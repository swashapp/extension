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
          <div className="swash-transaction-modal">
            <div>
              <div className="swash-transaction-modal-header">
                <p>Are You Sure?</p>
              </div>
              <div className="swash-transaction-modal-body">
                <div className="swash-modal-body-text">Be careful with your private keys, as anyone with your keys controls your tokens.</div>
              </div>
              <div className="swash-transaction-modal-footer">
                <div className="swash-transaction-modal-footer-right">
                  <div
                    className="swash-transaction-modal-button"
                    onClick={(e) => {
                      this.state.revealFunction(e);
                      this.state.opening(e);
                    }}>
                    Yes, {this.state.text} keys
                  </div>
                  <div className="swash-transaction-modal-button-cancel" onClick={this.state.opening}>
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
