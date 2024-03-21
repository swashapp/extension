import { ReactNode } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { SystemMessage } from '../../../enums/message.enum';
import { helper } from '../../../helper';
import { GetCharityInfoRes } from '../../../types/api/charity.type';
import { OngoingRes } from '../../../types/api/donation.type';
import { useAccountBalance } from '../../hooks/use-account-balance';
import { useErrorHandler } from '../../hooks/use-error-handler';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';
import { toastMessage } from '../toast/toast-message';

export function StopDonation({
  charity,
  ongoing,
  onStop,
}: {
  charity: GetCharityInfoRes;
  ongoing: OngoingRes;
  onStop?: () => void;
}): ReactNode {
  const { safeRun } = useErrorHandler();
  const { balance } = useAccountBalance();

  return (
    <div className={'donate-popup'}>
      <p className={'large'}>You sure you want to stop donating?</p>
      <hr />
      <div className={'flex col gap20'}>
        <div className={'flex justify-between'}>
          <p>Charity</p>
          <p>{charity.name}</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Donation Type</p>
          <p>Ongoing Donation</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Current Balance</p>
          <p>{balance} SWASH</p>
        </div>
        <div className={'flex justify-between'}>
          <p>Amount to Donate</p>
          <p>{ongoing.portion}%/day</p>
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
          onClick={async () => {
            safeRun(async () => {
              await helper('user').stopOngoingDonation(ongoing.id);
              if (onStop) onStop();
              toastMessage(
                'success',
                SystemMessage.SUCCESSFULLY_STOP_ONGOING_DONATION,
              );
              closePopup();
            });
          }}
        />
      </div>
    </div>
  );
}
