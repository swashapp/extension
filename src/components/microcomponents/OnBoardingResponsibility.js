import React from 'react'
import CustomCheckBox from './CustomCheckBox'
class OnBoardingResponsibility extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage: 'PrivacyPolicy',
        };

        // This binding is necessary to make `this` work in the callback
        // this.XXX = this.XXX.bind(this);
        this.LoadOnBoardingNew=this.LoadOnBoardingNew.bind(this);

    }

    LoadOnBoardingNew(){
        this.props.ChangeOnBoardingPage('New')
    }
    
    render() {
        return (
            <div className="d-flex justify-content-center">
                <React.Fragment>
					<div className="onboarding-box">
						<div className="onboarding-box-header">
							<p>Privacy Policy</p>
						</div>
						<div className="onboarding-box-body">
							<p>Please read our privacy policy, available 
								<a target="_blank" href="https://swashapp.io/file/final-privacy-policy.pdf"> here</a>
								. Swash can collect personal data, so it is very important that you read and understand our privacy policy.
							</p>
						</div>
						<div className="onboarding-box-footer">
							<div className="onboarding-box-footer-left">
								<CustomCheckBox id="approvePolicy" />
								<span>I have read it and i agree</span>
							</div>
							<div className="onboarding-box-footer-right">
								<div className='onboarding-proceed-button' onClick={this.LoadOnBoardingNew}>Proceed</div>
								<div style={{float:"right"}}>
									<span>Back</span>
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