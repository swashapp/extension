import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Routes from '../src/components/Routes';
import OnBoarding from './components/pages/OnBoarding';

class App extends Component {
  constructor() {
    super();
    this.state = {resource: []};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="flexible-content">
        <Switch>
          <Route path="/OnBoarding" component={OnBoarding} />
          <Route component={Routes} />
        </Switch>
      </div>
    );
  }
}

export default App;
