import React from 'react';
import verified from '../../statics/images/verified.svg';
import error from '../../statics/images/error-icon.svg';
import arrow from '../../statics/images/arrow.svg';
import PropTypes from 'prop-types';

class TransferModal extends React.Component {
  static get propTypes() {
    return {
      tx: PropTypes.string,
      status: PropTypes.bool,
      opening: PropTypes.func,
      amount: PropTypes.string,
      recipient: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      opening: this.props.opening,
      transactionId: this.props.tx,
      amount: this.props.amount,
      recipient: this.props.recipient,
      minimumData: 0,
      transactionFee: '0',
      withdrawType: 'withdrawToAll',
      failedReason: '',
    };
    this.withdraw = this.withdraw.bind(this);
    this.proceed = this.proceed.bind(this);
  }

  componentDidMount() {
    let swPromise = window.helper.getSponsoredWithdrawTransactionFee(this.state.recipient);
    let waPromise = window.helper.getWithdrawAllToTransactionFee(this.state.recipient);
    let pricePromise = window.helper.getDataEthPairPrice();

    Promise.all([swPromise, waPromise, pricePromise]).then(([swTxFee, waTxFee, dataPrice]) => {
      let minData = (swTxFee / dataPrice) * 20;
      if (minData < Number(this.state.amount)) {
        this.setState({transactionFee: swTxFee, withdrawType: 'sponsorWithdraw', minimumData: minData});
      } else {
        this.setState({transactionFee: waTxFee, withdrawType: 'withdrawToAll', minimumData: minData});
      }
    });
  }

  proceed() {
    this.setState({status: 'init'});
  }

  purgeNumber(num) {
    let temp = num.toString();
    if (temp.indexOf('.') < 0) return temp;
    return temp.slice(0, temp.indexOf('.') + 5);
  }

  withdraw() {
    this.setState({status: 'waiting'});
    if (this.state.withdrawType === 'sponsorWithdraw') {
      window.helper.sendSponsoredWithdraw(this.state.recipient).then((response) => {
        if (response !== true) {
          this.setState({status: 'failed', failedReason: response});
          return;
        }
        this.setState({status: 'confirmed'});
      });
    } else {
      window.helper.withdrawAllTo(this.state.recipient).then((tx) => {
        if (tx.error) {
          this.setState({status: 'failed', failedReason: tx.error});
          return;
        }
        this.setState({status: 'confirmed'});
        this.setState({transactionId: tx.hash});
        tx.wait().then((x) => {});
      });
    }
  }

  purgeAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(37, 42)}`;
  }

  renderModal() {
    switch (this.state.status) {
      case 'notice':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Start transfer</p>
            </div>
            <div className="swash-transaction-modal-body">
              {this.state.withdrawType === 'sponsorWithdraw' ? (
                <>
                  <p>You have reached the minimum balance needed for us to cover transaction fees for you.</p>
                  <p>
                    Current transaction fee is <span className="swash-text-green">{this.purgeNumber(this.state.transactionFee)}</span> ETH that we
                    will pay for you.
                  </p>
                </>
              ) : (
                <>
                  <p>You haven&apos;t reached the minimum balance needed for us to cover transaction fees for you.</p>
                  <p>
                    If you want to proceed with the transaction, you need{' '}
                    <span className="swash-text-green">{this.purgeNumber(this.state.transactionFee)}</span> ETH in your Swash wallet to cover the gas
                    fee.
                  </p>
                </>
              )}
            </div>
            <div className="swash-transaction-modal-footer">
              <div className="swash-transaction-modal-footer-right">
                <div className="swash-transaction-modal-button" onClick={this.proceed}>
                  Proceed
                </div>

                <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      case 'confirmed':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Transfer completed</p>
            </div>
            <div className="swash-transaction-modal-body swash-transaction-modal-body-large">
              <img src={verified} alt={'Verified'} />
              <p>
                Verify your transaction on{' '}
                <a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${this.state.transactionId}`}>
                  Etherscan
                </a>
              </p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Transfer failed</p>
            </div>
            <div className="swash-transaction-modal-body swash-transaction-modal-body-large">
              <img src={error} alt={'Error'} />
              <p>Reason: {this.state.failedReason}</p>
            </div>
          </div>
        );
      case 'init':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="swash-transaction-modal-body">
              <div className="swash-transaction-modal-body-left">
                <div className="swash-transaction-modal-body-text1">Send</div>
                <div className="swash-transaction-modal-body-text2">
                  <span className="swash-transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="swash-transaction-modal-body-middle">
                <img src={arrow} alt={'Arrow'} />
              </div>
              <div className="swash-transaction-modal-body-right">
                <div className="swash-transaction-modal-body-text1">To address</div>
                <div className="swash-transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="swash-transaction-modal-footer">
              <div className="swash-transaction-modal-footer-right">
                <div className="swash-transaction-modal-button" onClick={this.withdraw}>
                  Confirm and send
                </div>

                <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      case 'waiting':
        return (
          <div>
            <div className="swash-transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="swash-transaction-modal-body">
              <div className="swash-transaction-modal-body-left">
                <div className="swash-transaction-modal-body-text1">Send</div>
                <div className="swash-transaction-modal-body-text2">
                  <span className="swash-transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="swash-transaction-modal-body-middle">
                <img src={arrow} alt={'Arrow'} />
              </div>
              <div className="swash-transaction-modal-body-right">
                <div className="swash-transaction-modal-body-text1">To address</div>
                <div className="swash-transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="swash-transaction-modal-footer">
              <div className="swash-transaction-modal-footer-right">
                <div className="swash-transaction-modal-button swash-transaction-modal-button-waiting">
                  Sending...                  
                </div>
                <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return '';
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-transaction-modal">{this.renderModal()}</div>
        </React.Fragment>
      </div>
    );
  }
}

export default TransferModal;
