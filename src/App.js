import React, { Component } from 'react';
import { Route, HashRouter, Switch} from 'react-router-dom';
import Routes from '../src/components/Routes';
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
						<Route path='/OnBoarding' component={OnBoarding} />
						<Route component={Routes} />
					</Switch>
				</HashRouter>
			</div>
		);
	}
}

export default App;
