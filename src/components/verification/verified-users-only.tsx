import React, { useCallback, useEffect, useState } from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerifiedUsersOnly(): JSX.Element {
  return (
    <>
      <div className="small-popup-title title">Get verified to Earn More!</div>
      <div className="small-popup-separator" />
      <div className="small-popup-content">
        Earn More is only available for verified Swash members.
        <br />
        <br />
        Now live with Swash ads and a fully customisable New Tab Experience, new
        ways to Earn More will be added over time, including surveys, videos,
        and technical and commercial product integrations with Swash partners.
        <br />
        <br />
        To use the Earn More feature, your profile has to be verified. Take a
        few minutes to verify your profile and get ready to enter a new
        internet.
      </div>
      <div className="small-popup-separator" />
      <div className="small-popup-actions">
        <Button
          text={'Cancel'}
          color={'secondary'}
          className="small-popup-actions-cancel"
          link={{ url: RouteToPages.wallet }}
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
