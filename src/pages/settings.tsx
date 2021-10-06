import React from 'react';
import FlexGrid from '../components/flex-grid/flex-grid';
import FileLogo from 'url:../static/images/logos/file.png';
import DropboxLogo from 'url:../static/images/logos/dropbox.png';
import GoogleDriveLogo from 'url:../static/images/logos/google-drive.png';
import ThreeBoxLogo from 'url:../static/images/logos/three-box.png';
import Input from '../components/input/input';
import CopyEndAdornment from '../components/input/end-adronments/copy-end-adornment';
import BackgroundTheme from '../components/drawing/background-theme';
import IconButton from '../components/icon-button/icon-button';
import Button from '../components/button/button';

export default function Settings() {
  return (
    <div className="page-container settings-container">
      <BackgroundTheme layout="layout2" />
      <div className="page-header">
        <h2>Settings</h2>
      </div>
      <div className="flex-column gap32">
        <div className="simple-card">
          <h6>Backup your wallet settings</h6>
          <div className="flex-column gap32">
            <p>
              Don’t forget to download your settings to make sure you can access
              your wallet on other devices or browsers. If you lose access but
              don’t have this in a safe place, then you won’t be able to access
              your wallet.
            </p>
            <FlexGrid column={4} className="flex-grid gap16">
              <IconButton body="Local File" image={FileLogo} link={false} />
              <IconButton body="Dropbox" image={DropboxLogo} link={false} />
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
            onChange={(e) => {}}
            endAdornment={<CopyEndAdornment value={''} />}
          />
          <div className="reveal-private-key-button">
            <Button color="secondary" text="Reveal Private Key" link={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
