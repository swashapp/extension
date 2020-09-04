import React from 'react';
import Logo from '../../statics/images/Swash_Beta_Flag.svg';
import PropTypes from 'prop-types';

class OnBoardingPage extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'Welcome',
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
  }

  LoadOnBoardingNew() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box">
            <div className="swash-onboarding-box-header">
              <p>Welcome to Swash</p>
            </div>
            <div className="swash-onboarding-box-body">
              <img alt={''} style={{marginBottom: '23px'}} src={Logo} />
              <div>
                <span>
                  Thanks for installing Swash.
                  <br />
                  We’ll have you ready to go in a couple of minutes.
                </span>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div style={{textAlign: 'center'}}>
                <div className="swash-onboarding-start-button" onClick={this.LoadOnBoardingNew}>
                  Get started
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingPage;
