import { ReactNode, useContext, useMemo, useState } from 'react';

import { isValidPassword } from '../../../utils/validator.util';
import { OnboardingContext } from '../../context/onboarding.context';
import { InputBase } from '../input/input-base';

import { NavigationButtons } from '../navigation-buttons/navigation-buttons';

import '../../../static/css/components/onboarding-components.css';

export function OnboardingSetPassword(): ReactNode {
  const { setPassword, back, next } = useContext(OnboardingContext);

  const [masterPass, setMasterPass] = useState<string>('');
  const [confirmMasterPass, setConfirmMasterPass] = useState<string>('');

  const isPasswordValid = useMemo(
    () => masterPass === confirmMasterPass && isValidPassword(masterPass),
    [masterPass, confirmMasterPass],
  );

  return (
    <div className={'flex col gap40 create-password-container'}>
      <h6>Create your master password</h6>
      <div className={'round no-overflow flex col gap40 bg-white card32'}>
        <p>
          Your master password will allow you to enter your Swash account on
          multiple devices. Store it in a safe place and keep it to yourself to
          maintain your security.
        </p>
        <div className={'flex col gap16'}>
          <InputBase
            type={'password'}
            name={'password'}
            placeholder={'Enter your master password'}
            value={masterPass}
            onChange={(e) => {
              setMasterPass(e.target.value);
            }}
          />
          <InputBase
            type={'password'}
            name={'confirm password'}
            placeholder={'Enter your master password again'}
            value={confirmMasterPass}
            onChange={(e) => {
              setConfirmMasterPass(e.target.value);
            }}
          />
        </div>
        <NavigationButtons
          onBack={() => back()}
          onNext={() => {
            if (isPasswordValid) {
              setPassword(masterPass);
              next();
            }
          }}
          nextButtonText={'Send code'}
          disableNext={!isPasswordValid}
        />
      </div>
    </div>
  );
}
