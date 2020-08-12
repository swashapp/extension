import React from 'react';
import CustomRadioBox from './CustomRadioBox.js';
import FilePickerPopup from './FilePickerPopup';
import ThreeBoxImg from '../../statics/images/3box.svg';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import CustomSnackbar from './CustomSnackbar';
import PassphraseModal from './PassphraseModal';

class OnBoardingNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.showPopup = false;
    this.state.onBoardingType = 'LocalFile';
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

    if (!window.browser.runtime.onMessage.hasListener(this.togglePopup)) window.browser.runtime.onMessage.addListener(this.togglePopup);

    switch (type) {
      case 'LocalFile':
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
          let that = this;
          let file = e.target.files[0];
          let reader = new FileReader();

          reader.readAsText(file);

          reader.onload = function () {
            window.helper.applyConfig(reader.result).then((response) => {
              if (response) {
                that.goToNextPage();
              } else that.refs.notify.handleNotification('The configuration file could not be imported', 'error');
            });
          };

          reader.onerror = function () {
            console.error(reader.error);
          };
        };
        input.click();
        // return this.props.ChangeOnBoardingPage('ImportFromLocal');
        break;
      case 'GoogleDrive':
        window.browser.tabs.getCurrent().then((tab) => {
          window.helper.startOnBoarding(type, tab.id).then(() => {});
        });
        break;
      case 'DropBox':
        window.browser.tabs.getCurrent().then((tab) => {
          window.helper.startOnBoarding(type, tab.id).then(() => {});
        });
        break;
      case '3Box':
        this.togglePopup();
        break;
      default:
    }
  }

  radioChangeHandler(selectedType) {
    this.setState({
      onBoardingType: selectedType,
    });
  }

  togglePopup(isCompleted) {
    this.setState({
      showPopup: !this.state.showPopup,
    });

    if (isCompleted === true) this.goToNextPage();
  }

  goToNextPage() {
    if (!window.browser.runtime.onMessage.hasListener(this.togglePopup)) window.browser.runtime.onMessage.removeListener(this.togglePopup);
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  render() {
    let modal = (
      <FilePickerPopup text='Click "Close Button" to hide popup' closePopup={this.togglePopup.bind(this)} onboarding={this.state.onBoardingType} />
    );

    if (this.state.onBoardingType === '3Box') {
      modal = <PassphraseModal page={'import'} closePopup={this.togglePopup.bind(this)} />;
    }

    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="onboarding-box onboarding-box-big">
            <div className="onboarding-box-header">
              <p>Import your configuration</p>
            </div>
            <div className="onboarding-box-body onboarding-box-body-big onboarding-box-body-import">
              <span>Choose an option to import your settings file</span>
              <br />
              <div className="onbording-export-div">
                <div
                  className="onbording-import-option"
                  onClick={() => {
                    this.setState({onBoardingType: 'LocalFile'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="onboarding-import-option-row">
                    <img src={LocalFileImg} alt={''} />
                  </div>
                  <div className="onboarding-import-option-row">
                    <span>Local file</span>
                  </div>
                  <div className="onboarding-import-option-row">
                    <CustomRadioBox id="LocalFile" handleClick={this.radioChangeHandler} isChecked={this.state.onBoardingType === 'LocalFile'} />
                  </div>
                </div>
                <div
                  className="onbording-import-option"
                  onClick={() => {
                    this.setState({onBoardingType: 'GoogleDrive'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="onboarding-import-option-row">
                    <img src={GoogleDriveImg} alt={''} />
                  </div>
                  <div className="onboarding-import-option-row">
                    <span>Google Drive</span>
                  </div>
                  <div className="onboarding-import-option-row">
                    <CustomRadioBox id="GoogleDrive" handleClick={this.radioChangeHandler} isChecked={this.state.onBoardingType === 'GoogleDrive'} />
                  </div>
                </div>
                <div
                  className="onbording-import-option"
                  onClick={() => {
                    this.setState({onBoardingType: 'DropBox'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="onboarding-import-option-row">
                    <img src={DropboxImg} alt={''} />
                  </div>
                  <div className="onboarding-import-option-row">
                    <span>Dropbox</span>
                  </div>
                  <div className="onboarding-import-option-row">
                    <CustomRadioBox id="DropBox" handleClick={this.radioChangeHandler} isChecked={this.state.onBoardingType === 'DropBox'} />
                  </div>
                </div>
                <div
                  className="onbording-import-option"
                  onClick={() => {
                    this.setState({onBoardingType: '3Box'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="onboarding-import-option-row">
                    <img src={ThreeBoxImg} alt={''} />
                  </div>
                  <div className="onboarding-import-option-row">
                    <span>3Box</span>
                  </div>
                  <div className="onboarding-import-option-row">
                    <CustomRadioBox id="3Box" handleClick={this.radioChangeHandler} isChecked={this.state.onBoardingType === '3Box'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="onboarding-box-footer">
              <div className="onboarding-box-footer-left"></div>
              <div className="onboarding-box-footer-right">
                <div className="onboarding-proceed-button" onClick={this.LoadOnBoardingNew}>
                  Import
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
          {this.state.showPopup ? (
            <div>
              <div
                className="swash-modal"
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.togglePopup();
                }}>
                {modal}
              </div>
            </div>
          ) : (
            ''
          )}
        </React.Fragment>
        <CustomSnackbar ref="notify" />
      </div>
    );
  }
}

export default OnBoardingNewPage;
