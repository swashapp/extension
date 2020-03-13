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
        window.helper.getFilesList(this.state.onboarding).then(status => {
            if (this.state.onboarding === 'GoogleDrive') {
                for (let fileIndex in status.files) {
                    if (status.files.hasOwnProperty(fileIndex)) {
                        let file = status.files[fileIndex];

                        let add = {
                            key: file.name,
                            id: file.id
                        };

                        files.push(add);
                    }
                }
                this.setState({files: files});
            } else if (this.state.onboarding === 'DropBox') {
                for (let fileIndex in status.entries) {
                    if (status.entries.hasOwnProperty(fileIndex)) {
                        let file = status.entries[fileIndex];

                        let add = {
                            key: file.name,
                            size: file.size,
                            id: file.id
                        };

                        files.push(add);
                    }
                }
                this.setState({files: files});
            }
        });
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
                    <div className="transaction-modal">
                        <div>
                            <div className="transaction-modal-header">
                                <p>Select A File</p>
                            </div>
                            <div className="transaction-modal-body" style={{overflow: "auto"}}>
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