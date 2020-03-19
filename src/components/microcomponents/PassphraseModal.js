import React from 'react'
import loading from "../../statics/images/loading.png";
import FileBrowser from "react-keyed-file-browser";
import CustomSnackbar from "./CustomSnackbar";

class PassphraseModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            nextPage: 1,
            mnemonic: null,
            waiting: false,
            closePopup: this.props.closePopup,
            files: [],
            selectedFile: {}
        };

        this.getMnemonic = this.getMnemonic.bind(this);
        this.backupConfig = this.backupConfig.bind(this);
        this.signIn3Box = this.signIn3Box.bind(this);
        this.applyConfig = this.applyConfig.bind(this);
    }

    componentDidMount() {
        if (this.props.page === 'export') {
            this.getMnemonic();
            this.setState({
                nextPage: 1
            });
        } else if (this.props.page === 'import') {
            this.setState({
                nextPage: 2
            });
        }
    }

    getMnemonic() {
        window.helper.get3BoxMnemonic().then(mnemonic => {
            if (mnemonic === "") {
                if (this.state.mnemonic == null) {
                    const bip39 = require('bip39');
                    this.setState({
                        mnemonic: bip39.generateMnemonic()
                    });
                }
            } else {
                this.setState({
                    mnemonic: mnemonic
                });
            }
        });
    }

    getHeader() {
        switch (this.state.page) {
            case 1:
                return <>Warning</>;
            case 2:
                return <>Backup Passphrase</>;
            case 3:
                return <>Backup Passphrase</>;
            case 4:
                return <>Select A File</>;
            default:
        }
    }

    getBody() {
        switch (this.state.page) {
            case 1:
                return <div className="transaction-modal-body-large" style={{overflow: "auto", display: "block", width: "auto"}}>
                    <div className="modal-body-text" style={{height: 'inherit'}}>
                        This feature is experimental and so may not work perfectly all the time. It may change or be removed in the future.
                        <p style={{
                            'font-weight': 'bold'
                        }}>
                            Use it at your own risk.
                        </p>
                    </div>
                </div>;
            case 2:
                this.getMnemonic();
                return <div className="transaction-modal-body-large" style={{overflow: "auto", display: "block", width: "auto"}}>
                    <div className="modal-body-text" style={{height: 'inherit'}}>
                        If you ever change browsers or move computers, you will need this seed phrase to access your 3Box backups. Save them somewhere safe and secret.
                        <p style={{
                            'display': 'block',
                            'margin-top': '10px',
                            'width': '100%',
                            'text-align': 'center',
                            'font-weight': 'bold',
                            'border': 'solid #e6e6e6 1px',
                            'border-radius': '4px',
                            'padding': '10px',
                            'background': '#f7f7f7'
                        }}>
                            {this.state.mnemonic}
                        </p>
                    </div>
                </div>;
            case 3:
                return <div className="transaction-modal-body-large" style={{overflow: "auto", display: "block", width: "auto"}}>
                    <div className="modal-body-text" style={{height: 'inherit'}}>
                        If you ever change browsers or move computers, you will need this seed phrase to access your 3Box backups. Save them somewhere safe and secret.
                        <textarea id="3box-passphrase-input" rows="3" cols="33" placeholder="Enter your 12 words passphrase" style={{
                            'width': '100%',
                            'float': 'left',
                            'margin-top': '10px',
                            'font-size': 'inherit',
                            'font-family': 'inherit',
                            'text-align': 'center',
                        }}>
                    </textarea>
                    </div>
                </div>;
            case 4:
                return <div className="transaction-modal-body-large" style={{overflow: "auto", display: "block", width: "auto"}}>
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
                </div>;
            default:
        }
    }

    getNextButton() {
        switch (this.state.page) {
            case 1:
                return <div className='transaction-modal-button' onClick={(e) => {
                    this.setState({
                        page: this.state.page + this.state.nextPage
                    });
                }}>Next
                </div>;
            case 2:
                return this.state.waiting ?
                    <div className='transaction-modal-button transaction-modal-button-waiting'>Uploading...
                        <img src={loading} alt=""/>
                    </div> :
                    <div className='transaction-modal-button' onClick={this.backupConfig}>Export</div>;
            case 3:
                return this.state.waiting ?
                    <div className='transaction-modal-button transaction-modal-button-waiting'>Signing in...
                        <img src={loading} alt=""/>
                    </div> :
                    <div className='transaction-modal-button' onClick={this.signIn3Box}>Sign in</div>;
            case 4:
                return <div className='transaction-modal-button' onClick={this.applyConfig}>Import</div>;
            default:

        }
    }

    backupConfig() {
        const bip39 = require('bip39');
        this.setState({waiting: true});
        bip39.mnemonicToSeed(this.state.mnemonic).then(bytes => {
            let seed = '0x'.concat(bytes.toString('hex').substring(0, 32));
            window.helper.writeTo3BoxSpace(seed).then((result) => {
                this.setState({waiting: false});
                this.state.closePopup(result);
            });
        });
    }

    signIn3Box() {
        const bip39 = require('bip39');
        this.setState({waiting: true});
        let inputValue = document.getElementById('3box-passphrase-input').value;
        if (bip39.validateMnemonic(inputValue)) {
            this.state.mnemonic = inputValue;
            bip39.mnemonicToSeed(inputValue).then(bytes => {
                let seed = '0x'.concat(bytes.toString('hex').substring(0, 32));
                window.helper.getFrom3BoxSpace(seed).then((result) => {
                    let files = this.state.files;
                    let fileList = JSON.parse(result);
                    for (let fileIndex in fileList) {
                        if (fileList.hasOwnProperty(fileIndex)) {
                            let add = {
                                key: fileIndex,
                                conf: fileList[fileIndex]
                            };
                            files.push(add);
                        }
                    }
                    this.setState({
                        files: files,
                        waiting: false,
                        page: 4
                    });
                });
            });
        }
    }

    applyConfig() {
        if (this.state.selectedFile) {
            return window.helper.applyConfig(this.state.selectedFile.conf).then((result) => {
                window.helper.save3BoxMnemonic(this.state.mnemonic).then(() => {
                    if (result)
                        return this.state.closePopup(true);
                    this.refs.notify.handleNotification('Can not import this config file', 'error');
                    return this.state.closePopup();
                });
            });
        } else
            return this.state.closePopup();
    }

    render() {
        if (this.props.page === 'export' && this.state.mnemonic === null) {
            return (
                <p>Please Wait</p>
            );
        } else {
            return (
                <div className="d-flex justify-content-center">
                    <React.Fragment>
                        <div className="transaction-modal-large">
                            <div>
                                <div className="transaction-modal-header">
                                    <p>{this.getHeader()}</p>
                                </div>
                                {this.getBody()}
                                <div className="transaction-modal-footer">
                                    <div className="transaction-modal-footer-right">
                                        {this.getNextButton()}
                                        <div className='transaction-modal-button-cancel' onClick={(e) => {
                                            this.state.closePopup();
                                        }}>
                                            Cancel
                                        </div>
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
}

export default PassphraseModal;