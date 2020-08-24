import React from 'react';

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
                Everything is almost done. Now you can join the first Data Union.                 
              </p>
              <p>
                Join and enjoy!
              </p>
            </div>
            <div className="onboarding-box-footer">
              <div style={{textAlign: 'center'}}>
                <div className="onboarding-start-button" onClick={this.LoadOnBoardingJoin}>
                  Join
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
