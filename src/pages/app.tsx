import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { DataTour } from '../components/data/data-tour';
import { HelpTour } from '../components/help/help-tour';

import { InviteFriendsTour } from '../components/invite-friends/invite-friends-tour';

import { Popup } from '../components/popup/popup';
import { SettingsTour } from '../components/settings/settings-tour';
import { Sidenav } from '../components/sidenav/sidenav';
import { SidenavButton } from '../components/sidenav/sidenav-button';
import { WalletTour } from '../components/wallet/wallet-tour';
import { SidenavItems } from '../data/sidenav-items';
import { RouteToPages } from '../paths';

import { Onboarding } from './onboarding';
import { Wallet } from './wallet';

export const SidenavContext = React.createContext<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isOpen: false,
  setOpen: () => undefined,
});

function RouteComponent(
  ExtensionComponent: () => JSX.Element,
  activeIndex: number,
) {
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [tourOn, setTourOn] = useState<boolean>(false);
  useEffect(() => {
    const search = window.location.hash.split('?');
    if (search) {
      const _tour = new URLSearchParams(search[1]).get('tour');
      if (_tour) {
        setTourOn(true);
      }
    }
  }, []);
  return (
    <div key={window.location.hash}>
      <SidenavContext.Provider
        value={{
          isOpen: sidenavOpen,
          setOpen: setSidenavOpen,
        }}
      >
        <SidenavButton isTourOn={tourOn} />
        <div className="sidenav-and-content">
          <div
            className={`sidenav ${
              sidenavOpen ? 'open-sidenav' : 'close-sidenav'
            }`}
          >
            <Sidenav
              activeIndex={activeIndex}
              onClose={() => setSidenavOpen(false)}
            />
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

export default function App(): JSX.Element {
  useEffect(() => injectStyle(), []);
  return (
    <div className="main-container">
      <Switch>
        <Route
          exact
          path={RouteToPages.home}
          component={() => RouteComponent(Wallet, 0)}
        />
        <Route exact path={RouteToPages.onboarding} component={Onboarding} />
        {SidenavItems.map((link, index) => (
          <Route
            key={link.title + index}
            path={link.route}
            component={() => RouteComponent(link.component, index)}
          />
        ))}
      </Switch>
      <Popup />
      <ToastContainer
        toastClassName="toast-panel-container"
        autoClose={3000}
        closeButton={false}
        hideProgressBar
      />
    </div>
  );
}
