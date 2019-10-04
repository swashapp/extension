import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import SideNavigation from './components/sideNavigation';
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
			  <SideNavigation  resource={this.state.resource}/>
			  <main id="content" className="content-padding">
				<Routes/>
			  </main>
			  {/*<Footer />*/}
			</div>
		);
	}
}

export default App;
