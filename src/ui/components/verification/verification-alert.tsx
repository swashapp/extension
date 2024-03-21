import { ReactNode } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { InternalRoutes } from '../../../paths';
import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

export function VerificationAlert(): ReactNode {
  return (
    <>
      <p className={'large'}>Verification</p>
      <hr />
      <p className={'flex col gap12'}>
        Verify your profile to get access to all Swash features!
      </p>
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
          text={'Verify'}
          link={{ url: InternalRoutes.profile }}
          onClick={() => {
            closePopup();
          }}
        />
      </div>
    </>
  );
}
