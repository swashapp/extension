import React from 'react';
import PropTypes from 'prop-types'
import {Collapse} from 'react-collapse';
import CustomCheckBox from './CustomCheckBox';
import WalletDialog from './WalletDialog';
import icon_open from '../../statics/images/active.svg'
import icon_closed from '../../statics/images/inactive.svg'

class TransferView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpened: false, 
      toAddress: '',
      addressName: null,
      isDonate: false,
      isProfile: false,
      withdrawSuccessful: false,
      dataAvailable: 0,
      wallets: [],
      donateList: []
    };
    this.walletChange = this.walletChange.bind(this);
    this.handleWalletDialogClose = this.handleWalletDialogClose.bind(this);
  }

  componentDidMount() {
        window.scrollTo(0, 0);
        this.getWalletList();        
        this.getBalanceInfo();
        this.getDonateList()
    };

    async getDonateList(){
      var xhr = new XMLHttpRequest()
      let that = this;
      xhr.addEventListener('load', () => {
        const d = xhr.responseText;
        console.log(d)
        that.setState({ donateList: JSON.parse(d) })
      })
      xhr.open('GET', 'https://raw.githubusercontent.com/mabdi/swash-backend/master/donate-list.json?_=' + new Date().getTime())
      xhr.send()
    }

    async getWalletList(){
      let that = this;
        async function loader() {
            let wallets = await window.helper.loadWallets();
            let newWallets = [];
            for (let x in wallets) {
                newWallets.push({
                    'name': wallets[x].name,
                    'wallet': wallets[x].wallet,
                })
            }

            that.setState({ wallets: newWallets })
        }
        loader();
    }

    async getBalanceInfo() {
        // let dataBalance = await window.helper.getDataBalance();
        // dataBalance = (dataBalance === '' || dataBalance === 'undefined' || typeof(dataBalance) ==='undefined') ?'0.00':dataBalance
        let dataAvailable = await window.helper.getAvailableBalance();    
        dataAvailable = dataAvailable === ''|| typeof(dataAvailable) === 'undefined' || dataAvailable.error?'0.00':dataAvailable
        // let cumulativeEarnings = await window.helper.getCumulativeEarnings();   
        // cumulativeEarnings = cumulativeEarnings === ''|| typeof(cumulativeEarnings) === 'undefined' || cumulativeEarnings.error?'0.00':cumulativeEarnings   
        if(dataAvailable !== this.state.dataAvailable)
            this.setState({
                // dataBalance: this.purgeNumber(dataBalance),
                dataAvailable: this.purgeNumber(dataAvailable),
        // cumulativeEarnings: this.purgeNumber(cumulativeEarnings)
            })        
    }

  walletChange(e){
    this.setState({ toAddress: e.target.value, isDonate: false,isProfile: false, addressName: ''  });
  }


  handleWalletDialogClose(item){
    if(item){
    this.setState({ toAddress: item.wallet, isDonate: false,isProfile: true, addressName: item.name  });
    }
  }

  isValidAmount(amount){
    // format check
    // less than available data

    return true;
  }

  isValidAddress(address){
    // format check
    return true;
  }

  withdraw(ref) {
    ref.setState({withdrawState: true});
    const address = this.state.toAddress;
    const amount = document.getElementById("amountdata").value;
    if(!this.isValidAddress(address)) return; //TODO highlight error
    if(!this.isValidAmount(amount)) return; //TODO highlight error
		window.helper.withdrawFor(address, amount).then(tx => {
			ref.setState({withdrawState: false});
			ref.refs.notify.handleNotification(`<a target="_blank" href=https://etherscan.io/tx/${tx.hash}>See the transaction details</a>`, 'success'); 
      this.setState({withdrawSuccessful:true});
      tx.wait().then(x => {
        ref.refs.notify.handleNotification("Transaction completed successfully", 'success');
			})
		}, reason => {
			ref.setState({withdrawState: false});			
			ref.refs.notify.handleNotification(reason.message, 'error');			
		})				
  }
  
  purgeNumber(num) {
        if(num.indexOf('.') < 0)
            return num;
        return num.slice(0, num.indexOf('.') + 5)
    }

  saveWallet(toAddress){

  }

  getSuggestToAdd(toAddress, profileWallets){
    const ws = profileWallets.map((x) => x.wallet);
    if(ws.indexOf(toAddress) == -1){
      
      // window.scrollTo(0, tesNode.offsetTop);
      return (
        <div className="setting-part">
                <div className="swash-head">New wallet address</div>
                            <div className="swash-p">You can save this wallet address ({toAddress}) in your profile to use in future.</div>

                            <div className="form-caption">Give it a name</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="newwalletname"/>
                            </div>
                            <a className="linkbutton" style={{marginTop: 16}} onClick={() => this.saveWallet(toAddress)}>Save</a>
        </div>
      );
    }else{
      return ''
    }
  }

  render() {
    const profileWallets = this.state.wallets;
  
    var dataAvailable = this.state.dataAvailable;
    const {isOpened, toAddress, isDonate,isProfile, addressName, withdrawSuccessful} = this.state;
    let iconArrow = isOpened? icon_open: icon_closed;
    let classHeader = (isOpened)?"accordion-head accordion-head-open":"accordion-head";
    const donateList = this.state.donateList;
    const donates = donateList.map((obj, id) =>
      <a key={id} title={obj.name} onClick={(x)=>{ this.setState({toAddress: obj.wallet, addressName: obj.name, isDonate: true}) }} className="donate-item"><img width='64' height='64'  src={obj.icon}/></a>
    );
    // const addToProfile = (<div className="module-detail-view-checkbox">
    //   <label>
    //     <CustomCheckBox id='save_address' handleClick={(x) => {}} />
    //     <div className="label">Save this address for future use</div>
    //   </label>
    // </div>);
    const addressInfo = (isProfile || isDonate)? ((isDonate? 'Donate to ': 'Transfer to ') + addressName): ' ';
     const suggestAdding = ''; // withdrawSuccessful? this.getSuggestToAdd(toAddress, profileWallets) : '';
    //const suggestAdding = true? this.getSuggestToAdd(toAddress, profileWallets) : '';
    
    return (
      <div>
        <div className="setting-part">
                            <div className="swash-head">Transfer</div>
                            <div className="swash-p">In this section you can withdraw your earned money to a wallet.</div>

                            <div className="balance-block withdraw-block block-bottom-corner-radius block-top-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{dataAvailable}</span> DATA available to transfer</div> 
                            </div>



                            <div className="form-caption">Amount (DATA)</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="amountdata"/>
                                
                            </div>


                            <div className="form-caption" style={{marginTop: 32}}>Destination (Ethereum address)</div>
                            <div style={{position: 'relative'}}>
                                <input type="text" className="form-input" id="walletAddress" onChange={this.walletChange} value={toAddress}/>
                                <WalletDialog onClose={this.handleWalletDialogClose} items={profileWallets} />
                                
                            </div>
                            
                            <div className="swash-p" style={{marginBottom:32, height: 48}}>
                              {addressInfo}
                            </div>

                            <div>
                            <div className={classHeader} >
                              <div className='accordion-title'>I would like to donate</div>
                              
                              {/*<img src={this.props.message.icon} alt="" className="accordion-icon" />*/}
                              <div className="accordion-arrow" onClick={() => this.setState({isOpened: !isOpened})} ><img alt="" src={iconArrow}  /></div>
                              
                            </div>

                            <Collapse isOpened={isOpened}>
                              <div className="accordion-body">
                                <div className="donate-container">
                                  {donates}
                                </div>
                              </div>
                              
                            </Collapse>
                          </div>

                          <a className="linkbutton" style={{marginTop: 56}} onClick={() => this.withdraw(this)}>Bingo</a>

                          

                        </div>  
                     
      </div>
    );
  }
}

export default TransferView;