import { SidenavItems } from '../data/sidenav-items';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from '../components/sidenav/sidenav';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import Popup from '../components/popup/popup';
import SidenavButton from '../components/sidenav/sidenav-button';
import OnBoarding from './on-boarding';

function EmptyComponent() {
  return <div style={{ width: '100%' }}></div>;
}

function RouteComponent(
  ExtentionComponent: React.ComponentClass | null,
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
          {ExtentionComponent === null ? (
            <EmptyComponent />
          ) : (
            <ExtentionComponent />
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
