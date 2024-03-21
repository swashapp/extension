import { Tab, Tabs } from '@mui/material';
import {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Button } from '../components/button/button';
import { ClickableInput } from '../components/clickable-input/clickable-input';
import { Input } from '../components/input/input';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { showPopup } from '../components/popup/popup';
import { PunchedBox } from '../components/punched-box/punched-box';
import { Select } from '../components/select/select';
import { CryptoIcon } from '../components/svg/crypto';
import { DollarIcon } from '../components/svg/dollar';
import { VoucherIcon } from '../components/svg/voucher';
import { VouchersIcon } from '../components/svg/vouchers';
import { Tooltip } from '../components/tooltip/tooltip';
import { helper } from '../core/webHelper';
import { RouteToPages } from '../paths';
import { initValue, UtilsService } from '../service/utils-service';

const SwashCoinIcon = '/static/images/icons/swash-coin.svg';

const currencyList = [
  { name: 'ETH', value: 'ETH' },
  { name: 'MATIC', value: 'MATIC' },
  { name: 'SWASH', value: 'SWASH' },
  { name: 'BNB', value: 'BNB' },
  { name: 'USDT', value: 'USDT' },
];

export function Wallet(): ReactElement {
  const [value, setValue] = useState<number>(0);
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);

  const [currency, setCurrency] = useState(currencyList[0].value);
  const [receiver, setReceiver] = useState<string>('');

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

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTokenAvailable();
  }, [getTokenAvailable]);

  return (
    <>
      <div className={'page-header'}>
        <h6>Wallet</h6>
      </div>
      <div className={'flex row nowrap gap32'}>
        <div className={'flex col gap32 grow1'}>
          <NumericSection
            title={'Earning balance'}
            tooltip={'This number updates every 48 hours.'}
            value={tokenAvailable}
            layout={<></>}
            image={SwashCoinIcon}
          />
          <PunchedBox className={`wallet-punch`}>
            <div style={{ height: 200 }}></div>
          </PunchedBox>
        </div>
        <div className={'round flex col gap24 grow2 no-overflow bg-white card'}>
          <div className={'flex col gap12'}>
            <div className={'flex align-center'}>
              <h6>Withdraw Your Earnings</h6>
              <Tooltip
                text={
                  'This is your unique ID in the Swash ecosystem. Do not use it to send crypto to yourself.'
                }
              />
            </div>
            <p>
              Ready to cash out? Choose how to withdraw your earnings
              <br />
              from the options below.
            </p>
          </div>
          <Tabs
            className={'wallet-withdraw-tabs'}
            TabIndicatorProps={{ sx: { display: 'none' } }}
            value={value}
            onChange={handleChange}
          >
            <Tab
              className={'wallet-withdraw-tab'}
              label={
                <div className={'flex row gap4 center'}>
                  <CryptoIcon />
                  <p className={'bold'}>Crypto</p>
                </div>
              }
            />
            <Tab
              className={'wallet-withdraw-tab'}
              label={
                <div className={'flex row gap4 center'}>
                  <DollarIcon />
                  <p className={'bold'}>Cash & Gift Card</p>
                </div>
              }
            />
            <Tab
              className={'wallet-withdraw-tab'}
              label={
                <div className={'flex row gap4 center'}>
                  <VouchersIcon />
                  <p className={'bold'}>Unused vouchers</p>
                </div>
              }
            />
          </Tabs>
          <div className={'flex col gap24'} hidden={value !== 0}>
            <Select
              items={currencyList}
              label={'Select cryptocurrency'}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as string)}
            />
            <Input
              label={'Paste wallet address'}
              value={receiver}
              onChange={(e) => setReceiver(e.target.value as string)}
            />
            <div className={'flex justify-between gap32'}>
              <ClickableInput
                label={'Select network'}
                placeholder={<>Select network</>}
                onClick={() => {
                  showPopup({
                    id: 'select-network',
                    closable: true,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: (
                      <div
                        className={
                          'flex col gap32 wallet-withdraw-network-popup'
                        }
                      >
                        <div className={'flex col gap12'}>
                          <h4>Select network</h4>
                          <p>
                            Please make sure the network you select matches the
                            withdrawal address and that the deposit platform
                            supports it or your assets may be lost.
                          </p>
                        </div>
                        <div className={'flex col gap24'}>
                          {[
                            {
                              name: 'Ethereum (ERC20)',
                              logo: '',
                              fee: '132 SWASH',
                              min: '12 SWASH',
                            },
                            {
                              name: 'BNB Smart Chain (BEP20)',
                              logo: '',
                              fee: '132 SWASH',
                              min: '12 SWASH',
                            },
                            {
                              name: 'Gnosis Chain',
                              logo: '',
                              fee: '132 SWASH',
                              min: '12 SWASH',
                            },
                            {
                              name: 'Polygon',
                              logo: '',
                              fee: '132 SWASH',
                              min: '12 SWASH',
                            },
                          ].map(({ name, fee, min }, index) => (
                            <div
                              key={`network-${index}`}
                              className={
                                'flex align-center justify-between wallet-withdraw-network-option'
                              }
                            >
                              <div className={'flex'}>
                                <div className={'flex col'}>
                                  <p className={'bold'}>{name}</p>
                                  <p className={'small'}>
                                    Fee {fee} (=1.1234$)
                                  </p>
                                </div>
                              </div>
                              <div className={'flex'}>
                                <p className={'small'}>Min. withdrawal {min}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  });
                }}
              />
              <Input
                label={'Enter amount'}
                value={receiver}
                onChange={(e) => setReceiver(e.target.value as string)}
              />
            </div>
            <div className={'flex justify-between gap32'}>
              <div className={'flex col gap8 grow1'}>
                <p className={'bold'}>Receive amount</p>
                <p className={'larger'}>
                  {tokenAvailable} <span className={'large'}>USDT</span>
                </p>
                <p className={'small'}>
                  Network fee <span className={'small bold'}>12 SWASH</span>
                </p>
              </div>
              <div className={'flex col justify-between grow1'}>
                <div
                  className={
                    'flex align-center border-box bg-soft-yellow wallet-toaster'
                  }
                >
                  <p>How to withdraw? View guide</p>
                </div>
                <div className={'flex justify-between'}>
                  <p className={'small'}>Contract information</p>
                  <p className={'small'}>****9890789</p>
                </div>
              </div>
            </div>
            <Button
              className={'full-width-button'}
              color={'primary'}
              text={`Withdraw`}
              link={{ url: RouteToPages.data }}
            />
          </div>
          <div className={'flex col gap32'} hidden={value !== 1}>
            <div className={'flex col gap20'}>
              <p className={'bold'}>
                Choose from any of the payout and gift card options below
                <br />
                to withdraw your Swash earnings
              </p>
            </div>
            <div className={'flex col gap20'}>
              <p className={'bold'}>How much do you want to cashout?</p>
              <div className={'flex gap16'}>
                {[5, 10, 20, 50, 100].map((option, index) => (
                  <div
                    className={
                      'flex col justify-between border-box wallet-cashout-option'
                    }
                    key={`cashout-${index}`}
                  >
                    <p>$ {option}</p>
                    <p className={'small'}>42.2 SWASH</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={'small wallet-cashout-desc'}>
                When you click the button below, your $SWASH will be
                automatically
                <br />
                converted ready for you to redeem a gift card of your choice.
              </p>
              <br />
              <p className={'small wallet-cashout-desc'}>
                If you don’t redeem straight away, don’t worry, your voucher
                will be ready for
                <br />
                you to use whenever you’re ready. Got questions?{' '}
                <em>Check out the FAQ</em>
              </p>
            </div>
            <div className={'flex col gap20'}>
              <Button
                className={'full-width-button'}
                color={'primary'}
                text={`Convert and go to the gift card checkout`}
                link={{ url: RouteToPages.data }}
              />
              <p className={'small wallet-cashout-desc'}>
                Check your payout status and unclaimed vouchers <em>here.</em>
              </p>
            </div>
          </div>
          <div className={'flex col gap20'} hidden={value !== 2}>
            <p className={'bold'}>Select an unused voucher to redeem it:</p>
            <div className={'flex gap16'}>
              {[
                { amount: 5, color: 'purple' },
                { amount: 10, color: 'soft-yellow' },
                { amount: 20, color: 'soft-green' },
                { amount: 50, color: 'yellow' },
                { amount: 100, color: 'orange' },
              ].map(({ amount, color }, index) => (
                <div
                  key={`unused-voucher-${index}`}
                  className={'flex col wallet-unused-voucher'}
                >
                  <div className={'flex center wallet-unused-voucher-amount'}>
                    <p className={'bold'}>$ {amount}</p>
                  </div>
                  <div className={'flex center wallet-unused-voucher-use'}>
                    <p className={'smaller'}>Use voucher</p>
                  </div>
                  <div className={'absolute'}>
                    <VoucherIcon color={color} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
