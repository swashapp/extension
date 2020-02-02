import React from 'react';
// import Web3 from 'web3';
// import Box from '3box';
import CustomRadioBox from './CustomRadioBox.js';
import FilePickerPopup from "./FilePickerPopup";
import ThreeBoxImg from '../../statics/images/3box.svg';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import CustomSnackbar from './CustomSnackbar';


class OnBoardingNewPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.showPopup = false;
        this.state.onBoardingType = "LocalFile";
        // This binding is necessary to make `this` work in the callback
        // this.XXX = this.XXX.bind(this);
        this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
        this.radioChangeHandler = this.radioChangeHandler.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.goToNextPage = this.goToNextPage.bind(this);
        this.goToPreviousPage = this.goToPreviousPage.bind(this);
    }

    LoadOnBoardingNew() {
        let type = this.state.onBoardingType;

        if (!window.browser.runtime.onMessage.hasListener(this.togglePopup))
            window.browser.runtime.onMessage.addListener(this.togglePopup);

        switch (type) {
            case 'LocalFile':
                console.log('LocalFile');
                let input = document.createElement('input');
                input.type = 'file';

                input.onchange = e => {
                    let file = e.target.files[0];

                    window.helper.loadFile(file).then((result) => {
                        if (result) {
                            window.helper.applyConfig(result).then((response) => {
                                if (response) {
                                    this.goToNextPage();
                                } else
                                    this.refs.notify.handleNotification('The configuration file could not be imported', 'error');
                            });
                        }
                    })
                };
                input.click();
                // return this.props.ChangeOnBoardingPage('ImportFromLocal');
                break;
            case 'GoogleDrive':
                console.log('GoogleDrive');
                window.browser.tabs.getCurrent().then(tab => {
                    window.helper.startOnBoarding(type, tab.id).then(() => {
                    });
                });
                break;
            case  'DropBox':
                console.log('DropBox');
                window.browser.tabs.getCurrent().then(tab => {
                    window.helper.startOnBoarding(type, tab.id).then(() => {
                    });
                });
                break;
            case '3Box':
                console.log('3Box');

                // const createMetaMaskProvider = require('metamask-extension-provider');
                // const provider = createMetaMaskProvider();
                // var web3 = new Web3(provider);
                //
                // const eth = new web3.eth(provider);
                // eth.accounts().then((accounts) => {
                //     console.log(`Detected MetaMask account ${accounts[0]}`)
                // });
                //
                // console.log(web3.eth.accounts[0]);
                // web3.eth.getAccounts().then((accounts) => {
                //     console.log("Accounts");
                //     console.log(accounts);
                // });

                // console.log(web3.currentProvider);

                // Box.openBox('0x44dB7d3771e5694f1F33fAB0B82E72f02118DE07', web3.currentProvider).then(() => {
                //     console.log("Logined");
                // });
                break;
            default:
                console.log('Welcome');
        }
    }

    radioChangeHandler(selectedType) {
        this.setState({
            onBoardingType: selectedType
        });
    };

    togglePopup(isCompleted) {
        this.setState({
            showPopup: !this.state.showPopup
        });

        if (isCompleted === true)
            this.goToNextPage();
    }

    goToNextPage() {
        if (!window.browser.runtime.onMessage.hasListener(this.togglePopup))
            window.browser.runtime.onMessage.removeListener(this.togglePopup);
        this.props.ChangeOnBoardingPage(this.props.nextPage())
    }

    goToPreviousPage() {
        this.props.ChangeOnBoardingPage(this.props.previousPage())
    }

    render() {
        let picker = <FilePickerPopup
            text='Click "Close Button" to hide popup'
            closePopup={this.togglePopup.bind(this)}
            onboarding={this.state.onBoardingType}
        />;
        return (
            <div className="d-flex justify-content-center">
                <React.Fragment>
                    <div className="onboarding-box onboarding-box-big">
                        <div className="onboarding-box-header">
                            <p>Import your wallet</p>
                        </div>
                        <div className="onboarding-box-body onboarding-box-body-big onboarding-box-body-import" style={{overflow: "auto"}}>
                            <span>Choose an option to import your settings file</span><br/>
                            <div className="onbording-export-div">
                                <div className="onbording-import-option">
                                    <div className="onboarding-import-option-row">
                                        <img src={LocalFileImg} alt=""/>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <span>Local file</span>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <CustomRadioBox
                                            id="LocalFile"
                                            handleClick={this.radioChangeHandler}
                                            isChecked={this.state.onBoardingType === "LocalFile"}
                                        />
                                    </div>
                                </div>
                                <div className="onbording-import-option">
                                    <div className="onboarding-import-option-row">
                                        <img src={GoogleDriveImg} alt=""/>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <span>Google Drive</span>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <CustomRadioBox
                                            id="GoogleDrive"
                                            handleClick={this.radioChangeHandler}
                                            isChecked={this.state.onBoardingType === "GoogleDrive"}
                                        />
                                    </div>
                                </div>
                                <div className="onbording-import-option">
                                    <div className="onboarding-import-option-row">
                                        <img src={DropboxImg} alt=""/>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <span>Dropbox</span>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <CustomRadioBox
                                            id="DropBox"
                                            handleClick={this.radioChangeHandler}
                                            isChecked={this.state.onBoardingType === "DropBox"}
                                        />
                                    </div>
                                </div>
                                <div className="onbording-import-option">
                                    <div className="onboarding-import-option-row">
                                        <img src={ThreeBoxImg} alt="" style={{opacity: "50%"}}/>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <span>3Box</span>
                                    </div>
                                    <div className="onboarding-import-option-row">
                                        <CustomRadioBox
                                            id="3Box"
                                            // handleClick={this.radioChangeHandler}
                                            isChecked={this.state.onBoardingType === "3Box"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="onboarding-box-footer">
                            <div className="onboarding-box-footer-left">
                            </div>
                            <div className="onboarding-box-footer-right">
                                <div className='onboarding-proceed-button' onClick={this.LoadOnBoardingNew}>Import</div>
                                <div style={{float: "right"}}>
                                    <span onClick={this.goToPreviousPage}>Back</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.showPopup ? <div>
                        <div
                            className="swash-modal"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) this.togglePopup()
                            }}
                        >
                            {picker}
                        </div>
                    </div> : ''}
                </React.Fragment>
                <CustomSnackbar
                    ref='notify'
                />
            </div>
        );
    }
}

export default OnBoardingNewPage;