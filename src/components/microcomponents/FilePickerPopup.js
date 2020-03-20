import React from 'react';
import FileBrowser from 'react-keyed-file-browser'
import CustomSnackbar from './CustomSnackbar';

class FilePickerPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.closePopup = this.props.closePopup;
        this.state.onboarding = this.props.onboarding;
        this.state.files = [];
        this.state.selectedFile = {};

        this.applyConfig = this.applyConfig.bind(this);
    }

    componentDidMount() {
        let files = this.state.files;
        if (this.state.onboarding === 'GoogleDrive' || this.state.onboarding === 'DropBox') {
            window.helper.getFilesList(this.state.onboarding).then(status => {
                let fileList = [];

                if (this.state.onboarding === 'GoogleDrive')
                    fileList = status.files;
                else if (this.state.onboarding === 'DropBox')
                    fileList = status.entries;

                for (let fileIndex in fileList) {
                    if (fileList.hasOwnProperty(fileIndex)) {
                        let file = fileList[fileIndex];

                        let add = {
                            key: file.name,
                            id: file.id
                        };

                        files.push(add);
                    }
                }
                this.setState({files: files});
            });
        }
    }

    applyConfig() {
        if (this.state.selectedFile.id)
            return window.helper.downloadFile(this.state.onboarding, this.state.selectedFile.id).then(response => {
                if (response) {
                    return window.helper.applyConfig(JSON.stringify(response)).then((result) => {
                        if (result)
                            return this.state.closePopup(true);
                        this.refs.notify.handleNotification('Can not import this config file', 'error');
                        return this.state.closePopup();
                    });
                }
            });
        else
            return this.state.closePopup();
    }

    render() {
        return (
            <div className="d-flex justify-content-center">
                <React.Fragment>
                    <div className="transaction-modal-large">
                        <div>
                            <div className="transaction-modal-header">
                                <p>Select A File</p>
                            </div>
                            <div className="transaction-modal-body-large" style={{overflow: "auto", display: "block", width: "auto"}}>
                                <div className="modal-body-text" style={{display: "block"}}>
                                    <FileBrowser
                                        files={this.state.files}
                                        detailRenderer={() => {
                                            return (<div/>)
                                        }}
                                        onSelectFile={(file) => {
                                            this.state.selectedFile = file;
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="transaction-modal-footer">
                                <div className="transaction-modal-footer-right">
                                    <div className='transaction-modal-button' onClick={this.applyConfig}>Import</div>
                                    <div className='transaction-modal-button-cancel' onClick={this.state.closePopup}>Cancel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomSnackbar
                        ref='notify'
                    />
                </React.Fragment>
            </div>
        );
    }
}

export default FilePickerPopup;