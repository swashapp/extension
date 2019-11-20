import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import { MDBProgress } from 'mdbreact';

import icon_open from '../../statics/images/active.svg'
import icon_closed from '../../statics/images/inactive.svg'

class TransferView extends React.Component {

  render() {
    var toAddress  = '0x123';


    return (
      <div>
        <div className="setting-part">
                            <div className="swash-head">Withdraw</div>
                            <div className="swash-p">In this section you can Withdraw your earned money to a wallet.</div>


                            <div className="form-caption">Wallet address</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="walletAddress" value={toAddress}/>
                                <button className="form-input-button" onClick={(e) => {}}>Select</button>
                            </div>


                            <div className="form-caption">Wallet address</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="walletAddress" value={toAddress}/>
                                <button className="form-input-button" onClick={(e) => {}}>Select</button>
                            </div>
                            
                        </div>
                     
      </div>
    );
  }
}

export default TransferView;