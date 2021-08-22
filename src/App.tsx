// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import WarningOnPages from './components/microcomponents/WarningOnPages';
import Data from './components/pages/Data';
import Help from './components/pages/Help';
import OnBoarding from './components/pages/OnBoarding';
import Settings from './components/pages/Settings';
import Wallet from './components/pages/Wallet';
import SideNavigation from './components/sideNavigation';
import MobileSideNavigation from './components/sideNavigation-mobile';

class App extends React.Component {
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

export default App;
