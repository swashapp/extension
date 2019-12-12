import React from 'react';
import { Route, HashRouter, Switch, Redirect} from 'react-router-dom';
import SideNavigation from './sideNavigation';
import MobileSideNavigation from './sideNavigation-mobile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Advanced from './pages/Advanced';
import Data from './pages/Data';

class Routes extends React.Component {
	constructor(){
	  super();
	  this.state ={resource : []};	  
	}	
	componentDidMount(){	        		
	}

	render() {
	    return (
	    	<div>
				<SideNavigation  resource={this.state.resource}/>
				<MobileSideNavigation/>
				<main id="content" className="content-padding">
					<Switch>			
						<Route path='/Settings'  component={Settings} />
						<Route path='/Help' component={Help} />
						<Route path='/Advanced' component={Advanced} />
						<Route path='/Data' component={Data} />
						<Redirect to='/Settings' />
					</Switch>
				</main>
				{/*<Footer />*/}
			</div>
	    );
	}
}

export default Routes;
