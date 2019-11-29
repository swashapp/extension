//import '../statics/css/SwashHomePage.css';
import React from "react";
import { 
  MDBContainer, 
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavbarNav,
  MDBNavLink,
} from "mdbreact";
//import Logo_Main from '../statics/img/Logo.svg';
import Logo from '../statics/images/Logo_Beta.png';
import Hamburger from '../statics/images/hamburger4.svg?color=ffffff';

class TopNavigation extends React.Component {
  state={
    collapse1: false,
    collapseID: ''
  }

  toggleCollapse = collapseID => () => {
    this.setState(prevState => ({ collapseID: (prevState.collapseID !== collapseID ? collapseID : '') }));
  }

  toggleSingleCollapse = collapseId => {
    this.setState({
      ...this.state,
      [collapseId]: !this.state[collapseId]
    });
  }

  render() {

    const overlay = (
      <div
        id="sidenav-overlay"
        style={{ backgroundColor: "transparent" }}
        onClick={this.toggleCollapse("mainNavbarCollapse")}
      />
    );

    const { collapseID } = this.state;



    return (
      <MDBContainer fluid className="m-0 p-0 top-navigation">
        {/*<!-- Navbar -->*/}
        <MDBNavbar expand="md" fixed="top" scrolling style={{"backgroundColor":"#ffffff"}} className="z-depth-0">
          {/*<!-- Brand -->*/}
          <MDBNavbarBrand href="/" className="navbar_brand">
            <img src={Logo} alt='Logo' style={{ height: '2.5rem', width: "2.5rem" }} className="mr-2"/>
            Swash
          </MDBNavbarBrand>
          {/*<!-- Collapse -->*/}
          <MDBNavbarToggler id="hamburger1" className="mr-2" image={Hamburger} onClick={this.toggleCollapse("mainNavbarCollapse")} />
          <MDBCollapse
            id="mainNavbarCollapse"
            className="collapse navbar-collapse"
            isOpen={this.state.collapseID}
            navbar
          >
            {/*<!-- Links -->*/}
            <MDBNavbarNav right> {/*left,right,auto*/}
              {/*<!-- Left -->*/}
              <MDBNavItem> {/*active*/}
                <MDBNavLink
                  to="/Settings"
                  className="navbar_link"
                >
                  Settings
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to="/Data"
                  className="navbar_link"
                >
                  Data
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to="/Advanced"
                  className="navbar_link"
                >
                  Advanced
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  to="/Help"
                  className="navbar_link"
                >
                  Help
                </MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
        {collapseID && overlay}
        {/*<!-- Navbar -->*/}
      </MDBContainer>
    );
  }
}

export default TopNavigation;
