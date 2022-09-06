import { Button as MuiButton } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { helper } from '../../core/webHelper';
import { initValue, UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { Circle } from '../drawing/circle';
import { FlexGrid } from '../flex-grid/flex-grid';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { Switch } from '../switch/switch';

const RightArrow = '/static/images/shape/right-arrow.svg';
const completedIcon = '/static/images/icons/progress-completed.png';

function Options(props: {
  amount: number;
  selected: boolean;
  onClick: (value: number) => void;
}): JSX.Element {
  return (
    <MuiButton
      variant="outlined"
      className="donate-percent-option"
      style={{
        border: props.selected ? ' 2px solid #00A9D8' : '1px solid #E9EDEF',
      }}
      onClick={() => {
        props.onClick(props.amount);
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
        per day
      </span>
    </MuiButton>
  );
}

export function Donate(props: {
  id: number;
  title: string;
  address: string;
  callback?: () => void;
}): JSX.Element {
  const [confirm, setConfirm] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [amount, setAmount] = useState<string>('0');
  const [percent, setPercent] = useState<number>(5);

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
      setAmount(token);
    });
  }, [tokenAvailable]);

  useEffect(() => {
    getTokenAvailable();
  }, [getTokenAvailable]);

  const inputPage = useMemo(() => {
    return (
      <>
        <div className="donate-type">
          <div className={`donate-type-${isOngoing ? 'disabled' : 'enabled'}`}>
            One-Off Donation
          </div>
          <Switch
            invert
            checked={isOngoing}
            onChange={(e, checked) => {
              setIsOngoing(checked);
            }}
          />
          <div className={`donate-type-${isOngoing ? 'enabled' : 'disabled'}`}>
            Ongoing Donation
          </div>
        </div>
        <div className="donate-item">
          <Input
            label="Available Balance"
            name="balance"
            value={tokenAvailable}
            disabled={true}
          />
        </div>
        {isOngoing ? (
          <div className="donate-item">
            Please select what percentage of your earnings you would like to
            donate every day. You can cancel your donation at any time.
            <div className="donate-option">
              <FlexGrid
                column={2}
                className="donate-option-grid"
                innerClassName="donate-option-item"
              >
                <Options
                  amount={25}
                  onClick={setPercent}
                  selected={percent === 25}
                />
                <Options
                  amount={50}
                  onClick={setPercent}
                  selected={percent === 50}
                />
                <Options
                  amount={75}
                  onClick={setPercent}
                  selected={percent === 75}
                />
                <Options
                  amount={100}
                  onClick={setPercent}
                  selected={percent === 100}
                />
              </FlexGrid>
            </div>
          </div>
        ) : (
          <div className="donate-option">
            <Input
              label="Donation Amount"
              name="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
        )}
      </>
    );
  }, [amount, isOngoing, percent, tokenAvailable]);

  const confirmPage = useMemo(() => {
    return (
      <div className="donate-confirmation-column">
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Charity</div>
          <div className="donate-confirmation-value">{props.title}</div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Donation Type</div>
          <div className="donate-confirmation-value">
            {isOngoing ? 'Ongoing Donation' : 'One-Off Donation'}
          </div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Available Balance</div>
          <div className="donate-confirmation-value">
            {tokenAvailable} SWASH
          </div>
        </div>
        <div className="donate-confirmation-row">
          <div className="donate-confirmation-name">Donation Amount</div>
          <div className="donate-confirmation-value">
            {isOngoing ? `${amount} SWASH` : `${percent}% per day`}
          </div>
        </div>
      </div>
    );
  }, [amount, isOngoing, percent, props.title, tokenAvailable]);

  if (thanks)
    return (
      <div className="token-transfer-popup-completed donate-completed">
        <div className="progress-dashed">
          <Circle
            className={'progress-circle1'}
            border={'black'}
            dashed={'6 14'}
          />
          <div className={'progress-widget'}>
            <Circle className={'progress-circle6'} colorfulGradient />
            <img className="progress-image" src={completedIcon} alt={''} />
          </div>
        </div>
        <h2>Thank you!</h2>
        <p>
          Thank you for your donation to {props.title}! Manage your donations
          anytime on the Donations page.
        </p>
      </div>
    );
  else
    return (
      <div className="donate-popup">
        <div className="small-popup-title title">
          {confirm ? (
            <div className="donate-confirmation-header">
              <img
                src={RightArrow}
                alt="back"
                onClick={() => setConfirm(false)}
              />
              Confirmation
            </div>
          ) : (
            props.title
          )}
        </div>
        <div className="small-popup-separator" />
        {confirm ? confirmPage : inputPage}
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
            text={confirm ? 'Confirm' : 'Next'}
            className="small-popup-actions-submit"
            link={false}
            onClick={() => {
              if (!confirm) setConfirm(true);
              else {
                if (isOngoing) {
                  helper
                    .addCharityAutoPayment(
                      props.id,
                      props.address,
                      percent.toString(),
                    )
                    .then(() => setThanks(true))
                    .then(() => props.callback && props.callback());
                } else {
                  helper
                    .withdrawToTarget(props.address, amount, false, false)
                    .then(() => setThanks(true))
                    .then(() => props.callback && props.callback());
                }
              }
            }}
          />
        </div>
      </div>
    );
}
