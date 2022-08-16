import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'react-toastify';

import { closePopup } from '../popup/popup';
import { WaitingProgressBar } from '../progress/waiting-progress';
import { ToastMessage } from '../toast/toast-message';

const SWASH_DOMAIN = 'http://localhost:3000';
const SWASH_JOIN_PAGE = '/user/profile-verification';

const enum Status {
  CANCEL = 'CANCEL',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export function VerificationPopup(props: {
  title: 'phone' | 'email';
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
      case Status.ERROR:
        toast(<ToastMessage type="error" content={event.data.message} />);
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
