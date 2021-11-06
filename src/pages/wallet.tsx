import { ethers } from 'ethers';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../components/button/button';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { FormMessage } from '../components/form-message/form-message';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { closePopup, showPopup } from '../components/popup/popup';
import { Select } from '../components/select/select';
import { ToastMessage } from '../components/toast/toast-message';
import { DataTransferPopup } from '../components/wallet/data-transfer-popup';
import { WALLET_TOUR_CLASS } from '../components/wallet/wallet-tour';
import { UtilsService } from '../service/utils-service';

const DataBonusIcon = '/static/images/icons/data-bonus.svg';
const DataEarningsIcon = '/static/images/icons/data-earnings.svg';
const QuestionGrayIcon = '/static/images/shape/question-gray.png';

const networkList = [
  { description: 'xDai', value: 'xDai' },
  { description: 'Mainnet', value: 'Mainnet' },
];

export function Wallet(): JSX.Element {
  const [dataAvailable, setDataAvailable] = useState<string>('$');
  const [minimumWithdraw, setMinimumWithdraw] = useState<number>(99999999);
  const [gasLimit, setGasLimit] = useState<number>(99999999);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [recipientEthBalance, setRecipientEthBalance] = useState<string>('$');
  const [recipientDataBalance, setRecipientDataBalance] = useState<string>('$');
  const [unclaimedBonus, setUnclaimedBonus] = useState<string>('$');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [network, setNetwork] = useState<string>('xDai');

  const getWalletAddress = useCallback(() => {
    window.helper
      .getWalletAddress()
      .then((address: string) => setWalletAddress(address));
  }, []);

  const getUnclaimedBonus = useCallback(() => {
    window.helper.getRewards().then((_unclaimedBonus: number | string) => {
      setUnclaimedBonus((_unclaimed) => {
        const ret =
          _unclaimedBonus.toString() !== _unclaimed
            ? _unclaimedBonus.toString()
            : _unclaimed;
        return UtilsService.purgeNumber(ret);
      });
    });
  }, []);

  const getDataAvailable = useCallback(() => {
    window.helper.getAvailableBalance().then((_dataAvailable: any) => {
      setDataAvailable((data) => {
        const _data =
          _dataAvailable.error ||
          _dataAvailable === '' ||
          typeof _dataAvailable === 'undefined'
            ? data
            : _dataAvailable;
        return UtilsService.purgeNumber(_data);
      });
    });
  }, []);

  const getBalanceInfo = useCallback(async () => {
    await getUnclaimedBonus();
    await getDataAvailable();
  }, [getDataAvailable, getUnclaimedBonus]);

  useEffect(() => {
    getWalletAddress();
    getBalanceInfo().catch();
  }, [getBalanceInfo, getWalletAddress]);

  const isClaimDisable = useMemo(() => {
    return unclaimedBonus === '$' || Number(unclaimedBonus) <= 0 || claiming;
  }, [claiming, unclaimedBonus]);

  const claimRewards = useCallback(() => {
    setClaiming(true);
    window.helper
      .claimRewards()
      .then((result: { tx?: string }) => {
        setClaiming(false);
        if (result.tx) {
          getBalanceInfo().then();
          toast(
            <ToastMessage
              type="success"
              content={<>Rewards are claimed successfully</>}
            />,
          );
        } else {
          toast(
            <ToastMessage
              type="error"
              content={<>Failed to claim rewards</>}
            />,
          );
        }
      })
      .catch((err?: { message: string }) => {
        setClaiming(false);
        toast(
          <ToastMessage
            type="error"
            content={<>{err?.message} || Failed to claim rewards</>}
          />,
        );
      });
  }, [getBalanceInfo]);

  const isMessageNeeded = useMemo(
    () => dataAvailable !== '$' && Number(dataAvailable) > 0,
    [dataAvailable],
  );

  const formState: { message: string; type: 'error' | 'warning' | 'success' } =
    useMemo(() => {
      let ret: { message: string; type: 'error' | 'warning' | 'success' } = {
        message: '',
        type: 'warning',
      };
      if (
        dataAvailable.length > 0 &&
        dataAvailable !== '$' &&
        !dataAvailable.match(/^[0-9]+(\.[0-9]+)?$/)
      ) {
        ret = { message: 'Amount value is not valid', type: 'error' };
      } else if (
        recipient.length === 42 &&
        !ethers.utils.isAddress(recipient)
      ) {
        ret = { message: 'Recipient address is not valid', type: 'error' };
      } else if (isMessageNeeded) {
        if (network === 'xDai') {
          ret = {
            message: 'Exchange wallets are not compatible with xDai.',
            type: 'error',
          };
        } else if (Number(dataAvailable) > minimumWithdraw) {
          ret = {
            message:
              'It’s on us. Swash will cover these transaction fees for you! 🎉',
            type: 'success',
          };
        } else if (Number(recipientEthBalance) > gasLimit) {
          ret = {
            message: `Transaction fee is ${gasLimit} ETH`,
            type: 'warning',
          };
        } else {
          ret = {
            message: 'Unable to withdraw - not enough ETH for the gas fee',
            type: 'error',
          };
        }
      }
      return ret;
    }, [
      dataAvailable,
      gasLimit,
      isMessageNeeded,
      minimumWithdraw,
      network,
      recipient,
      recipientEthBalance,
    ]);

  const isTransferDisable = useMemo(() => {
    let ret = false;
    if (dataAvailable === '$' || Number(dataAvailable) <= 0) ret = true;
    else if (!ethers.utils.isAddress(recipient)) ret = true;
    else if (!network) ret = true;
    else if (network === 'Mainnet') {
      if (recipientEthBalance === '$' || Number(recipientEthBalance) <= 0)
        ret = true;
      else if (
        Number(recipientEthBalance) < gasLimit &&
        Number(dataAvailable) < minimumWithdraw
      )
        ret = true;
    } else if (formState.message && formState.type === 'error') ret = true;
    return ret;
  }, [
    dataAvailable,
    formState.message,
    formState.type,
    gasLimit,
    minimumWithdraw,
    network,
    recipient,
    recipientEthBalance,
  ]);

  useEffect(() => {
    if (recipient.length === 42) {
      window.helper
        .getWithdrawBalance()
        .then((response: { minimum: number; gas: number }) => {
          if (response.minimum) {
            setMinimumWithdraw(response.minimum);
          }
          if (response.gas) {
            setGasLimit(Number(response.gas.toFixed(3)));
          }
        });
      if (recipient.match(/^0x[a-fA-F0-9]{40}$/g)) {
        const getBalanceOfRecipient = async () => {
          const DataBalance = await window.helper.getDataBalance(recipient);
          const EthBalance = await window.helper.getEthBalance(recipient);
          setRecipientDataBalance(DataBalance);
          setRecipientEthBalance(EthBalance);
        };
        getBalanceOfRecipient();
      }
    }
  }, [recipient]);

  return (
    <div className="page-container">
      <BackgroundTheme />
      <div className="page-content">
        <div className="page-header">
          <h2>Wallet</h2>
        </div>
        <FlexGrid column={2} className="wallet-cards card-gap">
          <div className={'flex-column card-gap'}>
            <FlexGrid column={2} className={'wallet-numerics card-gap'}>
              <NumericSection
                tourClassName={WALLET_TOUR_CLASS.DATA_EARNINGS}
                title="Data Earnings"
                value={dataAvailable}
                layout="layout1"
                image={DataEarningsIcon}
              />
              <NumericSection
                title="Data Referral Bonus"
                value={unclaimedBonus}
                layout={
                  <Button
                    className="form-button"
                    color="primary"
                    text="Claim"
                    loadingText="Claiming"
                    loading={claiming}
                    disabled={isClaimDisable}
                    onClick={claimRewards}
                    link={false}
                  />
                }
                image={DataBonusIcon}
              />
            </FlexGrid>
            <div className="simple-card">
              <div className="wallet-title">
                <h6>Your wallet address</h6>
                <div className="wallet-title-question-mark">
                  <img src={QuestionGrayIcon} width={16} height={16} alt={''} />
                </div>
              </div>
              <div className={WALLET_TOUR_CLASS.WALLET_ADDRESS}>
                <Input
                  label="Wallet Address"
                  value={walletAddress}
                  disabled={true}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  endAdornment={<CopyEndAdornment value={walletAddress} />}
                />
              </div>
            </div>
          </div>
          <div className="simple-card">
            <h6>Withdraw Your Earnings</h6>
            <div className="withdraw-text">
              <p>
                Withdraw your earnings using xDai chain or Ethereum mainnet.
                It’s important to make sure you have set up your wallet
                properly. Click button below to read more.
              </p>
              <div className="form-button withdraw-read-more-button">
                <Button
                  color="secondary"
                  text="Read More"
                  link={false}
                  onClick={() =>
                    showPopup({
                      closable: true,
                      content: (
                        <>
                          <div className="wallet-read-more-title">
                            <h6>Withdraw Your Earnings</h6>
                          </div>
                          <p>
                            You can withdraw your earnings using xDai chain or
                            Ethereum mainnet.
                            <br />
                            <br />
                            It’s important to make sure you have set up your
                            wallet properly (it only takes a few minutes!).
                            Check the{' '}
                            <a
                              href="#/help"
                              style={{
                                color: 'var(--blue)',
                              }}
                              onClick={closePopup}
                            >
                              Help section
                            </a>{' '}
                            for step-by-step instructions.
                            <br />
                            <br />
                            xDai is the recommended method as it’s faster and
                            Swash will cover the cost for you! 🎉
                            <br />
                            <br />
                            You can also put your SWASH to work by trading or
                            staking liquidity on the SWASH/xDAI pool on{' '}
                            <a
                              href="https://honeyswap.org"
                              target="_blank"
                              style={{
                                color: 'var(--blue)',
                              }}
                              rel="noreferrer"
                            >
                              Honeyswap
                            </a>{' '}
                            🐝
                            <br />
                            <br />
                            Alternatively, if you use Ethereum, you will be
                            presented with the amount needed in your wallet (in
                            ETH) to cover the transaction fee. Exchange wallets
                            are not currently supported.
                            <br />
                            <br />
                            New earnings are available after 48 hours as an
                            anti-fraud measure.
                          </p>
                        </>
                      ),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex-column form-item-gap">
              <FlexGrid
                className="withdraw-form-items form-item-gap"
                column={2}
              >
                <Input
                  label="Amount"
                  name="amount"
                  value={dataAvailable}
                  disabled={true}
                  onChange={(e) => setDataAvailable(e.target.value)}
                />
                <Select
                  items={networkList}
                  label="Withdraw To"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as string)}
                />
              </FlexGrid>
              <Input
                name="RecipientWalletAddress"
                label="Recipient Wallet Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <div>
                <FormMessage text={formState.message} type={formState.type} />
                {network === 'Mainnet' && recipient ? (
                  <div className="form-message-balance">{`Balance: ${UtilsService.purgeNumber(
                    recipientEthBalance,
                  )} ETH, ${UtilsService.purgeNumber(
                    recipientDataBalance,
                  )} SWASH`}</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Button
              className="form-button"
              color="primary"
              text="Withdraw"
              disabled={isTransferDisable}
              link={false}
              onClick={() =>
                showPopup({
                  closable: false,
                  content: (
                    <DataTransferPopup
                      amount={dataAvailable}
                      recipient={recipient}
                      onSuccess={getBalanceInfo}
                      useSponsor={Number(dataAvailable) > minimumWithdraw}
                      sendToMainnet={network === 'Mainnet'}
                    />
                  ),
                })
              }
            />
          </div>
        </FlexGrid>
      </div>
    </div>
  );
}
