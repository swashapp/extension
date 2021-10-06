import React, { useCallback, useEffect, useState } from 'react';

const SWASHDOMAIN = 'http://localhost:3001';
const SWASHJOINPAGE = '/user-join';
const MAXTOKENTRYCOUNT = 3;
const MAXGENERALTRYCOUNT = 3;

const enum Status {
  BACK = 'BACK',
  SUCCESS = 'SUCCESS',
  FAILE = 'FAILE',
  TRYAGAIN = 'TRYAGAIN',
}

export default function OnBoardingJoin(props: {
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [token, setToken] = useState<string | null>('sadfasdf');
  const [tokenTry, setTokenTry] = useState<number>(0);
  const [generalTry, setGeneralTry] = useState<number>(0);
  const [iframeSrc, setIframeSrc] = useState<string>(
    `${SWASHDOMAIN}${SWASHJOINPAGE}?token=${token}`,
  );
  const [iframeWrapperVisible, setIframeWrapperVisible] =
    useState<boolean>(true);

  const reloadIFrame = useCallback(() => {
    setIframeSrc(`${SWASHDOMAIN}${SWASHJOINPAGE}?token=${token}`);
  }, [iframeSrc]);

  const handleMessages = useCallback(
    (event) => {
      if (event.origin !== SWASHDOMAIN || !event.data) return;

      const status = event.data.status;
      switch (status) {
        case Status.BACK:
          props.onBack();
          break;
        case Status.SUCCESS:
          props.onSubmit();
          break;
        case Status.FAILE:
          setTokenTry((count) => {
            count++;
            if (count > MAXTOKENTRYCOUNT) props.onBack();
            return count;
          });
          break;
        default:
          setGeneralTry((count) => {
            count++;
            if (count > MAXGENERALTRYCOUNT) reloadIFrame();
            return count;
          });
          break;
      }
    },
    [props.onBack, props.onSubmit, reloadIFrame],
  );
  useEffect(() => {
    // window.helper.generateJWT().then(setToken);
    window.onmessage = handleMessages;
  }, [handleMessages, setToken]);

  const makeVisible = useCallback(
    (e) => {
      e.currentTarget.style.visibility = 'visible';
      setIframeWrapperVisible(false);
    },
    [setIframeWrapperVisible],
  );
  return (
    <div className="simple-card">
      <div
        className="on-boarding-iframe-wrapper"
        // style={{ visibility: iframeWrapperVisible ? 'visible' : 'hidden' }}
      >
        {token ? (
          <iframe
            seamless
            className="on-boarding-join-iframe"
            // onLoad={makeVisible}
            title={'joinPage'}
            scrolling="no"
            frameBorder="no"
            src={iframeSrc}
          >
            <p>Your browser does not support iframes.</p>
          </iframe>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
