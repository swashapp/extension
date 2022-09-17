import React, { useCallback, useEffect, useState } from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerificationAlert(): JSX.Element {
  const [reward, setReward] = useState<string>('');

  const loadActiveProfile = useCallback(() => {
    window.helper
      .getLatestPrograms()
      .then((data: { profile: { reward: string } }) => {
        if (data.profile.reward) setReward(data.profile.reward);
      });
  }, []);

  useEffect(() => {
    loadActiveProfile();
  }, [loadActiveProfile]);

  return (
    <>
      <div className="small-popup-title title">Verification</div>
      <div className="small-popup-separator" />
      <div className="small-popup-content">
        Verify your profile now and receive {reward} SWASH!
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
          text={'Verify'}
          className="small-popup-actions-submit"
          link={{ url: RouteToPages.profile }}
          onClick={() => {
            closePopup();
          }}
        />
      </div>
    </>
  );
}
