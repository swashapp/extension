import { Button as MuiButton } from '@mui/material';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { initValue, UtilsService } from '../../service/utils-service';
import { Button } from '../button/button';
import { Circle } from '../drawing/circle';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { Switch } from '../switch/switch';
import { ToastMessage } from '../toast/toast-message';

import '../../static/css/components/donate.css';

const RightArrow = '/static/images/shape/right-arrow.svg';
const completedIcon = '/static/images/icons/progress-completed.png';

function Options(props: {
  amount: number;
  selected: boolean;
  onClick: (value: number) => void;
}): ReactElement {
  return (
    <MuiButton
      variant={'outlined'}
      className={'bg-white donate-percent-option'}
      style={{
        border: props.selected ? ' 2px solid #00A9D8' : '1px solid #E9EDEF',
      }}
      onClick={() => {
        props.onClick(props.amount);
      }}
    >
      <span className={'flex gap12'}>
        <span>{props.amount}%</span>
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
      </span>
    </MuiButton>
  );
}

export function Donate(props: {
  id: number;
  title: string;
  address: string;
  callback?: () => void;
}): ReactElement {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [amount, setAmount] = useState<string>('0');
  const [percent, setPercent] = useState<number>(5);

  const getTokenAvailable = useCallback(() => {
    helper.getAvailableBalance().then((_tokenAvailable: any) => {
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
        <div className={'flex align-center justify-between donate-type'}>
          <div
            className={`flex align-center donate-type-${
              isOngoing ? 'disabled' : ''
            }`}
          >
            One-off Donation
          </div>
          <Switch
            checked={isOngoing}
            onChange={(e, checked) => {
              setIsOngoing(checked);
            }}
          />
          <div
            className={`flex align-center donate-type-${
              isOngoing ? '' : 'disabled'
            }`}
          >
            Ongoing Donation
          </div>
        </div>
        <div className={'donate-item'}>
          <Input
            label={'Available Balance'}
            name={'balance'}
            value={tokenAvailable}
            disabled={true}
          />
        </div>
        {isOngoing ? (
          <div className={'donate-item'}>
            Please select what percentage of your earnings you would like to
            donate every day. You can cancel your donation at any time.
            <div className={'donate-option'}>
              <div className={'flex row wrap gap16'}>
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
              </div>
            </div>
          </div>
        ) : (
          <div className={'donate-option'}>
            <Input
              label={'Donation Amount'}
              name={'amount'}
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
      <div className={'flex col gap20'}>
        <div className={'flex justify-between'}>
          <p>Charity</p>
          <p>{props.title}</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Donation Type</p>
          <p>{isOngoing ? 'Ongoing Donation' : 'One-off Donation'}</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Available Balance</p>
          <p>{tokenAvailable} SWASH</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Donation Amount</p>
          <p>{isOngoing ? `${percent}% per day` : `${amount} SWASH`}</p>
        </div>
      </div>
    );
  }, [amount, isOngoing, percent, props.title, tokenAvailable]);

  if (thanks)
    return (
      <div className={'token-transfer-popup-completed donate-completed'}>
        <div className={'progress-dashed'}>
          <Circle
            className={'progress-circle1'}
            border={'black'}
            dashed={'6 14'}
          />
          <div className={'progress-widget'}>
            <Circle className={'progress-circle6'} colorfulGradient />
            <img className={'progress-image'} src={completedIcon} alt={''} />
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
      <div className={'donate-popup'}>
        <p className={'large'}>
          {confirm ? (
            <div className={'flex align-center'}>
              <img
                src={RightArrow}
                alt={'back'}
                className={'donate-confirmation-image'}
                onClick={() => setConfirm(false)}
              />
              <p className={'large bold'}>Confirmation</p>
            </div>
          ) : (
            <p className={'large bold'}>{props.title}</p>
          )}
        </p>
        <hr />
        {confirm ? confirmPage : inputPage}
        <hr />
        <div className={'flex justify-between'}>
          <Button
            text={'Cancel'}
            color={'secondary'}
            className={'popup-cancel'}
            link={false}
            onClick={() => {
              closePopup();
            }}
          />
          <Button
            text={confirm ? 'Confirm' : 'Next'}
            className={'popup-submit'}
            loading={loading}
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
                    .catch((err) =>
                      toast(
                        <ToastMessage
                          type={'error'}
                          content={<>{err.toString()}</>}
                        />,
                      ),
                    )
                    .then(() => props.callback && props.callback());
                } else {
                  setLoading(true);
                  helper
                    .donateToTarget(props.address, amount)
                    .then(
                      () => {
                        setLoading(false);
                        setThanks(true);
                      },
                      (err) => {
                        setLoading(false);
                        toast(
                          <ToastMessage
                            type={'error'}
                            content={<>{err.toString()}</>}
                          />,
                        );
                      },
                    )
                    .then(() => props.callback && props.callback());
                }
              }
            }}
          />
        </div>
      </div>
    );
}
