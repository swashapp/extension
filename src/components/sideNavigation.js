import React from 'react';
// import logo from "../assets/mdb-react.png";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import resource from "../resource";

class SideNavigation extends React.Component {
    


    render(){
    return <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                {/*<img alt="MDB React Logo" className="img-fluid" src={logo}/>*/}
            </a>
            <MDBListGroup className="list-group-flush">
                
                <NavLink exact={true} to="/Profile" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Profile
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Modules" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Modules
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Filters" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        
                        Advanced Filters
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Marketplace" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Marketplace
                    </MDBListGroupItem>
                </NavLink><NavLink to="/Messages" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Messages
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Manual" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Manual
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/About" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        About
                    </MDBListGroupItem>
                </NavLink>
                
            </MDBListGroup>
        </div>

}}

export default SideNavigation;