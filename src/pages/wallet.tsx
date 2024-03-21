import React, { useCallback, useEffect, useState } from 'react';

import { Input } from '../components/input/input';
import { NumericSection } from '../components/numeric-section/numeric-section';
import { PunchedBox } from '../components/punched-box/punched-box';
import { Tooltip } from '../components/tooltip/tooltip';
import { helper } from '../core/webHelper';
import { initValue, UtilsService } from '../service/utils-service';

const SwashCoinIcon = '/static/images/icons/swash-coin.svg';

export function Wallet(): JSX.Element {
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [walletAddress, setWalletAddress] = useState<string>('');

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
        <div className={'flex col grow2 round no-overflow bg-white card'}>
          <div className={'wallet-title'}>
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
          <div className={'flex withdraw-tabs'}>
            <div>Crypto</div>
            <div>Cash & Gift Card</div>
            <div>Unclaimed vouchers</div>
          </div>
          <div>
            <Input
              label={'Wallet Address'}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
