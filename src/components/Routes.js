import React from 'react';
import { Route, HashRouter, Switch} from 'react-router-dom';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';
import Modules from './pages/Modules';
import Filters from './pages/Filters';
import Manuals from './pages/Manuals';
import Messages from './pages/Messages';
import Marketplace from './pages/Marketplace';
import About from './pages/About';


import Module from './pages/Module';

class Routes extends React.Component {
  render() {
    return (
      <HashRouter>
		<Switch>
			<Route path='/' exact component={Profile} />
			<Route path='/Marketplace' render={()=><Marketplace reload={this.props.reload}/>} />
			<Route path='/Dashboard' component={Profile} />
			<Route path='/Profile' component={Profile} />
			<Route path='/apis/'  render={()=>
				<Module resource={this.props.resource} reload={this.props.reload}/>
				} />
			<Route path='/Modules/'  render={()=>
				<Modules resource={this.props.resource} reload={this.props.reload}/>
				} />
			<Route path='/Filters/'  render={()=>
				<Filters resource={this.props.resource}/>
				} />
			<Route path='/Manual/'  render={()=>
				<Manuals resource={this.props.resource}/>
				} />
			<Route path='/Messages/'  render={()=>
				<Messages resource={this.props.resource}/>
				} />
			<Route path='/About/'  render={()=>
				<About resource={this.props.resource}/>
				} />
			<Route path='/404' component={NotFoundPage} />
		</Switch>
      </HashRouter>
    );
  }
}

export default Routes;
