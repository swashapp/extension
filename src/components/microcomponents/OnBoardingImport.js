import React from 'react'
import Logo_32 from '../../statics/images/Logo_32.png';
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
      <div id="onboarding-page" className="d-flex justify-content-center">
        <React.Fragment>
        <div className="w-75">
          <div className='m-0 pt-5 text-center logo-32-title'>
            <img src={Logo_32} alt='Logo Picture' />
            Swash            
          </div>
          <div>
            <a className='mt-5' onClick={this.LoadOnBoardingNew}>&lt; Back</a>
          </div>
          <div className='m-0 pt-3 text-center'>
            <p className="import-message">Choose one of this option to import the settings file</p>
          </div>
          <div className='d-flex justify-content-center'>
            <div className='import-options-box ml-4 p-0 text-left'>
              <div className='import-option-rows-box m-0 p-2'>
                <a onClick=""><img src={LocalFile} width="64px" height="64px" alt="local file" /> Local file</a>
              </div>
              <div className='import-option-rows-box m-0 p-2'>
                <a onClick=""><img src={GoogleDrive} width="64px" height="64px" alt="google drive" /> Google Drive</a>
              </div>
              <div className='import-option-rows-box m-0 p-2'>
                <a onClick=""><img src={Dropbox} width="64px" height="64px" alt="dropbox" /> Dropbox</a>
              </div>
            </div>
          </div>
          <div className='mt-5 mb-5 d-flex justify-content-center'>
            <a className='get-started-button' onClick="">Import</a>
          </div>
        </div>
        </React.Fragment>
      </div>
    );
  }
}
export default OnBoardingNewPage;