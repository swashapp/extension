import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import DropboxLogo from 'url:../static/images/logos/dropbox.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileLogo from 'url:../static/images/logos/file.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import GoogleDriveLogo from 'url:../static/images/logos/google-drive.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import ThreeBoxLogo from 'url:../static/images/logos/three-box.png';

import { Button } from '../components/button/button';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { IconButton } from '../components/icon-button/icon-button';
import { CopyEndAdornment } from '../components/input/end-adornments/copy-end-adornment';
import { Input } from '../components/input/input';
import { Export3Box } from '../components/passphrase-popup/export-3box';
import { showPopup } from '../components/popup/popup';
import { ToastMessage } from '../components/toast/toast-message';

export function Settings(): JSX.Element {
  const [reveal, setReveal] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>('');

  const loadSettings = useCallback(async () => {
    return window.helper
      .getWalletPrivateKey()
      .then((key) => setPrivateKey(key));
  }, []);

  useEffect(() => {
    if (!privateKey) {
      loadSettings().then();
    }
  }, [loadSettings, privateKey]);

  const onboardingUpload = useCallback((request) => {
    if (request.onboarding) {
      window.helper.uploadFile(request.onboarding).then((response) => {
        if (response === false)
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

    if (window.browser.runtime.onMessage.hasListener(onboardingUpload))
      window.browser.runtime.onMessage.removeListener(onboardingUpload);
  }, []);

  const onboardingOAuth = useCallback(
    (onboarding) => {
      if (!window.browser.runtime.onMessage.hasListener(onboardingUpload))
        window.browser.runtime.onMessage.addListener(onboardingUpload);

      window.browser.tabs.getCurrent().then((tab) => {
        window.helper.startOnBoarding(onboarding, tab.id).then();
      });
    },
    [onboardingUpload],
  );

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout2" />
      <div className="page-content">
        <div className="page-header">
          <h2>Settings</h2>
        </div>
        <div className="flex-column card-gap">
          <div className="simple-card">
            <h6>Backup your wallet settings</h6>
            <div className="flex-column card-gap">
              <p>
                Don’t forget to download your settings to make sure you can
                access your wallet on other devices or browsers. If you lose
                access but don’t have this in a safe place, then you won’t be
                able to access your wallet.
              </p>
              <FlexGrid
                column={2}
                className="settings-backup-buttons form-item-gap"
              >
                <FlexGrid
                  column={2}
                  className="settings-2backup-buttons form-item-gap"
                >
                  <IconButton
                    body="Local File"
                    image={FileLogo}
                    link={false}
                    onClick={() => window.helper.saveConfig().then()}
                  />
                  <IconButton
                    body="Dropbox"
                    image={DropboxLogo}
                    link={false}
                    onClick={() => onboardingOAuth('DropBox')}
                  />
                </FlexGrid>
                <FlexGrid
                  column={2}
                  className="settings-2backup-buttons form-item-gap"
                >
                  <IconButton
                    body="Google Drive"
                    image={GoogleDriveLogo}
                    imageSize={{ width: 27 }}
                    link={false}
                    onClick={() => onboardingOAuth('GoogleDrive')}
                  />
                  <IconButton
                    body="3Box"
                    image={ThreeBoxLogo}
                    imageSize={{ width: 31, height: 20 }}
                    link={false}
                    onClick={() => {
                      showPopup({
                        closable: true,
                        closeOnBackDropClick: true,
                        content: <Export3Box />,
                      });
                    }}
                  />
                </FlexGrid>
              </FlexGrid>
            </div>
          </div>
          <div className="simple-card">
            <h6>Private key</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac
              eleifend ante.
            </p>
            <Input
              label="Private Key"
              value={privateKey}
              type={reveal ? 'text' : 'password'}
              disabled={true}
              onChange={(e) => setPrivateKey(e.target.value)}
              endAdornment={<CopyEndAdornment value={privateKey} />}
            />
            <div className="reveal-private-key-button">
              <Button
                color="secondary"
                text={`${reveal ? 'Hide' : 'Reveal'} Private Key`}
                link={false}
                onClick={() => setReveal((r) => !r)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
