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
			
			

			<Route path='/Settings'  render={()=>
				<Settings resource={this.props.resource} reload={this.props.reload}/>
				} />
			<Route path='/Help' component={Help} />
			<Route path='/Advanced' component={Advanced} />
			<Route path='/Data' component={Data} />
			<Route path='/'  render={()=>
				<Settings resource={this.props.resource} reload={this.props.reload}/>
				} />
		</Switch>
      </HashRouter>
    );
  }
}

export default Routes;
