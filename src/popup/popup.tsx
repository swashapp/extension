import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';

import { LearnMore } from '../components/button/learn-more';
import { Circle } from '../components/drawing/circle';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { SwashLogo } from '../components/swash-logo/swash-logo';
import { Switch } from '../components/switch/switch';

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
  onClick: () => void;
  iconClassName: string;
  text: string;
}) {
  return (
    <div onClick={props.onClick} className="flex-row extension-popup-menu-item">
      <div className={props.iconClassName} />
      <div className="extension-popup-menu-item-text">{props.text}</div>
    </div>
  );
}

const purgeNumber = (num: string) => {
  if (num.indexOf('.') < 0) return num;
  return num.slice(0, num.indexOf('.') + 5);
};

function Popup() {
  const [dataAvailable, setDataAvailable] = useState<string>('0');
  const [unclaimedBonus, setUnclaimedBonus] = useState<string>('0');
  const [status, setStatus] = useState<boolean>(false);
  const [excluded, setExcluded] = useState<boolean>(false);

  const getUnclaimedBonus = useCallback(() => {
    window.helper.getRewards().then((_unclaimedBonus) => {
      setUnclaimedBonus((_unclaimed) => {
        const ret =
          _unclaimedBonus.toString() !== _unclaimed
            ? _unclaimedBonus.toString()
            : _unclaimed;
        return purgeNumber(ret);
      });
    });
  }, []);

  const getDataAvailable = useCallback(() => {
    window.helper.getAvailableBalance().then((_dataAvailable) => {
      setDataAvailable((data) => {
        const _data =
          _dataAvailable.error ||
          _dataAvailable === '' ||
          typeof _dataAvailable === 'undefined'
            ? data
            : _dataAvailable;
        return purgeNumber(_data);
      });
    });
  }, []);

  const getBalanceInfo = useCallback(async () => {
    getUnclaimedBonus();
    getDataAvailable();
  }, [getDataAvailable, getUnclaimedBonus]);

  useEffect(() => {
    window.helper.isCurrentDomainFiltered().then((filtered) => {
      if (filtered) setExcluded(true);
    });
  }, []);

  useEffect(() => {
    window.helper.isNeededOnBoarding().then((result) => {
      if (!result) {
        getBalanceInfo().then();
      }
    });
  }, [getBalanceInfo]);

  const showPageOnTab = useCallback((url_to_show: string) => {
    window.helper.isNeededOnBoarding().then((result) => {
      if (result)
        url_to_show = browser.runtime.getURL('dashboard/index.html#/');
      return browser.windows
        .getAll({
          populate: true,
          windowTypes: ['normal'],
        })
        .then(() => {
          browser.tabs.create({ url: url_to_show, active: true }).then(() => {
            window.close();
          });
        });
    });
  }, []);

  const onStatusChanged = useCallback((checked: boolean) => {
    setStatus(checked);
    if (checked) {
      window.helper.start();
    } else {
      window.helper.stop();
    }
  }, []);

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
              onChange={(e) => onStatusChanged(!e.target.checked)}
            />
          </div>
        </div>
        <FlexGrid
          column={2}
          className="flex-row form-item-gap extension-popup-numerics"
        >
          <NumericStats value={dataAvailable} label="Data Earnings" />
          <NumericStats value={unclaimedBonus} label="Referral Bonus" />
        </FlexGrid>
        <MenuItem
          text="Wallet"
          iconClassName="popup-wallet-icon"
          onClick={() =>
            showPageOnTab(
              browser.runtime.getURL('dashboard/index.html#/wallet'),
            )
          }
        />
        <MenuItem
          text="Settings"
          iconClassName="popup-settings-icon"
          onClick={() =>
            showPageOnTab(
              browser.runtime.getURL('dashboard/index.html#/settings'),
            )
          }
        />
        <MenuItem
          text="Exclude Current Domain"
          iconClassName={`popup-exclude-icon ${
            excluded ? 'popup-excluded' : ''
          }`}
          onClick={() => {
            window.helper.handleFilter().then(() => {
              setExcluded(true);
            });
          }}
        />
        <MenuItem
          text="Help"
          iconClassName="popup-help-icon"
          onClick={() =>
            showPageOnTab(browser.runtime.getURL('dashboard/index.html#/help'))
          }
        />
        <WelcomeToNewDataWorld />
      </div>
    </div>
  );
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
