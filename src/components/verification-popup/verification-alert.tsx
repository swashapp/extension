import React from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerificationAlert(): JSX.Element {
  return (
    <>
      <div className="small-popup-title title">Verification</div>
      <div className="small-popup-separator" />
      <div className="small-popup-content">
        Verify your profile now and receive 100 SWASH!
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
