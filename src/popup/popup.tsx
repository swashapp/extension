import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import LearnMore from '../components/button/learn-more';
import Circle from '../components/drawing/circle';
import FlexGrid from '../components/flex-grid/flex-grid';
import Link from '../components/link/link';
import SwashLogo from '../components/swash-logo/swash-logo';
import Switch from '../components/switch/switch';

function WelcomeToNewDataWorld() {
  return (
    <div className="popup-welcome-container">
      <div className="popup-welcome-text title">
        Welcome to a new world of data.
      </div>
      <Circle className={'popup-welcome-circle1'} border={'black'} />
      <Circle className={'popup-welcome-circle2'} color={'black'} />
      <Circle className={'popup-welcome-circle3'} border={'black'} />
      <div className="popup-learn-more-button">
        <LearnMore position="Popup" />
      </div>
    </div>
  );
}

function NumericStats(props: { value: string; label: string }) {
  return (
    <div className="flex-column extension-popup-numerics-container">
      <div className="extension-popup-numerics-label">{props.label}</div>
      <div className="title extension-popup-numerics-value">{props.value}</div>
    </div>
  );
}

function MenuItem(props: {
  link: string;
  iconClassName: string;
  text: string;
}) {
  return (
    <Link newTab url={props.link} position="Popup" event="PopupLink">
      <div className="flex-row extension-popup-menu-item">
        <div className={props.iconClassName} />
        <div className="extension-popup-menu-item-text">{props.text}</div>
      </div>
    </Link>
  );
}

function Popup() {
  const [dataAvailable, setDataAvailable] = useState<number>(0);
  const [unclaimedBonus, setUnclaimedBonus] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);
  return (
    <div className="extension-popup-container">
      <div className="flex-column extension-popup">
        <div className="flex-row extension-popup-logo-and-switch">
          <SwashLogo className="extension-popup-logo" />
          <div className="flex-row extension-popup-switch">
            <div className="extension-popup-switch-label">
              {status ? 'ON' : 'OFF'}
            </div>
            <Switch
              checked={!status}
              onChange={(e) => setStatus(!e.target.checked)}
            />
          </div>
        </div>
        <FlexGrid
          column={2}
          className="flex-row form-item-gap extension-popup-numerics"
        >
          <NumericStats
            value={dataAvailable.toString()}
            label="Data Earnings"
          />
          <NumericStats
            value={unclaimedBonus.toString()}
            label="Referral Bonus"
          />
        </FlexGrid>
        <MenuItem text="Wallet" iconClassName="popup-wallet-icon" link="" />
        <MenuItem text="Settings" iconClassName="popup-settings-icon" link="" />
        <MenuItem
          text="Exclude Current Domain"
          iconClassName="popup-exclude-icon"
          link=""
        />
        <MenuItem text="Help" iconClassName="popup-help-icon" link="" />
        <WelcomeToNewDataWorld />
      </div>
    </div>
  );
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
