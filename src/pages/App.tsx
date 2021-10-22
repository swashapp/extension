import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import InviteFriendsTour from '../components/invite-friends/invite-friends-tour';

import Popup from '../components/popup/popup';
import Sidenav from '../components/sidenav/sidenav';
import SidenavButton from '../components/sidenav/sidenav-button';
import WalletTour from '../components/wallet/wallet-tour';
import { SidenavItems } from '../data/sidenav-items';
import { RouteToPages } from '../paths';

import Onboarding from './onboarding';
import Wallet from './wallet';

function EmptyComponent() {
  return <div style={{ width: '100%' }}></div>;
}

function RouteComponent(
  ExtensionComponent: React.ComponentClass | null,
  activeIndex: number,
) {
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  return (
    <>
      <SidenavButton
        sidenavOpen={sidenavOpen}
        setSidenavOpen={setSidenavOpen}
      />
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
          {ExtensionComponent === null ? (
            <EmptyComponent />
          ) : (
            <ExtensionComponent />
          )}
        </div>
        <WalletTour />
        <InviteFriendsTour />
      </div>
    </>
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
          component={() =>
            RouteComponent(Wallet as unknown as React.ComponentClass, 0)
          }
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
