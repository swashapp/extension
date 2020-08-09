import React from 'react';
import verified from '../../statics/images/verified.svg';
import error from '../../statics/images/error-icon.svg';
import arrow from '../../statics/images/arrow.svg';
import loading from '../../statics/images/loading.png';

class TransferModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      opening: this.props.opening,
      transactionId: this.props.tx,
      amount: this.props.amount,
      recipient: this.props.recipient,
      failedReason: '',
    };
    this.withdraw = this.withdraw.bind(this);
  }

  withdraw() {
    this.setState({status: 'waiting'});
    //window.helper.withdrawTo(this.state.recipient, this.state.amount).then(tx => {
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

  purgeAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(37, 42)}`;
  }

  renderModal() {
    switch (this.state.status) {
      case 'confirmed':
        return (
          <div>
            <div className="transaction-modal-header">
              <p>Transfer completed</p>
            </div>
            <div className="transaction-modal-body transaction-modal-body-large">
              <img src={verified}></img>
              <p>
                Verify your transaction on{' '}
                <a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${this.state.transactionId}`}>
                  Etherscan
                </a>
              </p>
            </div>
          </div>
        );
        break;
      case 'failed':
        return (
          <div>
            <div className="transaction-modal-header">
              <p>Transfer failed</p>
            </div>
            <div className="transaction-modal-body transaction-modal-body-large">
              <img src={error}></img>
              <p>Reason: {this.state.failedReason}</p>
            </div>
          </div>
        );
        break;

      case 'init':
        return (
          <div>
            <div className="transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="transaction-modal-body">
              <div className="transaction-modal-body-left">
                <div className="transaction-modal-body-text1">Send</div>
                <div className="transaction-modal-body-text2">
                  <span className="transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="transaction-modal-body-middle">
                <img src={arrow} />
              </div>
              <div className="transaction-modal-body-right">
                <div className="transaction-modal-body-text1">To address</div>
                <div className="transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="transaction-modal-footer">
              <div className="transaction-modal-footer-right">
                <div className="transaction-modal-button" onClick={this.withdraw}>
                  Confirm and send
                </div>

                <div className="transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case 'waiting':
        return (
          <div>
            <div className="transaction-modal-header">
              <p>Confirm DATA transfer</p>
            </div>
            <div className="transaction-modal-body">
              <div className="transaction-modal-body-left">
                <div className="transaction-modal-body-text1">Send</div>
                <div className="transaction-modal-body-text2">
                  <span className="transaction-modal-body-text3">{this.state.amount}</span> DATA
                </div>
              </div>
              <div className="transaction-modal-body-middle">
                <img src={arrow} />
              </div>
              <div className="transaction-modal-body-right">
                <div className="transaction-modal-body-text1">To address</div>
                <div className="transaction-modal-body-text3">{this.purgeAddress(this.state.recipient)}</div>
              </div>
            </div>
            <div className="transaction-modal-footer">
              <div className="transaction-modal-footer-right">
                <div className="transaction-modal-button transaction-modal-button-waiting">
                  Sending...
                  <img src={loading} />
                </div>
                <div className="transaction-modal-button-cancel" onClick={this.state.opening}>
                  Cancel
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="transaction-modal">{this.renderModal()}</div>
        </React.Fragment>
      </div>
    );
  }
}

export default TransferModal;
