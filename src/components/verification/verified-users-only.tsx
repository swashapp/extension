import React, { ReactElement } from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerifiedUsersOnly(props: {
  header: string;
  body: ReactElement;
}): ReactElement {
  return (
    <>
      <p className={'large'}>{props.header}</p>
      <hr />
      <div className={'flex col gap12'}>{props.body}</div>
      <hr />
      <div className={'flex justify-between'}>
        <Button
          text={'Cancel'}
          color={'secondary'}
          className={'popup-cancel'}
          link={{ url: RouteToPages.wallet }}
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
