// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WarningOnPages from './microcomponents/WarningOnPages';
import Data from './pages/Data';
import Help from './pages/Help';
import OnBoarding from './pages/OnBoarding';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import SideNavigation from './sideNavigation';
import MobileSideNavigation from './sideNavigation-mobile';

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = { resource: [] };
  }

  componentDidMount() {
    this._loadAsyncData();
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  _loadAsyncData() {
    this._asyncRequest = window.helper.isNeededOnBoarding().then((result) => {
      this._asyncRequest = null;
      this.setState({ needOnBoarding: result });
    });
  }

  render() {
    if (this.state.externalData === null) {
      return <p>Please Wait</p>;
    } else {
      if (this.state.needOnBoarding) {
        return (
          <div>
            <Switch>
              <Route path="/OnBoarding" component={OnBoarding} />
              <Redirect to="/OnBoarding" />
            </Switch>
          </div>
        );
      } else {
        return (
          <div>
            <SideNavigation resource={this.state.resource} />
            <MobileSideNavigation />
            <main id="swash-content" className="swash-body-content">
              <WarningOnPages />
              <Switch>
                <Route path="/Settings" component={Settings} />
                <Route path="/Help" component={Help} />
                <Route path="/Wallet" component={Wallet} />
                <Route path="/Data" component={Data} />
                <Redirect to="/Settings" />
              </Switch>
            </main>
          </div>
        );
      }
    }
  }
}

export default Routes;
