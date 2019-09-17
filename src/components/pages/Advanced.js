import React from 'react'
import 'react-widgets/dist/css/react-widgets.css';
import 'react-notifications/lib/notifications.css';
import NumberPicker from 'react-widgets/lib/NumberPicker'
import simpleNumberLocalizer from 'react-widgets-simple-number';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import remove from '../../assets/close-50.png'
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
import src1 from '../../assets/img-1.jpg';

simpleNumberLocalizer();

class AdvancedPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {          
            email: "",
            walletId: "",
            delay: 0
        };
    }

    componentDidMount() {
        this.loadSettings()
    }
      
    loadSettings() {
        // window.helper.load().then(db => {
        //  //document.getElementById('push').checked = db.configs.pushStatus;
        //  document.getElementById('email').setAttribute('valuex','1') ;
        //  document.getElementById('wallet').setAttribute('valuex','1') ;
        //  let email = db.profile.email;
        //  let walletId = db.profile.walletId;
        //  let that = this;            
  //           this.setState({email:email, walletId:walletId, delay:db.configs.delay})
        // });
    }
    handleChange(delay) {
        this.setState({delay: delay});
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
       
       
        const changeInput = (e) => {
            if (e.target.id === 'wallet') {
                this.setState({walletId: e.target.value})
            }
            if (e.target.id === 'email') {
                this.setState({email: e.target.value})
            }
        };
        const toggle = (x) => {
            if (x === '1')
                this.setState({
                    modal1: !this.state.modal1
                });
            if (x === '2')
                this.setState({
                    modal2: !this.state.modal2
                });
            if (x === '3')
                this.setState({
                    modal3: !this.state.modal3
                });
            if (x === 'addModal')
                this.setState({
                    addModal: !this.state.addModal
                });
        };
        let excludeTableData = [
            {
                url: "https://www.amazon.com/ap/signin*",
                type: "Wildcard"
            
            },
            {
                url: "https://www.facebook.com/login*",
                type: "Wildcard"
            
            },
            {
                url: "https://www.facebook.com/v3.2/dialog/oauth*",
                type: "Wildcard"
            
            },
            {
                url: "https://login.yahoo.com/*",
                type: "Wildcard"
            
            },
            {
                url: "https://accounts.google.com/*",
                type: "Wildcard"
            
            },
            {
                url: "https://login.live.com/*",
                type: "Wildcard"
            
            },
            {
                url: "https://login.aol.com/*",
                type: "Wildcard"
            
            },
            {
                url: "https://twitter.com/login*",
                type: "Wildcard"
            
            },
            {
                url: "https://twitter.com/account*",
                type: "Wildcard"
            
            },
            {
                url: "https://drive.google.com/*",
                type: "Wildcard"
            
            }
        ];
        let excludeTableDataRows =  excludeTableData.map( (row) => { return (<tr className="table-row">                                    
                                                <td className="table-text table-head-text"><input type="text" value={row.url} /></td>
                                                <td className="table-text"><input type="text" value={row.type} /></td>
                                                <td className="table-text"><button >Delete</button></td>
                                            </tr>)});
        let addXUrl = (<div><div className="form-caption">Add a URL to exclude</div>
                            <div>
                                <input type="text" className="form-input"/>
                            </div></div>);
        let addXType = (<select id='filterOption' className="browser-default custom-select">
                            <option value="exact">Exact</option>
                            <option value="regex">Regular Expression</option>
                            <option value="wildcard">Wild Card</option>
                        </select>);
        let AddXButton = (<button>Add</button>);


        let maskTableData = [
            {
                text: "Jane@example.com"
            
            }
        ];
        let maskTableDataRows =  maskTableData.map( (row) => { return (<tr className="table-row">                                    
                                                <td className="table-text table-head-text"><input type="text" value={row.text} /></td>
                                                <td className="table-text"><button >Delete</button></td>
                                            </tr>)});
        let addMaskText = (<div>
                <div className="form-caption">Add a text mask</div>
                <div>
                    <input type="text" className="form-input"/>
                </div>
            </div>);
        let AddMaskButton = (<button>Add</button>);


        return (
            <div id="settings-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Text masking</div>
                            <div className="swash-p">
You can mask specific sensitive text data before it is sent to Streamr Marketplace. Your sensitive data is transformed based on the privacy level setting. Examples of text you might want to mask could be your name, email address, and phone number.

</div>

<div>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr className="table-head-row">                               
                                            <th className="table-text table-head-text">{addMaskText}</th>
                                            <th className="table-text table-head-text">{AddMaskButton}</th>
                                        </tr>
                                    </MDBTableHead>
                                
                                    <MDBTableBody>
                                        {maskTableDataRows}
                                    </MDBTableBody>
                                </MDBTable>
                                </div>
                            </div>
                            
                            
                    </div>


                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">URLs to exclude</div>
                            <div className="swash-p">This filtering is used to exclude domains and URLs to ensure their data are not going to be sent to Streamr Marketplace. This mechanism is independent of the global filters and can be used to target whatever you would like to exclude. See the docs for more details.</div>
                    
                            
                            <div>
                                <MDBTable>
                                    <MDBTableHead>
                                        <tr className="table-head-row">                               
                                            <th className="table-text table-head-text">{addXUrl}</th>
                                            <th className="table-text table-head-text">{addXType}</th>
                                            <th className="table-text table-head-text">{AddXButton}</th>
                                        </tr>
                                    </MDBTableHead>
                                
                                    <MDBTableBody>
                                        {excludeTableDataRows}                                
                                    </MDBTableBody>
                                </MDBTable>
                                </div>
                            </div>

                        </div>
                    



                </React.Fragment>
                <NotificationContainer/>
            </div>
        );
    }
}

export default AdvancedPage;