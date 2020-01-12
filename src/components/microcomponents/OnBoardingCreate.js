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
    this.LoadOnBoardingNew=this.LoadOnBoardingNew.bind(this);
    this.LoadOnBoardingCreateWallet=this.LoadOnBoardingCreateWallet.bind(this);
  }

  LoadOnBoardingNew(){
      this.props.ChangeOnBoardingPage('New')
  }

  LoadOnBoardingCreateWallet(){
      this.props.ChangeOnBoardingPage('CreateWallet')
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
            <div className='m-0 pt-5 text-center'>
              <p className="welcome-swash-message">Create new wallet</p>
            </div>        
            <div className='m-0 pt-3 text-justify'>
              <p className="intro-swash-message">A new wallet will be created on Etherume for you and you have to save the Wallet Address and its private key in a safe place.<br/> You can share your Wallet Address with everyone but never share your private key with anyone.</p>
            </div>        
            <div className='m-0 pt-3 text-center d-flex justify-content-center'>
              <a className='get-started-button' onClick={this.LoadOnBoardingCreateWallet}>Create Wallet</a>
            </div>        
          </div>
        </React.Fragment>
      </div>
    );
  }
}
export default OnBoardingNewPage;