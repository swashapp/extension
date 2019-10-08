import React from 'react';
import { Route, HashRouter, Switch, Redirect} from 'react-router-dom';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Advanced from './pages/Advanced';
import Data from './pages/Data';

class Routes extends React.Component {
  render() {
    return (
      <HashRouter>
		<Switch>			
			
			

			<Route path='/Settings'  component={Settings} />
			<Route path='/Help' component={Help} />
			<Route path='/Advanced' component={Advanced} />
			<Route path='/Data' component={Data} />
			<Redirect to='/Settings' />
		</Switch>
      </HashRouter>
    );
  }
}

export default Routes;
