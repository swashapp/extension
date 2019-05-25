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

class ProfilePage extends React.Component {
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
		window.helper.load().then(db => {
			//document.getElementById('push').checked = db.configs.pushStatus;
			document.getElementById('email').setAttribute('valuex','1') ;
			document.getElementById('wallet').setAttribute('valuex','1') ;
			let email = db.profile.email;
			let walletId = db.profile.walletId;
			let that = this;			
            this.setState({email:email, walletId:walletId, delay:db.configs.delay})
		});
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

        
        return (
            <div id="profile">
                <React.Fragment>
                    
                    <MDBRow id={'profile'} className="justify-content-center">                    
                        <MDBCol md="12" lg="12">
                            <section className="text-center pb-3">
                                <MDBRow className="d-flex justify-content-left">
                                    <MDBCol lg="6" xl="6" className="mb-3 offset-md-3">
                                        <div className={'justify-content-left'}>
                                            <MDBCard className="d-flex mb-5">
                                                <MDBView>
                                                    <div className={'mg-tp-5'}>
                                                        User Profile
                                                    </div>
                                                </MDBView>
                                                <MDBCardBody>
                                                    <MDBCardTitle className="font-bold mb-3">
                                                    </MDBCardTitle>                                                    
                                                    <MDBInput onChange={changeInput} value={this.state.walletId}
                                                              label="Wallet Id" icon="user" id="wallet"/>
                                                    <MDBInput value={changeInput} value={this.state.email}
                                                              label="Email Address" icon="envelope" id="email"/>
                                                    {/*<div className={'input-title'}>
                                                        <div className='row'>
                                                            <div className="col-md-8">

                                                                <h5 style={{display: 'inline-flex', color: '#757575'}}>Push
                                                                    Messages:

                                                                </h5>
                                                            </div>

                                                            <div className="col-md-4">
                                                                <input id='push' className='switch' type='checkbox'/>
                                                                <div className='switch-wrap'>
                                                                    <p className="enabled"></p>
                                                                    <p className="disabled"></p>
                                                                    <div className='enable-circle'></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    */}
                                                    <br />
                                                    <br />
                                                    <div className={'input-title'}>
                                                        <div className='row'>
                                                            <div className="col-md-7">

                                                                <h5 style={{display: 'inline-flex', color: '#757575'}}>Delay 
                                                                    Sending(Minutes):

                                                                </h5>
                                                            </div>

                                                            <div className="col-md-4">														
                                                                <NumberPicker value={this.state.delay} onChange={value => this.setState({ delay: value })} min={0}/>
                                                            </div>
                                                        </div>
                                                    </div>
                           
                                                </MDBCardBody>

                                                <MDBCardFooter className="links-light profile-card-footer">
                                                    <MDBBtn onClick={saveSettings} color="blue">Save Changes</MDBBtn>
                                                </MDBCardFooter>
                                            </MDBCard>
                                        </div>

                                    </MDBCol>                                    
                                </MDBRow>

                            </section>
                        </MDBCol>

                    </MDBRow>
                    <MDBRow>


                    </MDBRow>
                </React.Fragment>
                <NotificationContainer/>
            </div>
        );
    }
}

export default ProfilePage;