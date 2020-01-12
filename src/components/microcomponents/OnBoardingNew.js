import React from 'react'
import Logo_32 from '../../statics/images/Logo_32.png';
import Import from '../../statics/images/import.svg';
import Add from '../../statics/images/add.svg';


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
      <div id="onboarding-page" className="d-flex justify-content-center">
        <React.Fragment>
        <div className="w-75">
          <div className='m-0 pt-5 text-center logo-32-title'>
            <img src={Logo_32} alt='Logo Picture' />
            Swash            
          </div>
          <div className='m-0 pt-3 text-center'>
            <p className="new-to-swash-message">Are you new to Swash?</p>
          </div>
          <div className='mt-5'>
            <div className='import-wallet-box mx-2 my-3 p-2 text-center'>
              <img src={Import} width="32px" height="32px" alt="import" />
              <p className="create-new-wallet-box-title">No, I have a wallet address now</p>
              <p className="create-new-wallet-box-text">Import your existing wallet address and settings</p>
              <div className="d-flex justify-content-center">
                <a className='get-started-button mt-5' onClick={this.LoadOnBoardingImport}>Import Settings</a>
              </div>
            </div>
            <div className='create-new-wallet-box mx-2 my-3 p-2 text-center'>
              <img src={Add} width="32px" height="32px" alt="import" />
              <p className="create-new-wallet-box-title">Yes, let's get set up!</p>
              <p className="create-new-wallet-box-text">This will create a new wallet</p>
              <div className="d-flex justify-content-center">
                <a className='get-started-button mt-5' onClick={this.LoadOnBoardingCreate}>Create a wallet</a>
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