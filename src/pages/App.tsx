import { SidenavItems } from '../data/sidenav-items';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from '../components/sidenav/sidenav';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

function EmptyComponent() {
  return <div style={{ width: '100%' }}></div>;
}

export default function App(): JSX.Element {
  useEffect(() => injectStyle(), []);
  return (
    <div className="main-container">
      <div className="sidenav">
        <Sidenav />
      </div>
      <div className="content">
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
      <ToastContainer
        toastClassName="toast-panel-container"
        autoClose={3000}
        closeButton={false}
        hideProgressBar
      />
    </div>
  );
}
