import React from 'react';
import { Route, HashRouter, Switch, Redirect} from 'react-router-dom';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Advanced from './pages/Advanced';
import Data from './pages/Data';
import Transfer from './pages/Transfer';

class Routes extends React.Component {
  render() {
    return (
      <HashRouter>
		<Switch>			
			
			

			<Route path='/Settings'  component={Settings} />
			<Route path='/Help' component={Help} />
			<Route path='/Advanced' component={Advanced} />
			<Route path='/Data' component={Data} />
			<Route path='/Transfer' component={Transfer} />
			<Redirect to='/Settings' />
		</Switch>
      </HashRouter>
    );
  }
}

export default Routes;
