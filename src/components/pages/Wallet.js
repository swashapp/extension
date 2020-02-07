import React from 'react'
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import ModuleView from '../microcomponents/ModuleView';
import PrivacyLevel from '../microcomponents/PrivacyLevel';
import TransferView from '../microcomponents/TransferView';
import TransferModal from '../microcomponents/TransferModal';
import RevealKeyModal from '../microcomponents/RevealKeyModal';



class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keyInfo: {address:'', privateKey: ''},
            dataBalance: '0.00',
            dataAvailable: '0.00',
			cumulativeEarnings: '0.00',
			withdrawState: false,
			transferModal: false,
			revealKeyModal: false,
        };
        this.balanceCheckInterval = 0;
		this.openModal = this.openModal.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.revealPrivateKey = this.revealPrivateKey.bind(this);
    }

     
    componentDidMount() {
        this.balanceCheckInterval = setInterval(() => this.getBalanceInfo(this), 15000);
        this.getBalanceInfo();
        this.loadSettings();
        window.scrollTo(0, 0);
    }

    componentDidUnmount() {
        clearInterval(this.balanceCheckInterval);
    }

    purgeNumber(num) {
        if(num.indexOf('.') < 0)
            return num;
        return num.slice(0, num.indexOf('.') + 5)
    }

    loadSettings() {        
        window.helper.load().then(db => {        
            window.helper.decryptWallet(db.configs.encryptedWallet, db.configs.salt).then(keyInfo => {                
                this.setState({
                    keyInfo: keyInfo,
                })
            })	            
        });
    }

	openModal(name) {
		switch(name) {
			case 'Transfer':
				this.setState({transferModal: !this.state.transferModal});
				break;
			case 'RevealKey':
				this.setState({revealKeyModal: !this.state.revealKeyModal});
				break;
		}
	}
	
    async getBalanceInfo() {
        let dataBalance = await window.helper.getDataBalance();
        dataBalance = (dataBalance === '' || dataBalance === 'undefined' || typeof(dataBalance) ==='undefined') ?'0.00':dataBalance
        let dataAvailable = await window.helper.getAvailableBalance();		
        dataAvailable = dataAvailable === ''|| typeof(dataAvailable) === 'undefined' || dataAvailable.error?'0.00':dataAvailable
        let cumulativeEarnings = await window.helper.getCumulativeEarnings();		
        cumulativeEarnings = cumulativeEarnings === ''|| typeof(cumulativeEarnings) === 'undefined' || cumulativeEarnings.error?'0.00':cumulativeEarnings		
        if(dataBalance !== this.state.dataBalance || dataAvailable !== this.state.dataAvailable)
            this.setState({
                dataBalance: this.purgeNumber(dataBalance),
                dataAvailable: this.purgeNumber(dataAvailable),
				cumulativeEarnings: this.purgeNumber(cumulativeEarnings)
            })        
    }
    
	withdraw(ref) {
		ref.setState({withdrawState: true});
		window.helper.withdraw().then(tx => {
			ref.setState({withdrawState: false});
			ref.refs.notify.handleNotification(`<a target="_blank" href=https://etherscan.io/tx/${tx.hash}>See the transaction details</a>`, 'success'); 
			tx.wait().then(x => {
				ref.refs.notify.handleNotification("Transaction completed successfully", 'success');
			})
		}, reason => {
			ref.setState({withdrawState: false});			
			ref.refs.notify.handleNotification(reason.message, 'error');			
		})				
	}	   
	
	copyToClipboard(e, element) {            
		this.revealPrivateKey(e);
		element.select();
		document.execCommand("copy");
		this.revealPrivateKey(e);
		element.blur();    
		this.refs.notify.handleNotification('Copied successfully', 'success');                    
	}

	revealPrivateKey(e) {
		var x = document.getElementById("privateKey");
		if (x.type === "password") {
		  x.type = "text";
		} else {
		  x.type = "password";
		}
	} 

    render() {
                    
       
     
      
        return (
            <div id="settings-page" className="swash-col">				
                <React.Fragment>
                    <div className="swash-col">
					
                        <div className="setting-part">                                                        
                            <div className="balance-block">
								<div className="swash-row">
									<div className="balance-text">
										<div className="balance-text-bold">{this.state.dataBalance}</div> DATA balance
									</div> 
								</div>
								<div className="swash-row">
									<div className="balance-text">
										<div style={{width: '50%', float: 'left'}}>
											<div className="balance-text-bold">{this.state.dataAvailable}</div> DATA available
										</div>
										<div style={{width: '50%', float: 'left', paddingLeft: '9%'}}>
											<div className="balance-cumulative">{this.state.cumulativeEarnings}</div> Cumulative earnings
										</div>
									</div>                                 
									
								</div>
                            </div>
							
							
                        </div>
                        <div className="setting-part">
							<div className="form-caption">Wallet address</div>
							<div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="walletAddress" value={this.state.keyInfo.address}/>
                                <button className="form-input-button" onBlur={(e) => {e.target.innerText="Copy"}} onClick={(e) => {this.copyToClipboard(e, document.getElementById("walletAddress"));e.target.focus();e.target.innerText="Copied"}}>Copy</button>
                            </div>
                            <div className="form-caption">Private key </div>
                            <div style={{position: 'relative'}}>
                                <input type="password" className="form-input" id="privateKey" value={this.state.keyInfo.privateKey}/>
                                 <RDropdownMenu className="button form-input-button reveal-button" items={[{text: 'Reveal', callback: () => this.openModal('RevealKey')}, {text: 'Copy', callback: () => this.openModal('RevealKey')}]} ref='keyRevealMenu'/>
							</div>
						</div>
						<div className="setting-part">
							<div className="swash-head">Transfer your DATA</div>
							<div className="swash-p">
								New earnings are frozen for 48 hours as an anti-fraud measure. You can withdraw your available balance. We don’t recommend leaving too much DATA in the Swash wallet.												
							</div>  
							<div className="transfer-row">
								<div className="transfer-column amount-column">
									<div className="form-caption">Amount to send</div>
									<div>
										<input type="text" id="amount" placeholder="27.2" className="form-input  filter-input" />
									</div>
								</div>
								
								<div className="transfer-column wallet-column">
									<div className="form-caption">Recipient Ethereum address</div>
									<div>
										<input type="text" id="recipient" placeholder="0x1234" className="form-input  filter-input" />
									</div>
								</div>
								
								<div className="transfer-column button-column" style={{marginRight: '0px'}}>
									<a className="transfer-link-button" onClick={() => this.openModal('Transfer')}>Transfer</a>						
								</div>
							</div>
						</div>
                    </div>
					
					{
						this.state.transferModal?<div>
							<div onClick={(e) => {if (e.target == e.currentTarget) this.openModal('Transfer')}} className="swash-modal">
								<TransferModal status='confirming' opening={() => this.openModal('Transfer')}/>
							</div>
						</div>:''
					}
					{
						this.state.revealKeyModal?<div>
							<div onClick={(e) => {if (e.target == e.currentTarget) this.openModal('RevealKey')}} className="swash-modal">
								<RevealKeyModal functions={{copy: (e)=>{this.copyToClipboard(e,document.getElementById("privateKey"))}, reveal: this.revealPrivateKey}} opening={() => this.openModal('RevealKey')}/>
							</div>
						</div>:''
					}
                </React.Fragment>
                <CustomSnackbar
                    ref='notify'
                />        
            </div>
        );
    }
}

export default SettingsPage;