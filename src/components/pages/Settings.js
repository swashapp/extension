import React from 'react';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import ThreeBoxImg from '../../statics/images/3box.svg';
import PassphraseModal from '../microcomponents/PassphraseModal.js';
import {TwitterIcon, FacebookIcon, LinkedinIcon, EmailIcon} from 'react-share';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      modules: [],
      masks: [],
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

      let masks = db.privacyData;
      let newMasks = [];
      for (let x in masks) {
        newMasks.push({
          value: masks[x].value,
        });
      }

      let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
      this.setState({
        masks: newMasks,
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

  addMask() {
    let mvElement = document.getElementById('swash-mask-value');
    let f = {
      value: mvElement.value,
    };
    mvElement.value = '';
    if (!f.value || f.value === 'undefined') {
      this.notifyRef.current.handleNotification('Null is not allowed', 'error');
      return;
    }

    let allow = true;
    window.helper.loadPrivacyData().then((pData) => {
      for (let i in pData) {
        if (pData[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        pData.push(f);
        window.helper.savePrivacyData(pData);
        let i = this.state.masks;
        i.push(f);
        this.setState({masks: i});
      } else {
        this.notifyRef.current.handleNotification('Duplicate entry', 'error');
      }
    });
  }

  deleteMaskRecord(id) {
    let newArray = [];
    let storageArray = [];
    for (let i in this.state.masks) {
      if (this.state.masks[i].value !== id) {
        newArray.push(this.state.masks[i]);
        storageArray.push({value: this.state.masks[i].value});
      }
    }
    window.helper.savePrivacyData(storageArray);
    this.setState({masks: newArray});
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
    let maskTableDataRows = this.state.masks.map((row) => {
      return (
        <tr key={row.value} className="swash-table-row">
          <td className="swash-table-text swash-disabled-masked-text-td">
            <input type="text" value={row.value} disabled className="swash-disabled-masked-text" />
          </td>
          <td className="swash-table-text swash-delete-masked-text-td">
            <button
              className="swash-link-button"
              onClick={() => {
                this.deleteMaskRecord(row.value);
              }}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
    let addMaskText = (
      <div>
        <div className="swash-form-caption">Add a text mask</div>
        <div>
          <input
            type="text"
            id="swash-mask-value"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.addMask();
            }}
            placeholder="Peter"
            className="swash-form-input swash-mask-input"
          />
        </div>
      </div>
    );
    let AddMaskButton = (
      <button className="swash-link-button" onClick={() => this.addMask()}>
        Add
      </button>
    );

    return (
      <div id="swash-settings" className="swash-col">
        <React.Fragment>
          <div id="swash-advanced-page">
            <div className="swash-col">
              <div className="swash-setting-part">
                <div className="swash-head">Invite a friend</div>
                <div className="swash-p">
                  Use your referral link to earn {this.state.reward} DATA for every new installation of Swash plus another 1 DATA. Whoever refers the
                  most new users each month will receive 1000 $DATA.
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
                  <a href={`https://twitter.com/intent/tweet?url=${this.state.referralLink}`}>
                    <TwitterIcon size={32} round={true} />
                  </a>
                  <a href={`https://www.facebook.com/sharer.php?u=${this.state.referralLink}`}>
                    <FacebookIcon size={32} round={true} />
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?url=${this.state.referralLink}`}>
                    <LinkedinIcon size={32} round={true} />
                  </a>
                  <a href={`mailto:?&subject=You are invited to swash&body=${this.state.referralLink}`}>
                    <EmailIcon size={32} round={true} />
                  </a>
                </div>
              </div>
            </div>

            <div className="swash-col">
              <div className="swash-setting-part">
                <div className="swash-head">Text masking</div>
                <div className="swash-p2">
                  Swash doesn’t collect any sensitive data from you, like your name, email, or passwords. However, with text masking, you can add
                  another layer of security to hide certain sensitive words or numbers so they don’t get added to the Streamr Marketplace.
                </div>

                <div>
                  <div>
                    <div>
                      <tr className="swash-table-head-row">
                        <th className="swash-table-text swash-table-head-text swash-add-mask-text-th">{addMaskText}</th>
                        <th className="swash-table-text swash-table-head-text swash-add-mask-button-th">{AddMaskButton}</th>
                      </tr>
                    </div>

                    <div>{maskTableDataRows}</div>
                  </div>
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
