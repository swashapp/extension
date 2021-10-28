import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import DropboxLogo from 'url:../../static/images/logos/dropbox.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileLogo from 'url:../../static/images/logos/file.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import GoogleDriveLogo from 'url:../../static/images/logos/google-drive.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import ThreeBoxLogo from 'url:../../static/images/logos/three-box.png';
import browser from 'webextension-polyfill';

import { StepperContext } from '../../pages/onboarding';
import { Button } from '../button/button';
import { FlexGrid } from '../flex-grid/flex-grid';
import { FilePicker } from '../passphrase-popup/file-picker';
import { SignIn3Box } from '../passphrase-popup/sign-in-3box';
import { closePopup, showPopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

import { ImportingConfig } from './importing-config';

function ImportCard(props: {
  icon: string;
  text: string;
  imageSize?: { width?: number; height?: number };
  onClick: () => void;
}) {
  return (
    <div className="import-your-config-card">
      <img
        width={props.imageSize?.width || 24}
        height={props.imageSize?.height || 24}
        src={props.icon}
        alt={''}
      />
      <h4>{props.text}</h4>
      <div className="import-your-config-button">
        <Button text="Import" link={false} onClick={props.onClick} />
      </div>
    </div>
  );
}

export function ImportYourConfig(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [importing, setImporting] = useState<boolean>(false);
  const onImport = useCallback(() => {
    window.helper
      .getJoinedSwash()
      .then((data) => {
        stepper.setJoin(data);
        if (data.id && data.email)
          stepper.changeSelectedPage('Join', 'Completed');
        setImporting(false);
        stepper.next();
      })
      .catch(() => setImporting(false));
  }, [stepper]);
  const applyConfig = useCallback(
    (selectedFile, onboarding, setLoading) => {
      if (selectedFile?.id) {
        setLoading(true);
        return window.helper
          .downloadFile(onboarding, selectedFile.id)
          .then((response) => {
            if (response) {
              setImporting(true);
              setLoading(false);
              closePopup();
              return window.helper
                .applyConfig(JSON.stringify(response))
                .then((result) => {
                  if (result) {
                    onImport();
                    toast(
                      <ToastMessage
                        type="success"
                        content={<>Config file is imported successfully</>}
                      />,
                    );
                  } else {
                    setImporting(false);
                    toast(
                      <ToastMessage
                        type="error"
                        content={<>Can not import this config file</>}
                      />,
                    );
                  }
                });
            }
          });
      } else {
        closePopup();
      }
    },
    [onImport],
  );
  const togglePopup = useCallback(
    (message: { onboarding: string }) => {
      showPopup({
        closable: true,
        content: (
          <FilePicker
            onboarding={message.onboarding}
            applyConfig={applyConfig}
          />
        ),
      });
    },
    [applyConfig],
  );
  const importFromFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
      const picker = e.target as HTMLInputElement;
      const file = picker && picker.files ? picker.files[0] : null;
      if (file) {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
          setImporting(true);
          window.helper.applyConfig(reader.result).then((response) => {
            if (response) {
              onImport();
            } else {
              setImporting(false);
              toast(
                <ToastMessage
                  type="error"
                  content={<>The configuration file could not be imported</>}
                />,
              );
            }
          });
        };

        reader.onerror = function () {
          console.error(reader.error);
        };
      }
    };
    input.click();
  }, [onImport]);

  const importFromGoogleDrive = useCallback(() => {
    if (!browser.runtime.onMessage.hasListener(togglePopup))
      browser.runtime.onMessage.addListener(togglePopup);
    browser.tabs.getCurrent().then((tab) => {
      window.helper.startOnBoarding('GoogleDrive', tab.id).then();
    });
  }, [togglePopup]);

  const importFromDropBox = useCallback(() => {
    if (!browser.runtime.onMessage.hasListener(togglePopup))
      browser.runtime.onMessage.addListener(togglePopup);
    browser.tabs.getCurrent().then((tab) => {
      window.helper.startOnBoarding('DropBox', tab.id).then();
    });
  }, [togglePopup]);

  const importFrom3Box = useCallback(() => {
    showPopup({
      closable: true,
      content: <SignIn3Box onImport={onImport} />,
    });
  }, [onImport]);

  useEffect(() => {
    return () => {
      if (browser.runtime.onMessage.hasListener(togglePopup))
        browser.runtime.onMessage.removeListener(togglePopup);
    };
  }, [togglePopup]);

  return (
    <>
      {importing ? (
        <ImportingConfig />
      ) : (
        <div className="import-your-config">
          <h2>Import your configuration</h2>
          <p>Choose an option to import your settings file</p>
          <FlexGrid column={2} className="import-your-config-cards card-gap">
            <FlexGrid column={2} className="import-your-config-2cards card-gap">
              <ImportCard
                text="Local File"
                icon={FileLogo}
                onClick={importFromFile}
              />
              <ImportCard
                text="Dropbox"
                icon={DropboxLogo}
                onClick={importFromDropBox}
              />
            </FlexGrid>
            <FlexGrid column={2} className="import-your-config-2cards card-gap">
              <ImportCard
                text="Google Drive"
                icon={GoogleDriveLogo}
                imageSize={{ width: 27 }}
                onClick={importFromGoogleDrive}
              />
              <ImportCard
                text="3Box"
                icon={ThreeBoxLogo}
                imageSize={{ width: 31, height: 20 }}
                onClick={importFrom3Box}
              />
            </FlexGrid>
          </FlexGrid>
        </div>
      )}
    </>
  );
}
