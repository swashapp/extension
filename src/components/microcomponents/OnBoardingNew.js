import React from 'react'
import CustomRadioBox from './CustomRadioBox.js'
class OnBoardingNewPage extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
    };
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingImport=this.LoadOnBoardingImport.bind(this);
    this.LoadOnBoardingCreate=this.LoadOnBoardingCreate.bind(this);
  }

  LoadOnBoardingImport(){
      this.props.ChangeOnBoardingPage('Import')
  }

  LoadOnBoardingCreate(){
      this.props.ChangeOnBoardingPage('Create')
  }

  render() {
    return (
			<div className="d-flex justify-content-center">
                <React.Fragment>
					<div className="onboarding-box">
						<div className="onboarding-box-header">
							<p>Are you new to Swash?</p>
						</div>
						<div className="onboarding-box-body">
							<div>
								<div className="onboarding-box-body-radio">
									<CustomRadioBox/>
									<span>Yes, I’m new here</span><br/>
									<div className="onboarding-text-gray">This will create a new wallet</div>
								</div>
								<div className="onboarding-box-body-radio">
									<CustomRadioBox/>									
									<span>No, I already have a wallet</span><br/>
									<div className="onboarding-text-gray">Import your existing wallet and settings</div>
								</div>
							</div>
						</div>
						<div className="onboarding-box-footer">
							<div className="onboarding-box-footer-left">								
							</div>
							<div className="onboarding-box-footer-right">
								<div className='onboarding-proceed-button' onClick={this.LoadOnBoardingImport}>Next</div>								
							</div>
						</div>
					</div>					                    
                </React.Fragment>
            </div>      
    );
  }
}
export default OnBoardingNewPage;