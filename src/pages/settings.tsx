import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import browser from 'webextension-polyfill';

import { Button } from '../components/button/button';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { IconButton } from '../components/icon-button/icon-button';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { showPopup } from '../components/popup/popup';
import { ToastMessage } from '../components/toast/toast-message';
import { VerificationPopup } from '../components/verification/verification-popup';
import { VerifiedInfoBox } from '../components/verification/verified-info-box';
import { helper } from '../core/webHelper';
import { RouteToPages } from '../paths';

import { AppContext } from './app';

const DropboxLogo = '/static/images/logos/dropbox.png';
const FileLogo = '/static/images/logos/file.png';
const GoogleDriveLogo = '/static/images/logos/google-drive.png';

export function Settings(): JSX.Element {
  const app = useContext(AppContext);

  const [reveal, setReveal] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>('');

  const [emailLoading, setEmailLoading] = React.useState(false);
  const [email, setEmail] = React.useState(undefined);
  const [phone, setPhone] = React.useState(undefined);

  const fetchProfile = useCallback(
    (forceUpdate?: boolean) => {
      setEmailLoading(true);
      helper.getUserProfile().then((profile) => {
        if (!profile.email) {
          setTimeout(fetchProfile, 3000, true);
        } else {
          setEmailLoading(false);
          setEmail(profile.email || '');
          setPhone(profile.phone || '');

          if (forceUpdate) app.forceUpdate();
        }
      });
    },
    [app],
  );

  const updateData = useCallback(() => {
    setEmailLoading(true);
    helper.updateVerification().then(() => {
      fetchProfile(true);
    });
  }, [fetchProfile]);

  const loadSettings = useCallback(async () => {
    return helper
      .getWalletPrivateKey()
      .then((key: string) => setPrivateKey(key));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!privateKey) {
      loadSettings().then();
    }
  }, [loadSettings, privateKey]);

  const onboardingUpload = useCallback((request) => {
    if (request.onboarding) {
      helper.uploadFile(request.onboarding).then((response: boolean) => {
        if (!response)
          toast(
            <ToastMessage
              type="error"
              content={<>The configuration file could not be exported</>}
            />,
          );
        else
          toast(
            <ToastMessage
              type="success"
              content={<>The configuration file is exported successfully</>}
            />,
          );
      });
    }

    if (browser.runtime.onMessage.hasListener(onboardingUpload))
      browser.runtime.onMessage.removeListener(onboardingUpload);
  }, []);

  const onboardingOAuth = useCallback(
    (onboarding) => {
      if (!browser.runtime.onMessage.hasListener(onboardingUpload))
        browser.runtime.onMessage.addListener(onboardingUpload);

      browser.tabs.getCurrent().then((tab) => {
        helper.startOnBoarding(onboarding, tab.id).then();
      });
    },
    [onboardingUpload],
  );

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h2>Settings</h2>
        </div>
        <div className="flex-column card-gap">
          <FlexGrid column={2} className="half-cards card-gap settings-columns">
            <div className="simple-card">
              <div>
                <h6>Backup your account</h6>
              </div>
              <div className="flex-column card-gap">
                <p>
                  Don’t forget to download your settings to make sure you can
                  access your account on other devices or browsers. If you lose
                  access but don’t have this saved, then you won’t be able to
                  access your account. Think of this like a password. Do not
                  share your private key or saved file with anyone and make sure
                  to store it securely offline.
                </p>
                <FlexGrid
                  column={2}
                  className="settings-backup-buttons form-item-gap"
                >
                  <IconButton
                    body="Local File"
                    image={FileLogo}
                    link={false}
                    onClick={() => helper.saveConfig().then()}
                  />
                  <IconButton
                    body="Dropbox"
                    image={DropboxLogo}
                    link={false}
                    onClick={() => onboardingOAuth('DropBox')}
                  />
                  <IconButton
                    body="Google Drive"
                    image={GoogleDriveLogo}
                    imageSize={{ width: 27 }}
                    link={false}
                    onClick={() => onboardingOAuth('GoogleDrive')}
                  />
                </FlexGrid>
              </div>
            </div>
            <div className={`simple-card`}>
              <h6>Contact information</h6>
              <VerifiedInfoBox
                title={'Email address'}
                value={email ? email : undefined}
                loading={emailLoading}
                onClick={() => {
                  toast(
                    <ToastMessage
                      type="warning"
                      content={<>Change email is not available</>}
                    />,
                  );
                }}
              />
              <VerifiedInfoBox
                title={'Phone number'}
                value={phone ? phone : undefined}
                loading={emailLoading}
                onClick={() => {
                  showPopup({
                    id: 'verify-phone',
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'large-popup',
                    content: (
                      <VerificationPopup
                        title={'phone'}
                        callback={updateData}
                      />
                    ),
                  });
                }}
              />
            </div>
          </FlexGrid>
          <FlexGrid column={2} className="half-cards card-gap settings-columns">
            <div className="simple-card">
              <h6>Private key</h6>
              <p>
                Think of your private key like a password. Do not share it with
                anyone and make sure to store it securely offline.
              </p>
              <div>
                <Input
                  label={'Private key'}
                  value={privateKey}
                  type={reveal ? 'text' : 'password'}
                  disabled={true}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  endAdornment={<CopyEndAdornment value={privateKey} />}
                />
              </div>
              <div className="reveal-private-key-button">
                <Button
                  color={'primary'}
                  text={`${reveal ? 'Hide' : 'Reveal'} private key`}
                  link={false}
                  onClick={() => setReveal((r) => !r)}
                />
              </div>
            </div>
            <div className="simple-card">
              <h6>Data & ads controls</h6>
              <p>
                Curious about your data?
                <br />
                <br />
                Manage your data, undo ad site restrictions, and amend your
                domain preferences at anytime via the data & ads control center.
                <br />
                <br />
              </p>
              <div className="manage-preferences-key-button">
                <Button
                  color={'secondary'}
                  text={`Manage Preferences`}
                  link={{ url: RouteToPages.data }}
                />
              </div>
            </div>
          </FlexGrid>
        </div>
      </div>
    </div>
  );
}
