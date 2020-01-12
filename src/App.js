import React, { Component } from 'react';
import { Route, HashRouter, Switch, Redirect} from 'react-router-dom';
import Routes from '../src/components/Routes';
import Transfer from './components/pages/Transfer';
import OnBoarding from './components/pages/OnBoarding';

class App extends Component {
	constructor(){
	  super();
	  this.state ={resource : []};	  
	}	
	componentDidMount(){	        		
	}
	render() {
		  
		return (
			<div className="flexible-content">
				<HashRouter>
					<Switch>
						<Route path='/Transfer' component={Transfer} />
						<Route path='/OnBoarding' component={OnBoarding} />
						<Route component={Routes} />
					</Switch>
				</HashRouter>
			</div>
		);
	}
}

export default App;
