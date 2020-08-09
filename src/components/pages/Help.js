import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import help1 from '../../statics/images/help1.png';
import help2 from '../../statics/images/help2.png';
import help3 from '../../statics/images/help3.png';
import help4 from '../../statics/images/help4.png';
import help5 from '../../statics/images/help5.png';

import help7 from '../../statics/images/help7.png';

class HelpPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div id="help-page" className="swash-col">
        <React.Fragment>
          <div className="swash-col">
            <div className="setting-part">
              <div className="swash-head">Welcome to Swash</div>
              <div className="swash-p">
                Swash is a browser extension that pays you to surf the web. Swash can do more than typical browser extensions as it can also call APIs
                on behalf of the user and send this data to Streamr to monetize it.
              </div>

              <div className="swash-head2">Getting Started</div>
              <div className="swash-p">
                Swash can be enabled or disabled via the switch in the popover window. A green icon shows the app is running. Your earned balance in
                DATA is shown here too. The icons give quick access to Settings, Data and Help views.
              </div>

              <img alt="" src={help1} />
              <div className="image-caption">Swash installed and enabled</div>

              <div className="swash-p">
                Once you've installed Swash, it will generate an ethereum wallet address for you where you can receive payments in Streamr's native
                token,{' '}
                <a target="_blank" rel="noreferrer" href="https://etherscan.io/token/0x0cf0ee63788a0849fe5297f3407f701e122cc023">
                  DATA
                </a>
                . You can withdraw these payments and exchange them for other cryptocurrency or plain old cash through various exchanges, such as
                Coinbase or Binance. For more information, see Payments and Withdrawals below.
              </div>

              <img alt="" src={help2} />
              <div className="image-caption">Swash’s Earnings section shows balances, address and withdrawal functions</div>

              <div className="swash-p">
                Swash uses a modular approach to its data gathering functionality. By default, Search module is enabled, which will gather data when
                you are searching on a variety of search engines. You can adjust the settings of these modules in the Settings page under Choose data
                to capture. You can also choose to enable other modules that gather more fine grained data for a range of popular sites.
              </div>

              <img alt="" src={help3} />
              <div className="image-caption">Default data collection modules, Browse and Search</div>

              <div className="swash-p">
                You can also control how much information the modules can gather by adjusting the Privacy settings slider. This enables you to
                anonymize your data to some general level. For more information, see <AnchorLink href="#privacySettings">Privacy Settings</AnchorLink>{' '}
                section. If you want to prevent specific pieces of information or specific web domains or URLs from being captured, you can do this on
                the Advanced page.
              </div>

              <img alt="" src={help4} />
              <div className="image-caption">The Privacy settings slider gives you three levels of privacy options</div>

              <div className="swash-p">
                Once Swash is gathering data, it appears in the Data page, where you can inspect it if you would like to. By default, Swash adds a 2
                minute delay in sending the data, giving you a window to delete captured sessions you would rather not send. This delay can be set to
                whatever you want.
              </div>

              <img alt="" src={help5} />
              <div className="image-caption">Delete any captured session from the Data view before the delay progress bar reaches the end</div>

              <div className="swash-head">Capture Modules</div>

              <div className="swash-p2">
                Swash is a modular extension and, aside from its default modules for Browse and Search it currently provides optional modules for
                Facebook, Amazon, Twitter, Spotify and Youtube. These modules provide for some fine grained data capture on those websites.
              </div>

              <div className="swash-head2">Search</div>
              <div className="swash-p2">
                Search engine module supports six top search engines: Google, Bing, Yahoo, AOL, Ask, Baidu.
                <p>You can choose to enable various functionality for one or all of them.</p>
              </div>

              <div className="swash-head2">Facebook</div>
              <div className="swash-p2">
                The Facebook module is more complicated. It can capture the user's data in three ways. One is through a web request listener. Another
                is via injected Javascript on Facebook pages and a third way is to use Facebook’s API. The basic module can capture the user's visited
                Facebook pages and searches, but the Facebook API is required to capture books, videos, televisions, pages, and other
                Facebook-specific data.
              </div>

              <div className="swash-head2">Amazon</div>
              <div className="swash-p2">
                Amazon is another interesting module that captures the user's visited pages and searches on Amazon. Clicked links, items added to
                cart, items ready to buy and items added to a wishlist can also be captured by this module.
              </div>

              <div className="swash-head2">Twitter</div>
              <div className="swash-p2">
                User's post tweet and searches, follow and unfollow actions, mute and unmute actions, likes, and retweets can be captured by the
                Twitter module.
              </div>

              <div className="swash-head2">Youtube</div>
              <div className="swash-p2">
                This module can capture watched videos, subscriptions, channels, playlists and any activities done on the Youtube platform.
              </div>

              <div className="swash-head2">Spotify</div>
              <div className="swash-p2">
                This module captures the user's Spotify profile, saved tracks and albums, current playlists and playbacks, currently playing and
                recently played songs, and the artists that the user has followed.
              </div>

              <div id="privacySettings" className="swash-head">
                Privacy Settings
              </div>
              <div className="swash-p">
                We designed a simple privacy model as you see in the table shown below. The first column of the table shows different data types that
                we have identified so far and the first row of the table shows privacy levels that have been defined for Swash. At the lowest level,
                Swash assures no privacy. In Medium Privacy Level, Swash masks URL path names, reduces time precision by removing hours from time and
                for texts it removes user information from texts. In High Level, it removes URL path names, removes days from the time and removes all
                texts that have user's information.
              </div>

              <div className="help-table">
                <MDBTable>
                  <MDBTableHead>
                    <tr className="table-head-row">
                      <th className="table-text table-head-text help-table-data-type-th">Data Type</th>
                      <th className="table-text table-head-text help-table-no-privacy-th">No Privacy</th>
                      <th className="table-text table-head-text help-table-medium-privacy-th">Medium Privacy</th>
                      <th className="table-text table-head-text help-table-high-privacy-th">High Privacy</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    <tr className="table-row">
                      <td className="table-text table-head-text">URL</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Mask path name</td>
                      <td className="table-text">Remove path name and query strings</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">Time</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Remove hours</td>
                      <td className="table-text">Remove days and months</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">TimeString</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Remove hours</td>
                      <td className="table-text">Remove days and months</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">Text</td>
                      <td className="table-text">Replace masked text with '*'</td>
                      <td className="table-text">Replace masked text with null</td>
                      <td className="table-text">Remove texts that has masked text</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">Id</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Mask</td>
                      <td className="table-text">Remove Id</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">UserInfo</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Mask</td>
                      <td className="table-text">Remove User information</td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-text table-head-text">UserAttr</td>
                      <td className="table-text">No changes</td>
                      <td className="table-text">Mask</td>
                      <td className="table-text">Remove User attributes</td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </div>

              <div className="swash-head">Information Disclosure</div>

              <div className="swash-p">
                To prevent information disclosure we designed a filtering mechanism that uses a regular expression, wildcard, and exact matching
                method to filter all data that contain blacklist patterns.
              </div>

              <div className="swash-head">Swash engine</div>

              <div className="swash-p">
                The picture shown below, summarizes the architecture of Swash engine. At the lowest layer, each module gathers a specific type of data
                and passes it to the User Consent Policy layer. The second layer checks whether this data complies with user consent policy or not.
                <p>
                  If data complies, the extension forwards it to the upper layer. In the third layer data filters give users the ability to exclude
                  some domains and URLs from their data being collected. In the upper layer, Privacy Level applies to data and based on the level of
                  the privacy that has been chosen by the user, a transformation may be applied on the data before being sent to the Streamr network.
                </p>
              </div>

              <img alt="" src={help7} style={{marginBottom: '102px'}} />

              <div className="swash-head">What makes us different?</div>

              <div className="swash-p">
                A comparison between the way Swash collects data and the way giant data collectors collect data, shows some major differences:
                Firstly, unlike giant data collectors, users can configure which data they want to be sent to Streamr. Then, by using Swash, the user
                gets paid for all data he/she provides to sell, but giant data collectors never share revenue of selling data. Next, Swash users are
                anonymous and the user identity is anonymized before sending data, but giant data collectors has profiled users. Moreover, Swash is
                not limited to data regarding a specific business and it can collects a combination of user's data that none of these companies have
                all these data together. As Swash is installed on the user side, it can collect some other interesting data that giant data collectors
                do not have access.
              </div>

              <div className="graybox">
                <div className="swash-head3">Giant data collectors</div>
                <ul>
                  <li>Users are not asked to provide consent</li>
                  <li>User will not get paid for his own data</li>
                  <li>User identity is known for giant data collectors</li>
                  <li>Every data collector has user data regarding their business</li>
                  <li>Data collectors can just collect user data that has been sent to them</li>
                </ul>
              </div>
              <div className="graybox">
                <div className="swash-head3">Swash</div>
                <ul>
                  <li>Users can configure which data they want to be sent</li>
                  <li>User gets paid for all data they provide to sell</li>
                  <li>Swash never reveals the user identity unless the users gives permission to do so</li>
                  <li>Swash collects a combination of user data</li>
                  <li>Swash is on the user side and it can collect more data</li>
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
