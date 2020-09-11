import React from 'react';
import FileBrowser, {Icons} from 'react-keyed-file-browser';
import '../../statics/css/react-keyed-file-browser.css';
import CustomSnackbar from './CustomSnackbar';
import PropTypes from 'prop-types';

class FilePickerPopup extends React.Component {
  static get propTypes() {
    return {
      closePopup: PropTypes.func,
      onboarding: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.notifyRef = React.createRef();
    this.state = {
      closePopup: this.props.closePopup,
      onboarding: this.props.onboarding,
      importState: 'enabled',
      files: [],
      selectedFile: {},
    };

    this.applyConfig = this.applyConfig.bind(this);
  }

  componentDidMount() {
    let files = this.state.files;
    if (this.state.onboarding === 'GoogleDrive' || this.state.onboarding === 'DropBox') {
      window.helper.getFilesList(this.state.onboarding).then((status) => {
        let fileList = [];

        if (this.state.onboarding === 'GoogleDrive') fileList = status.files;
        else if (this.state.onboarding === 'DropBox') fileList = status.entries;

        for (let fileIndex in fileList) {
          if (fileList.hasOwnProperty(fileIndex)) {
            let file = fileList[fileIndex];

            let add = {
              key: file.name,
              id: file.id,
            };

            files.push(add);
          }
        }
        this.setState({files: files});
      });
    }
  }

  applyConfig() {
    this.setState({importState: 'waiting'});
    if (this.state.selectedFile.id)
      return window.helper.downloadFile(this.state.onboarding, this.state.selectedFile.id).then((response) => {
        if (response) {
          return window.helper.applyConfig(JSON.stringify(response)).then((result) => {
            if (result) return this.state.closePopup(true);
            this.notifyRef.current.handleNotification('Can not import this config file', 'error');
            return this.state.closePopup();
          });
        }
      });
    else return this.state.closePopup();
  }

  render() {

    const renderImportButton = () => {
      switch(this.state.importState) {
        case 'enabled':
          return <div className="swash-transaction-modal-button" onClick={this.applyConfig}>
                  Import
                </div>
          break;
        case 'waiting':
          return <div disabled className="swash-transaction-modal-button swash-transaction-modal-button-waiting" onClick={this.applyConfig}>
                    Importing...
                  </div>         
          break;        
      }
    }

    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-transaction-modal-large">
            <div>
              <div className="swash-transaction-modal-header">
                <p>Select a file</p>
              </div>
              <div className="swash-transaction-modal-body-large" style={{overflow: 'auto', display: 'block', width: 'auto'}}>
                <div className="swash-modal-body-text" style={{display: 'inherit'}}>
                  <FileBrowser
                    files={this.state.files}
                    isSelectable={true}
                    detailRenderer={() => {
                      return <div />;
                    }}
                    onSelectFile={(file) => {
                      this.setState({selectedFile: file});
                    }}
                  />
                </div>
              </div>
              <div className="swash-transaction-modal-footer">
                <div className="swash-transaction-modal-footer-right">
                  {renderImportButton()}
                  <div className="swash-transaction-modal-button-cancel" onClick={this.state.closePopup}>
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CustomSnackbar ref={this.notifyRef} />
        </React.Fragment>
      </div>
    );
  }
}

export default FilePickerPopup;
