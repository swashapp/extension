import React, { memo, useCallback, useState } from 'react';

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

import Button from '../button/button';
import FlexGrid from '../flex-grid/flex-grid';

import CongratsWalletIsReady from './congrats-wallet-is-ready';
import ImportingConfig from './importing-config';

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

export default memo(function ImportYourConfig() {
  const [importing, setImporting] = useState<boolean | null>(null);
  const doImport = useCallback(() => {
    setImporting(true);
  }, [setImporting]);
  return (
    <>
      {importing ? (
        <ImportingConfig />
      ) : importing === null ? (
        <div className="import-your-config">
          <h2>Import your configuration</h2>
          <p>Choose an option to import your settings file</p>
          <FlexGrid column={2} className="import-your-config-cards card-gap">
            <FlexGrid column={2} className="import-your-config-2cards card-gap">
              <ImportCard
                text="Local File"
                icon={FileLogo}
                onClick={doImport}
              />
              <ImportCard
                text="Dropbox"
                icon={DropboxLogo}
                onClick={doImport}
              />
            </FlexGrid>
            <FlexGrid column={2} className="import-your-config-2cards card-gap">
              <ImportCard
                text="Google Drive"
                icon={GoogleDriveLogo}
                imageSize={{ width: 27 }}
                onClick={doImport}
              />
              <ImportCard
                text="3Box"
                icon={ThreeBoxLogo}
                imageSize={{ width: 31, height: 20 }}
                onClick={doImport}
              />
            </FlexGrid>
          </FlexGrid>
        </div>
      ) : (
        <CongratsWalletIsReady type="imported" />
      )}
    </>
  );
});
