import React from 'react';
import {MDBListGroup, MDBListGroupItem} from 'mdbreact';
import {NavLink} from 'react-router-dom';
import Logo from '../statics/images/Swash_Beta_Flag.svg';

class SideNavigation extends React.Component {
  render() {
    return (
      <div className="swash-sidebar-fixed swash-position-fixed">
        <MDBListGroup className="swash-list-group-flush">
          <div className="swash-sidebar-logo">
            <img src={Logo} alt={'Swash'} />
          </div>
          <NavLink exact={true} to="/Wallet" activeClassName="activeClass">
            <MDBListGroupItem className="swash-sidebar-text">Wallet</MDBListGroupItem>
          </NavLink>
          <NavLink exact={true} to="/Settings" activeClassName="activeClass">
            <MDBListGroupItem className="swash-sidebar-text">Settings</MDBListGroupItem>
          </NavLink>
          <NavLink to="/Data" activeClassName="activeClass">
            <MDBListGroupItem className="swash-sidebar-text">Data</MDBListGroupItem>
          </NavLink>
          <NavLink to="/Help" activeClassName="activeClass">
            <MDBListGroupItem className="swash-sidebar-text">Help</MDBListGroupItem>
          </NavLink>
        </MDBListGroup>
      </div>
    );
  }
}

export default SideNavigation;
