import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import SideNavigation from './components/sideNavigation';
class App extends Component {
	constructor(){
	  super();
	  this.state ={resource : []};
	  this.reload = this.reload.bind(this);      
	}
	reload() {
		this.componentDidMount();
	}
	componentDidMount(){	        
		let that = this;

		async function loader() {
			let f = await window.helper.loadModules();
			let list = [];
			for(let x in f){
				list.push(f[x])				
			}
			that.setState({resource:list})
		}
		  try{
			  loader();
		  }
		  catch (e) {
			  
		  }
			   
	}
	render() {
		  
		return (
			<div className="flexible-content">          
			  <SideNavigation  resource={this.state.resource}/>
			  <main id="content" className="content-padding">
				<Routes resource={this.state.resource} reload={this.reload}/>
			  </main>
			  {/*<Footer />*/}
			</div>
		);
	}
}

export default App;
