import React from 'react';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import ThreeBoxImg from '../../statics/images/3box.svg';
import PassphraseModal from '../microcomponents/PassphraseModal.js';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      modules: [],
      masks: [],
      showPopup: false,
    };

    this.onboardingOAuth = this.onboardingOAuth.bind(this);
    this.onboardingUpload = this.onboardingUpload.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    this.loadSettings();
    this.loadReferal();
    window.scrollTo(0, 0);
  }

  componentDidUnmount() {}

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

  async loadReferal() {
    let db = await window.helper.load();
    if (!db.profile.user_id) {
      setTimeout(() => this.loadReferal(), 5000);
      return;
    }
    let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
    this.setState({referralLink});
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
                  Refer a friend to Swash and earn a 1 DATA bonus for any new installation of Swash that is made by your referral URL and 1 DATA when
                  the invited user balance reaches her first 10 DATA.
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
              </div>
            </div>

            <div className="swash-col">
              <div className="swash-setting-part">
                <div className="swash-head">Text masking</div>
                <div className="swash-p2">
                  You can mask specific sensitive text data before it is sent to Streamr Marketplace. Your sensitive data is transformed based on the
                  privacy level setting. Examples of text you might want to mask could be your name, email address and phone number.
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
              <div className="swash-head">Export the configuration</div>
              <div className="swash-p">
                You can maintain a consistent configuration across systems. After you configure settings in Swash on your browser, export those
                settings to a configuration file using one of these methods and then import the configuration into new installations.
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
