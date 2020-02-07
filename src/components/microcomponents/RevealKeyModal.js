import React from 'react'
import verified from '../../statics/images/verified.svg';
import arrow from '../../statics/images/arrow.svg';

class RevealKeyModal extends React.Component {
  constructor(props) {
  super(props);
    this.state = {
		opening: this.props.opening,
		copyPrivateKey: this.props.functions.copy,
		revealPrivateKey: this.props.functions.reveal,
    };	
  }
  
  
  render() {
    return (
      <div className="d-flex justify-content-center">
			<React.Fragment>
				<div className="transaction-modal">
					<div>
						<div className="transaction-modal-header">
							<p>Are You Sure?</p>
						</div>
						<div className="transaction-modal-body">
							<div className="modal-body-text">
								Be careful with your private keys, as anyone with your keys controls your tokens.				
							</div>
						</div>
						<div className="transaction-modal-footer">							
							<div className="transaction-modal-footer-right">
								<div className='transaction-modal-button' onClick={(e) => {this.state.copyPrivateKey(e); this.state.opening(e)}}>Yes, copy keys</div>
								<div className='transaction-modal-button-cancel' onClick={this.state.opening}>Cancel</div>
							</div>
						</div>
					</div>					
				</div>					                    
			</React.Fragment>
		</div>
    );
  }
}
export default RevealKeyModal;