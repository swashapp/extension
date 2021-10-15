import React, { memo } from 'react';

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

import Button from '../components/button/button';
import BackgroundTheme from '../components/drawing/background-theme';
import FlexGrid from '../components/flex-grid/flex-grid';
import IconButton from '../components/icon-button/icon-button';
import CopyEndAdornment from '../components/input/end-adornments/copy-end-adornment';
import Input from '../components/input/input';

export default memo(function Settings() {
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
                  <IconButton body="Local File" image={FileLogo} link={false} />
                  <IconButton body="Dropbox" image={DropboxLogo} link={false} />
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
                  />
                  <IconButton
                    body="3Box"
                    image={ThreeBoxLogo}
                    imageSize={{ width: 31, height: 20 }}
                    link={false}
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
              value={''}
              disabled={true}
              onChange={() => undefined}
              endAdornment={<CopyEndAdornment value={''} />}
            />
            <div className="reveal-private-key-button">
              <Button
                color="secondary"
                text="Reveal Private Key"
                link={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
