import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';

import { VerificationActionType, VerificationType } from '../../enums/api.enum';
import { ButtonColors } from '../../enums/button.enum';
import { CloudServices } from '../../enums/cloud.enum';
import { SystemMessage } from '../../enums/message.enum';
import { helper } from '../../helper';
import { InternalRoutes, WebsiteURLs } from '../../paths';
import { AccountInfoRes } from '../../types/api/account.type';
import { MultiPageRef } from '../../types/ui.type';
import { isValidPassword } from '../../utils/validator.util';
import { BackupOption } from '../components/backup-option/backup-option';
import { Button } from '../components/button/button';
import { TextEndAdornment } from '../components/input/end-adornments/text-end-adornment';
import { Input } from '../components/input/input';
import { MultiPageView } from '../components/multi-page-view/multi-page-view';
import { MultiTabView } from '../components/multi-tab-view/multi-tab-view';
import { PageHeader } from '../components/page-header/page-header';
import { closePopup, showPopup } from '../components/popup/popup';
import { WaitingProgressBar } from '../components/progress/waiting-progress';
import { Recaptcha } from '../components/recaptcha/recaptcha';
import { toastMessage } from '../components/toast/toast-message';
import { VerifyCode } from '../components/verify-code/verify-code';
import { WaitForDone } from '../components/wait-for-done/wait-for-done';
import { DashboardContext } from '../context/dashboard.context';
import { useErrorHandler } from '../hooks/use-error-handler';

function SetPassword({ password }: { password: string }) {
  const ref = useRef<MultiPageRef>();
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [challenge, setChallenge] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [code, setCode] = useState<string>('');

  return (
    <MultiPageView ref={ref}>
      <Recaptcha
        onBack={() => {
          closePopup();
        }}
        onTokenReceived={(token: string) => {
          setChallenge(token);
          ref.current?.next();
        }}
      />
      <WaitForDone
        onBack={() => {
          setChallenge('');
          setRequestId('');
          ref.current?.back();
        }}
        onLoad={() => {
          safeRun(async () => {
            const verify = await helper('user').verify(
              VerificationType.EMAIL,
              VerificationActionType.RESET_PASSWORD,
              account.email,
              challenge,
            );
            setRequestId(verify.request_id);
            ref.current?.next();
          });
        }}
      />
      <VerifyCode
        text={account.email}
        onBack={() => {
          setChallenge('');
          setRequestId('');
          setCode('');
          ref.current?.back(2);
        }}
        onNext={async (code) => {
          setCode(code);
          ref.current?.next();
        }}
        nextButtonText={'Verify'}
      />
      <WaitForDone
        onBack={() => {
          setChallenge('');
          setRequestId('');
          setCode('');
          ref.current?.back(3);
        }}
        onLoad={async () => {
          safeRun(
            async () => {
              await helper('user').resetPassword(
                account.email,
                password,
                requestId,
                code,
              );
              toastMessage('success', SystemMessage.SUCCESSFULLY_SET_PASSWORD);
              closePopup();
            },
            {
              failure: async () => {
                toastMessage('error', SystemMessage.FAILED_SET_PASSWORD);
              },
            },
          );
        }}
      />
    </MultiPageView>
  );
}

