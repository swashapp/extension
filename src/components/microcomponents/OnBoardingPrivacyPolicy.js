import React from 'react'
import CustomCheckBox from './CustomCheckBox'
class OnBoardingPrivacyPolicy extends React.Component {
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
        this.props.ChangeOnBoardingPage('OnBoardingResponsibility')
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
							<p>If you lose your private keys, or someone else gains access to them, <b>you will lose all of your funds forever</b>. Swash cannot recover them. It is your responsibility to be safe and secure.
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


export default OnBoardingPrivacyPolicy;