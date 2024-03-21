import { ReactElement, useCallback, useEffect, useState } from 'react';

import { helper } from '../../core/webHelper';
import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerificationAlert(): ReactElement {
  const [reward, setReward] = useState<string>('');

  const loadActiveProfile = useCallback(() => {
    helper.getLatestPrograms().then((data: { profile: { reward: string } }) => {
      if (data.profile.reward) setReward(data.profile.reward);
    });
  }, []);

  useEffect(() => {
    loadActiveProfile();
  }, [loadActiveProfile]);

  return (
    <>
      <p className={'large'}>Verification</p>
      <hr />
      <div className={'flex col gap12'}>
        Verify your profile now and receive {reward} SWASH!
      </div>
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
          text={'Verify'}
          className={'popup-submit'}
          link={{ url: RouteToPages.profile }}
          onClick={() => {
            closePopup();
          }}
        />
      </div>
    </>
  );
}
