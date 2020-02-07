import React from 'react'
import verified from '../../statics/images/verified.svg';
import arrow from '../../statics/images/arrow.svg';

class TransferModal extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
		status: this.props.status,
		opening: this.props.opening,
		transactionId: this.props.tx
    };
	this.confirmTransaction = this.confirmTransaction.bind(this);
  }
  
	confirmTransaction() {
		this.setState({status: 'confirmed'});
	}
  render() {
    return (
      <div className="d-flex justify-content-center">
			<React.Fragment>
				<div className="transaction-modal">
					{this.state.status === "confirmed"? 
						<div>
							<div className="transaction-modal-header">
								<p>Transfer completed</p>
							</div>
							<div className="transaction-modal-body transaction-modal-body-large">
								<img src={verified}></img>
								<p>
									Verify your transaction on <a href={"https://etherscan.com/?tx=" + this.transaction}>Etherscan</a>
								</p>							
							</div>
						</div>
						:						
						<div>
							<div className="transaction-modal-header">
								<p>Confirm DATA transfer</p>
							</div>
							<div className="transaction-modal-body">
								<div className="transaction-modal-body-left">
									<div className="transaction-modal-body-text1">Send</div>
									<div className="transaction-modal-body-text2">
										<span className="transaction-modal-body-text3">36.67</span> DATA										
									</div>
								</div>
								<div className="transaction-modal-body-middle">
									<img src={arrow} />
								</div>
								<div className="transaction-modal-body-right">
									<div className="transaction-modal-body-text1">To address</div>								
									<div className="transaction-modal-body-text3">0x7f46…fbc561</div>									
								</div>						
							</div>
							<div className="transaction-modal-footer">								
								<div className="transaction-modal-footer-right">
									<div className='transaction-modal-button' onClick={this.confirmTransaction}>Confirm and send</div>
									<div className='transaction-modal-button-cancel' onClick={this.state.opening}>Cancel</div>
								</div>
							</div>
						</div>
					}
				</div>					                    
			</React.Fragment>
		</div>
    );
  }
}
export default TransferModal;