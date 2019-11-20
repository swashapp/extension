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
      withdrawSuccessful: false
    };
    this.walletChange = this.walletChange.bind(this);
    this.handleWalletDialogClose = this.handleWalletDialogClose.bind(this);
  }

  walletChange(e){
    this.setState({ toAddress: e.target.value, isDonate: false,isProfile: false, addressName: ''  });
  }


  handleWalletDialogClose(item){
    this.setState({ toAddress: item.wallet, isDonate: false,isProfile: true, addressName: item.name  });
  }

  isValidAmount(amount){
    // format check
    // less than available data
  }

  isValidAddress(address){
    // format check
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
    const profileWallets = [
      {
          name: 'main wallet',
          wallet: '0x987'
      },
      {
          name: 'my friend',
          wallet: '0x777'
      }
  ]; // TODO fetch from profile
  
    var dataAvailable = '36.67';
    const {isOpened, toAddress, isDonate,isProfile, addressName, withdrawSuccessful} = this.state;
    let iconArrow = isOpened? icon_open: icon_closed;
    let classHeader = (isOpened)?"accordion-head accordion-head-open":"accordion-head";
    const donateList = [
      {
        name: "Swash",
        wallet: "0x123",
        icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNjRweCIgaGVpZ2h0PSI2NHB4IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA1OCAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT45QTVFMjc2OC1FRjIwLTQyQjctQjE2RS0wM0Y2RDFGQkUyRjZAMS4wMHg8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGcgaWQ9IlN3YXNoLVZpZXdzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTGFuZGluZy1QYWdlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzk0LjAwMDAwMCwgLTEyNy4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTItQ29weS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzOTQuMDAwMDAwLCAxMjcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzEuODU3Nzc3OCwwIEM1NS43NTI1Njk0LDAgNjMuNzE1NTU1Niw4LjE1MDEzODg5IDYzLjcxNTU1NTYsMzEuODU3Nzc3OCBDNjMuNzE1NTU1Niw1NS41NjU0MTY3IDU1LjUxNDg2MTEsNjMuNzE1NTU1NiAzMS44NTc3Nzc4LDYzLjcxNTU1NTYgQzguMjAwNjk0NDQsNjMuNzE1NTU1NiAwLDU1LjM3OTcyMjIgMCwzMS44NTc3Nzc4IEMwLDguMzM1ODMzMzMgNy45NjI5ODYxMSwwIDMxLjg1Nzc3NzgsMCBaIiBpZD0iUGF0aC04IiBmaWxsPSIjMkFDNDM3Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtQ29weS00IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNi45MjQ0NDQsIDExLjQ0ODg4OSkiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyLjk4NjY2NjY3Ij4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjkuNDk0Mzg0NSw2LjA1MzUwMjg2IEwyMC41NTM0MDUsNi4xNjYwMjE1MSIgaWQ9IlBhdGgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0Ljk0NjEyOCwgNS44MDEyNzUpIHJvdGF0ZSgtMzYwLjAwMDAwMCkgdHJhbnNsYXRlKC0yNC45NDYxMjgsIC01LjgwMTI3NSkgIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguNzYzNTcwMzQsNi4wNTM1MDI4NiBDMi45MjExOTAxMSw2LjA1MzUwMjg2IDIuMTYwOTM4MWUtMTIsOC41MTU1ODE5OCAyLjE2MDkzODFlLTEyLDEzLjQzOTc0MDIgQzIuMTYwOTM4MWUtMTIsMTguMzYzODk4NSAyLjkyMTE5MDExLDIwLjY5OTY0NzIgOC43NjM1NzAzNCwyMC40NDY5ODY2IiBpZD0iUGF0aCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjM4MTc4NSwgMTMuMjU5NDkzKSByb3RhdGUoLTM2MC4wMDAwMDApIHRyYW5zbGF0ZSgtNC4zODE3ODUsIC0xMy4yNTk0OTMpICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMC40NzY2MTA5LDIwLjQ0Njk3MTIgQzI2LjQ4ODQ1OTksMjAuNDM5OTcxMiAyOS40OTQzODQ1LDIyLjgzMTU4NTcgMjkuNDk0Mzg0NSwyNy42MjE4Mjk4IEMyOS40OTQzODQ1LDMyLjQxMjIwMDEgMjYuNDg4NDU5OSwzNC44MDczODUyIDIwLjQ3NjYxMDksMzQuODA3Mzg1MiIgaWQ9IlBhdGgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuOTg1NDk4LCAyNy42MjcxNzgpIHJvdGF0ZSgtMzYwLjAwMDAwMCkgdHJhbnNsYXRlKC0yNC45ODU0OTgsIC0yNy42MjcxNzgpICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjYzNTkxMzk4LDM0LjgwNzM4NTIgTDEuNDMzNTE5OTdlLTEyLDM0LjgwNzM4NTIiIGlkPSJQYXRoIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjgxNzk1NywgMzQuODA3Mzg1KSByb3RhdGUoLTM2MC4wMDAwMDApIHRyYW5zbGF0ZSgtNC44MTc5NTcsIC0zNC44MDczODUpICI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS04IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC43ODI0MTUsIDIwLjY4MjY3Mikgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuNzgyNDE1LCAtMjAuNjgyNjcyKSAiIGN4PSIxNC43ODI0MTU0IiBjeT0iMjAuNjgyNjcxNyIgcj0iNC41NjAxMzE1NiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTEzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC43ODI0MTUsIDM0LjgwNzQyMykgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuNzgyNDE1LCAtMzQuODA3NDIzKSAiIGN4PSIxNC43ODI0MTU0IiBjeT0iMzQuODA3NDIzMSIgcj0iNC41NjAxMzE1NiI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5LTE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNC43ODI0MTUsIDYuMDUzNDY1KSByb3RhdGUoLTkwLjAwMDAwMCkgdHJhbnNsYXRlKC0xNC43ODI0MTUsIC02LjA1MzQ2NSkgIiBjeD0iMTQuNzgyNDE1NCIgY3k9IjYuMDUzNDY0ODkiIHI9IjQuNTYwMTMxNTYiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
      },
      {
        name: "Streamr",
        wallet: "0x456",
        icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9ImdseXBoLW1vZHVsZS0tbG9nby0tY3VoVTgiPjxwYXRoIGQ9Ik0yNS4wMSAxLjg0OVYuNjk2QS42OTQuNjk0IDAgMCAwIDI0LjI4NCAwYy03Ljc1NC4zNjgtMTMuOTY3IDYuNjE2LTE0LjI4IDE0LjM4Mi4wMTcuNDg3LjQxMS42MTQuNjQzLjYxNGgxLjE3MWMuMzcxIDAgLjY3NS0uMjkuNjk0LS42Ni4zMzMtNi4zOSA1LjQ2LTExLjUxIDExLjg1Mi0xMS44MzUuNDg4LS4wNjIuNjQ0LS4zMjkuNjQ0LS42NTNNMTQuNDY1IDE0Ljk5N2gxLjEyMWEuNjkuNjkgMCAwIDAgLjY4Ny0uNjQ2IDguNzYgOC43NiAwIDAgMSA4LjE0OC04LjA5Mi42MjcuNjI3IDAgMCAwIC41ODgtLjY2M1Y0LjQ1NWEuNjk3LjY5NyAwIDAgMC0uNzQ0LS42OTRjLTUuNjI3LjM2Ny0xMC4xMjYgNC44NjYtMTAuNDkzIDEwLjQ5MmEuNjk3LjY5NyAwIDAgMCAuNjkzLjc0NE0yNS4wMSA4LjIyMXYxLjE0NmMwIC40Ny0uNDA3LjYzOC0uNjA2LjY2MmE1LjAwNyA1LjAwNyAwIDAgMC00LjM2MSA0LjM0OS42OTkuNjk5IDAgMCAxLS42OTEuNjJoLTEuMTJhLjY5My42OTMgMCAwIDEtLjY5Mi0uNzU3IDcuNTEgNy41MSAwIDAgMSA2LjcxNC02LjcxMy42OTMuNjkzIDAgMCAxIC43NTYuNjkzem0xMy4xNDIgMTYuNzUzYy0uMzI0IDAtLjU5LS4xNTctLjY1NC0uNjQ0LS4zMjQtNi4zOTItNS40NDUtMTEuNTE4LTExLjgzNS0xMS44NWEuNjk2LjY5NiAwIDAgMS0uNjYyLS42OTR2LTEuMTcxYzAtLjIzMi4xMjgtLjYyNi42MTUtLjY0MyA3Ljc2Ny4zMTMgMTQuMDE2IDYuNTI1IDE0LjM4NCAxNC4yNzdhLjY5NC42OTQgMCAwIDEtLjY5NS43MjVoLTEuMTUzek0yNS4wMDEgMTQuNDNjMC0uNDAzLjM0MS0uNzIuNzQ0LS42OTMgNS42MjcuMzY3IDEwLjEyNiA0Ljg2NiAxMC40OTMgMTAuNDkxYS42OTcuNjk3IDAgMCAxLS42OTQuNzQ1aC0xLjE0MWEuNjI3LjYyNyAwIDAgMS0uNjYzLS41ODkgOC43NiA4Ljc2IDAgMCAwLTguMDkzLTguMTQ2LjY5Mi42OTIgMCAwIDEtLjY0Ny0uNjg3di0xLjEyem02Ljc3NyAxMC41NDNoLTEuMTQ3Yy0uNDY5IDAtLjYzOC0uNDA4LS42NjItLjYwNmE1LjAwNyA1LjAwNyAwIDAgMC00LjM1LTQuMzYuNjk5LjY5OSAwIDAgMS0uNjE5LS42OTJ2LTEuMTE5YzAtLjQwOC4zNTEtLjczMy43NTctLjY5MmE3LjUxIDcuNTEgMCAwIDEgNi43MTQgNi43MTIuNjkzLjY5MyAwIDAgMS0uNjkzLjc1N3pNMS44NSAxNC45OTRjLjMyNCAwIC41OS4xNTcuNjU0LjY0NC4zMjQgNi4zOTIgNS40NDUgMTEuNTE4IDExLjgzNSAxMS44NS4zNy4wMi42NjIuMzI0LjY2Mi42OTR2MS4xNzJjMCAuMjMxLS4xMjguNjI1LS42MTUuNjQyQzYuNjE4IDI5LjY4My4zNyAyMy40Ny4wMDEgMTUuNzE5YS42OTQuNjk0IDAgMCAxIC42OTUtLjcyNWgxLjE1M3pNMTUgMjUuNTM3YzAgLjQwMy0uMzQxLjcyLS43NDQuNjkzLTUuNjI3LS4zNjctMTAuMTI2LTQuODY1LTEwLjQ5My0xMC40OTFhLjY5Ny42OTcgMCAwIDEgLjY5NC0uNzQ1aDEuMTQxYy41MDQgMCAuNjUuMzk0LjY2My41ODlhOC43NiA4Ljc2IDAgMCAwIDguMDkzIDguMTQ2LjY5Mi42OTIgMCAwIDEgLjY0Ny42ODd2MS4xMnpNOC4yMjMgMTQuOTk0SDkuMzdjLjQ2OSAwIC42MzguNDA4LjY2Mi42MDZhNS4wMDcgNS4wMDcgMCAwIDAgNC4zNSA0LjM2MS42OTkuNjk5IDAgMCAxIC42MTkuNjl2MS4xMmEuNjk0LjY5NCAwIDAgMS0uNzU3LjY5MyA3LjUxIDcuNTEgMCAwIDEtNi43MTQtNi43MTMuNjkzLjY5MyAwIDAgMSAuNjkzLS43NTd6bTYuNzggMjMuMTU3YzAtLjMyNC4xNTctLjU5LjY0NC0uNjUzIDYuMzkzLS4zMjQgMTEuNTItNS40NDUgMTEuODUyLTExLjgzNGEuNjk2LjY5NiAwIDAgMSAuNjk0LS42NjFoMS4xNzJjLjIzMSAwIC42MjUuMTI3LjY0Mi42MTQtLjMxMyA3Ljc2Ni02LjUyNiAxNC4wMTQtMTQuMjggMTQuMzgyYS42OTQuNjk0IDAgMCAxLS43MjQtLjY5NXYtMS4xNTN6bTEwLjU0NC0xMy4xNDhjLjQwNCAwIC43Mi4zNDIuNjk0Ljc0NC0uMzY3IDUuNjI2LTQuODY3IDEwLjEyNS0xMC40OTMgMTAuNDkyYS42OTcuNjk3IDAgMCAxLS43NDUtLjY5NHYtMS4xNDFjMC0uNTA0LjM5NC0uNjUuNTg5LS42NjNhOC43NiA4Ljc2IDAgMCAwIDguMTQ3LTguMDkyLjY5Mi42OTIgMCAwIDEgLjY4Ny0uNjQ2aDEuMTIxem0tMTAuNTQ0IDYuNzc2di0xLjE0NmMwLS40Ny40MDgtLjYzOC42MDYtLjY2MmE1LjAwNyA1LjAwNyAwIDAgMCA0LjM2Mi00LjM1LjcuNyAwIDAgMSAuNjktLjYxOGgxLjEyYy40MDggMCAuNzMzLjM1LjY5My43NTZhNy41MSA3LjUxIDAgMCAxLTYuNzE0IDYuNzEzLjY5My42OTMgMCAwIDEtLjc1Ny0uNjkzeiIgZmlsbD0iI0ZGNUMwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48L3BhdGg+PC9zdmc+Cg=="
      },
      
    ];
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
     const suggestAdding = withdrawSuccessful? this.getSuggestToAdd(toAddress, profileWallets) : '';
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
                        {suggestAdding}  
                     
      </div>
    );
  }
}

export default TransferView;