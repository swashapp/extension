import { Button as MiButton } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';

import { initValue, UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { FlexGrid } from '../flex-grid/flex-grid';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { Switch } from '../switch/switch';

function Options(props: { amount: number }): JSX.Element {
  return (
    <MiButton
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
    </MiButton>
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
      <div className="donate-title title">{props.title}</div>
      <div className="donate-separator" />
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
      <div className="donate-separator" />
      <div className="donate-actions">
        <Button
          text={'Cancel'}
          color={'secondary'}
          className="donate-actions-cancel"
          link={false}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={'Donate Now'}
          className="donate-actions-donate"
          link={false}
        />
      </div>
    </>
  );
}
