import React from 'react';
import {withRouter} from 'react-router-dom';
import SwashBanner from '../statics/images/swash-banner.svg';
import Logo from '../statics/images/Swash_Beta_Flag.svg';
import menu from '../statics/images/menu.svg';
import close from '../statics/images/close.svg';
import PropTypes from 'prop-types';

class MobileSideNavigation extends React.Component {
  static get propTypes() {
    return {
      history: PropTypes.object,
      'history.push': PropTypes.func,
      location: PropTypes.object,
      'location.pathname': PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      active: false,
      selectedMenu: 'Settings',
      version: '1.0.0',
      isEnabled: false,
    };
    this.changeStatus = this.changeStatus.bind(this);
  }

  componentDidMount() {
    window.helper.load().then((db) => {
      this.setState({version: db.configs.version, isEnabled: db.configs.is_enabled});
    });
  }

  toggleClass() {
    const currentState = this.state.active;
    this.setState({active: !currentState});
  }

  menuClick(location) {
    this.props.history.push(location);
    this.toggleClass();
  }

  changeStatus() {
    if (this.state.isEnabled) {
      window.helper.stop();
    } else {
      window.helper.start();
    }
    this.setState({isEnabled: !this.state.isEnabled});
  }

  render() {
    return (
      <div id="swash-sidebar-navigation-mobile">
        <div className="box-upper m-0 p-0">
          <div className="col-12 m-0 p-0">
            <img src={SwashBanner} alt="Swash Banner" className="swash-banner" />
          </div>
          <div className="col-6 m-0 p-0 float-left">
            <div className="swash-mobile-menu-icon-wrapper" onClick={this.toggleClass}>
              <img src={menu} className="swash-mobile-menu-icon" alt={'Menu'}></img>
            </div>
          </div>
          <div className="col-6 m-0 p-0 float-left">
            <div className="swash-switch-container">
              <input className="swash-switch" type="checkbox" onClick={this.changeStatus} checked={this.state.isEnabled} id="streaming" />
              <div>
                <p className="swash-enabled swash-switch-status">ON</p>
                <p className="swash-disabled swash-switch-status">OFF</p>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div id="omega" className={this.state.active ? 'omega-activated' : null}>
          <div id="omega-sidebar">
            <div id="omega-sidebar-header" className="">
              <div className="sidbar-header-row">
                <img src={Logo} alt="Swash Logo" className="swash-sidebar-logo-mobile" />
              </div>
              <div className="swash-sidbar-header-row">
                <div style={{float: 'left', width: '50%'}}>
                  <div className="swash-sidebar-version">{`V${this.state.version}`}</div>
                </div>
                <div style={{float: 'left', width: '50%'}}>
                  <div className="swash-mobile-menu-close-icon" onClick={this.toggleClass}>
                    <img src={close} alt={'Close'} />
                  </div>
                </div>
              </div>
            </div>
            <div id="omega-sidebar-body">
              <div
                onClick={() => this.menuClick('/Wallet')}
                className={this.props.location.pathname === '/Wallet' ? 'swash-sidebar-menu-active' : 'swash-sidebar-menu-normal'}>
                Wallet
              </div>
              <div
                onClick={() => this.menuClick('/Settings')}
                className={this.props.location.pathname === '/Settings' ? 'swash-sidebar-menu-active' : 'swash-sidebar-menu-normal'}>
                Settings
              </div>
              <div
                onClick={() => this.menuClick('/Data')}
                className={this.props.location.pathname === '/Data' ? 'swash-sidebar-menu-active' : 'swash-sidebar-menu-normal'}>
                Data
              </div>
              <div
                onClick={() => this.menuClick('/Help')}
                className={this.props.location.pathname === '/Help' ? 'swash-sidebar-menu-active' : 'swash-sidebar-menu-normal'}>
                Help
              </div>
              <div className="swash-sidebar-menu-normal">
                <a href="https://t.me/swashapp" className="swash-get-btn-bot" target="_blank" rel="noreferrer noopener">
                  Swash on Telegram
                </a>
              </div>
              <div className="swash-sidebar-menu-normal">
                <a href="https://swashapp.io" className="swash-get-btn-bot" target="_blank" rel="noreferrer noopener">
                  Swashapp.io
                </a>
              </div>
            </div>
          </div>
          <div id="omega-overlay" onClick={this.toggleClass}></div>
        </div>
      </div>
    );
  }
}

export default withRouter(MobileSideNavigation);
