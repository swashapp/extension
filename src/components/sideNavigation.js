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
                <NavLink exact={true} to="/" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="chart-pie" className="mr-3"/>
                        Dashboard
                    </MDBListGroupItem>
                </NavLink>
                <NavLink exact={true} to="/Profile1" activeClassName="activeClass">
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
                <NavLink to="/Facebook" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="facebook" fab className="mr-3"/>
                        Facebook
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Youtube" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="youtube" fab className="mr-3"/>
                        Youtube
                    </MDBListGroupItem>
                </NavLink><NavLink to="/Amazon" activeClassName="activeClass">
                    <MDBListGroupItem>
                        <MDBIcon icon="amazon" fab className="mr-3"/>
                        Amazon
                    </MDBListGroupItem>
                </NavLink>
                {this.props.resource.map((ob,id)=>
                    <NavLink key={id} to={"/apis/"+ob.name} activeClassName="activeClass">
                        <MDBListGroupItem>
                            <MDBIcon icon="amazon" fab className="mr-3"/>
                            {ob.name}
                        </MDBListGroupItem>
                    </NavLink>
                )}
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
                {/*</NavLink><NavLink to="/Github" activeClassName="activeClass">*/}
                    {/*<MDBListGroupItem>*/}
                        {/*<MDBIcon icon="github" fab className="mr-3"/>*/}
                        {/*Github*/}
                    {/*</MDBListGroupItem>*/}
                {/*</NavLink>*/}
            </MDBListGroup>
        </div>

}}

export default SideNavigation;