import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import Popup from '../components/popup/popup';
import Sidenav from '../components/sidenav/sidenav';
import SidenavButton from '../components/sidenav/sidenav-button';
import { SidenavItems } from '../data/sidenav-items';

import OnBoarding from './onboarding';

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
      </div>
    </>
  );
}

export default function App(): JSX.Element {
  useEffect(() => injectStyle(), []);
  return (
    <div className="main-container">
      <Switch>
        <Route exact path="/" component={OnBoarding} />
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
