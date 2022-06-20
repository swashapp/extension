import { Button as MuiButton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { initValue, UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { FlexGrid } from '../flex-grid/flex-grid';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { Switch } from '../switch/switch';

function Options(props: { amount: number }): JSX.Element {
  return (
    <MuiButton
      variant="outlined"
      style={{
        width: 173,
        height: 72,
        borderRadius: 12,
        background: '#FFFFFF',
        mixBlendMode: 'normal',
        border: '1px solid #E9EDEF',
        boxSizing: 'border-box',
        textTransform: 'none',
      }}
    >
      {props.amount}%
      <span
        style={{
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 14,
          color: '#8091A3',
        }}
      >
        /month
      </span>
    </MuiButton>
  );
}

export function Donate(props: { title: string }): JSX.Element {
  const [isOngoing, setIsOngoing] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);

  const getTokenAvailable = useCallback(() => {
    window.helper.getAvailableBalance().then((_tokenAvailable: any) => {
      setTokenAvailable((token) => {
        const _token =
          _tokenAvailable.error ||
          _tokenAvailable === '' ||
          typeof _tokenAvailable === 'undefined'
            ? token
            : _tokenAvailable;
        return UtilsService.purgeNumber(_token, 4);
      });
    });
  }, []);

  useEffect(() => {
    getTokenAvailable();
  }, [getTokenAvailable]);

  return (
    <>
      <div className="small-popup-title title">{props.title}</div>
      <div className="small-popup-separator" />
      <div className="donate-type">
        One-Off Payment
        <Switch
          checked={isOngoing}
          onChange={(e, checked) => {
            setIsOngoing(checked);
          }}
        />
        Ongoing Payment
      </div>
      <div className="donate-item">
        <Input
          label="Current Balance"
          name="balance"
          value={tokenAvailable}
          disabled={true}
        />
      </div>
      {isOngoing ? (
        <div className="donate-item">
          Please select how much you want donate every new month. You can always
          cancel your donation.
          <div className="donate-option">
            <FlexGrid
              column={2}
              className="donate-option-grid"
              innerClassName="donate-option-item"
            >
              <Options amount={5} />
              <Options amount={10} />
              <Options amount={15} />
              <Options amount={20} />
            </FlexGrid>
          </div>
        </div>
      ) : (
        <div className="donate-option">
          <Input label="Amount to Donate" name="amount" value={100} />
        </div>
      )}
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
          text={'Donate Now'}
          className="small-popup-actions-submit"
          link={false}
        />
      </div>
    </>
  );
}
