import React from 'react'
import '../../statics/css/custom-notifications.css';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';

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
            modules: [],
            privacyLevel: 0,
            keyInfo: {address:'', privateKey: ''},
            dataBalance: '0.00',
            dataAvailable: '0.00',            
        };
        this.balanceCheckInterval = 0;
    }

     
    componentDidMount() {
        //this.balanceCheckInterval = setInterval(() => this.getBalanceInfo(this), 5000);
        this.getBalanceInfo();
        this.loadSettings();
        window.scrollTo(0, 0);
    }

    componentDidUnmount() {
        //clearInterval(this.balanceCheckInterval);
    }

    loadSettings() {        
        window.helper.load().then(db => {
            console.log("db: ", db);
            let modules = [];
            for(module in db.modules) {
                modules.push(db.modules[module]);
            }    
            window.helper.decryptWallet(db.configs.encryptedWallet, db.configs.salt).then(keyInfo => {
                console.log("keyInfo: ", keyInfo)
                this.setState({
                    privacyLevel: db.configs.privacyLevel,
                    keyInfo: keyInfo,
                    modules: modules
                })
            })	            
        });
    }

    async getBalanceInfo() {
        let dataBalance = await window.helper.getDataBalance();
        let dataAvailable = await window.helper.getAvailableBalance();
        this.setState({
            dataBalance: (dataBalance?'':'0.00',dataBalance),
            dataAvailable: (dataAvailable?'':'0.00',dataAvailable)
        })
        setTimeout(this.getBalanceInfo(), 5000)
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
                    //NotificationManager.success('Configuration is updated successfully', 'Update Configuration');
                })
            })
        };
       
       
        const changeInput = (e) => {
            if (e.target.id === 'wallet') {
                this.setState({walletId: e.target.value})
            }
            if (e.target.id === 'email') {
                this.setState({email: e.target.value})
            }
        };
        
        const copyToClipboard = (e, element) => {            
            element.select();
            document.execCommand("copy"); 
        }

        const revealPrivateKey = (e) => {
            var x = document.getElementById("privateKey");
            if (x.type === "password") {
              x.type = "text";
            } else {
              x.type = "password";
            }
        } 

        let cumulativeEarnings="761.59";
        
        // let privacyTableDataRows = privacyTableData.map((row) => {
        //                             (<tr>                                    
        //                                 <td>{row.type}</td>
        //                                 <td>{row.data}</td>
        //                                 <td>{row.refreshed}</td>
        //                             </tr>)
        //                         });

        const modules = (this.state.modules)?(this.state.modules.map((module)=> {
                return (<ModuleView isOpened={false} module={module} />)
            })): (<></>);
        

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
                                <div className="balance-text"><span className="balance-text-bold">{this.state.dataBalance}</span> DATA balance</div> 
                                <div className="balance-cumulative">Cumulative earnings<br/>
<span>{cumulativeEarnings}</span></div>
                            </div>
                            <div className="balance-block withdraw-block block-bottom-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{this.state.dataAvailable}</span> DATA available</div> 
                                <div className="withdraw-btn"><a onClick={this.loadSettings} >Withdraw DATA</a></div>
                            </div>
                            <div className="form-caption">Wallet address</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="walletAddress" value={this.state.keyInfo.address}/>
                                <button className="form-input-button" onClick={(e) => {copyToClipboard(e, document.getElementById("walletAddress"))}}>Copy</button>
                            </div>
                            <div className="form-caption">Private key </div>
                            <div style={{position: 'relative'}}>
                                <input type="password" className="form-input" id="privateKey" value={this.state.keyInfo.privateKey}/>
                                 <RDropdownMenu className="button form-input-button more-button" callbacks={[revealPrivateKey, (e)=>{copyToClipboard(e,document.getElementById("privateKey"))}]} ref='keyRevealMenu'/>                                
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
                    

                        <PrivacyLevel level={this.state.privacyLevel} />
                        </div>  
                </div>



                </React.Fragment>                
            </div>
        );
    }
}

export default SettingsPage;