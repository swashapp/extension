import { SidenavItems } from '../data/sidenav-items';
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from '../components/sidenav/sidenav';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import Popup from '../components/popup/popup';
import SidenavButton from '../components/sidenav/sidenav-button';

function EmptyComponent() {
  return <div style={{ width: '100%' }}></div>;
}

export default function App(): JSX.Element {
  useEffect(() => injectStyle(), []);
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  return (
    <>
      <SidenavButton
        sidenavOpen={sidenavOpen}
        setSidenavOpen={setSidenavOpen}
      />
      <div className="main-container">
        <div
          className={`sidenav ${
            sidenavOpen ? 'open-sidenav' : 'close-sidenav'
          }`}
        >
          <Sidenav onClose={() => setSidenavOpen(false)} />
        </div>
        <div
          className={`content ${
            sidenavOpen ? 'content-open-sidenav' : 'content-close-sidenav'
          }`}
        >
          <Switch>
            <Route exact path="/" component={EmptyComponent} />
            {SidenavItems.map((link) => (
              <Route
                path={link.route}
                component={link.component || EmptyComponent}
              />
            ))}
          </Switch>
        </div>
        <Popup />
        <ToastContainer
          toastClassName="toast-panel-container"
          autoClose={3000}
          closeButton={false}
          hideProgressBar
        />
      </div>
    </>
  );
}
