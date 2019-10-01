import React from 'react'
import '../../statics/css/custom-notifications.css';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';
import NotificationContainer from '../lib/notifications/NotificationContainer';
import NotificationManager from '../lib/notifications/NotificationManager';

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
import ModuleView from '../microcomponents/ModuleView';
import PrivacyLevel from '../microcomponents/PrivacyLevel';


class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {			
			privacyLevel: 0
		};
    }

    componentDidMount() {
        this.loadSettings();
        window.scrollTo(0, 0);
    }
      
    loadSettings() {
		window.helper.load().then(db => {				
            this.setState({privacyLevel: db.configs.privacyLevel})
		});
    }
	
    
    render() {
        const settings = {};
        const saveSettings = () => {
            let pushStatus = false; //document.getElementById('push').checked;
            let delay = this.state.delay;
            let email = document.getElementById('email').value;
            let wallet = document.getElementById('wallet').value;
            let data = {
                email: email,
                walletId: wallet
            };
            window.helper.saveProfile(data).then(() => {
                window.helper.saveConfigs({pushStatus: pushStatus, delay: delay}).then(() => {
                    if (pushStatus)
                        window.helper.subscribe();
                    else
                        window.helper.unsubscribe();
                    NotificationManager.success('Configuration is updated successfully', 'Update Configuration');
                })
            })
        };

        const changePrivacyLevel = (lvl) => {                    
            return window.helper.changePrivacyLevel(lvl).then(()=>{
              this.setState({isEnabled: !this.state.isEnabled})          
            }); 
        };
       
       
        const changeInput = (e) => {
            if (e.target.id === 'wallet') {
                this.setState({walletId: e.target.value})
            }
            if (e.target.id === 'email') {
                this.setState({email: e.target.value})
            }
        };
        
        let currentBalance1 = "48.92";
        let currentBalance2 = "36.67";
        let cumulativeEarnings="761.59";
        
        // let privacyTableDataRows = privacyTableData.map((row) => {
        //                             (<tr>                                    
        //                                 <td>{row.type}</td>
        //                                 <td>{row.data}</td>
        //                                 <td>{row.refreshed}</td>
        //                             </tr>)
        //                         });

        const modules = (this.props.resource)?(this.props.resource.map((module)=> {
                return (<ModuleView isOpened={false} module={module} />)
            })): (<></>);
        let currentLevel = 1; // TODO load dynamically 

        return (
            <div id="settings-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Earnings</div>
                            <div className="swash-p">Once your data is being purchased on the Streamr Marketplace, your earnings will appear here. 
                            New earnings are frozen for 48 hours as an anti-fraud measure. Balance available to withdraw is shown below. 
                            See the <a href="#/Help">docs</a> to learn more about private keys, balances and withdrawing. </div>
                            <div className="balance-block block-top-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{currentBalance1}</span> DATA balance</div> 
                                <div className="balance-cumulative">Cumulative earnings<br/>
<span>{cumulativeEarnings}</span></div>
                            </div>
                            <div className="balance-block withdraw-block block-bottom-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{currentBalance2}</span> DATA available</div> 
                                <div className="withdraw-btn"><a >Withdraw DATA</a></div>
                            </div>
                            <div className="form-caption">Wallet address</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input"/>
                                <button className="form-input-button">Copy</button>
                            </div>
                            <div className="form-caption">Private key </div>
                            <div style={{position: 'relative'}}>
                                <input type="password" className="form-input"/>
                                {/*<RevealButton className="form-input-button" />*/}
                                <button className="form-input-button more-button">...</button>
                            </div>
                        </div>
                    


                    
                        <div className="setting-part">
                            <div className="swash-head">Choose data to capture</div>
                            <div className="swash-p">To stream your web browsing behaviour, Swash uses a modular approach. By default, only 
the Browse module is on. You can also optionally enable other modules in order to capture specific data from a variety of other popular sites. Click any module to adjust settings.</div>
                        

                        <div>
                            {modules}
                        </div>

                        </div>
                    


                
                    <div className="setting-part">
                        <div className="swash-head">Set global privacy level</div>
                        <div className="swash-p">
This allows you to set privacy levels across all your modules. Adjust them to choose
the types of data you’d like to share and what to obscure or remove. You can also use the Advanced settings to block specific text (eg your name or address), sites and domains.</div>
                    

                        <PrivacyLevel level={this.state.privacyLevel} onChange={ (lvl)=> this.changePrivacyLevel(lvl) } />
                        </div>  
                </div>



                </React.Fragment>
                <NotificationContainer/>
            </div>
        );
    }
}

export default SettingsPage;