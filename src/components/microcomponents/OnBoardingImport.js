import React from 'react'
import CustomRadioBox from './CustomRadioBox.js';
import ThreeBox from '../../statics/images/3box.svg';
import LocalFile from '../../statics/images/file.svg';
import GoogleDrive from '../../statics/images/google-drive.svg';
import Dropbox from '../../statics/images/dropbox.svg';


class OnBoardingNewPage extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
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
				<div className="onboarding-box onboarding-box-big">
					<div className="onboarding-box-header">
						<p>Import your wallet</p>
					</div>
					<div className="onboarding-box-body onboarding-box-body-big">
						<span>Choose an option to import your settings file</span><br/>
						<div className="onbording-import-option">
							<div className="onboarding-import-option-row">
								<img src={LocalFile} alt=""/>
							</div>
							<div className="onboarding-import-option-row">
								<span>Local file</span>
							</div>
							<div className="onboarding-import-option-row">
								<CustomRadioBox/>
							</div>
						</div>
						<div className="onbording-import-option">
							<div className="onboarding-import-option-row">
								<img src={GoogleDrive} alt=""/>
							</div>
							<div className="onboarding-import-option-row">
								<span>Google Drive</span>
							</div>
							<div className="onboarding-import-option-row">
								<CustomRadioBox/>
							</div>
						</div>
						<div className="onbording-import-option">
							<div className="onboarding-import-option-row">
								<img src={Dropbox} alt=""/>
							</div>
							<div className="onboarding-import-option-row">
								<span>Dropbox</span>
							</div>
							<div className="onboarding-import-option-row">
								<CustomRadioBox/>
							</div>
						</div>
						<div className="onbording-import-option">
							<div className="onboarding-import-option-row">
								<img src={ThreeBox} alt=""/>
							</div>
							<div className="onboarding-import-option-row">
								<span>3Box</span>
							</div>
							<div className="onboarding-import-option-row">
								<CustomRadioBox/>
							</div>
						</div>
					</div>
					<div className="onboarding-box-footer">
						<div className="onboarding-box-footer-left">							
						</div>
						<div className="onboarding-box-footer-right">
							<div className='onboarding-proceed-button' onClick={this.LoadOnBoardingNew}>Import</div>
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
export default OnBoardingNewPage;