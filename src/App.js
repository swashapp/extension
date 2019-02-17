import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Footer from './components/Footer';
import './index.css';
import resource from './resource';
class App extends Component {
  
  render() {
    return (
        <div className="flexible-content">
          <TopNavigation />
          <SideNavigation  resource={resource.list}/>
          <main id="content" className="p-5">
            <Routes resource={resource.list}/>
          </main>
          {/*<Footer />*/}
        </div>
    );
  }
}

export default App;
