import React, { useCallback, useRef, useState } from 'react';

import Circle from '../components/drawing/circle';
import CongratsWalletIsReady from '../components/on-boarding/congrats-wallet-is-ready';
import EmailSent from '../components/on-boarding/email-sent';
import ImportYourConfig from '../components/on-boarding/import-your-config';
import OnBoardingImportant from '../components/on-boarding/on-boarding-important';
import OnBoardingJoin from '../components/on-boarding/on-boarding-join';
import OnBoardingPrivacy from '../components/on-boarding/on-boarding-privacy';
import OnBoardingProfile from '../components/on-boarding/on-boarding-profile';
import OnBoardingStart from '../components/on-boarding/on-boarding-start';
import OnBoardingVerifiy from '../components/on-boarding/on-boarding-verify';
import Stepper from '../components/stepper/stepper';
import { IStepper } from '../components/stepper/stepper.type';

export default function OnBoarding() {
  const ref = useRef<IStepper>();
  const [ready, setReady] = useState<boolean>(false);
  const onStart = useCallback(
    (value: boolean) => () => {
      setReady(value);
      ref.current?.next();
    },
    [setReady, ref],
  );
  return (
    <div className="page-container on-boarding-container">
      <Circle className={'on-boarding-circle1'} border={'black'} />
      <Circle className={'on-boarding-circle2'} colorfulGradiant />
      <Circle
        className={'on-boarding-circle3'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle className={'on-boarding-circle4'} color={'lightest-green'} />
      <Circle
        className={'on-boarding-circle5'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle
        className={'on-boarding-circle6'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle className={'on-boarding-circle7'} colorful />
      <div className="on-boarding-stepper">
        {ready ? (
          <Stepper ref={ref}>
            <OnBoardingStart
              onStartNew={onStart(false)}
              onStartReady={onStart(true)}
            />
            <ImportYourConfig />
          </Stepper>
        ) : (
          <Stepper ref={ref}>
            <OnBoardingStart
              onStartNew={onStart(false)}
              onStartReady={onStart(true)}
            />
            <OnBoardingPrivacy
              onSubmit={() => ref.current?.next()}
              onBack={() => ref.current?.back()}
            />
            <OnBoardingImportant
              onSubmit={() => ref.current?.next()}
              onBack={() => ref.current?.back()}
            />
            <OnBoardingProfile
              onSubmit={() => ref.current?.next()}
              onBack={() => ref.current?.back()}
            />
            <OnBoardingJoin
              onSubmit={() => ref.current?.next()}
              onBack={() => ref.current?.back()}
            />
            <OnBoardingVerifiy
              onSubmit={() => ref.current?.next()}
              onBack={() => ref.current?.back()}
            />
          </Stepper>
        )}
      </div>
    </div>
  );
}
