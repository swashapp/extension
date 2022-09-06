import React, { useCallback, useEffect, useState } from 'react';

import { helper } from '../../core/webHelper';
import { initValue, UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function StopDonation(props: {
  id: number;
  title: string;
  percent: string;
  callback?: () => void;
}): JSX.Element {
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);

  const getTokenAvailable = useCallback(() => {
    window.helper.getAvailableBalance().then((_tokenAvailable: any) => {
      const _token =
        _tokenAvailable.error ||
        _tokenAvailable === '' ||
        typeof _tokenAvailable === 'undefined'
          ? tokenAvailable
          : _tokenAvailable;
      const token = UtilsService.purgeNumber(_token, 4);

      setTokenAvailable(token);
    });
  }, [tokenAvailable]);

  useEffect(() => {
    getTokenAvailable();
  }, [getTokenAvailable]);

  return (
    <div className="donate-popup">
      <div className="small-popup-title title">
        You sure you want to stop donating?
      </div>
      <div className="small-popup-separator" />
      <div className="donate-confirmation-column">
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Charity</div>
          <div className="donate-confirmation-value">{props.title}</div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Donation Type</div>
          <div className="donate-confirmation-value">Ongoing Donation</div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Current Balance</div>
          <div className="donate-confirmation-value">
            {tokenAvailable} SWASH
          </div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Amount to Donate</div>
          <div className="donate-confirmation-value">${props.percent}%/day</div>
        </div>
      </div>
      <div className="small-popup-separator" />
      <div className="small-popup-actions">
        <Button
          text={'Cancel'}
          color={'secondary'}
          className="small-popup-actions-cancel"
          link={false}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={'Confirm'}
          className="small-popup-actions-submit"
          link={false}
          onClick={() => {
            helper
              .delCharityAutoPayment(props.id)
              .then(() => props.callback && props.callback())
              .then(closePopup);
          }}
        />
      </div>
    </div>
  );
}
