import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { StepperContext } from '../../pages/onboarding';

import { OnboardingVerify } from './onboarding-verify';

const SWASH_DOMAIN = 'https://swashapp.io';
const SWASH_JOIN_PAGE = '/user/join';
const MAX_TOKEN_TRY_COUNT = 3;
const MAX_GENERAL_TRY_COUNT = 3;

const enum Status {
  BACK = 'BACK',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  TRY_AGAIN = 'TRYAGAIN',
}

export function OnboardingJoin(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [token, setToken] = useState<string | null>('');
  const [tokenTry, setTokenTry] = useState<number>(0);
  const [generalTry, setGeneralTry] = useState<number>(0);
  // const [iframeWrapperVisible, setIframeWrapperVisible] =
  //   useState<boolean>(true);

  const iframeSrc = useMemo(
    () => `${SWASH_DOMAIN}${SWASH_JOIN_PAGE}?token=${token}`,
    [token],
  );

  const reloadIFrame = useCallback(() => {
    setToken((_token) => _token + '');
  }, []);

  const [success, setSuccess] = useState<boolean>(false);
  const onSuccess = useCallback((email: string, stayUpdate: boolean) => {
    console.log(email, stayUpdate);
    setSuccess(true);
  }, []);

  const handleMessages = useCallback(
    (event) => {
      // if (event.origin !== SWASH_DOMAIN || !event.data) return;

      const status = event.data.status;
      switch (status) {
        case Status.BACK:
          stepper.back();
          break;
        case Status.SUCCESS:
          onSuccess(event.data.email, event.data.stayUpdate);
          break;
        case Status.FAIL:
          setTokenTry((count) => {
            count++;
            if (count > MAX_TOKEN_TRY_COUNT) stepper.back();
            return count;
          });
          break;
        default:
          setGeneralTry((count) => {
            count++;
            if (count > MAX_GENERAL_TRY_COUNT) reloadIFrame();
            return count;
          });
          break;
      }
    },
    [onSuccess, reloadIFrame, stepper],
  );
  useEffect(() => {
    console.log(token);
    if (!token) {
      window.helper.generateJWT().then((_token) => setToken(_token));
    }
    window.onmessage = handleMessages;
  }, [handleMessages, token]);

  // const makeVisible = useCallback((e) => {
  //   reloadIFrame();
  // }, []);
  return (
    <>
      {success ? (
        <OnboardingVerify
          onBack={() => {
            console.log('');
          }}
        />
      ) : (
        <div
          className="onboarding-iframe-wrapper"
          // style={{ visibility: iframeWrapperVisible ? 'visible' : 'hidden' }}
        >
          {token ? (
            <iframe
              seamless
              className="onboarding-join-iframe"
              onLoad={reloadIFrame}
              title={'joinPage'}
              scrolling="no"
              frameBorder="no"
              src={iframeSrc}
            >
              <p>Your browser does not support iframe.</p>
            </iframe>
          ) : (
            ''
          )}
        </div>
      )}
    </>
  );
}
