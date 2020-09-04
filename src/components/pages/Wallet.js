import React from 'react';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import TransferModal from '../microcomponents/TransferModal';
import RevealKeyModal from '../microcomponents/RevealKeyModal';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyInfo: {address: '', privateKey: ''},
      referralBalance: '$',
      dataAvailable: '$',
      cumulativeEarnings: '$',
      withdrawState: false,
      transferModal: false,
      revealKeyModal: false,
      disableTransfer: false,
      recipient: '',
      recipientEthBalance: '$',
      recipientDataBalance: '$',
      revealFunction: {func: this.copyToClipboard, text: 'copy'},
    };    
    this.openModal = this.openModal.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.revealPrivateKey = this.revealPrivateKey.bind(this);
    this.pasteWallet = this.pasteWallet.bind(this);
    this.getBalanceInfo = this.getBalanceInfo.bind(this);
    this.loadSettings = this.loadSettings.bind(this);
    this.transfer = this.transfer.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
  }

  componentDidMount() {    
    this.loadSettings().then(this.getBalanceInfo);
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
  }

  purgeNumber(num) {
    if (num.indexOf('.') < 0) return num;
    return num.slice(0, num.indexOf('.') + 5);
  }

  async loadSettings() {
    return window.helper.load().then((db) => {
      return window.helper.decryptWallet(db.profile.encryptedWallet, db.configs.salt).then((keyInfo) => {
        this.setState({
          keyInfo: keyInfo,
        });
      });
    });
  }

  transfer(e) {
    let amount = document.querySelector('#swash-amount').value;
    let recipient = document.querySelector('#swash-recipient').value;
    if (!amount.match(/^[0-9]+(\.[0-9]+)?$/)) {
      this.refs.notify.handleNotification('Amount value is not valid', 'failure');
      return;
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      this.refs.notify.handleNotification('Recipient address is not valid', 'failure');
      return;
    }
    this.openModal('Transfer');
  }

  openModal(name) {
    switch (name) {
      case 'Transfer':
        this.setState({transferModal: !this.state.transferModal});
        break;
      case 'RevealKey':
        if (this.isPrivateKeyRevealed()) {
          this.revealPrivateKey();
          this.forceUpdate();
        } else this.setState({revealKeyModal: !this.state.revealKeyModal, revealFunction: {func: this.revealPrivateKey, text: 'reveal'}});
        break;
      case 'CopyKey':
        this.setState({
          revealKeyModal: !this.state.revealKeyModal,
          revealFunction: {
            func: (e) => {
              let pKey = document.getElementById('swash-privateKey');
              let pKeyType = pKey.type;
              pKey.type = 'text';
              this.copyToClipboard(e, document.getElementById('swash-privateKey'));
              pKey.type = pKeyType;
            },
            text: 'copy',
          },
        });
        break;
      default:
        break;
    }
  }

  async getBalanceInfo() {
    let referralBalance = (await window.helper.getReferralRewards()).toString();
    let dataAvailable = await window.helper.getAvailableBalance();
    dataAvailable = dataAvailable.error || dataAvailable === '' || typeof dataAvailable === 'undefined' ? this.state.dataAvailable : dataAvailable;
    let cumulativeEarnings = await window.helper.getCumulativeEarnings();
    cumulativeEarnings =
      cumulativeEarnings.error || cumulativeEarnings === '' || typeof cumulativeEarnings === 'undefined'
        ? this.state.cumulativeEarnings
        : cumulativeEarnings;
    if (referralBalance !== this.state.referralBalance || dataAvailable !== this.state.dataAvailable)
      this.setState({
        referralBalance: this.purgeNumber(referralBalance),
        dataAvailable: this.purgeNumber(dataAvailable),
        cumulativeEarnings: this.purgeNumber(cumulativeEarnings),
      });
  }

  onAmountChange(e) {
    let val = e.target.value;
    if (val > this.state.dataAvailable || this.state.dataAvailable === '0.0') {
      this.setState({disableTransfer: true});
      return;
    }
    this.setState({disableTransfer: false});
  }

  copyToClipboard(e, element) {
    element.select();
    document.execCommand('copy');
    element.blur();
    this.refs.notify.handleNotification('Copied successfully', 'success');
  }

  revealPrivateKey(e) {
    var x = document.getElementById('swash-privateKey');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  isPrivateKeyRevealed() {
    var x = document.getElementById('swash-privateKey');
    if (!x) return false;
    if (x.type === 'password') return false;
    return true;
  }

  pasteWallet(e) {
    e.preventDefault();
    navigator.clipboard.readText().then(async (address) => {
      if (address.match(/^0x[a-fA-F0-9]{40}$/g)) {
        document.querySelector('#swash-recipient').value = address;
        let DataBalance = await window.helper.getDataBalance(address);
        let EthBalance = await window.helper.getEthBalance(address);
        this.setState({recipient: address, recipientDataBalance: DataBalance, recipientEthBalance: EthBalance});
      }
    });
  }

  render() {
    return (
      <div id="settings-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="swash-setting-part">
              <div className="swash-balance-block">
                <div className="swash-row">
                  <div className="swash-balance-text">
                    <div className="swash-balance-text-column">
                      <div className="swash-balance-text-bold">{this.state.dataAvailable} </div>
                      DATA available
                    </div>                    
                  </div>
                </div>
                <div className="swash-row">
                  <div className="swash-balance-text">
                    <div className="swash-balance-text-column">
                      <div className="swash-balance-text-bold">{this.state.referralBalance} </div>
                      Referral Rewards
                    </div>
                    <div className="swash-balance-text-column">
                      <div className="swash-balance-cumulative">{this.state.cumulativeEarnings} </div>
                      Cumulative earnings
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swash-setting-part">
              <div className="swash-form-caption">Wallet address</div>
              <div style={{position: 'relative'}}>
                <input type="text" className="swash-form-input" id="swash-wallet" value={this.state.keyInfo.address} />
                <button
                  className="swash-form-input-button"
                  onBlur={(e) => {
                    e.target.innerText = 'Copy';
                  }}
                  onClick={(e) => {
                    this.copyToClipboard(e, document.getElementById('swash-wallet'));
                    e.target.focus();
                    e.target.innerText = 'Copied';
                  }}>
                  Copy
                </button>
              </div>
              <div className="swash-form-caption">Private key</div>
              <div style={{position: 'relative'}}>
                <input type="password" className="swash-form-input" id="swash-privateKey" value={this.state.keyInfo.privateKey} />
                <RDropdownMenu
                  className="swash-button swash-form-input-button swash-reveal-button"
                  items={[
                    {text: this.isPrivateKeyRevealed() ? 'Hide' : 'Reveal', callback: () => this.openModal('RevealKey')},
                    {
                      text: 'Copy',
                      callback: () => this.openModal('CopyKey'),
                    },
                  ]}
                  ref="keyRevealMenu"
                />
              </div>
            </div>
            <div className="swash-setting-part">
              <div className="swash-head">Withdraw your DATA</div>
              <div className="swash-p">
                New earnings are frozen for 48 hours as an anti-fraud measure. You can withdraw your available balance. We don’t recommend leaving too
                much DATA in the Swash wallet.
              </div>
              <div className="swash-transfer-row">
                <div className="swash-transfer-column swash-amount-column">
                  <div className="swash-form-caption">Amount</div>
                  <div>
                    <input type="text" id="swash-amount" value={this.state.dataAvailable} disabled="true" className="swash-form-input  swash-filter-input" />
                  </div>
                </div>

                <div className="swash-transfer-column swash-recipient-column">
                  <div className="swash-form-caption">Recipient Ethereum address</div>
                  <div>
                    <input
                      type="text"
                      id="swash-recipient"
                      placeholder={this.state.keyInfo.address.substr(0, 7) + '...'}
                      onContextMenu={this.pasteWallet}
                      className="swash-form-input  swash-filter-input"
                    />
                  </div>
                </div>

                <div className="swash-transfer-column swash-transfer-button-column" style={{marginRight: '0px'}}>
                  <button
                    id="swash-transfer-button"
                    className="swash-transfer-link-button"
                    disabled={this.state.dataAvailable === '$' || this.state.dataAvailable == null || this.state.dataAvailable === '0.0'}
                    onClick={this.transfer}>
                    Transfer
                  </button>
                </div>
              </div>
              {this.state.recipient ? (
                <div className="swash-transfer-row">
                  <div className="swash-transfer-column">
                    <ul>
                      <li>Same as address on your clipboard</li>
                      <li>
                        Owns {this.purgeNumber(this.state.recipientEthBalance)} ETH, {this.purgeNumber(this.state.recipientDataBalance)} DATA
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>

          {this.state.transferModal ? (
            <div>
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.openModal('Transfer');
                }}
                className="swash-modal">
                <TransferModal
                  status="notice"
                  amount={document.querySelector('#swash-amount').value}
                  recipient={document.querySelector('#swash-recipient').value}
                  opening={() => this.openModal('Transfer')}
                />
              </div>
            </div>
          ) : (
            ''
          )}
          {this.state.revealKeyModal ? (
            <div>
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.openModal('CopyKey');
                }}
                className="swash-modal">
                <RevealKeyModal
                  func={(e) => {
                    this.state.revealFunction.func(e, document.getElementById('swash-privateKey'));
                  }}
                  text={this.state.revealFunction.text}
                  opening={() => this.openModal('CopyKey')}
                />
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
