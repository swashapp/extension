import React from 'react'
import Logo from '../../statics/images/Logo_Beta.png';

class OnBoardingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage: 'Welcome',
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
                        <div className='m-0 pt-5 text-center'>
                            <img src={Logo} alt='Logo Picture' />
                        </div>        
                        <div className='m-0 pt-5 text-center'>
                            <p className="welcome-swash-message">Welcome to Swash</p>
                        </div>        
                        <div className='m-0 pt-3 text-center'>
                            <p className="intro-swash-message">Earn crypto by surfing the web with Swash.<br/>We are happy to see you.</p>
                        </div>        
                        <div className='m-0 pt-3 text-center d-flex justify-content-center'>
                            <a className='get-started-button' onClick={this.LoadOnBoardingNew}>Get Started!</a>
                        </div>        
                    </div>
                </React.Fragment>
            </div>
        );
    }
}


export default OnBoardingPage;