export function Settings(): ReactNode {
  const { safeRun } = useErrorHandler();
  const { account } = useContext(DashboardContext);

  const [email, setEmail] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [masterPass, setMasterPass] = useState<string>('');
  const [confirmMasterPass, setConfirmMasterPass] = useState<string>('');

  const [loading, setLoading] = useState<string>('');

  const isPasswordValid = useMemo(
    () => masterPass === confirmMasterPass && isValidPassword(masterPass),
    [masterPass, confirmMasterPass],
  );

  const onSetPassword = useCallback(() => {
    if (isPasswordValid) {
      showPopup({
        closable: false,
        closeOnBackDropClick: true,
        paperClassName: 'popup custom',
        content: <SetPassword password={masterPass} />,
      });
    }
  }, [isPasswordValid, masterPass]);

  useEffect(() => {
    if (!privateKey)
      safeRun(async () => {
        setPrivateKey(await helper('wallet').get());
      });
  }, [privateKey, safeRun]);

  useEffect(() => {
    if (!email) {
      safeRun(async () => {
        const data = await helper('cache').getData('account');
        setEmail((data as AccountInfoRes).email);
      });
    }
  }, [email, safeRun]);

  const tabs = useMemo(() => {
    return [
      {
        label: <p className={'bold'}>Your account settings</p>,
        content: (
          <div className={'flex col gap32 settings-tab-panel'}>
            <p>
              Don’t forget to download your settings to make sure you can access
              your account on other devices or browsers.
              <br />
              <br />
              If you lose access but don’t have this in a safe place, then you
              won’t be able to access your wallet. Think of this like a
              password. Do not share your private key or saved file with anyone
              and make sure to store it securely offline.
            </p>
            <div className={'flex gap12'}>
              <CopyToClipboard text={privateKey}>
                <BackupOption
                  text={'Copy private key'}
                  icon={'/static/images/icons/backup/copy.svg'}
                  type={2}
                  onClick={() => {
                    toastMessage(
                      'success',
                      SystemMessage.SUCCESSFULLY_COPIED_PRIVATE_KEY,
                    );
                  }}
                />
              </CopyToClipboard>
              <BackupOption
                text={'Local File'}
                icon={'/static/images/icons/backup/local-file.svg'}
                type={2}
                onClick={() => {
                  safeRun(async () => {
                    await helper('backup').download();
                    toastMessage(
                      'success',
                      SystemMessage.SUCCESSFULLY_CREATE_BACKUP_FILE,
                    );
                  });
                }}
              />
              <BackupOption
                text={'Dropbox'}
                icon={'/static/images/icons/backup/dropbox.svg'}
                type={2}
                loading={loading === 'Dropbox'}
                onClick={() => {
                  safeRun(
                    async () => {
                      setLoading('Dropbox');
                      await helper('backup').uploadToCloud(
                        CloudServices.DROPBOX,
                      );
                      toastMessage(
                        'success',
                        SystemMessage.SUCCESSFULLY_UPLOAD_BACKUP_FILE,
                      );
                    },
                    {
                      failure: () => {
                        toastMessage(
                          'error',
                          SystemMessage.FAILED_UPLOAD_BACKUP_FILE,
                        );
                      },
                      finally: () => {
                        setLoading('');
                      },
                    },
                  );
                }}
              />
              <BackupOption
                text={'Google Drive'}
                icon={'/static/images/icons/backup/google-drive.svg'}
                type={2}
                loading={loading === 'Google Drive'}
                imageSize={{ width: 27 }}
                onClick={() => {
                  safeRun(
                    async () => {
                      setLoading('Google Drive');
                      await helper('backup').uploadToCloud(
                        CloudServices.GOOGLE_DRIVE,
                      );
                      toastMessage(
                        'success',
                        SystemMessage.SUCCESSFULLY_UPLOAD_BACKUP_FILE,
                      );
                    },
                    {
                      failure: () => {
                        toastMessage(
                          'error',
                          SystemMessage.FAILED_UPLOAD_BACKUP_FILE,
                        );
                      },
                      finally: () => {
                        setLoading('');
                      },
                    },
                  );
                }}
              />
            </div>
          </div>
        ),
      },
      {
        label: <p className={'bold'}>Logging in</p>,
        content: (
          <div className={'flex col gap32 settings-tab-panel'}>
            <p>
              Logging in with the Swash mobile app? Scan the QR code below to
              sync your devices.
            </p>
            {privateKey ? (
              <QRCode value={privateKey} />
            ) : (
              <WaitingProgressBar />
            )}
          </div>
        ),
      },
      {
        label: <p className={'bold'}>Email + Password</p>,
        content: (
          <div className={'flex col gap16 settings-tab-panel'}>
            <Input label={'Email'} value={email} disabled />
            <Input
              type={'password'}
              label={'Master password'}
              placeholder={'Enter your master password'}
              value={masterPass}
              onChange={(e) => {
                setMasterPass(e.target.value);
              }}
            />
            <Input
              type={'password'}
              label={'Confirm master password'}
              placeholder={'Enter your master password again'}
              value={confirmMasterPass}
              onChange={(e) => {
                setConfirmMasterPass(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') onSetPassword();
              }}
              endAdornment={
                <TextEndAdornment
                  text={'Set'}
                  disabled={!isPasswordValid}
                  onClick={() => {
                    onSetPassword();
                  }}
                />
              }
            />
          </div>
        ),
      },
      {
        label: <p className={'bold'}>Data & ads controls</p>,
        content: (
          <div className={'flex col gap32 settings-tab-panel'}>
            <p>
              Curious about your data?
              <br />
              <br />
              Manage your data, undo ad site restrictions, and amend your domain
              preferences at anytime via the data & ads control center.
            </p>
            <div className={'flex gap12'}>
              <Button
                text={`Do not share`}
                color={ButtonColors.SECONDARY}
                link={{
                  url: WebsiteURLs.request,
                  external: true,
                  newTab: true,
                }}
              />
              <Button
                text={`Manage Preferences`}
                color={ButtonColors.PRIMARY}
                link={{ url: InternalRoutes.data }}
              />
            </div>
          </div>
        ),
      },
    ];
  }, [
    confirmMasterPass,
    email,
    isPasswordValid,
    loading,
    masterPass,
    onSetPassword,
    privateKey,
    safeRun,
  ]);

  return (
    <>
      <PageHeader header={'Settings'} uid={account.wallet} />
      <div className={'round no-overflow bg-white card28'}>
        <MultiTabView tabs={tabs} />
      </div>
    </>
  );
}
