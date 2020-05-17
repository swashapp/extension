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
            dataBalance: '$',
            dataAvailable: '$',
			cumulativeEarnings: '$',
			withdrawState: false,
			transferModal: false,
			revealKeyModal: false,
			disableTransfer: true,
			recipient: '',
			recipientEthBalance: '$',
			recipientDataBalance: '$',
			revealFunction: {func: this.copyToClipboard, text: 'copy'}
        };
        this.balanceCheckInterval = 0;
		this.openModal = this.openModal.bind(this);
		this.copyToClipboard = this.copyToClipboard.bind(this);
		this.revealPrivateKey = this.revealPrivateKey.bind(this);
		this.pasteWallet = this.pasteWallet.bind(this);
		this.getBalanceInfo = this.getBalanceInfo.bind(this);
		this.loadSettings = this.loadSettings.bind(this);
		this.transfer = this.transfer.bind(this);	
		this.onAmountChange = this.onAmountChange.bind(this);
    }

     
    componentDidMount() {
        this.balanceCheckInterval = setInterval(() => this.getBalanceInfo(this), 15000);
        this.loadSettings().then(this.getBalanceInfo);        
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        clearInterval(this.balanceCheckInterval);
    }

    purgeNumber(num) {
        if(num.indexOf('.') < 0)
            return num;
        return num.slice(0, num.indexOf('.') + 5)
    }

    async loadSettings() {        
        return window.helper.load().then(db => {        
            return window.helper.decryptWallet(db.profile.encryptedWallet, db.configs.salt).then(keyInfo => {                
                this.setState({
                    keyInfo: keyInfo,
                })
            })	            
        });
    }

	transfer(e) {		
		let amount = document.querySelector("#amount").value;
		let recipient = document.querySelector("#recipient").value;
		if(!amount.match(/^[0-9]+(\.[0-9]+)?$/)) {
			this.refs.notify.handleNotification('Amount value is not valid', 'failure');
			return;
		}
		
		if(!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
			this.refs.notify.handleNotification('Recipient address is not valid', 'failure');
			return;
		}
		this.openModal('Transfer');							
	}
	
	openModal(name) {
		switch(name) {
			case 'Transfer':
				this.setState({transferModal: !this.state.transferModal});
				break;
			case 'RevealKey':
				if(this.isPrivateKeyRevealed()) {
					this.revealPrivateKey();
					this.forceUpdate();					
				}
				else
					this.setState({revealKeyModal: !this.state.revealKeyModal, revealFunction: {func: this.revealPrivateKey, text: 'reveal'}});
				break;
			case 'CopyKey':
				this.setState({revealKeyModal: !this.state.revealKeyModal, revealFunction: {func: (e) => {						
						let pKey = document.getElementById("privateKey");
						let pKeyType = pKey.type;
						pKey.type = "text";
						this.copyToClipboard(e, document.getElementById("privateKey"));
						pKey.type = pKeyType;
					}, text: 'copy'}
				});					
				break;
		}
	}
	
    async getBalanceInfo() {
        let dataBalance = await window.helper.getDataBalance(this.state.keyInfo.address);
        dataBalance = (dataBalance.error || dataBalance === '' || dataBalance === 'undefined' || typeof(dataBalance) ==='undefined') ?this.state.dataBalance:dataBalance
        let dataAvailable = await window.helper.getAvailableBalance();		
        dataAvailable = dataAvailable.error || dataAvailable === ''|| typeof(dataAvailable) === 'undefined'?this.state.dataAvailable:dataAvailable
        let cumulativeEarnings = await window.helper.getCumulativeEarnings();		
        cumulativeEarnings = cumulativeEarnings.error || cumulativeEarnings === ''|| typeof(cumulativeEarnings) === 'undefined'?this.state.cumulativeEarnings:cumulativeEarnings		
        if(dataBalance !== this.state.dataBalance || dataAvailable !== this.state.dataAvailable)
            this.setState({
                dataBalance: this.purgeNumber(dataBalance),
                dataAvailable: this.purgeNumber(dataAvailable),
				cumulativeEarnings: this.purgeNumber(cumulativeEarnings)
            })        
    }
    	
	
	onAmountChange(e) {
		let val = e.target.value;
		let btn = document.querySelector("#transfer-button")
		if(val > this.state.dataAvailable || this.state.dataAvailable == '0.0') {
			this.setState({disableTransfer: true});
			return;
		}
		this.setState({disableTransfer: false});
	}
	
	copyToClipboard(e, element) {            
		element.select();
		document.execCommand("copy");		
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
	
	isPrivateKeyRevealed() {
		var x = document.getElementById("privateKey");
		if(!x)
			return false;
		if (x.type === "password")
			return false;
		return true;
	}

	pasteWallet(e) {		
		e.preventDefault();
		navigator.clipboard.readText().then(async address => {
		if(address.match(/^0x[a-fA-F0-9]{40}$/g)){
				document.querySelector("#recipient").value = address;
				let DataBalance = await window.helper.getDataBalance(address);
				let EthBalance = await window.helper.getEthBalance(address);
				this.setState({recipient: address, recipientDataBalance: DataBalance, recipientEthBalance: EthBalance});
			}
		})		
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
                                 <RDropdownMenu className="button form-input-button reveal-button" items={[{text: this.isPrivateKeyRevealed()? 'Hide':'Reveal', callback: () => this.openModal('RevealKey')}, {text: 'Copy', callback: () => this.openModal('CopyKey')}]} ref='keyRevealMenu'/>
							</div>
						</div>
						<div className="setting-part">
							<div className="swash-head">Withdraw your DATA</div>
							<div className="swash-p">
								New earnings are frozen for 48 hours as an anti-fraud measure. You can withdraw your available balance. We don’t recommend leaving too much DATA in the Swash wallet.												
							</div>  
							<div className="transfer-row">
								<div className="transfer-column amount-column">
									<div className="form-caption">Amount</div>
									<div>
										<input type="text" id="amount" placeholder={this.state.dataAvailable} onChange={this.onAmountChange} className="form-input  filter-input" />
									</div>
								</div>
								
								<div className="transfer-column wallet-column">
									<div className="form-caption">Recipient Ethereum address</div>
									<div>
										<input type="text" id="recipient" placeholder={this.state.keyInfo.address.substr(0,7) + "..."} onContextMenu={this.pasteWallet} className="form-input  filter-input" />
									</div>
								</div>
								
								<div className="transfer-column button-column" style={{marginRight: '0px'}}>
									{this.state.disableTransfer?
										<a id="transfer-button" className="transfer-link-button transfer-link-button-disabled" onClick={() => {return false}}>Transfer</a>:						
										<a id="transfer-button" className="transfer-link-button" onClick={this.transfer}>Transfer</a>
									}
								</div>
							</div>
							{this.state.recipient? 
								<div className="transfer-row">
									<div className="transfer-column amount-column">									
									</div>
									<div className="transfer-column wallet-column">
										<ul>
											<li>Same as address on your clipboard</li>
											<li>Owns {this.purgeNumber(this.state.recipientEthBalance)} ETH, {this.purgeNumber(this.state.recipientDataBalance)} DATA</li>
										</ul>
									</div>
									
								</div>
								:''
							}
						</div>
                    </div>
					
					{
						this.state.transferModal?
							<div>
								<div onClick={(e) => {if (e.target == e.currentTarget) this.openModal('Transfer')}} className="swash-modal">
									<TransferModal status='init' amount={document.querySelector("#amount").value} recipient={document.querySelector("#recipient").value} opening={() => this.openModal('Transfer')}/>
								</div>							
							</div>
						:''
					}
					{
						this.state.revealKeyModal?<div>
							<div onClick={(e) => {if (e.target == e.currentTarget) this.openModal('CopyKey')}} className="swash-modal">
								<RevealKeyModal func={(e)=>{this.state.revealFunction.func(e,document.getElementById("privateKey"))}} text={this.state.revealFunction.text} opening={() => this.openModal('CopyKey')}/>
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