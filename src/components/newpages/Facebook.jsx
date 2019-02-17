import React from 'react';
import {
    MDBCol,
    MDBSwitch,
    MDBRow,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBBtn,
    MDBTooltip,
    MDBCardTitle,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBModal,
    MDBTableBody,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter
} from "mdbreact";
import NavBar from "../microcomponents/NavBar";

class Facebook extends React.Component {
    state = {
        modal1: false,activeNav:0,
        modal2: false,
        modal3: false, connected: false
    };
    toggle = (x) => {
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
    };

    render() {
        let table1 = {
            columns: [
                {
                    'label': 'ID',
                    'field': 'check',
                    'sort': 'asc'
                },
                {
                    'label': 'Exception',
                    'field': 'Exception',
                    'sort': 'asc'
                },
            ],
            rows: [
                {
                    'id': 1,
                    'Exception': 'Exception',
                }, {
                    'id': 2,
                    'Exception': 'Exception',
                }
            ]
        };
        const handleClick = (id)=>{
            this.setState({activeNav:id})
        };
        return (
            <div id="facebook-page">
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal1} toggle={() => this.toggle('1')}>

                        <MDBModalHeader toggle={() => this.toggle('1')}>Visited Urls</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={table1.rows}/>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('1')}>Close</MDBBtn>
                            <MDBBtn onClick={() => alert('xx')} color="success">+</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal2} toggle={() => this.toggle('2')}>
                        <MDBModalHeader toggle={() => this.toggle('2')}>User Searches</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={table1.rows}/>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('2')}>Close</MDBBtn>
                            <MDBBtn color="primary">Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer><MDBContainer>
                <MDBModal size="lg" isOpen={this.state.modal3} toggle={() => this.toggle('3')}>
                    <MDBModalHeader toggle={() => this.toggle('3')}>User Experience</MDBModalHeader>
                    <MDBModalBody>
                        <MDBTable btn fixed>
                            <MDBTableHead columns={table1.columns}/>
                            <MDBTableBody rows={table1.rows}/>
                        </MDBTable>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={() => this.toggle('3')}>Close</MDBBtn>
                        <MDBBtn color="primary">Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>

                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <i id={'facebook-page-bg'} className="fab fa-facebook mr-3"/>
                        <MDBCard className="d-flex mb-2 ">
                            <div className="row">
                                <div className="col-md-6">
                                    <MDBCardBody>
                                        <MDBCardTitle>Browsing Data</MDBCardTitle>
                                        <div className={'row'}>
                                            <div className="col-md-10">
                                                <MDBInput label="Visited Urls" filled type="checkbox" id="bd1">

                                                </MDBInput>
                                            </div>
                                            <div className="col-md-2" style={{margin: 'auto'}}>
                                                <MDBTooltip
                                                    placement="right"
                                                    tag="div"
                                                    tooltipContent="Add Exception">
                                                    <i onClick={() => this.toggle('1')}
                                                       className="fas fa-edit"/> </MDBTooltip>

                                            </div>
                                        </div>
                                        <div className={'row'}>
                                            <div className="col-md-10">
                                                <MDBInput label="Searches" filled type="checkbox" id="bd2"/>
                                            </div>
                                            <div className="col-md-2" style={{margin: 'auto'}}>
                                                <MDBTooltip
                                                    placement="right"
                                                    tag="div"
                                                    tooltipContent="Add Exception">
                                                    <i onClick={() => this.toggle('2')}
                                                       className="fas fa-edit"/> </MDBTooltip>
                                            </div>
                                        </div>
                                        <div className={'row'}>
                                            <div className="col-md-10">
                                                <MDBInput label="User Experience" filled type="checkbox" id="bd3"/>
                                            </div>
                                            <div className="col-md-2" style={{margin: 'auto'}}>
                                                <MDBTooltip
                                                    placement="right"
                                                    tag="div"
                                                    tooltipContent="Add Exception">
                                                    <i onClick={() => this.toggle('3')}
                                                       className="fas fa-edit"/> </MDBTooltip>
                                            </div>
                                        </div>

                                    </MDBCardBody>
                                </div>
                                <div className="col-md-6 xxx">
                                    <MDBCardBody>

                                        <div className={'n-v-w'} >
                                            <h6 style={{textAlign:'left'}} className={'justify-text-left'}>Privacy Level </h6>
                                            <NavBar handleClick={handleClick}  navs={['', '', '', '','']} activeNav={this.state.activeNav}/>

                                        </div>
                                        <p className="input-p">Blah Blah Blah</p>
                                        {/*<div className="my-3">*/}
                                            {/*<label htmlFor="customRange1">Privacy Level</label>*/}
                                            {/*<input type="range" className="custom-range" id="customRange1"/>*/}
                                        {/*</div>*/}
                                        {/*<p className="input-p">Blah Blah Blah</p>*/}
                                    </MDBCardBody>
                                </div>
                            </div>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <MDBCard className="d-flex mb-2">
                            <MDBCardBody>
                                {this.state.connected === false ?
                                    <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connect to
                                        Facebook</MDBBtn> : ''
                                } {this.state.connected === 'connecting' ?
                                <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connecting</MDBBtn> : ''
                            }
                            </MDBCardBody>
                            {this.state.connected === 'connected' ?
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="4" lg="4">
                                            <MDBCard className="d-flex mb-2">
                                                <MDBCardBody>
                                                    <MDBCardTitle>User Info</MDBCardTitle>
                                                    <MDBInput label="User Friends" filled type="checkbox" id="uf1"/>
                                                    <MDBInput label="User Family" filled type="checkbox" id="uf2"/>
                                                    <MDBInput label="User Pages" filled type="checkbox" id="uf3"/>
                                                    <MDBInput label="User Photos" filled type="checkbox" id="uf4"/>
                                                    <MDBInput label="User Tagged Posts" filled type="checkbox"
                                                              id="uf5"/>
                                                    <MDBInput label="User Tagged Places" filled type="checkbox"
                                                              id="uf6"/>
                                                    <MDBInput label="User Published Posts" filled type="checkbox"
                                                              id="uf7"/>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol md="4" lg="4">
                                            <MDBCard className="d-flex mb-2">
                                                <MDBCardBody>
                                                    <MDBCardTitle>User Favorites</MDBCardTitle>
                                                    <MDBInput label="User Games" filled type="checkbox" id="ufrs1"/>
                                                    <MDBInput label="User Movies" filled type="checkbox" id="ufrs2"/>
                                                    <MDBInput label="User Musics " filled type="checkbox" id="ufrs3"/>
                                                    <MDBInput label="User Videos" filled type="checkbox" id="ufrs4"/>
                                                    <MDBInput label="User Television" filled type="checkbox"
                                                              id="ufrs5"/>
                                                    <MDBInput label="User Links" filled type="checkbox" id="ufrs6"/>
                                                    <MDBInput label="User Favorite Requests" filled type="checkbox"
                                                              id="ufrs7"/>
                                                    <MDBInput label="User Books" filled type="checkbox" id="ufrs8"/>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                        <MDBCol md="4" lg="4">
                                            <MDBCard className="d-flex mb-2">
                                                <MDBCardBody>
                                                    <MDBCardTitle>User Business Info</MDBCardTitle>
                                                    <MDBInput label="Ad Studies" filled type="checkbox" id="ubi1"/>
                                                    <MDBInput label="User AdAccounts" filled type="checkbox" id="ubi2"/>
                                                    <MDBInput label="User AdContracts" filled type="checkbox"
                                                              id="ubi3"/>
                                                    <MDBInput label="User Business Activities" filled type="checkbox"
                                                              id="ubi4"/>
                                                    <MDBInput label="User Business Users" filled type="checkbox"
                                                              id="ubi5"/>
                                                    <MDBInput label="User Businesses" filled type="checkbox" id="ubi6"/>
                                                </MDBCardBody>
                                            </MDBCard>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBBtn color="success">Save</MDBBtn>
                                </React.Fragment> : ''}

                        </MDBCard>
                    </MDBCol>
                </MDBRow>

            </div>
        )
    }
};
export default Facebook;