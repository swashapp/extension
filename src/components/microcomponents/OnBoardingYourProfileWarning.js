import React from 'react';
import PropTypes from 'prop-types';

class OnBoardingYourProfileWarning extends React.Component {
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
      CurrentPage: 'YourProfileWarning',
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
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
              <p>Your Profile</p>
            </div>
            <div className="swash-onboarding-box-body">
              <p>
              We need to ask you for some generic profile information to make your data more valuable to buyers. Please answer accurately so Swash can deliver good quality data to the Data Union.
              </p>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left" />
              <div className="swash-onboarding-box-footer-right">
                <div className={'swash-onboarding-proceed-button'} onClick={this.LoadOnBoardingNew}>
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

export default OnBoardingYourProfileWarning;
