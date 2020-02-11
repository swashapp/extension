import React from 'react'
import verified from '../../statics/images/verified.svg';
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
		recipient: this.props.recipient
    };
	this.withdraw = this.withdraw.bind(this);
  }
  	
	
	withdraw() {
		this.setState({status: 'waiting'});
		window.helper.withdrawTo(this.state.recipient).then(tx => {
			this.setState({status: 'confirmed'});
			this.setState({transactionId: tx.hash})
			tx.wait().then(x => {
			})
		}, reason => {
			this.setState({status: 'failed'});			
		})				
	}
	
	
	purgeAddress(address) {
		return `${address.slice(0,6)}...${address.slice(37,42)}`
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
									Verify your transaction on <a href={`https://etherscan.io/tx/${this.state.transactionId}`}>Etherscan</a>
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
									{this.state.status === 'waiting'?
										<div className='transaction-modal-button transaction-modal-button-waiting'>Sending...
											<img src={loading} />
										</div>:
										<div className='transaction-modal-button' onClick={this.withdraw}>Confirm and send</div>
									}
									
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