import React from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerifiedUsersOnly(props: {
  header: string;
  body: JSX.Element;
}): JSX.Element {
  return (
    <>
      <div className="small-popup-title title">{props.header}</div>
      <div className="small-popup-separator" />
      <div className="small-popup-content">{props.body}</div>
      <div className="small-popup-separator" />
      <div className="small-popup-actions">
        <Button
          text={'Cancel'}
          color={'secondary'}
          className="small-popup-actions-cancel"
          link={{ url: RouteToPages.earnings }}
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
