import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { DataTour } from '../components/data/data-tour';
import { HelpTour } from '../components/help/help-tour';

import { InviteFriendsTour } from '../components/invite-friends/invite-friends-tour';

import { Popup, showPopup } from '../components/popup/popup';
import { SettingsTour } from '../components/settings/settings-tour';
import { Sidenav } from '../components/sidenav/sidenav';
import { SidenavButton } from '../components/sidenav/sidenav-button';
import { VerificationAlert } from '../components/verification/verification-alert';
import { WalletTour } from '../components/wallet/wallet-tour';
import { SidenavItems } from '../data/sidenav-items';
import { RouteToPages } from '../paths';

import { Onboarding } from './onboarding';

export const SidenavContext = React.createContext<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  startTour: () => void;
}>({
  isOpen: false,
  setOpen: () => undefined,
  startTour: () => undefined,
});

function RouteComponent(
  ExtensionComponent: () => JSX.Element,
  activeIndex: number,
) {
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [tourOn, setTourOn] = useState<boolean>(false);
  return (
    <div key={window.location.hash}>
      <SidenavContext.Provider
        value={{
          isOpen: sidenavOpen,
          setOpen: setSidenavOpen,
          startTour: () => setTourOn(true),
        }}
      >
        <SidenavButton isTourOn={tourOn} />
        <div className="sidenav-and-content">
          <div
            className={`sidenav ${
              sidenavOpen ? 'open-sidenav' : 'close-sidenav'
            }`}
          >
            <Sidenav activeIndex={activeIndex} />
          </div>
          <div
            className={`content ${
              sidenavOpen ? 'content-open-sidenav' : 'content-close-sidenav'
            }`}
          >
            <ExtensionComponent />
          </div>
          <WalletTour />
          <InviteFriendsTour />
          <SettingsTour />
          <DataTour />
          <HelpTour />
        </div>
        <div
          className="tour-fake-div"
          style={{ display: tourOn ? 'block' : 'none' }}
        />
      </SidenavContext.Provider>
    </div>
  );
}

export const AppContext = React.createContext<{
  forceUpdate: () => void;
}>({
  forceUpdate: () => undefined,
});

export default function App(): JSX.Element {
  useEffect(() => injectStyle(), []);
  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(
    () =>
      window.helper.isNeededOnBoarding().then((status: boolean) => {
        setNeedOnBoarding(status);

        if (!status) {
          showPopup({
            closable: false,
            closeOnBackDropClick: true,
            paperClassName: 'small-popup',
            content: <VerificationAlert />,
          });
        }
      }),
    [trigger],
  );

  const forceUpdate = useCallback(() => setTrigger((t: number) => t + 1), []);

  return (
    <div className="main-container">
      <AppContext.Provider
        value={{
          forceUpdate,
        }}
      >
        {needOnBoarding ? (
          <Switch>
            <Route
              exact
              path={RouteToPages.onboarding}
              component={Onboarding}
            />
            <Redirect to={RouteToPages.onboarding} />
          </Switch>
        ) : (
          <Switch>
            {SidenavItems.map((link, index) => (
              <Route
                key={link.title + index}
                path={link.route}
                component={() => RouteComponent(link.component, index)}
              />
            ))}
            <Redirect to={RouteToPages.wallet} />
          </Switch>
        )}
        <Popup />
        <ToastContainer
          toastClassName="toast-panel-container"
          autoClose={3000}
          closeButton={false}
          hideProgressBar
          pauseOnHover
        />
      </AppContext.Provider>
    </div>
  );
}
