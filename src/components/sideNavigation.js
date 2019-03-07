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
                    <MDBListGroupItem>
                        <MDBIcon icon="user-cog" className="mr-3"/>
                        Profile
                    </MDBListGroupItem>
                </NavLink>
                {/*<NavLink to="/Google" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon fab icon="google-plus-g" className="mr-3"/>*/}
                        {/*Google*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink>*/}
                {/*<NavLink to="/Twitter" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon fab icon="twitter" className="mr-3"/>*/}
                        {/*Twitter*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink>*/}
                {/*<NavLink to="/Instagram" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon fab icon="instagram" className="mr-3"/>*/}
                        {/*Instagram*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink>*/}
                
                {/*{this.props.resource.map((ob,id)=>
                    <NavLink key={id} to={"/apis/"+ob.name} activeClassName="activeClass">
                        <MDBListGroupItem>
                            <MDBIcon icon="amazon" fab className="mr-3"/>
                            {ob.name}
                        </MDBListGroupItem>
                    </NavLink>
                )}*/}
                {/*<NavLink to="/LinkedIn" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon icon="linkedin-in" fab className="mr-3"/>*/}
                        {/*LinkedIn*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink><NavLink to="/Pinterest" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon icon="pinterest" fab className="mr-3"/>*/}
                        {/*Pinterest*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink>*/}
                <NavLink to="/Filters" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon fas icon="filter"  className="mr-3"/>
                        
                        Filters
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Modules" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="plug" fas className="mr-3"/>
                        Modules
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Marketplace" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="cart-plus" fas className="mr-3"/>
                        Marketplace
                    </MDBListGroupItem>
                </NavLink><NavLink to="/Messages" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="envelope" fas className="mr-3"/>
                        Messages
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Manual" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="book" fas className="mr-3"/>
                        Manual
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/About" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="question" fas className="mr-3"/>
                        About
                    </MDBListGroupItem>
                </NavLink>
                
            </MDBListGroup>
        </div>

}}

export default SideNavigation;