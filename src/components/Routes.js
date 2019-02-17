import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NewProfile from './pages/NewProfile';
import TablesPage from './pages/TablesPage';
import MapsPage from './pages/MapsPage';
import NotFoundPage from './pages/NotFoundPage';
import Google from './newpages/Google';
import Facebook from './newpages/Facebook';
import Amazon from './newpages/Amazon';
import YouTube from './newpages/YouTube';
import GeneralApiPage from './newpages/GeneralApiPage';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/' exact component={DashboardPage} />
        <Route path='/dashboard' component={DashboardPage} />
        <Route path='/profile' component={ProfilePage} />
        <Route path='/profile1' component={NewProfile} />
        <Route path='/tables' component={TablesPage} />
        <Route path='/maps' component={MapsPage} />
        <Route path='/Google' component={Google} />
        <Route path='/Facebook' component={Facebook} />
        <Route path='/Amazon' component={Amazon} />
        <Route path='/YouTube' component={YouTube} />
        <Route path='/apis/'  render={()=>
            <GeneralApiPage resource={this.props.resource}/>
        } />
        <Route path='/404' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
