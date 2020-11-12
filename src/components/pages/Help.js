import React from 'react';
import help2 from '../../statics/images/help2.png';
import ReactPlayer from 'react-player';

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
              <div className="swash-p2">
                For Frequently Asked Questions,
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://swashapp.io/faq'}>
                  {' click here'}
                </a>
                .
              </div>
              <div className="swash-head">Welcome to the world’s first digital Data Union!</div>
              <div className="swash-p2">
                Swash is a browser extension that allows you to earn as you surf the web. It captures, pools, and sells data for you, making it
                possible for you to profit from your data directly.
              </div>
              <div className="swash-video">
                <ReactPlayer url={'https://youtu.be/pmH3yhkDiic'} width={'100%'} height={'100%'} controls={true} />
              </div>

              <div className="swash-head2">Getting Started</div>
              <div className="swash-p">
                You can switch Swash on or off using the switch in the popup window. The app is running when the icon is green. You can also see your
                balance and quick access icons to the Swash plugin.
                <br />
                <br />
                Once you’ve installed Swash, you can either create a new Ethereum wallet address or import your existing one. Payments are made to
                your wallet in Streamr’s native token,
                <a target={'_blank'} rel={'noopener noreferrer'} href={'https://etherscan.io/token/0x0cf0ee63788a0849fe5297f3407f701e122cc023'}>
                  {' DATA'}
                </a>
                . You can withdraw these earnings and exchange them for other cryptocurrencies or fiat currencies through various exchanges.
              </div>

              <img alt={''} src={help2} />
              <div className="swash-image-caption">Swash’s Earnings section shows balances</div>

              <div className="swash-head">What makes us different?</div>

              <div className="swash-p">
                Swash, unlike other data collectors, makes it possible for people to earn from their data. Typical data collectors make profits on the
                data they collect and sell while the people who generate that data receive nothing.
                <br />
                <br />
                Other data collectors often gather sensitive information and don’t care to protect the wellbeing of users who create that data. Swash
                works for these people, redistributing profits back to them and anonymising the data before it’s added to the Data Union.
                <br />
                <br />
              </div>

              <div className="swash-gray-box">
                <div className="swash-head3">Conventional data collectors:</div>
                <ul>
                  <li>Do not pay users for their data</li>
                  <li>Do not get consent from users</li>
                  <li>Keep users in the dark about what happens to their data</li>
                  <li>Know and share the users’ identity without caring about privacy</li>
                </ul>
              </div>
              <div className="swash-gray-box">
                <div className="swash-head3">Swash:</div>
                <ul>
                  <li>Pay users for the value of their data</li>
                  <li>Never reveal the identity of users</li>
                  <li>Gives users a way to control when Swash is enabled or not</li>
                  <li>Collects a cross-browser combination of data across different sites</li>
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
