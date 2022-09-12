import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import browser from 'webextension-polyfill';

import { LearnMore } from '../components/button/learn-more';
import { Circle } from '../components/drawing/circle';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { Notifications } from '../components/sidenav/welcome-to-new-data-world';
import { SwashLogo } from '../components/swash-logo/swash-logo';
import { Toggle } from '../components/toggle/toggle';
import { VerificationBadge } from '../components/verification/verification-badge';
import { helper } from '../core/webHelper';
import { initValue, UtilsService } from '../service/utils-service';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare global {
  interface Window {
    helper: any;
  }
}
window.helper = helper;

function WelcomeToNewDataWorld() {
  const [notifications, setNotifications] = useState<Notifications>({});
  useEffect(() => window.helper.loadNotifications().then(setNotifications), []);
  return (
    <>
      {notifications.general && notifications.general.title ? (
        <div className="popup-welcome-container">
          <div className="popup-welcome-text title">
            {notifications.general.title}
          </div>
          <Circle className={'popup-welcome-circle1'} border={'black'} />
          <Circle className={'popup-welcome-circle2'} color={'black'} />
          <Circle className={'popup-welcome-circle3'} border={'black'} />
          <div className="popup-learn-more-button">
            <LearnMore position="Popup" link={notifications.general.link} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
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
  badge?: JSX.Element;
}) {
  return (
    <div onClick={props.onClick} className="flex-row extension-popup-menu-item">
      <div className={props.iconClassName} />
      <div className="extension-popup-menu-item-text">{props.text}</div>
      {props.badge ? props.badge : ''}
    </div>
  );
}

function Popup() {
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [unclaimedBonus, setUnclaimedBonus] = useState<string>(initValue);
  const [excluded, setExcluded] = useState<boolean>(false);

  const getUnclaimedBonus = useCallback(() => {
    window.helper.getBonus().then((_unclaimedBonus: string | number) => {
      setUnclaimedBonus((_unclaimed) => {
        const ret =
          _unclaimedBonus.toString() !== _unclaimed
            ? _unclaimedBonus.toString()
            : _unclaimed;
        return UtilsService.purgeNumber(ret, 4);
      });
    });
  }, []);

  const getTokenAvailable = useCallback(() => {
    window.helper.getAvailableBalance().then((_tokenAvailable: any) => {
      setTokenAvailable((token) => {
        const _token =
          _tokenAvailable.error ||
          _tokenAvailable === '' ||
          typeof _tokenAvailable === 'undefined'
            ? token
            : _tokenAvailable;
        return UtilsService.purgeNumber(_token, 4);
      });
    });
  }, []);

  const getBalanceInfo = useCallback(async () => {
    getUnclaimedBonus();
    getTokenAvailable();
  }, [getTokenAvailable, getUnclaimedBonus]);

  useEffect(() => {
    window.helper.isCurrentDomainFiltered().then((filtered: any) => {
      if (filtered) setExcluded(true);
    });
  }, []);

  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(true);
  const showPageOnTab = useCallback((url_to_show: string) => {
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
  }, []);
  useEffect(
    () =>
      window.helper.isNeededOnBoarding().then((_needOnBoarding: boolean) => {
        setNeedOnBoarding(_needOnBoarding);
        if (_needOnBoarding) {
          const onboardingPath = 'dashboard/index.html#/onboarding';
          browser.tabs
            .query({ currentWindow: true })
            .then((tabs: browser.Tabs.Tab[]) => {
              const tab = tabs.find((tab) => tab.url?.endsWith(onboardingPath));
              if (tab) {
                tab.active = true;
                browser.tabs.update(tab.id, { active: true });
                window.close();
              } else {
                showPageOnTab(browser.runtime.getURL(onboardingPath));
              }
            });
        } else {
          window.helper.load().then(() => {
            getBalanceInfo().then();

            window.helper.isVerified().then((status: boolean) => {
              setVerified(status);
            });
          });
        }
      }),
    [getBalanceInfo, showPageOnTab],
  );

  return (
    <>
      {needOnBoarding ? (
        <></>
      ) : (
        <div className="extension-popup-container">
          <div className="flex-column extension-popup">
            <div className="flex-row extension-popup-logo-and-switch">
              <SwashLogo className="extension-popup-logo" />
              <Toggle />
            </div>
            <FlexGrid
              column={2}
              className="flex-row form-item-gap extension-popup-numerics"
            >
              <NumericStats value={tokenAvailable} label="SWASH Earnings" />
              <NumericStats value={unclaimedBonus} label="SWASH Rewards" />
            </FlexGrid>
            <MenuItem
              text="Profile"
              iconClassName="popup-profile-icon"
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/profile'),
                )
              }
              badge={
                verified === undefined ? (
                  <></>
                ) : (
                  <VerificationBadge verified={verified} darkBackground />
                )
              }
            />
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
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/help'),
                )
              }
            />
            <WelcomeToNewDataWorld />
          </div>
        </div>
      )}
    </>
  );
}

const theme = createTheme();

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('popup'),
);
