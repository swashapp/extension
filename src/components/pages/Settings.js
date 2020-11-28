import React from 'react';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import ThreeBoxImg from '../../statics/images/3box.svg';
import PassphraseModal from '../microcomponents/PassphraseModal.js';
import {TwitterShareButton, FacebookShareButton, LinkedinShareButton, EmailShareButton} from 'react-share';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      modules: [],
      reward: 0,
      showPopup: false,
    };

    this.onboardingOAuth = this.onboardingOAuth.bind(this);
    this.onboardingUpload = this.onboardingUpload.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    this.loadSettings();
    this.loadReferral();
    this.loadActiveReferral();
    window.scrollTo(0, 0);
  }

  loadSettings() {
    window.helper.load().then((db) => {
      let modules = [];

      for (let module in db.modules) {
        modules.push(db.modules[module]);
      }

      let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
      this.setState({
        modules: modules,
        referralLink: referralLink,
      });
    });
  }

  loadReferral() {
    window.helper.load().then((db) => {
      if (!db.profile.user_id) {
        setTimeout(() => this.loadReferral(), 5000);
        return;
      }
      let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
      this.setState({referralLink});
    });
  }

  loadActiveReferral() {
    window.helper.getActiveReferral().then((referral) => {
      if (referral.reward) this.setState({reward: referral.reward});
    });
  }

  onboardingOAuth(onboarding) {
    if (!window.browser.runtime.onMessage.hasListener(this.onboardingUpload)) window.browser.runtime.onMessage.addListener(this.onboardingUpload);

    window.browser.tabs.getCurrent().then((tab) => {
      window.helper.startOnBoarding(onboarding, tab.id).then(() => {});
    });
  }

  onboardingUpload(request, sender, sendResponse) {
    if (request.onboarding) {
      window.helper.uploadFile(request.onboarding).then((response) => {
        if (response === false) this.notifyRef.current.handleNotification('The configuration file could not be exported', 'error');
        else this.notifyRef.current.handleNotification('The configuration file is exported successfully', 'success');
      });
    }

    if (!window.browser.runtime.onMessage.hasListener(this.onboardingUpload)) window.browser.runtime.onMessage.removeListener(this.onboardingUpload);
  }

  togglePopup(isCompleted) {
    this.setState({
      showPopup: !this.state.showPopup,
    });

    if (isCompleted === false) this.notifyRef.current.handleNotification('The configuration file could not be exported', 'error');
    else if (isCompleted === true) this.notifyRef.current.handleNotification('The configuration file is exported successfully', 'success');
  }

  copyToClipboard(e, element) {
    element.select();
    document.execCommand('copy');
    element.blur();
    this.notifyRef.current.handleNotification('Copied successfully', 'success');
  }

  render() {
    const referralMessage = 'Use my referral link to earn money as you surf with Swash:';
    return (
      <div id="swash-settings" className="swash-col">
        <React.Fragment>
          <div id="swash-advanced-page">
            <div className="swash-col">
              <div className="swash-setting-part">
                <div className="swash-head">Invite a friend</div>
                <div className="swash-p">
                  Share your referral link with friends to earn {this.state.reward} DATAcoin for every new installation of Swash! Whoever refers the
                  most new users each month will receive 1000 DATAcoin.
                </div>
                <div className="swash-transfer-row">
                  <div className="swash-referral-column">
                    <div className="swash-form-caption">Your referral link</div>
                    <div>
                      <input
                        type="text"
                        id="swash-referral-link"
                        value={this.state.referralLink}
                        readOnly={true}
                        className="swash-form-input  swash-filter-input"
                      />
                    </div>
                  </div>
                  <div className="swash-referral-column" style={{marginRight: '0px'}}>
                    <button
                      id="swash-transfer-button"
                      className="swash-transfer-link-button"
                      onBlur={(e) => {
                        e.target.innerText = 'Copy Link';
                      }}
                      onClick={(e) => {
                        this.copyToClipboard(e, document.getElementById('swash-referral-link'));
                        e.target.focus();
                        e.target.innerText = 'Copied';
                      }}>
                      Copy Link
                    </button>
                  </div>
                </div>
                <div className="swash-share">
                  Share now on
                  <TwitterShareButton url={this.state.referralLink} title={referralMessage}>
                    <span className="swash-share-twitter" />
                  </TwitterShareButton>
                  <FacebookShareButton url={this.state.referralLink} quote={referralMessage}>
                    <span className="swash-share-facebook" />
                  </FacebookShareButton>
                  <LinkedinShareButton url={this.state.referralLink} summary={referralMessage}>
                    <span className="swash-share-linkedin" />
                  </LinkedinShareButton>
                  <EmailShareButton url={this.state.referralLink} subject={'My Referral Link'} body={referralMessage}>
                    <span className="swash-share-email" />
                  </EmailShareButton>
                </div>
                <div className="swash-p">
                  <em>Your referral earnings will be available to withdraw at the end of Feb 2021.</em>
                </div>
              </div>
            </div>
          </div>

          <div className="swash-col">
            <div className="swash-setting-part">
              <div className="swash-head">Backup your wallet settings</div>
              <div className="swash-p">
                If you want to use this wallet on other devices or browsers, simply download your settings using one of the options below and keep it
                in a safe place.
              </div>

              <div style={{display: 'inline-block', width: '100%'}}>
                <div className="swash-onboarding-export-div">
                  <div className="swash-onboarding-export-option">
                    <button
                      className="swash-onboarding-export-button"
                      onClick={() => {
                        window.helper.saveConfig().then();
                      }}>
                      <figure>
                        <img src={LocalFileImg} alt={''} />
                      </figure>
                      <div className="swash-onboarding-export-button">Local file</div>
                    </button>
                  </div>

                  <div className="swash-onboarding-export-option">
                    <button
                      className="swash-onboarding-export-button"
                      onClick={() => {
                        this.onboardingOAuth('GoogleDrive');
                      }}>
                      <figure>
                        <img src={GoogleDriveImg} alt={''} />
                      </figure>
                      <div className="swash-onboarding-export-button">Google Drive</div>
                    </button>
                  </div>

                  <div className="swash-onboarding-export-option">
                    <button
                      className="swash-onboarding-export-button"
                      onClick={() => {
                        this.onboardingOAuth('DropBox');
                      }}>
                      <figure>
                        <img src={DropboxImg} alt={''} />
                      </figure>
                      <div className="swash-onboarding-export-button">Dropbox</div>
                    </button>
                  </div>

                  <div className="swash-onboarding-export-option">
                    <button className="swash-onboarding-export-button" onClick={this.togglePopup}>
                      <figure>
                        <img src={ThreeBoxImg} alt={''} />
                      </figure>
                      <div className="swash-onboarding-export-button">3Box</div>
                    </button>
                  </div>
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
                <PassphraseModal page={'export'} closePopup={this.togglePopup.bind(this)} />
              </div>
            </div>
          ) : (
            ''
          )}
        </React.Fragment>
        <CustomSnackbar ref={this.notifyRef} />
      </div>
    );
  }
}

export default SettingsPage;
