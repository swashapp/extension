import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from 'react-toastify';

import { closePopup } from '../popup/popup';
import { WaitingProgressBar } from '../progress/waiting-progress';
import { ToastMessage } from '../toast/toast-message';

const SWASH_DOMAIN = 'https://swashapp.io';
const SWASH_JOIN_PAGE = '/user/profile-verification';

const enum Status {
  CANCEL = 'CANCEL',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export function VerificationPopup(props: {
  title: 'phone' | 'email';
  callback?: () => void;
}): JSX.Element {
  const [token, setToken] = useState<string | null>('');
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  const handleMessages = useCallback(
    (event) => {
      const status = event.data.status;
      switch (status) {
        case Status.CANCEL:
          closePopup();
          break;
        case Status.SUCCESS:
          props.callback && props.callback();
          closePopup();
          break;
        case Status.ERROR:
          toast(<ToastMessage type="error" content={event.data.message} />);
          break;
      }
    },
    [props],
  );

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
          title={'profile verification'}
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
