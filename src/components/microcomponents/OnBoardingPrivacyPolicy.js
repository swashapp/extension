import React from 'react';
import CustomCheckBox from './CustomCheckBox';
import PropTypes from 'prop-types';

class OnBoardingPrivacyPolicy extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      previousPage: PropTypes.string,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'PrivacyPolicy',
      isChecked: false,
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    if (this.state.isChecked) this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box">
            <div className="swash-onboarding-box-header">
              <p>Privacy Policy</p>
            </div>
            <div className="swash-onboarding-box-body">
              <p>
                Please read our privacy policy, available
                <a target="_blank" rel="noopener noreferrer" href="https://swashapp.io/file/final-privacy-policy.pdf">
                  {' '}
                  here
                </a>
                . Swash can collect personal data, so it is very important that you read and understand our privacy policy.
              </p>
              <div
                className="swash-onboarding-box-footer-left-small"
                onClick={() => {
                  this.setState({isChecked: !this.state.isChecked});
                }}>
                <CustomCheckBox id="approvePolicy" checked={this.state.isChecked} />
                <span>I have read it and I agree</span>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left">
                <div
                  className="swash-onboarding-box-approve-wrapper"
                  onClick={() => {
                    this.setState({isChecked: !this.state.isChecked});
                  }}>
                  <CustomCheckBox id="approvePolicy" checked={this.state.isChecked} />
                  <span>I have read it and I agree</span>
                </div>
              </div>
              <div className="swash-onboarding-box-footer-right">
                <div
                  className={this.state.isChecked ? 'swash-onboarding-proceed-button' : 'swash-onboarding-proceed-disable-button'}
                  onClick={this.LoadOnBoardingNew}>
                  Proceed
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingPrivacyPolicy;
