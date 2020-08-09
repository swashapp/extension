import React from 'react';

class RevealKeyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text,
      opening: this.props.opening,
      revealFunction: this.props.func,
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
                <div className="modal-body-text">Be careful with your private keys, as anyone with your keys controls your tokens.</div>
              </div>
              <div className="transaction-modal-footer">
                <div className="transaction-modal-footer-right">
                  <div
                    className="transaction-modal-button"
                    onClick={(e) => {
                      this.state.revealFunction(e);
                      this.state.opening(e);
                    }}>
                    Yes, {this.state.text} keys
                  </div>
                  <div className="transaction-modal-button-cancel" onClick={this.state.opening}>
                    Cancel
                  </div>
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
