import React from 'react'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,MDBModalBody,MDBModalHeader,
    MDBMask,MDBTable, MDBTableBody,
    MDBTableHead,MDBModalFooter,
    MDBCardImage,MDBModal,
    MDBCardBody,MDBContainer,
    MDBCardTitle,
    MDBCardText, MDBInput,
    MDBCardFooter,
    MDBBtn,
    MDBIcon
} from 'mdbreact';
import help1 from '../../statics/images/help1.png';
import help2 from '../../statics/images/help2.png';
import help3 from '../../statics/images/help3.png';
import help4 from '../../statics/images/help4.png';
import help5 from '../../statics/images/help5.png';

import help7 from '../../statics/images/help7.png';


class HelpPage extends React.Component {
    
    componentDidMount() {
  window.scrollTo(0, 0)
}
    
    render() {
        
        return (
            <div id="help-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Welcome to Swash</div>
                            <div className="swash-p">Swash is a browser extension that pays you to surf the web. Swash can do more than typical browser extensions as it can also call APIs on behalf of the user and send this data to Streamr to monetize it.</div>

                            <div className="swash-head2">Getting Started</div>
                            <div className="swash-p"> Swash can be enabled or disabled via the switch in the popover window. A green icon shows the app is running. Your earned balance in DATA is shown here too. The icons give quick access to Settings, Data and Help views.   </div>

                            <img src={help1}/>
                            <div className="image-caption">Swash installed and enabled</div>

                            <div className="swash-p">Once you've installed Swash, it will generate an ethereum wallet address for you where you can receive payments in Streamr's native token, DATA. You can withdraw these payments and exchange them for other cryptocurrency or plain old cash through various exchanges, such as Coinbase or Binance. For more, see Payments and Withdrawals below.</div>

                            <img src={help2}/>
                            <div className="image-caption">Swash’s Earnings section shows balances, address and withdrawal functions</div>

                            <div className="swash-p">Swash uses a modular approach to its data gathering functionality. By default, two modules, Browse and Search are enabled, which will gather data when you are browsing web pages and doing web searches on a variety of search engines. You can adjust the settings of these modules in the Settings page under Choose data to capture. You can also choose to enable other modules that gather more fine grained data for a range of popular sites.</div>


                            <img src={help3}/>
                            <div className="image-caption">Default data collection modules, Browse and Search</div>

                            <div className="swash-p">You can also control how much information the modules can gather by adjusting the Privacy settings slider. This enables you to anonymise your data to some general level. For more, see Privacy Settings below. If you want to prevent specific pieces of information or specific web domains or URLs from being captured, you can do this on the Advanced page.</div>

                            <img src={help4}/>
                            <div className="image-caption">The Privacy settings slider gives you three levels of privacy options</div>

                            <div className="swash-p">Once Swash is gathering data, it appears in the Data page, where you can inspect it if you would like to. By default, Swash adds a 2 minute delay in sending the data, giving you a window to delete captured sessions you would rather not send. This delay can be set to whatever you want. </div>

                            <img src={help5}/>    
                            <div className="image-caption">Delete any captured session from the Data view before the delay progress bar reaches the end</div>

                            <div className="swash-head">Capture Modules</div>

                            <div className="swash-p">Swash is a modular extension and, aside from its default modules for Browse and Search it currently provides optional modules for Facebook, Amazon, Twitter, and Youtube. These modules provide for some fine grained data capture on those websites.</div>

                            <div className="swash-head2">Search</div>
                            <div className="swash-p">Search engine module supports six top search engines: Google, Bing, Yahoo, AOL, Ask, Baidu.
                            <p>You can choose to enable various functionality for one or all of them.</p></div>

                            <div className="swash-head2">Facebook</div>
                            <div className="swash-p">The Facebook module is more complicated. It can capture the user's data in three ways. One is through a web request listener. Another is via injected Javascript on Facebook pages and a third way is to use Facebook’s API. The basic module can capture the user's visited Facebook pages and searches, but the Facebook API is required to capture books, videos, televisions, pages, and other Facebook-specific data. </div>

                            <div className="swash-head2">Amazon</div>
                            <div className="swash-p">Amazon is another interesting module that captures the user's visited pages and searches on Amazon. Clicked links, items added to cart, items ready to buy and items added to a wishlist can also be captured by this module. </div>

                            <div className="swash-head2">Twitter</div>
                            <div className="swash-p">User's post tweet and searches, follow and unfollow actions, mute and unmute actions, likes, and retweets can be captured by the Twitter module.  </div>

                            <div className="swash-head2">Youtube</div>
                            <div className="swash-p">This module can capture watched videoes, subscriptions, channels, playlists and any activities done on the Youtube platform.  </div>



                            <div className="swash-head">Privacy Settings</div>
                            <div className="swash-p"> We designed a simple privacy model as you see in the table shown below. The first column of the table shows different data types that we have identified so far and the first row of the table shows privacy levels that we have defined for our product. At the lowest level, we assure no privacy. In Low Privacy Level we nullify all parameters in URLs, reduce time precision by removing minutes from time and mask user info in all texts. In Medium Privacy Level, we Mask URL path names, reduce time precision by removing hours from time and for texts we remove user information from texts. In Medium High Level, we remove URL path names, remove days from the time and remove all texts that have user's information.</div>



                            <div className="help-table">
                                <MDBTable>
                                
                                    <MDBTableHead>
                                        <tr className="table-head-row">                               
                                            <th className="table-text table-head-text" style={{width: 111}}>Data Type</th>
                                            <th className="table-text table-head-text" style={{width: 127}}>No Privacy</th>
                                            <th className="table-text table-head-text" style={{width: 136}}>Low Privacy</th>
                                            <th className="table-text table-head-text" style={{width: 143}}>Medium Privacy</th>
                                            <th className="table-text table-head-text" style={{width: 159}}>High Privacy</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        <tr className="table-row">                                    
                                            <td className="table-text table-head-text">URL</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">Remove 
params value</td>
                                            <td className="table-text">Global Masking 
path name</td>
                                            <td className="table-text">Per module mask<br/>
- ing path name</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">Time</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">Remove 
minutes</td>
                                            <td className="table-text">Remove 
hours</td>
                                            <td className="table-text">Remove days 
of month</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">TimeString</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">Remove 
minutes</td>
                                            <td className="table-text">Remove 
hours</td>
                                            <td className="table-text">Remove days 
of month</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">Text</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text"></td>
                                            <td className="table-text">Replace user 
info with star</td>
                                            <td className="table-text">Remove user info 
from the text</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">Id</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">hash</td>
                                            <td className="table-text">Global 
masking</td>
                                            <td className="table-text">Per module 
masking</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">UserInfo</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">hash</td>
                                            <td className="table-text">Global 
masking</td>
                                            <td className="table-text">Per module 
masking</td>
                                        </tr><tr className="table-row">                                    
                                            <td className="table-text table-head-text">UserAttr</td>
                                            <td className="table-text">No changes</td>
                                            <td className="table-text">hash</td>
                                            <td className="table-text">Global 
masking</td>
                                            <td className="table-text">Per module 
masking</td>
                                        </tr>                              
                                    </MDBTableBody>
                                </MDBTable>
                            </div>



                            <div className="swash-head">Information Disclosure</div>

                            <div className="swash-p">To prevent information disclosure we designed a filtering mechanism that uses a regular expression, wildcard, and exact matching method to filter all data that contain blacklist patterns.</div>


                            <div className="swash-head">Two way Communication</div>

                            <div className="swash-p">as we said before, data buyer may like to have a way to communicate with data owner without user privacy violation. We provide two mechanisms for this purpose. One is a simple mechanism using an email address that does not reveal user identity. The second mechanism that we have implemented is a push mechanism which generates a push-ID for every user of community product and the user can share its push-ID with data buyers by enabling push mechanism. We created a separate stream for push mechanism through which data buyers can push data to this stream. Every instance of our community product that its push mechanism is enabled can receive its corresponding messages. </div>

                            <div className="swash-head2">Swash engine</div>

                            <div className="swash-p">The picture shown in this below, summarizes our idea about Surf-Streamr engine. At the lowest layer, each module gathers a specific type of data and passes it to the User Consent Policy layer. The second layer checks whether this data complies with user consent policy.
                            <p>If data complies, the extensoin forward it to the upper layer. In the third layer data filters give users the ability to exclude some domains and URLs from their data being collected. In the upper layer User, Privacy Level applies to data and based on the privacy level that has been chosen by the user, the only data that complies with the policy level will be passed to the Streamr.</p></div>


                            <img src={help7}/>    

                            <div className="swash-head">What makes us different?</div>

                            <div className="swash-p">If we want to compare the way we collect data and the way giant data collectors collect data, we can mention these cases: Firstly, unlike giant data collectors, we ask the user to approve every data we would send to Streamr. Then, by using Surf-Streamr, the user gets paid for every data he provides to sell, but giant data collectors never share revenue of selling data. Next, Surf-Streamr never reveals user identity unless the user gives permission, but user identity is known for the giant data collector. Moreover, we are not limited to data regarding a specific business and we can collect a combination of user's data that none of these companies have all these data together. As we are on the user side, we can collect some other interesting data that giant data collectors do not have access.</div>


                            <div className="graybox">
                                <div className="swash-head">Giant data collectors</div>
                                <ul>
                                    <li>User is not asked to provide a consent</li>
                                    <li>User will not get paid for his own data</li>
                                    <li>User identity is known for giant data collectors</li>
                                    <li>Every data collector has user data regarding their business</li>
                                    <li>Data collectors can just collect user data that has been sent to them</li>
                                </ul>
                                
                            </div>
                            <p> </p>
                            <div className="graybox">
                            <div className="swash-head">Swash</div>
                            <ul>
                                <li>We ask user to approve every data we want to send</li>
<li>Users get paid for every data they provide to sell</li>
<li>We never reveal user identity unless they give permission to do so</li>
<li>We collect a combination of user data</li>
<li>We are in the user side and we can collect more data</li>
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