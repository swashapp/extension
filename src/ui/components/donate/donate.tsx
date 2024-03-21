import { Button as MuiButton } from '@mui/material';
import { ReactNode, useCallback, useRef, useState } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { helper } from '../../../helper';
import { GetCharityInfoRes } from '../../../types/api/charity.type';
import { OngoingRes } from '../../../types/api/donation.type';
import { MultiPageRef } from '../../../types/ui.type';

import { useAccountBalance } from '../../hooks/use-account-balance';
import { useErrorHandler } from '../../hooks/use-error-handler';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { MultiPageView } from '../multi-page-view/multi-page-view';
import { closePopup } from '../popup/popup';
import { BackIcon } from '../svg/back';
import { Switch } from '../switch/switch';

import '../../../static/css/components/donate.css';

function Options(props: {
  amount: number;
  selected: boolean;
  onClick: (value: number) => void;
}): ReactNode {
  return (
    <MuiButton
      variant={'outlined'}
      className={'bg-white donate-percent-option'}
      style={{
        border: props.selected
          ? ' 2px solid var(--color-jet-black)'
          : '1px solid var(--color-grey)',
      }}
      onClick={() => {
        props.onClick(props.amount);
      }}
    >
      <span className={'flex align-center gap12'}>
        <span
          style={{
            color: 'var(--color-black)',
          }}
        >
          {props.amount}%
        </span>
        <span
          style={{
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: 14,
            color: 'var(--color-dark-grey)',
          }}
        >
          per day
        </span>
      </span>
    </MuiButton>
  );
}

export function Donate({
  charity,
  onDonate,
}: {
  charity: GetCharityInfoRes;
  onDonate?: (ongoing: OngoingRes) => void;
}): ReactNode {
  const ref = useRef<MultiPageRef>();

  const { safeRun } = useErrorHandler();
  const { balance } = useAccountBalance();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [percent, setPercent] = useState<number>(25);

  const donate = useCallback(() => {
    safeRun(
      async () => {
        setLoading(true);
        if (isOngoing) {
          const ongoing = await helper('user').addOngoingDonation(
            charity.id,
            percent,
          );
          if (onDonate) onDonate(ongoing);
        } else {
          await helper('payment').donate(charity.wallet, amount);
        }
        ref.current?.next();
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [safeRun, isOngoing, charity, percent, onDonate, amount]);

  return (
    <MultiPageView ref={ref}>
      <div key={'form'} className={'donate-popup no-overflow'}>
        <p className={'large'}>
          <p className={'large bold'}>{charity.name}</p>
        </p>
        <hr />
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
            onChange={(_event, checked) => {
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
            value={balance}
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
              value={`${amount}`.replace(/^0\d+/, '')}
              type={'number'}
              inputProps={{
                step: 0.5,
                min: 1,
                max: balance,
              }}
              onChange={(e) => {
                const value = +e.target.value;
                if (value >= 0) setAmount(value);
              }}
              error={amount < 0 || amount > balance}
            />
          </div>
        )}
        <hr />
        <div className={'flex justify-between'}>
          <Button
            text={'Cancel'}
            color={ButtonColors.SECONDARY}
            onClick={() => {
              closePopup();
            }}
          />
          <Button
            text={'Next'}
            disabled={
              (!isOngoing && +amount === 0) ||
              (isOngoing && percent === 0) ||
              isNaN(balance)
            }
            onClick={() => ref.current?.next()}
          />
        </div>
      </div>
      <div key={'confirm'} className={'donate-popup no-overflow'}>
        <p className={'large'}>
          <div className={'flex align-center gap12'}>
            <span
              className={'flex center pointer'}
              onClick={() => ref.current?.back()}
            >
              <BackIcon />
            </span>
            <p className={'large bold'}>Confirmation</p>
          </div>
        </p>
        <hr />
        <div className={'flex col gap20'}>
          <div className={'flex justify-between'}>
            <p>Charity</p>
            <p>{charity.name}</p>
          </div>
          <div className={'flex justify-between'}>
            <p>Donation Type</p>
            <p>{isOngoing ? 'Ongoing Donation' : 'One-off Donation'}</p>
          </div>
          <div className={'flex justify-between'}>
            <p>Available Balance</p>
            <p>{balance} SWASH</p>
          </div>
          <div className={'flex justify-between'}>
            <p>Donation Amount</p>
            <p>{isOngoing ? `${percent}% per day` : `${amount} SWASH`}</p>
          </div>
        </div>
        <hr />
        <div className={'flex justify-between'}>
          <Button
            text={'Cancel'}
            color={ButtonColors.SECONDARY}
            onClick={() => {
              closePopup();
            }}
          />
          <Button
            text={'Confirm'}
            loading={loading}
            onClick={() => {
              donate();
            }}
          />
        </div>
      </div>
      <div
        key={'thanks'}
        className={'flex col align-center gap24 donate-popup no-overflow'}
      >
        <img className={'charity-logo'} src={charity.logo} alt={charity.name} />
        <div className={'flex col gap4'}>
          <p className={'large bold text-center'}>Thank you!</p>
          <p className={'text-center'}>
            Thank you for your donation to {charity.name}! Manage your donations
            anytime on the Donation page.
          </p>
        </div>
      </div>
    </MultiPageView>
  );
}
