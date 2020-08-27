import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";

class OnBoardingJoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingJoin = this.LoadOnBoardingJoin.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingJoin() {
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="onboarding-box">
            <div className="onboarding-box-header">
              <p>Join Swash</p>
            </div>
            <div className="onboarding-box-body">
              <p>
                You're almost a part of the world's first digital Data Union!
              </p>
              <ReCAPTCHA sitekey="6Le39MMZAAAAAMJXYWkw3OvMImnzHKfeisqLZul3" onChange={console.log}/>
            </div>
            <div className="onboarding-box-footer">
              <div style={{textAlign: 'center'}}>
                <div className="onboarding-start-button" onClick={this.LoadOnBoardingJoin}>                  
                  Join now                  
                </div>
              </div>
            </div>            
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingJoin;
