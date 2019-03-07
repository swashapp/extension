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
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.loadSettings()
    }

    loadSettings() {

        console.log('load settings this')
        //window.helper.load().then(db => {
        //     document.getElementById('push').checked = db.configs.pushStatus;;
        //     this.setState({email:db.profile.email,walletId:db.profile.walletId})
        //     });
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
<<<<<<< HEAD
        const loadSettings = () => {
            window.helper.load().then(db => {
                document.getElementById('push').checked = db.configs.pushStatus;
                ;
                document.getElementById('email').value = db.profile.email;
                document.getElementById('wallet').value = db.profile.walletId;
            });
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
        const addFilter = () => {
            let that = this;
            let f = {
                value: document.getElementById('value').value,
                type: document.getElementById('option').value
            };
            let s = document.getElementById('value').value;
            let f1 = {
                value: document.getElementById('value').value,
                type: document.getElementById('option').value,
                'Delete': <MDBBtn onClick={() => that.deleteRecords(s)} color="red" size="sm"><i class="fa fa-trash"
                                                                                                 aria-hidden="true"></i>
                </MDBBtn>
            };
            let allow = true;
            window.helper.loadFilters().then(filter => {
                console.log('ssssssss', filter, f, f.value)
                for (let i in filter) {
                    console.log('ifilter', filter[i].value, f.value, filter[i].value === f.value)
                    if (filter[i].value === f.value) {
                        allow = false;
                    }
                }
                if (allow) {
=======
        window.helper.saveProfile(data);
        window.helper.saveConfigs({pushStatus: pushStatus});
        if(pushStatus)
            window.helper.subscribe();
        else
            window.helper.unsubscribe();
    };
    
    const loadSettings = ()=>{
        console.log('load settings')
        window.helper.load().then(db => {
            document.getElementById('push').checked = db.configs.pushStatus;;
            document.getElementById('email').value = db.profile.email;
            document.getElementById('wallet').value = db.profile.walletId;
            });
    }
    const changeInput = (e)=>{
        console.log('e',e.target,e.target.value,e.target.id)
        if(e.target.id === 'wallet'){
            this.setState({walletId:e.target.value})
        }
        if(e.target.id === 'email'){
            this.setState({email:e.target.value})
        }
    }
    return (
        <React.Fragment>
            
            <MDBRow className="justify-content-center">
                <MDBCol md="12" lg="12">
                    <section className="text-center pb-3">
                        <MDBRow className="d-flex justify-content-left">
                            
                            <MDBCol lg="12" xl="12" className="mb-3">
                                <div className={'justify-content-left'}>

                                <MDBCard className="d-flex mb-5">
>>>>>>> 68b0a9a587d5083aa572cfa533d959cc7912b494

                    filter.push(f);
                    window.helper.saveFilters(filter);
                } else {
                    alert('duplicate')
                }

            }).then(() => {
                window.helper.loadFilters();
            }).then(() => {
                if (allow) {
                    this.state.filters.push(f1)
                }

                toggle('addModal')
            });

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
                            <MDBBtn onClick={addFilter} color="blue">Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBRow className="justify-content-center">
                    <MDBCol md="12" lg="12">
                        <section className="text-center pb-3">
                            <MDBRow className="d-flex justify-content-left">
                                <MDBCol lg="12" xl="12" className="mb-3">
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

                            </MDBRow>

                        </section>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol md="12" lg="12">
                        <MDBCard className="d-flex mb-3">
                            <MDBCol md="12" lg="12">
                                <MDBCardBody>
                                    <MDBView>
                                        <div >
                                            User Privacy Data
                                        </div>
                                    </MDBView>
                                    <MDBTable btn fixed bordered>
                                        <MDBTableHead columns={table2.columns}/>
                                        <MDBTableBody rows={this.state.filters}/>
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
            </React.Fragment>
        );
    }
}

export default ProfilePage;