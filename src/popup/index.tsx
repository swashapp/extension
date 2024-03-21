import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';

import { DisplayAds } from '../components/ads/display-ads';
import { SwashLogo } from '../components/swash-logo/swash-logo';
import { Toggle } from '../components/toggle/toggle';
import { VerificationBadge } from '../components/verification/verification-badge';
import { helper } from '../core/webHelper';
import { initValue, UtilsService } from '../service/utils-service';

import '../static/css/shared.css';
import '../static/css/popup.css';
import '../static/css/other/themes.css';

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
    <div
      className={'flex col border-box extension-popup-numerics-container grow1'}
    >
      <p className={'small'}>{props.label}</p>
      <p className={'large bold'}>{props.value}</p>
    </div>
  );
}

function MenuItem(props: {
  onClick: () => void;
  iconClassName: string;
  text: string;
  badge?: ReactElement;
}) {
  return (
    <div
      onClick={props.onClick}
      className={'flex align-center gap16 extension-popup-menu-item'}
    >
      <div className={props.iconClassName} />
      <p className={'bold'}>{props.text}</p>
      {props.badge ? props.badge : ''}
    </div>
  );
}

function Index() {
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
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
        <div className={'bg-white extension-popup-container'}>
          <div className={'flex col extension-popup'}>
            <div className={'flex align-center justify-between'}>
              <div className={'flex align-center'}>
                <SwashLogo className={'extension-popup-logo'} />
                {verified === undefined ? (
                  <></>
                ) : (
                  <VerificationBadge verified={verified} darkBackground />
                )}
              </div>
              <Toggle />
            </div>
            <div className={'flex gap16 extension-popup-numerics'}>
              <NumericStats value={tokenAvailable} label={'Earning balance'} />
              <NumericStats value={unclaimedBonus} label={'Rewards to claim'} />
            </div>
            <MenuItem
              text={'Wallet'}
              iconClassName={'popup-icon wallet'}
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/wallet'),
                )
              }
            />
            <MenuItem
              text={'Earn More'}
              iconClassName={'popup-icon earn'}
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/earn-more'),
                )
              }
            />
            <MenuItem
              text={'Settings'}
              iconClassName={'popup-icon settings'}
              onClick={() =>
                showPageOnTab(
                  browser.runtime.getURL('dashboard/index.html#/settings'),
                )
              }
            />
            <MenuItem
              text={'Help'}
              iconClassName={'popup-icon help'}
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
const container = document.getElementById('popup');
const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Index />
    </ThemeProvider>
  </StyledEngineProvider>,
);
