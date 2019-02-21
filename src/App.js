import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Footer from './components/Footer';
class App extends Component {
  constructor(){
          super();
          this.state ={resource : []}
      }
      componentDidMount(){
        let f = window.helper.load().modules;
        let list = [];
        for(let x in f){
            list.push(f[x])
            console.log(f[x])
        }
        this.setState({resource:list})
      }
  render() {
      
    return (
        <div className="flexible-content">
          <TopNavigation />
          <SideNavigation  resource={this.state.resource}/>
          <main id="content" className="p-5">
            <Routes resource={this.state.resource}/>
          </main>
          {/*<Footer />*/}
        </div>
    );
  }
}

export default App;
