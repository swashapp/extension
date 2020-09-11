import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import help1 from '../../statics/images/help1.png';
import help2 from '../../statics/images/help2.png';

class HelpPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div id="swash-help-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="swash-setting-part">
              <div className="swash-head">Welcome to the world’s first digital Data Union!</div>
              <div className="swash-p">
                Swash is a browser extension that makes it possible to earn as you surf the web. The data it captures is sent to a Data Union on your behalf, making it possible for you to sell and profit from your data directly.
              </div>

              <div className="swash-head2">Getting Started</div>
              <div className="swash-p">
                Swash can be enabled or disabled via the switch in the popup window. When it’s green, that means the app is running. You can also see your DATA balance and quick access icons to the Swash plugin.
              </div>

              <img alt={''} src={help1} />
              <div className="swash-image-caption">After Installation</div>

              <div className="swash-p">
                Once you&apos;ve installed Swash, you can either create an Ethereum wallet address or import your existing one. Payments are made to your wallet, which is in Streamr’s native token, 
                {' '}
                <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x0cf0ee63788a0849fe5297f3407f701e122cc023">
                  DATA
                </a>
                . You can withdraw these payments and exchange them for other cryptocurrencies or fiat currencies through various exchanges.
              </div>

              <img alt={''} src={help2} />
              <div className="swash-image-caption">Swash’s Earnings section shows balances</div>

              <div className="swash-head">What makes us different?</div>

              <div className="swash-p">
                Swash, unlike other data collectors, makes it possible for people to earn from their data. Typical data collectors make profits on the data they collect and sell while internet users receive nothing in return.
                <br></br>
                <br></br>
                Where conventional data collectors profile users and collect sensitive information, the identity of the Swash user is anonymised before the data is sent to the Data Union. 
                <br></br>
                <br></br>
                Swash isn’t limited to collecting data from a specific business but, rather, it can collect a variety of data across different sites and companies, allowing for unique insights that other data collectors lack.                
              </div>

              <div className="swash-gray-box">
                <div className="swash-head3">Conventional data collectors</div>
                <ul>
                  <li>Users are not able to give consent for data collection</li>
                  <li>Users are not paid for their own data</li>
                  <li>User identity is known and shared without consideration for privacy</li>
                  <li>Data collectors can just collect user data that has been sent to them</li>                  
                </ul>
              </div>
              <div className="swash-gray-box">
                <div className="swash-head3">Swash</div>
                <ul>
                  <li>Users get paid for all data they provide to sell</li>
                  <li>Swash never reveals the user identity unless the users gives permission to do so</li>
                  <li>Swash collects a combination of user data across sites</li>
                  <li>Users can control when Swash is enabled or not</li>                  
                </ul>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default HelpPage;
