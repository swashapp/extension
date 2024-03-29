import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import browser from 'webextension-polyfill';

import { helper } from '../../core/webHelper';
import { StepperContext } from '../../pages/onboarding';
import { Button } from '../button/button';
import { FlexGrid } from '../flex-grid/flex-grid';
import { showPopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

import { FilePicker } from './file-picker';
import { ImportPrivateKey } from './import-private-key';
import { ImportingConfig } from './importing-config';

const DropboxLogo = '/static/images/logos/dropbox.png';
const FileLogo = '/static/images/logos/file.png';
const KeyLogo = '/static/images/logos/key.png';
const GoogleDriveLogo = '/static/images/logos/google-drive.png';

function ImportCard(props: {
  icon: string;
  text: string;
  imageSize?: { width?: number; height?: number };
  onClick?: () => void;
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
        <Button
          text="Import"
          link={false}
          onClick={props?.onClick}
          disabled={props.onClick === undefined}
        />
      </div>
    </div>
  );
}

export function ImportYourConfig(): JSX.Element {
  const stepper = useContext(StepperContext);
  const [importing, setImporting] = useState<boolean>(false);

  const onImportFailed = useCallback((message?: string) => {
    setImporting(false);
    toast(
      <ToastMessage
        type="error"
        content={<>{message || 'Can not import this config file'}</>}
      />,
    );
  }, []);

  const onImport = useCallback(() => {
    setImporting(false);
    stepper.next();
  }, [stepper]);

  const togglePopup = useCallback(
    (message: { onboarding: string }) => {
      showPopup({
        closable: true,
        closeOnBackDropClick: true,
        content: (
          <FilePicker
            onboarding={message.onboarding}
            onBeforeImport={() => setImporting(true)}
            onImport={onImport}
            onImportFailed={onImportFailed}
          />
        ),
      });
    },
    [onImport, onImportFailed],
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
          helper
            .applyConfig(reader.result)
            .then((response: any) => {
              if (response) {
                onImport();
              } else {
                onImportFailed();
              }
            })
            .catch((err: { message?: string }) => {
              onImportFailed(err?.message);
            });
        };

        reader.onerror = function () {
          console.error(reader.error);
        };
      }
    };
    input.click();
  }, [onImport, onImportFailed]);

  const importFromPrivateKey = useCallback(() => {
    return showPopup({
      closable: true,
      closeOnBackDropClick: true,
      content: (
        <ImportPrivateKey
          onBeforeImport={() => setImporting(true)}
          onImport={onImport}
          onImportFailed={onImportFailed}
        />
      ),
    });
  }, [onImport, onImportFailed]);

  const importFromGoogleDrive = useCallback(() => {
    if (!browser.runtime.onMessage.hasListener(togglePopup))
      browser.runtime.onMessage.addListener(togglePopup);
    browser.tabs.getCurrent().then((tab) => {
      helper.startOnBoarding('GoogleDrive', tab.id).then();
    });
  }, [togglePopup]);

  const importFromDropBox = useCallback(() => {
    if (!browser.runtime.onMessage.hasListener(togglePopup))
      browser.runtime.onMessage.addListener(togglePopup);
    browser.tabs.getCurrent().then((tab) => {
      helper.startOnBoarding('DropBox', tab.id).then();
    });
  }, [togglePopup]);

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
                text="Private Key"
                icon={KeyLogo}
                onClick={importFromPrivateKey}
              />
            </FlexGrid>
            <FlexGrid column={2} className="import-your-config-2cards card-gap">
              <ImportCard
                text="Dropbox"
                icon={DropboxLogo}
                onClick={importFromDropBox}
              />
              <ImportCard
                text="Google Drive"
                icon={GoogleDriveLogo}
                imageSize={{ width: 27 }}
                onClick={importFromGoogleDrive}
              />
            </FlexGrid>
          </FlexGrid>
        </div>
      )}
    </>
  );
}
