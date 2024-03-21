import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { helper } from '../../core/webHelper';
import { StepperContext } from '../../pages/onboarding';
import { WebsitePath } from '../../paths';
import { WaitingProgressBar } from '../progress/waiting-progress';

import { OnboardingVerify } from './onboarding-verify';

const SWASH_JOIN_PAGE = '/user/verify-email';
const MAX_TOKEN_TRY_COUNT = 3;
const MAX_GENERAL_TRY_COUNT = 3;

const enum Status {
  BACK = 'BACK',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  TRY_AGAIN = 'TRY_AGAIN',
}

export function OnboardingJoin(): ReactElement {
  const stepper = useContext(StepperContext);
  const [token, setToken] = useState<string | null>('');
  const [tokenTry, setTokenTry] = useState<number>(0);
  const [generalTry, setGeneralTry] = useState<number>(0);
  const [iframeVisible, setIframeVisible] = useState<boolean>(false);

  const iframeSrc = useMemo(
    () => `${WebsitePath}${SWASH_JOIN_PAGE}?token=${token}&v=2`,
    [token],
  );

  const reloadIFrame = useCallback(() => {
    setToken((_token) => _token + '');
  }, []);

  const [verification, setVerification] = useState<{
    email: string;
    requestId: string;
    stayUpdate: boolean;
    status?: Status;
  }>({ email: '', requestId: '', stayUpdate: false });

  const handleMessages = useCallback(
    (event) => {
      // if (event.origin !== SWASH_DOMAIN || !event.data) return;

      const status = event.data.status;
      switch (status) {
        case Status.BACK:
          stepper.back();
          break;
        case Status.SUCCESS:
          console.log(event.data);
          setVerification(event.data);
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

  const [joinData, setJoinData] = useState<{
    id?: number;
    email?: string;
  } | null>(null);

  const onGetJoinedFailed = useCallback((err) => {
    if (err.message === 'user not found' || err.message === 'invalid user') {
      setJoinData({});
    }
  }, []);

  useEffect(() => {
    window.onmessage = handleMessages;

    helper
      .getJoinedSwash()
      .then((data: { id: number; email: string }) => {
        if (data.id && data.email) {
          stepper.next();
        } else setJoinData(data);
      })
      .catch(onGetJoinedFailed)
      .finally(() => {
        if (!token) {
          helper.generateJWT().then((_token: string) => setToken(_token));
        }
      });
  }, [handleMessages, onGetJoinedFailed, stepper, token]);

  return (
    <>
      {verification.email ? (
        <OnboardingVerify
          key={''}
          {...verification}
          onBack={() =>
            setVerification({ email: '', requestId: '', stayUpdate: false })
          }
          joinData={joinData}
        />
      ) : (
        <>
          {!iframeVisible || joinData === null ? <WaitingProgressBar /> : <></>}
          {token ? (
            <iframe
              seamless
              className={'onboarding-join-iframe'}
              style={{
                visibility:
                  iframeVisible && joinData !== null ? 'visible' : 'hidden',
              }}
              onLoad={() => setIframeVisible(true)}
              title={'joinPage'}
              scrolling={'no'}
              frameBorder={'no'}
              src={iframeSrc}
            >
              <p>Your browser does not support iframe.</p>
            </iframe>
          ) : (
            ''
          )}
        </>
      )}
    </>
  );
}
