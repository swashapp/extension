import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { InitialAccountInfoRes } from '../../core/data/initial-cache';
import { helper } from '../../helper';
import { InternalRoutes } from '../../paths';
import { Any } from '../../types/any.type';
import { AccountInfoRes } from '../../types/api/account.type';
import { Popup, showPopup } from '../components/popup/popup';
import { Sidenav } from '../components/sidenav/sidenav';
import { VerificationAlert } from '../components/verification/verification-alert';
import { DashboardContext } from '../context/dashboard.context';
import { SidenavContext } from '../context/sidenav.context';
import { SidenavItems } from '../data/sidenav-items';
import { useErrorHandler } from '../hooks/use-error-handler';

import { Onboarding } from './onboarding';

import '../../static/css/shared.css';
import '../../static/css/page.css';
import '../../static/css/other/themes.css';

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

function RouteComponent(
  ExtensionComponent: () => ReactNode,
  activeIndex: number,
) {
  return (
    <>
      <Sidenav activeIndex={activeIndex} />
      <div className={'no-overflow relative page-container'}>
        <div className={'border-box page-content'}>
          <ExtensionComponent />
        </div>
      </div>
    </>
  );
}

function App(): ReactNode {
  const { safeRun } = useErrorHandler();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [account, setAccount] = useState<AccountInfoRes>(InitialAccountInfoRes);
  const [onboarding, setOnboarding] = useState<boolean>(false);
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(true);

  const updateStatus = useCallback(
    (refresh: boolean) => {
      safeRun(async () => {
        const onboarding = await helper('coordinator').isInOnboarding(true);
        setOnboarding(onboarding);

        if (!onboarding)
          setAccount(await helper('user').getAccountDetails(refresh));

        setLoading(false);
      });
    },
    [safeRun],
  );

  useEffect(() => {
    injectStyle();
  }, []);

  useEffect(() => {
    if (!loading && !onboarding && !account.is_verified)
      showPopup({
        closable: false,
        closeOnBackDropClick: true,
        paperClassName: 'popup small',
        content: <VerificationAlert />,
      });
  }, [account.is_verified, loading, onboarding]);

  useEffect(() => {
    updateStatus(false);
  }, [updateStatus]);

  return (
    <div className={'flex row nowrap relative bg-lightest-grey container'}>
      <DashboardContext.Provider
        value={{
          account,
          update: (refresh: boolean, path?: string) => {
            updateStatus(refresh);
            if (path) navigate(path);
          },
        }}
      >
        {onboarding ? (
          <Routes>
            <Route path={InternalRoutes.onboarding} element={<Onboarding />} />
            <Route element={<Navigate to={InternalRoutes.onboarding} />} />
          </Routes>
        ) : (
          <Routes>
            {SidenavItems.map((link, index) => (
              <Route
                key={link.title}
                path={link.route}
                element={
                  <SidenavContext.Provider
                    value={{
                      isOpen: sidenavOpen,
                      setOpen: setSidenavOpen,
                    }}
                  >
                    {RouteComponent(link.component, index)}
                  </SidenavContext.Provider>
                }
              />
            ))}
            <Route
              path={'/'}
              element={<Navigate to={InternalRoutes.profile} />}
            />
          </Routes>
        )}
        <Popup />
        <ToastContainer
          toastClassName={'bg-white toast-panel-container'}
          autoClose={5000}
          closeButton={true}
          hideProgressBar
          pauseOnHover
        />
      </DashboardContext.Provider>
    </div>
  );
}

const theme = createTheme();
const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
);
