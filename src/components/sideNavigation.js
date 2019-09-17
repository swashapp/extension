import React from 'react';
// import logo from "../assets/mdb-react.png";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import resource from "../resource";

class SideNavigation extends React.Component {
    


    render(){
    return <div className="sidebar-fixed position-fixed">
            
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to="/Settings" activeClassName="activeClass">
                <MDBListGroupItem className="side-bar-text">
                        Settings
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Data" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Data
                    </MDBListGroupItem>
                </NavLink>
                
                <NavLink to="/Advanced" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Advanced
                    </MDBListGroupItem>
                </NavLink>
                
                <NavLink to="/Help" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Help
                    </MDBListGroupItem>
                </NavLink>
                
            </MDBListGroup>
        </div>

}}

export default SideNavigation;