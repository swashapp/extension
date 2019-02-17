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
import NavBar from '../microcomponents/NavBar'
class YouTube extends React.Component {
    state = {
        modal1: false,
        modal2: false,activeNav:0,
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
            <div id="youtube-page">
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
                        <i id={'youtube-page-bg'} className="fab fa-youtube mr-3"/>
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
                                <div className="col-md-6">
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
                                    </MDBCardBody>
                                </div>
                            </div>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <MDBCard className="d-flex mb-2">
                            {/*<MDBCardBody>*/}
                                {/*{this.state.connected === false ?*/}
                                    {/*<MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connect to*/}
                                        {/*Facebook</MDBBtn> : ''*/}
                                {/*} {this.state.connected === 'connecting' ?*/}
                                {/*<MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connecting</MDBBtn> : ''*/}
                            {/*}*/}
                            {/*</MDBCardBody>*/}
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                                <MDBCardBody>
                                                    <MDBCardTitle>User Info</MDBCardTitle>
                                                    <MDBInput label="User Clicks" filled type="checkbox" id="uf1"/>
                                                    <MDBInput label="User Reviewed Items" filled type="checkbox" id="uf2"/>
                                                    <MDBInput label="Items Added to Cart" filled type="checkbox" id="uf3"/>
                                                    <MDBInput label="Items Ready to Buy Now" filled type="checkbox" id="uf4"/>
                                                    <MDBInput label="Items Added to User's Wish List" filled type="checkbox"
                                                              id="uf5"/>

                                                </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBBtn color="success">Save</MDBBtn>
                                </React.Fragment>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>

            </div>
        )
    }
}
export default YouTube;