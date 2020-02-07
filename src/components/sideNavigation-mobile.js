import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import SwashBanner from '../statics/images/swash-banner.svg';
//import Logo_Main from '../statics/img/Logo.svg';
import Logo from '../statics/images/Swash_Beta_Flag.svg';
import menu from '../statics/images/menu.svg';
import close from '../statics/images/close.svg';

class MobileSideNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.toggleClass= this.toggleClass.bind(this);
        this.state = {
            active: false,
            selectedMenu: 'Settings'
        };
    }

    toggleClass() {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    };

    render(){
        return (
        <div id="sidebar-navigation-mobile">
            <div className="box-upper m-0 p-0">
                <div className="col-12 m-0 p-0">
                    <img src={SwashBanner} alt="Swash Banner" className="swash-banner"/>
                </div>
                <div className="col-6 m-0 p-0 float-left">
					<img src={menu} onClick={this.toggleClass} className="mobile-menu-icon"></img>
                </div>
                <div className="col-6 m-0 p-0 float-left">
                    <div className="switch-container">
                        <input className='switch' type='checkbox' id="streaming"/>
                        <div>
                            <p className="enabled switch-status">ON</p>
                            <p className="disabled switch-status">OFF</p>
                            <div></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="omega" className={this.state.active ? 'omega-activated': null}>
                <div id="omega-sidebar">
                    <div id="omega-sidebar-header" className="">
						<div className="sidbar-header-row">
							<img src={Logo} alt="Swash Logo" className="sidebar-logo-mobile"/>						
						</div>
						<div className="sidbar-header-row">
							<div style={{float: 'left', width: '50%'}}>
								<div className="sidebar-version">V.1.1.0</div>
							</div>
							<div style={{float: 'left', width: '50%'}}>
								<div className="mobile-menu-close-icon">
									<img src={close}/>							
								</div>
							</div>
						</div>
						
                    </div>
                    <div id="omega-sidebar-body">
                        <div className={this.props.location.pathname === "/Wallet"? "sidebar-menu-active" : "sidebar-menu-normal" } ><Link to="/Wallet" onClick={this.toggleClass}>Wallet</Link></div>
                        <div className={this.props.location.pathname === "/Settings"? "sidebar-menu-active" : "sidebar-menu-normal" }><Link to="/Settings" onClick={this.toggleClass}>Settings</Link></div>
                        <div className={this.props.location.pathname === "/Data"? "sidebar-menu-active" : "sidebar-menu-normal" }><Link to="/Data" onClick={this.toggleClass}>Data</Link></div>
                        <div className={this.props.location.pathname === "/Help"? "sidebar-menu-active" : "sidebar-menu-normal" }><Link to="/Help" onClick={this.toggleClass}>Help</Link></div>
                        <div className="sidebar-menu-normal"><a href="https://t.me/swashapp" className='get_swash_btn_bot' target="_blank" rel="noreferrer noopener" >Swash on Telegram</a></div>                        
                        <div className="sidebar-menu-normal"><a href="https://swashapp.io" className='get_swash_btn_bot' target="_blank" rel="noreferrer noopener" >Swashapp.io</a></div>                       
                    </div>
                </div>
                <div id="omega-overlay" onClick={this.toggleClass}></div>
            </div>
        </div>
        )
    }
}
export default withRouter(MobileSideNavigation);