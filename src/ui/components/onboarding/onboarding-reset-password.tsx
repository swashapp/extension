import { ReactNode, useCallback, useContext, useState } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { SwashSupportURLs } from '../../../paths';
import { isValidEmail } from '../../../utils/validator.util';
import { OnboardingContext } from '../../context/onboarding.context';
import { Button } from '../button/button';
import { InputBase } from '../input/input-base';
import { BackIcon } from '../svg/back';

import '../../../static/css/components/onboarding-components.css';

export function OnboardingResetPassword(): ReactNode {
  const { back, next } = useContext(OnboardingContext);
  const [email, setEmail] = useState<string>('');
  const [acceptEmail, setAcceptEmail] = useState<boolean | undefined>();

  const isEmailValid = useCallback(() => {
    setAcceptEmail(isValidEmail(email));
  }, [email]);

  return (
    <div className={'flex col gap32 reset-container'}>
      <h6>Reset your master password</h6>
      <div className={'round no-overflow flex col gap24 bg-white card32'}>
        <div className={'flex col gap16'}>
          <p>
            Your master password can be used to enter your Swash account on
            multiple devices.
          </p>
          <p>First, enter your email address:</p>
        </div>
        <InputBase
          type={'email'}
          name={'email'}
          placeholder={'example@email.com'}
          value={email}
          error={acceptEmail === false}
          onBlur={isEmailValid}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <div className={'flex col gap16'}>
          <Button
            text={'Reset password'}
            className={'full-width-button'}
            color={ButtonColors.PRIMARY}
            disabled={!acceptEmail}
            onClick={() => next()}
          />
          <p>
            Forgot email address?{' '}
            <span className={'bold'}>
              <a
                href={SwashSupportURLs.home}
                target={'_blank'}
                rel={'noreferrer'}
              >
                Get help
              </a>
            </span>
          </p>
        </div>
      </div>
      <a onClick={() => back()} className={'flex align-center'}>
        <BackIcon color={'var(--color-green)'} />
        <p className={'bold'}>Go back to log in</p>
      </a>
    </div>
  );
}
