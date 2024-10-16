import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import browser from 'webextension-polyfill';

import { DisplayAds } from '../components/ads/display-ads';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { SwashLogo } from '../components/swash-logo/swash-logo';
import { Toggle } from '../components/toggle/toggle';
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

function Index() {
  const [tokenAvailable, setTokenAvailable] = useState<string>(initValue);
  const [unclaimedBonus, setUnclaimedBonus] = useState<string>(initValue);

  const getUnclaimedBonus = useCallback(() => {
    window.helper.getBonus().then((_unclaimedBonus: string | number) => {
      setUnclaimedBonus((_unclaimed) => {
        const ret =
          _unclaimedBonus.toString() !== _unclaimed
            ? _unclaimedBonus.toString()
            : _unclaimed;
        return UtilsService.purgeNumber(ret, 2);
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
        return UtilsService.purgeNumber(_token, 2);
      });
    });
  }, []);

  const getBalanceInfo = useCallback(async () => {
    getUnclaimedBonus();
    getTokenAvailable();
  }, [getTokenAvailable, getUnclaimedBonus]);

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
              <div className="flex-row flex-align-center">
                <SwashLogo className="extension-popup-logo" />
              </div>
              <Toggle />
            </div>
            <FlexGrid
              column={2}
              className="flex-row form-item-gap extension-popup-numerics"
            >
              <NumericStats value={tokenAvailable} label="Earning balance" />
              <NumericStats value={unclaimedBonus} label="Rewards to claim" />
            </FlexGrid>
            <MenuItem
              text="Earnings"
              iconClassName="popup-wallet-icon"
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/earnings'),
                )
              }
            />
            <MenuItem
              text="Earn More"
              iconClassName="popup-earn-more-icon"
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/earn-more'),
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
              text="Help"
              iconClassName="popup-help-icon"
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/help'),
                )
              }
            />
            <DisplayAds width={320} height={100} />
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
      <Index />
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('popup'),
);
