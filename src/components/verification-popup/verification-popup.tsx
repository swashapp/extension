import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { closePopup } from '../popup/popup';
import { WaitingProgressBar } from '../progress/waiting-progress';

const SWASH_DOMAIN = 'https://swashapp.io';
const SWASH_JOIN_PAGE = '/user/profile-verification';

const enum Status {
  CANCEL = 'CANCEL',
  SUCCESS = 'SUCCESS',
}

export function VerificationPopup(props: {
  title: 'mobile' | 'email';
}): JSX.Element {
  const [token, setToken] = useState<string | null>('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  const handleMessages = useCallback((event) => {
    const status = event.data.status;
    switch (status) {
      case Status.CANCEL:
        closePopup();
        break;
      case Status.SUCCESS:
        closePopup();
        break;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      window.helper.generateJWT().then((_token: string) => setToken(_token));
    }
    window.onmessage = handleMessages;
  }, [handleMessages, token]);

  const iframeSrc = useMemo(
    () =>
      `${SWASH_DOMAIN}${SWASH_JOIN_PAGE}?type=${props.title}&token=${token}`,
    [props.title, token],
  );

  return (
    <div className="verification-iframe">
      {!iframeVisible ? <WaitingProgressBar /> : <></>}
      {token ? (
        <iframe
          seamless
          id={`verification-iframe-${props.title}`}
          className="verification-iframe"
          style={{
            visibility: iframeVisible ? 'visible' : 'hidden',
          }}
          onLoad={() => setIframeVisible(true)}
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
