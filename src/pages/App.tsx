import { SidenavItems } from '../data/sidenav-items';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidenav from '../components/sidenav/sidenav';

function EmptyComponent() {
  return <div style={{ width: '100%' }}></div>;
}

export default function App(): JSX.Element {
  return (
    <div className="main-container">
      <div className="sidenav">
        <Sidenav />
      </div>
      <div className="content">
        <Switch>
          {SidenavItems.map((link) => (
            <Route
              path={link.route}
              component={link.component || EmptyComponent}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
}
