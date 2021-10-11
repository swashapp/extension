import React, { useState } from 'react';
import FlexGrid from '../components/flex-grid/flex-grid';
import NumericSection from '../components/numeric-section/numeric-section';
import DataEarningsIcon from 'url:../static/images/icons/data-earnings.svg';
import DataBonusIcon from 'url:../static/images/icons/data-bonus.svg';
import QuestionGrayIcon from 'url:../static/images/shape/question-gray.png';
import Button from '../components/button/button';
import Input from '../components/input/input';
import CopyEndAdornment from '../components/input/end-adronments/copy-end-adornment';
import Select from '../components/select/select';
import { MenuItem } from '@material-ui/core';
import FormMessage from '../components/form-message/form-message';
import BackgroundTheme from '../components/drawing/background-theme';
import { showPopup } from '../components/popup/popup';
import DataTransferPopup from '../components/wallet/data-transfer-popup';

export default function Wallet() {
  const [dataAvailable, setDataAvailable] = useState<number>(0);
  const [amount, setAmount] = useState<string>('0');
  const [unclaimedBonus, setUnclaimedBonus] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [recipientWalletAddress, setRecipientWalletAddress] =
    useState<string>('');
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
                    className="claim-button"
                    color="primary"
                    text="Claim"
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
                  <img src={QuestionGrayIcon} width={16} height={16} />
                </div>
              </div>
              <Input
                label="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                endAdornment={<CopyEndAdornment value={walletAddress} />}
              />
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
                            You can also put your DATA to work by trading or
                            staking liquidity on the DATA/ xDAI pool on{' '}
                            <a
                              href="https://honeyswap.org"
                              style={{
                                color: 'var(--blue)',
                              }}
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
              <FlexGrid className="flex-grid form-item-gap" column={2}>
                <Input
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Select label="Withdraw To" value={'xDai'} onChange={() => {}}>
                  <MenuItem value="xDai">xDai</MenuItem>
                  <MenuItem value="xDai3">xDai1</MenuItem>
                  <MenuItem value="xDai2">xDai2</MenuItem>
                  <MenuItem value="xDai1">xDai3</MenuItem>
                </Select>
              </FlexGrid>
              <Input
                name="RecipientWalletAddress"
                label="Recipient Wallet Address"
                value={recipientWalletAddress}
                onChange={(e) => setRecipientWalletAddress(e.target.value)}
              />
              <FormMessage text="al;skdflasdflasdfasd" type="error" />
            </div>
            <Button
              className="form-button"
              color="primary"
              text="Withdraw"
              link={false}
              onClick={() =>
                showPopup({
                  closable: false,
                  content: (
                    <DataTransferPopup
                      amount={amount}
                      toAddress={recipientWalletAddress}
                      onSend={() =>
                        new Promise((resolve) =>
                          setTimeout(() => resolve(true), 3000),
                        )
                      }
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
