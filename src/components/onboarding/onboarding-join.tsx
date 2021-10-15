import React, { useCallback, useContext, useEffect, useState } from 'react';

import { StepperContext } from '../../pages/onboarding';

const SWASH_DOMAIN = 'http://localhost:3001';
const SWASH_JOIN_PAGE = '/user/join';
const MAX_TOKEN_TRY_COUNT = 3;
const MAX_GENERAL_TRY_COUNT = 3;

const enum Status {
  BACK = 'BACK',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  TRY_AGAIN = 'TRYAGAIN',
}

export default function OnBoardingJoin(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [token, setToken] = useState<string | null>('sadfasdf');
  const [tokenTry, setTokenTry] = useState<number>(0);
  const [generalTry, setGeneralTry] = useState<number>(0);
  const [iframeSrc, setIframeSrc] = useState<string>(
    `${SWASH_DOMAIN}${SWASH_JOIN_PAGE}?token=${token}`,
  );
  const [iframeWrapperVisible, setIframeWrapperVisible] =
    useState<boolean>(true);

  const reloadIFrame = useCallback(() => {
    setIframeSrc(`${SWASH_DOMAIN}${SWASH_JOIN_PAGE}?token=${token}`);
  }, [token]);

  const handleMessages = useCallback(
    (event) => {
      if (event.origin !== SWASH_DOMAIN || !event.data) return;

      const status = event.data.status;
      switch (status) {
        case Status.BACK:
          stepper.back();
          break;
        case Status.SUCCESS:
          stepper.next();
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
    [reloadIFrame, stepper],
  );
  useEffect(() => {
    const value = false;
    console.log(value);
    // window.helper.generateJWT().then(setToken);
    window.onmessage = handleMessages;
  }, [handleMessages, setToken]);

  const makeVisible = useCallback((e) => {
    console.log(e.currentTarget.style.width);
    // e.currentTarget.style.visibility = 'visible';
    // setIframeWrapperVisible(false);
  }, []);
  return (
    <div
      className="onboarding-iframe-wrapper"
      // style={{ visibility: iframeWrapperVisible ? 'visible' : 'hidden' }}
    >
      {token ? (
        <iframe
          seamless
          className="onboarding-join-iframe"
          onLoad={makeVisible}
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
  );
}
