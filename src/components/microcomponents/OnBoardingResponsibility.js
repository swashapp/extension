import React from 'react';
import CustomCheckBox from './CustomCheckBox';

class OnBoardingResponsibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'OnBoardingResponsibility',
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
          <div className="onboarding-box">
            <div className="onboarding-box-header">
              <p>Know your responsibility</p>
            </div>
            <div className="onboarding-box-body">
              <p>
                If you lose your private keys, or someone else gains access to them, <b>you will lose all of your funds forever</b>. Swash cannot
                recover them. It is your responsibility to be safe and secure.
              </p>
              <div
                className="onboarding-box-footer-left-small"
                onClick={() => {
                  this.setState({isChecked: !this.state.isChecked});
                }}>
                <CustomCheckBox
                  id="approvePolicy"
                  checked={this.state.isChecked}
                  handleClick={() => {
                    this.setState({
                      isChecked: !this.state.isChecked,
                    });
                  }}
                />
                <span>I have read it and I agree</span>
              </div>
            </div>
            <div className="onboarding-box-footer">
              <div className="onboarding-box-footer-left">
                <div
                  className="onboarding-box-approve-wrapper"
                  onClick={() => {
                    this.setState({isChecked: !this.state.isChecked});
                  }}>
                  <CustomCheckBox id="approvePolicy" checked={this.state.isChecked} />
                  <span>I have read it and I agree</span>
                </div>
              </div>
              <div className="onboarding-box-footer-right">
                <div
                  className={this.state.isChecked ? 'onboarding-proceed-button' : 'onboarding-proceed-disable-button'}
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

export default OnBoardingResponsibility;
