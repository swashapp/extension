import {
  Dispatch,
  ReactElement,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { Popup, showPopup } from '../components/popup/popup';
import { Sidenav } from '../components/sidenav/sidenav';
import { DarkModeToggle } from '../components/toggle/dark-mode-toggle';
import { VerificationAlert } from '../components/verification/verification-alert';
import { helper } from '../core/webHelper';
import { SidenavItems } from '../data/sidenav-items';
import { RouteToPages } from '../paths';

import { Onboarding } from './onboarding';

export const AppContext = createContext<{
  forceUpdate: () => void;
}>({
  forceUpdate: () => undefined,
});

export const SidenavContext = createContext<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isOpen: false,
  setOpen: () => undefined,
});

function RouteComponent(
  ExtensionComponent: () => ReactElement,
  activeIndex: number,
) {
  return (
    <>
      <Sidenav activeIndex={activeIndex} />
      <div className={'no-overflow relative page-container'}>
        <div className={'border-box page-content'}>
          <DarkModeToggle />
          <ExtensionComponent />
        </div>
      </div>
    </>
  );
}

export default function App(): ReactElement {
  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<number>(0);
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(true);

  const forceUpdate = useCallback(() => setTrigger((t: number) => t + 1), []);

  const checkVerification = useCallback((shouldTry: boolean) => {
    if (!shouldTry) return;

    helper.isAccountInitialized().then((initiated: boolean) => {
      if (initiated) {
        helper.isVerificationNeeded().then((needed: boolean) => {
          if (needed)
            showPopup({
              closable: false,
              closeOnBackDropClick: true,
              paperClassName: 'popup small',
              content: <VerificationAlert />,
            });
        });
      } else {
        setTimeout(checkVerification, 3000, true);
      }
    });
  }, []);

  useEffect(() => {
    injectStyle();
  }, []);

  useEffect(() => {
    window.helper.isNeededOnBoarding().then((status: boolean) => {
      setNeedOnBoarding(status);
      checkVerification(!status);
    });
  }, [checkVerification, trigger]);

  return (
    <div className={'flex row nowrap relative bg-lightest-grey container'}>
      <AppContext.Provider
        value={{
          forceUpdate,
        }}
      >
        {needOnBoarding ? (
          <Routes>
            <Route path={RouteToPages.onboarding} element={<Onboarding />} />
            <Route element={<Navigate to={RouteToPages.onboarding} />} />
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
            <Route element={<Navigate to={RouteToPages.wallet} />} />
          </Routes>
        )}
        <Popup />
        <ToastContainer
          toastClassName={'bg-white toast-panel-container'}
          autoClose={3000}
          closeButton={false}
          hideProgressBar
          pauseOnHover
        />
      </AppContext.Provider>
    </div>
  );
}
