import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NewProfile from './pages/NewProfile';
import TablesPage from './pages/TablesPage';
import MapsPage from './pages/MapsPage';
import NotFoundPage from './pages/NotFoundPage';
import Modules from './newpages/Modules';
import Filters from './newpages/Filters';
import Manuals from './newpages/Manuals';
import Messages from './newpages/Messages';
import Marketplace from './newpages/Marketplace';


import GeneralApiPage from './newpages/GeneralApiPage';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/' exact component={NewProfile} />
		<Route path='/Marketplace' render={()=>
			<Marketplace reload={this.props.reload}/>
			} />
        <Route path='/dashboard' component={NewProfile} />
        <Route path='/profile' component={NewProfile} />
        <Route path='/apis/'  render={()=>
			<GeneralApiPage resource={this.props.resource}/>
			} />
        <Route path='/modules/'  render={()=>
			<Modules resource={this.props.resource}/>
			} />
        <Route path='/filters/'  render={()=>
			<Filters resource={this.props.resource}/>
			} />
		<Route path='/Manual/'  render={()=>
			<Manuals resource={this.props.resource}/>
			} />
		<Route path='/Messages/'  render={()=>
			<Messages resource={this.props.resource}/>
			} />
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
