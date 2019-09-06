import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBIcon, MDBContainer, NavbarNav} from 'mdbreact';

class TopNavigation extends Component {
	state = {
	  collapseID: ''
	}

	toggleCollapse = collapseID => () => {
	  this.setState(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
	} 

    render() {
        return (
			<MDBNavbar light>			  
				<MDBNavbarToggler onClick={this.toggleCollapse('navbarCollapse1')} />
				<MDBCollapse id="navbarCollapse1" isOpen={this.state.collapseID} navbar>
				  <NavbarNav left>
					<MDBNavItem>
					  <MDBNavLink to="/Profile">Profile</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/Modules">Modules</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/Filters">Advanced Filters</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/Marketplace">Marketplace</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/Messages">Messages</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/Manual">Manual</MDBNavLink>
					</MDBNavItem>
					<MDBNavItem>
					  <MDBNavLink to="/About">About</MDBNavLink>
					</MDBNavItem>
				  </NavbarNav>
				</MDBCollapse>			  
			</MDBNavbar>				
        );
    }
}

export default TopNavigation;