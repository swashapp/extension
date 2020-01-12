import React from 'react'
import {Redirect} from 'react-router-dom';
import Logo from '../../statics/images/Logo_Beta.png';
import OnBoardingWelcomePage from '../microcomponents/OnBoardingWelcome';
import OnBoardingNewPage from '../microcomponents/OnBoardingNew';
import OnBoardingImportPage from '../microcomponents/OnBoardingImport';
import OnBoardingCreatePage from '../microcomponents/OnBoardingCreate';

class OnBoardingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentPage: 'Welcome',
        };

        // This binding is necessary to make `this` work in the callback
        // this.XXX = this.XXX.bind(this);
        this.LoadOnBoarding=this.LoadOnBoarding.bind(this);
        this.ChangeOnBoardingPage=this.ChangeOnBoardingPage.bind(this);
    }

    LoadOnBoarding(){
        let page=this.state.CurrentPage;
        console.log(this.state.CurrentPage)
        switch(page) {
            case 'Welcome':
                return <OnBoardingWelcomePage ChangeOnBoardingPage={this.ChangeOnBoardingPage}/>;
            case 'New':
                return <OnBoardingNewPage ChangeOnBoardingPage={this.ChangeOnBoardingPage} />;
            case 'Import':
                return <OnBoardingImportPage ChangeOnBoardingPage={this.ChangeOnBoardingPage} />;
            case 'Create':
                return <OnBoardingCreatePage ChangeOnBoardingPage={this.ChangeOnBoardingPage} />;
            case 'CreateWallet':
                return <Redirect to="/Settings" />
                // Redirect to Settings
            default:
                return 'Welcome';
        }        
    }

    ChangeOnBoardingPage(CurrentPage){
        this.setState({CurrentPage, CurrentPage})
    }
    
    render() {
        return (
            <div id="onboarding-page">
                <React.Fragment>
                    <div>
                        {this.LoadOnBoarding()}
                    </div>
                </React.Fragment>
            </div>
        );
    }
}


export default OnBoardingPage;