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
import src1 from '../../assets/img-1.jpg';


class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			privacyData: []
		};
    }

    componentDidMount() {
        this.loadSettings()
    }

    loadSettings() {
        // ADD LOADER HERE
        // this.setState({privacyData:window.loader.loadSettings})
        //window.helper.load().then(db => {
        //     document.getElementById('push').checked = db.configs.pushStatus;;
        //     this.setState({email:db.profile.email,walletId:db.profile.walletId})
        //     });
		window.helper.load().then(db => {
			document.getElementById('push').checked = db.configs.pushStatus;
			;
			document.getElementById('email').value = db.profile.email;
			document.getElementById('wallet').value = db.profile.walletId;
			let that = this;
			for(let pData of db.privacyData) {
				this.state.privacyData.push(
					{
						value: pData.value,
						Delete: <MDBBtn onClick={() => this.deleteRecordsX(pData.value)} color="red" size="sm"><i className="fa fa-trash"
																										 aria-hidden="true"/>
						</MDBBtn>
					}
				)
			}
			this.state.privacyData = db.privacyData;
		});	
    }
    deleteRecordsX(id){
        console.log('deleteRecordsdeleteRecordsdeleteRecords',id)
        let newArray = [];
        let storageArray = [];
        console.log('filters',this.state.privacyData)
        for(let i in this.state.privacyData){

            if(this.state.privacyData[i].value !== id){
                newArray.push(this.state.privacyData[i]);
                storageArray.push({value:this.state.privacyData[i].value})

            }
        }
        console.log('sss',storageArray)
        // window.helper.saveFilters(storageArray)  /// SAVE PRIVACY (DELETED ONE ITEM)
        this.setState({privacyData:newArray});

    }
    render() {
        const settings = {};
        const saveSettings = () => {
            console.log('save settings')
            let pushStatus = document.getElementById('push').checked;
            let email = document.getElementById('email').value;
            let wallet = document.getElementById('wallet').value;
            let data = {
                email: email,
                walletId: wallet
            };
            window.helper.saveProfile(data);
            window.helper.saveConfigs({pushStatus: pushStatus});
            if (pushStatus)
                window.helper.subscribe();
            else
                window.helper.unsubscribe();
        };
        let table2 = {
            columns: [

                {
                    'label': 'Value',
                    'field': 'value',
                    'sort': 'asc',
                    'minimal': 'lg'
                },{
                    'label': 'Delete',
                    'field': 'Exception',
                    'sort': 'asc',
                    'minimal': 'sm'
                },
            ],
            rows: [

            ]
        };
        const loadSettings = () => {
        };
        const changeInput = (e) => {
            console.log('e', e.target, e.target.value, e.target.id)
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

        const addPrivacyData = () => {
            let thatZ = this;
            let f = {
                value: document.getElementById('value').value,
            };
            let s = document.getElementById('value').value;
            let f1 = {
                value: document.getElementById('value').value,                
                'Delete': <MDBBtn onClick={() => this.deleteRecordsX(s)} color="red" size="sm"><i className="fa fa-trash"
                                                                                                 aria-hidden="true"/>
                </MDBBtn>
            };

            let allow = true;
            window.helper.loadPrivacyData().then(pData => {
                console.log('ssssssss', pData, f, f.value)
                for (let i in pData) {
                    console.log('ipData', pData[i].value, f.value, pData[i].value === f.value)
                    if (pData[i].value === f.value) {
                        allow = false;
                    }
                }
                if (allow) {
                    pData.push(f);
                    window.helper.savePrivacyData(pData);
                    let i = this.state.privacyData
                    i.push(f1)
                    this.setState({privacyData:i})
                } else {
                    alert('duplicate')
                }
                toggle('addModal')
            })
        };
        return (
            <React.Fragment>
                <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.addModal} toggle={() => toggle('1')}>

                        <MDBModalHeader toggle={() => toggle('addModal')}>Add User Privacy Data</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput id={'value'}
                                      label="Value"
                                      error="wrong"
                                      success="right"
                            />

                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn onClick={addPrivacyData} color="blue">Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBRow className="justify-content-center">
                    <MDBCol md="12" lg="12">
                        <section className="text-center pb-3">
                            <MDBRow className="d-flex justify-content-left">
                                <MDBCol lg="6" xl="6" className="mb-3">
                                    <div className={'justify-content-left'}>
                                        <MDBCard className="d-flex mb-5">
                                            <MDBView>
                                                <div className={'mg-tp-5'}>
                                                    Change Profile Details
                                                </div>
                                            </MDBView>
                                            <MDBCardBody>
                                                <MDBCardTitle className="font-bold mb-3">
                                                </MDBCardTitle>
                                                {/*<MDBCardText>Some quick example text to build on the card title and make up the*/}
                                                {/*bulk of the card's content.</MDBCardText>*/}
                                                <MDBInput onChange={changeInput} value={this.state.walletId}
                                                          label="Wallet Id" icon="user" id="wallet"/>
                                                <MDBInput value={changeInput} value={this.state.email}
                                                          label="Email Address" icon="envelope" id="email"/>
                                                <p className={'input-p'}>Optional : If you Provide Email , It may
                                                    Increase Your Income</p>
                                                <div className={'input-title'}>
                                                    <div className='row'>
                                                        <div className="col-md-6">

                                                            <h5 style={{display: 'inline-flex', color: '#757575'}}>Push
                                                                Messages:

                                                            </h5>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <input id='push' className='switch' type='checkbox'/>
                                                            <div className='switch-wrap'>
                                                                <p className="enabled"></p>
                                                                <p className="disabled"></p>
                                                                <div className='enable-circle'></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className={'input-p'}>Optional : If you Enable Push , It may Increase
                                                    Your Income</p>

                                            </MDBCardBody>

                                            <MDBCardFooter className="links-light profile-card-footer">
                                                <MDBBtn onClick={saveSettings} color="blue">Save Changes</MDBBtn>
                                            </MDBCardFooter>
                                        </MDBCard>
                                    </div>

                                </MDBCol>
                                <MDBCol md="6" lg="6">
                                    <MDBCard className="d-flex mb-3">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>
                                                <MDBView>
                                                    <div className={'mg-tp-5'}>
                                                        User Privacy Data
                                                    </div>
                                                </MDBView>
                                                <MDBTable id={'sssfj'} btn fixed bordered>
                                                    <MDBTableHead columns={table2.columns}/>
                                                    <MDBTableBody rows={this.state.privacyData}/>
                                                </MDBTable>
                                                <MDBRow>
                                                    <MDBBtn onClick={() => toggle('addModal')} color="blue"><i class="fa fa-plus"
                                                                                                               aria-hidden="true"></i>
                                                    </MDBBtn>
                                                </MDBRow>

                                            </MDBCardBody>
                                        </MDBCol></MDBCard>
                                </MDBCol>
                            </MDBRow>

                        </section>
                    </MDBCol>

                </MDBRow>
                <MDBRow>


                </MDBRow>
            </React.Fragment>
        );
    }
}

export default ProfilePage;