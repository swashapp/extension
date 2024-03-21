import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';

import { helper } from '../../helper';
import { InternalPaths } from '../../paths';
import { Any } from '../../types/any.type';

import { AccountInfoRes } from '../../types/api/account.type';
import { getExtensionURL } from '../../utils/browser.util';
import { DisplayAds } from '../components/ads/display-ads';
import { SwashLogo } from '../components/swash-logo/swash-logo';
import { Toggle } from '../components/toggle/toggle';
import { VerificationBadge } from '../components/verification/verification-badge';

import '../../static/css/shared.css';
import '../../static/css/popup.css';
import '../../static/css/other/themes.css';
import { useAccountBalance } from '../hooks/use-account-balance';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

function MenuItem(props: {
  onClick: () => void;
  iconClassName: string;
  text: string;
  badge?: ReactNode;
}) {
  return (
    <div
      onClick={props.onClick}
      className={'flex align-center gap16 popup-menu-item'}
    >
      <div className={props.iconClassName} />
      <p className={'bold'}>{props.text}</p>
      {props.badge ? props.badge : ''}
    </div>
  );
}

function App() {
  const { balance, balanceInUSD } = useAccountBalance();
  const [verified, setVerified] = useState<boolean | undefined>(undefined);

  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(true);
  const showPageOnTab = useCallback(async (url: string) => {
    await browser.windows.getAll({
      populate: true,
      windowTypes: ['normal'],
    });
    browser.tabs.create({ url, active: true }).then(() => {
      window.close();
    });
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const _needOnBoarding = await helper('coordinator').isInOnboarding(true);
      setNeedOnBoarding(_needOnBoarding);

      if (!_needOnBoarding) {
        // await helper.load();
        // await getBalanceInfo();

        const { is_verified } = (await helper('cache').getData(
          'info',
        )) as AccountInfoRes;
        setVerified(is_verified);
      }
    };

    checkOnboarding().catch((error) => {
      console.error('Error in useEffect:', error);
    });
  }, [showPageOnTab]);

  return (
    <>
      {needOnBoarding ? null : (
        <div className={'bg-white popup-container'}>
          <div className={'flex col popup-menu'}>
            <div className={'flex align-center justify-between'}>
              <div className={'flex align-center'}>
                <SwashLogo className={'popup-logo'} />
                {verified === undefined ? null : (
                  <VerificationBadge verified={verified} darkBackground />
                )}
              </div>
              <Toggle />
            </div>
            <div className={'flex gap16 popup-numerics'}>
              <div
                className={
                  'flex col col-10 border-box popup-numerics-container'
                }
              >
                <p className={'small'}>Balance</p>
                <p className={'large bold'}>
                  {balance} SWASH{' '}
                  <span className={'smaller'}>~ {balanceInUSD} USDT</span>
                </p>
              </div>
            </div>
            <MenuItem
              text={'Earnings'}
              iconClassName={'popup-icon wallet'}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.earnings))
              }
            />
            <MenuItem
              text={'Earn More'}
              iconClassName={'popup-icon earn'}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.earnMore))
              }
            />
            <MenuItem
              text={'Settings'}
              iconClassName={'popup-icon settings'}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.settings))
              }
            />
            <MenuItem
              text={'Help'}
              iconClassName={'popup-icon help'}
              onClick={() => showPageOnTab(getExtensionURL(InternalPaths.help))}
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
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
);
