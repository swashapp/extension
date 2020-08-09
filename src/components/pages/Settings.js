import React from 'react';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import ModuleView from '../microcomponents/ModuleView';
import PrivacyLevel from '../microcomponents/PrivacyLevel';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';

import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import CustomSelect from '../microcomponents/CustomSelect';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import ThreeBoxImg from '../../statics/images/3box.svg';
import PassphraseModal from '../microcomponents/PassphraseModal.js';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      privacyLevel: 0,
      filters: [],
      masks: [],
      showPopup: false,
    };

    this.onBoardingOAuth = this.onBoardingOAuth.bind(this);
    this.onBoardingUpload = this.onBoardingUpload.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    this.loadSettings();
    window.scrollTo(0, 0);
  }

  componentDidUnmount() {}

  loadSettings() {
    window.helper.load().then((db) => {
      let modules = [];

      for (let module in db.modules) {
        modules.push(db.modules[module]);
      }

      let filters = db.filters;
      let newFilters = [];
      for (let x in filters) {
        newFilters.push({
          value: filters[x].value,
          type: filters[x].type,
          internal: filters[x].internal,
        });
      }

      let masks = db.privacyData;
      let newMasks = [];
      for (let x in masks) {
        newMasks.push({
          value: masks[x].value,
        });
      }

      this.setState({
        filters: newFilters,
        masks: newMasks,
        privacyLevel: db.configs.privacyLevel,
        modules: modules,
      });
    });
  }

  addMask() {
    let mvElement = document.getElementById('maskValue');
    let f = {
      value: mvElement.value,
    };
    mvElement.value = '';
    if (!f.value || f.value === 'undefined') {
      this.refs.notify.handleNotification('Null is not allowed', 'error');
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
        this.refs.notify.handleNotification('Duplicate entry', 'error');
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

  addFilter() {
    let f = {
      value: document.getElementById('filterValue').value,
      type: this.refs.matchingTypeSelect.getSelectedItem().value,
      internal: false,
    };
    if (!f.value || f.value === 'undefined') {
      this.refs.notify.handleNotification('Null is not allowed', 'error');
      return;
    }

    let allow = true;
    window.helper.loadFilters().then((filter) => {
      for (let i in filter) {
        if (filter[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        filter.push(f);
        window.helper.saveFilters(filter);
        let i = this.state.filters;
        i.push(f);
        this.setState({filters: i});
        this.refs.notify.handleNotification('Added successfully', 'success');
      } else {
        this.refs.notify.handleNotification('Duplicate entry', 'error');
      }
    });
  }

  deleteFilterRecord(id) {
    let newArray = [];
    let storageArray = [];
    for (let i in this.state.filters) {
      if (this.state.filters[i].value !== id) {
        newArray.push(this.state.filters[i]);
        storageArray.push({type: this.state.filters[i].type, value: this.state.filters[i].value, internal: this.state.filters[i].internal});
      } else {
        if (this.state.filters[i].internal) {
          this.refs.notify.handleNotification('Internal filters can not be removed', 'error');
          return;
        }
      }
    }
    window.helper.saveFilters(storageArray);
    this.setState({filters: newArray});
  }

  onBoardingOAuth(onBoarding) {
    if (!window.browser.runtime.onMessage.hasListener(this.onBoardingUpload)) window.browser.runtime.onMessage.addListener(this.onBoardingUpload);

    window.browser.tabs.getCurrent().then((tab) => {
      window.helper.startOnBoarding(onBoarding, tab.id).then(() => {});
    });
  }

  onBoardingUpload(request, sender, sendResponse) {
    if (request.onBoarding) {
      window.helper.uploadFile(request.onBoarding).then((response) => {
        if (response === false) this.refs.notify.handleNotification('The configuration file could not be exported', 'error');
        else this.refs.notify.handleNotification('The configuration file is exported successfully', 'success');
      });
    }

    if (!window.browser.runtime.onMessage.hasListener(this.onBoardingUpload)) window.browser.runtime.onMessage.removeListener(this.onBoardingUpload);
  }

  togglePopup(isCompleted) {
    this.setState({
      showPopup: !this.state.showPopup,
    });

    if (isCompleted === false) this.refs.notify.handleNotification('The configuration file could not be exported', 'error');
    else if (isCompleted === true) this.refs.notify.handleNotification('The configuration file is exported successfully', 'success');
  }

  render() {
    const modules = this.state.modules ? (
      this.state.modules.map((module) => {
        return <ModuleView isOpened={false} module={module} />;
      })
    ) : (
      <></>
    );

    let excludeTableDataRows = this.state.filters.map((row) => {
      return (
        <tr key={row.value} className="table-row">
          <td className="table-text disabled-url-td">
            <input type="text" value={row.value} disabled className="disabledUrl" />
          </td>
          <td className="table-text disabled-matching-type-td">
            <input type="text" value={row.type} disabled className="disabledMatchingType" />
          </td>
          <td className="table-text delete-matching-type-td">
            <a className="linkbutton" onClick={() => this.deleteFilterRecord(row.value)}>
              Delete
            </a>
          </td>
          <td className="table-text delete-matching-type-td-small">
            <RDropdownMenu
              className="button more-button2"
              items={[{text: 'Delete', callback: () => this.deleteFilterRecord(row.value)}]}
              ref="filterItem"
            />
          </td>
        </tr>
      );
    });
    let addXUrl = (
      <div>
        <div className="form-caption">Add a URL to exclude</div>
        <div>
          <input
            type="text"
            id="filterValue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.addFilter();
            }}
            placeholder="http://example.com"
            className="form-input  filter-input"
          />
        </div>
      </div>
    );
    let selectItems = [
      {description: 'Exact', value: 'exact'},
      {description: 'Wildcard', value: 'wildcard'},
      {description: 'Regex', value: 'regex'},
    ];
    let addXType = (
      <div>
        <div className="form-caption">Matching Type</div>

        <CustomSelect items={selectItems} ref="matchingTypeSelect" />
      </div>
    );
    let AddXButton = (
      <a className="linkbutton add-link-button" onClick={() => this.addFilter()}>
        Add
      </a>
    );

    let maskTableDataRows = this.state.masks.map((row) => {
      return (
        <tr key={row.value} className="table-row">
          <td className="table-text disabled-masked-text-td">
            <input type="text" value={row.value} disabled className="disabledMaskedText" />
          </td>
          <td className="table-text delete-masked-text-td">
            <a
              className="linkbutton"
              onClick={() => {
                this.deleteMaskRecord(row.value);
              }}>
              Delete
            </a>
          </td>
        </tr>
      );
    });
    let addMaskText = (
      <div>
        <div className="form-caption">Add a text mask</div>
        <div>
          <input
            type="text"
            id="maskValue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.addMask();
            }}
            placeholder="Peter"
            className="form-input mask-input"
          />
        </div>
      </div>
    );
    let AddMaskButton = (
      <a className="linkbutton" onClick={() => this.addMask()}>
        Add
      </a>
    );

    return (
      <div id="settings" className="swash-col">
        <React.Fragment>
          <div id="settings-page" className="swash-col">
            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">Choose data to capture</div>
                <div className="swash-p">
                  To stream your web browsing behaviour, Swash uses a modular approach. By default, only the Search module is on. You can also
                  optionally enable other modules in order to capture specific data from a variety of other popular sites. Click any module to adjust
                  settings.
                </div>

                <div>{modules}</div>
              </div>
            </div>
            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">Set global privacy level</div>
                <div className="swash-p">
                  This allows you to set privacy levels across all your modules. Adjust them to choose the types of data you’d like to share and what
                  to obscure or remove. You can also use the Advanced settings to block specific text (e.g. your name or address), sites and domains.
                </div>

                <PrivacyLevel level={this.state.privacyLevel} />
              </div>
            </div>
          </div>
          <div id="advanced-page">
            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">Text masking</div>
                <div className="swash-p2">
                  You can mask specific sensitive text data before it is sent to Streamr Marketplace. Your sensitive data is transformed based on the
                  privacy level setting. Examples of text you might want to mask could be your name, email address and phone number.
                </div>

                <div>
                  <MDBTable>
                    <MDBTableHead>
                      <tr className="table-head-row">
                        <th className="table-text table-head-text add-mask-text-th">{addMaskText}</th>
                        <th className="table-text table-head-text add-mask-button-th">{AddMaskButton}</th>
                      </tr>
                    </MDBTableHead>

                    <MDBTableBody>{maskTableDataRows}</MDBTableBody>
                  </MDBTable>
                </div>
              </div>
            </div>

            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">URLs to exclude</div>
                <div className="swash-p2">
                  This filtering is used to exclude domains and URLs to ensure their data are not going to be sent to Streamr Marketplace. This
                  mechanism is independent of the global filters and can be used to target whatever you would like to exclude. See the docs for more
                  details.
                </div>

                <div>
                  <MDBTable>
                    <MDBTableHead>
                      <tr className="table-head-row">
                        <th className="table-head-text add-x-url-th">{addXUrl}</th>
                        <th className="table-head-text add-x-type-th">{addXType}</th>
                        <th className="table-head-text add-x-button-th">{AddXButton}</th>
                      </tr>
                    </MDBTableHead>

                    <MDBTableBody>{excludeTableDataRows}</MDBTableBody>
                  </MDBTable>
                </div>
              </div>
            </div>
          </div>

          <div className="swash-col">
            <div className="setting-part">
              <div className="swash-head">Export the configuration</div>
              <div className="swash-p">
                You can maintain a consistent configuration across systems. After you configure settings in Swash on your browser, export those
                settings to a configuration file using one of these methods and then import the configuration into new installations.
              </div>

              <div style={{display: 'inline-block', width: '100%'}}>
                <div className="onbording-export-div">
                  <div className="onbording-export-option">
                    <a
                      className="onbording-export-button"
                      onClick={() => {
                        window.helper.saveConfig().then();
                      }}>
                      <figure>
                        <img src={LocalFileImg} alt="" />
                      </figure>
                      <div className="onbording-export-button">Local file</div>
                    </a>
                  </div>

                  <div className="onbording-export-option">
                    <a
                      className="onbording-export-button"
                      onClick={() => {
                        this.onBoardingOAuth('GoogleDrive');
                      }}>
                      <figure>
                        <img src={GoogleDriveImg} alt="" />
                      </figure>
                      <div className="onbording-export-button">Google Drive</div>
                    </a>
                  </div>

                  <div className="onbording-export-option">
                    <a
                      className="onbording-export-button"
                      onClick={() => {
                        this.onBoardingOAuth('DropBox');
                      }}>
                      <figure>
                        <img src={DropboxImg} alt="" />
                      </figure>
                      <div className="onbording-export-button">Dropbox</div>
                    </a>
                  </div>

                  <div className="onbording-export-option">
                    <a className="onbording-export-button" onClick={this.togglePopup}>
                      <figure>
                        <img src={ThreeBoxImg} alt="" />
                      </figure>
                      <div className="onbording-export-button">3Box</div>
                    </a>
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
        <CustomSnackbar ref="notify" />
      </div>
    );
  }
}

export default SettingsPage;
