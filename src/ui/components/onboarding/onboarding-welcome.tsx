import { ReactNode, useContext, useState } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { OnboardingFlows } from '../../../enums/onboarding.enum';
import { isValidEmail, isValidPassword } from '../../../utils/validator.util';
import { OnboardingContext } from '../../context/onboarding.context';
import { Button } from '../button/button';
import { InputBase } from '../input/input-base';

import '../../../static/css/components/onboarding-components.css';

export function OnboardingWelcome(): ReactNode {
  const {
    email: contextEmail,
    setFlow,
    setEmail: contextSetEmail,
    setPassword,
    next,
  } = useContext(OnboardingContext);

  const [email, setEmail] = useState<string>(contextEmail);
  const [masterPass, setMasterPass] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  return (
    <div
      className={
        'round no-overflow flex col gap40 bg-off-white card32 login-container'
      }
    >
      <div className={'flex center'}>
        <img
          src={'/static/images/misc/wave-hand.webp'}
          alt={'wave-hand'}
          width={172}
          height={160}
        />
      </div>
      <div className={'flex col align-center gap12'}>
        <h6>Welcome back!</h6>
        <p>Log in to your Swash account.</p>
      </div>
      <div className={'flex col gap24'}>
        <div className={'flex col gap12'}>
          <InputBase
            type={'email'}
            name={'email'}
            placeholder={'example@email.com'}
            value={email}
            error={error}
            onBlur={() => {
              setError(!isValidEmail(email));
            }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <p>
            Forgot email?{' '}
            <span className={'bold'}>
              <a
                onClick={() => {
                  setFlow(OnboardingFlows.RestoreBackup);
                  contextSetEmail(email);
                  next();
                }}
              >
                Log with backup
              </a>
            </span>
          </p>
        </div>
        <div className={'flex col gap12'}>
          <InputBase
            type={'password'}
            name={'password'}
            placeholder={'Enter your password'}
            value={masterPass}
            onChange={(e) => {
              setMasterPass(e.target.value);
            }}
          />
          <p>
            Forgot password?{' '}
            <span className={'bold'}>
              <a
                onClick={() => {
                  setFlow(OnboardingFlows.ResetPassword);
                  contextSetEmail(email);
                  next();
                }}
              >
                Reset it
              </a>
            </span>
          </p>
        </div>
        <Button
          text={'Login'}
          className={'full-width-button'}
          color={ButtonColors.PRIMARY}
          disabled={error || !isValidPassword(masterPass)}
          onClick={() => {
            setFlow(OnboardingFlows.Login);
            contextSetEmail(email);
            setPassword(masterPass);
            next();
          }}
        />
      </div>
      <div className={'flex center'}>
        <p className={'absolute onboarding-separator-text'}>or</p>
        <hr className={'onboarding-separator-line'} />
      </div>
      <Button
        text={'Sign up'}
        className={'full-width-button'}
        color={ButtonColors.SECONDARY}
        onClick={() => {
          setFlow(OnboardingFlows.Register);
          contextSetEmail(email);
          next();
        }}
      />
    </div>
  );
}
