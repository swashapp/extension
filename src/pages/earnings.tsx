import { isAddress } from '@ethersproject/address';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../components/button/button';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { FormMessage } from '../components/form-message/form-message';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { showPopup } from '../components/popup/popup';
import { Select } from '../components/select/select';
import { ToastMessage } from '../components/toast/toast-message';
import { Tooltip } from '../components/tooltip/tooltip';
import { VerificationAlert } from '../components/verification/verification-alert';
import { TokenTransferPopup } from '../components/wallet/token-transfer-popup';
import { helper } from '../core/webHelper';
import { initValue, UtilsService } from '../service/utils-service';

const SwashBonusIcon = '/static/images/icons/swash-bonus.svg';
const SwashEarningsIcon = '/static/images/icons/swash-earnings.svg';

const networkList = [{ name: 'Gnosis Chain', value: 'Gnosis Chain' }];

export function Earnings(): JSX.Element {
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);
  const [unclaimedBonus, setUnclaimedBonus] = useState<string>(initValue);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [network, setNetwork] = useState<string>('Gnosis Chain');

  const getWalletAddress = useCallback(() => {
    helper
      .getWalletAddress()
      .then((address: string) => setWalletAddress(address));
  }, []);

  const getUnclaimedBonus = useCallback(() => {
    helper.getBonus().then((_unclaimedBonus: number | string) => {
      setUnclaimedBonus((_unclaimed) => {
        const ret =
          _unclaimedBonus.toString() !== _unclaimed
            ? _unclaimedBonus.toString()
            : _unclaimed;
        return UtilsService.purgeNumber(ret);
      });
    });
  }, []);

  const getTokenAvailable = useCallback(() => {
    helper.getAvailableBalance().then((_tokenAvailable: any) => {
      setTokenAvailable((token) => {
        const _token =
          _tokenAvailable.error ||
          _tokenAvailable === '' ||
          typeof _tokenAvailable === 'undefined'
            ? token
            : _tokenAvailable;
        return UtilsService.purgeNumber(_token);
      });
    });
  }, []);

  const getBalanceInfo = useCallback(async () => {
    await getUnclaimedBonus();
    await getTokenAvailable();
  }, [getTokenAvailable, getUnclaimedBonus]);

  useEffect(() => {
    getWalletAddress();
    getBalanceInfo().catch();
  }, [getBalanceInfo, getWalletAddress]);

  const isClaimDisable = useMemo(() => {
    return (
      unclaimedBonus === initValue || Number(unclaimedBonus) <= 0 || claiming
    );
  }, [claiming, unclaimedBonus]);

  const claimRewards = useCallback(() => {
    setClaiming(true);
    helper
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
            content={<>{err?.message || 'Failed to claim rewards'}</>}
          />,
        );
      });
  }, [getBalanceInfo]);

  const isMessageNeeded = useMemo(
    () => tokenAvailable !== initValue && Number(tokenAvailable) > 0,
    [tokenAvailable],
  );

  const formState: { message: string; type: 'error' | 'warning' | 'success' } =
    useMemo(() => {
      let ret: { message: string; type: 'error' | 'warning' | 'success' } = {
        message: '',
        type: 'warning',
      };
      if (
        tokenAvailable.length > 0 &&
        tokenAvailable !== initValue &&
        !tokenAvailable.match(/^[0-9]+(\.[0-9]+)?$/)
      ) {
        ret = { message: 'Amount value is not valid', type: 'error' };
      } else if (recipient.length === 42 && !isAddress(recipient)) {
        ret = { message: 'Recipient address is not valid', type: 'error' };
      } else if (isMessageNeeded) {
        ret = {
          message: 'Exchange wallets are not compatible.',
          type: 'warning',
        };
      }
      return ret;
    }, [tokenAvailable, isMessageNeeded, recipient]);

  const isTransferDisable = useMemo(() => {
    let ret = false;
    if (tokenAvailable === initValue || Number(tokenAvailable) <= 0) ret = true;
    else if (!isAddress(recipient)) ret = true;
    else if (!network) ret = true;
    else if (formState.message && formState.type === 'error') ret = true;
    return ret;
  }, [tokenAvailable, formState.message, formState.type, network, recipient]);

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Earnings</h2>
        </div>
        <FlexGrid column={2} className="half-cards card-gap">
          <div className={'flex-column card-gap'}>
            <FlexGrid column={2} className={'wallet-numerics card-gap'}>
              <NumericSection
                title={'Earning balance'}
                tooltip={'This number updates every 48 hours.'}
                value={tokenAvailable}
                layout="layout1"
                image={SwashEarningsIcon}
              />
              <NumericSection
                title={'Rewards to claim'}
                tooltip={
                  'When you click ‘Claim’, your rewards are added to your Earnings balance.'
                }
                value={unclaimedBonus}
                layout={
                  <Button
                    className={'form-button'}
                    color={'primary'}
                    text={'Claim'}
                    loadingText={'Claiming'}
                    loading={claiming}
                    disabled={isClaimDisable}
                    onClick={claimRewards}
                    link={false}
                  />
                }
                image={SwashBonusIcon}
              />
            </FlexGrid>
            <div className="simple-card">
              <div className="wallet-title">
                <h6>Your wallet address</h6>
                <Tooltip
                  text={
                    'This is your unique ID in the Swash ecosystem. Do not use it to send crypto to yourself.'
                  }
                />
              </div>
              <div>
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
            <h6>Withdraw your earnings</h6>
            <div className="withdraw-text">
              <p>
                Withdraw your earnings using Gnosis Chain. Exchange wallets are
                not supported. Learn how to set up your wallet and get to know
                your withdrawal limits.
              </p>
              <div className="form-button withdraw-read-more-button">
                <Button
                  color={'secondary'}
                  text={'Read More'}
                  link={{
                    url: 'https://medium.com/swashapp/everything-you-need-to-know-about-withdrawing-your-swash-f11d507978ec',
                    external: true,
                    newTab: true,
                  }}
                />
              </div>
            </div>
            <div className="flex-column form-item-gap">
              <FlexGrid className="half-form-items form-item-gap" column={2}>
                <Input
                  label="Amount"
                  name="amount"
                  value={tokenAvailable}
                  disabled={true}
                  onChange={(e) => setTokenAvailable(e.target.value)}
                />
                <Select
                  items={networkList}
                  label="Withdraw to"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as string)}
                  disabled={true}
                />
              </FlexGrid>
              <Input
                name="RecipientWalletAddress"
                label="Recipient wallet address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <div>
                <FormMessage text={formState.message} type={formState.type} />
              </div>
            </div>
            <Button
              className={'form-button'}
              color={'primary'}
              text={'Withdraw'}
              disabled={isTransferDisable}
              link={false}
              loading={withdrawing}
              onClick={async () => {
                try {
                  setWithdrawing(true);
                  await helper.checkWithdrawAllowance(tokenAvailable);
                  if (await helper.isVerified())
                    showPopup({
                      closable: false,
                      paperClassName: 'large-popup',
                      content: (
                        <TokenTransferPopup
                          amount={tokenAvailable}
                          recipient={recipient}
                          onSuccess={getBalanceInfo}
                        />
                      ),
                    });
                  else {
                    showPopup({
                      closable: false,
                      closeOnBackDropClick: true,
                      paperClassName: 'small-popup',
                      content: <VerificationAlert />,
                    });
                  }
                } catch (err: Error) {
                  toast(
                    <ToastMessage
                      type="error"
                      content={
                        <>{err?.message || 'Failed to withdraw earnings'}</>
                      }
                    />,
                  );
                } finally {
                  setWithdrawing(false);
                }
              }}
            />
          </div>
        </FlexGrid>
      </div>
    </div>
  );
}
