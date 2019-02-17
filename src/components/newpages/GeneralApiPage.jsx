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

class GeneralApiPage extends React.Component {
    state = {
        modal1: false,addModal:false,
        modal2: false, activeNav: 0, resource: false,
        modal3: false, connected: false
    };

    componentDidMount() {
        let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
        let resourse;
        console.log('gg', href)
        for (let u in this.props.resource) {
            if (href === this.props.resource[u].name)
                resourse = this.props.resource[u];
        }
        ;
        this.setState({resource: resourse, page: href})
    };

    componentDidUpdate() {
        let resourse;
        let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
        console.log(this.state.href, href)
        if (this.state.page !== href) {
            for (let u in this.props.resource) {
                if (href === this.props.resource[u].name)
                    resourse = this.props.resource[u];
            }
            ;
            this.setState({resource: resourse, page: href})

        }
    }

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
        if (x === 'addModal')
            this.setState({
                addModal: !this.state.addModal
            });
    };

    render() {
        const addModal = ()=>{

        };
        let table1 = {
            columns: [
                {
                    'label': 'Name',
                    'field': 'check',
                    'sort': 'asc'
                },
                {
                    'label': 'Value',
                    'field': 'Exception',
                    'sort': 'asc'
                },{
                    'label': 'Type',
                    'field': 'Exception',
                    'sort': 'asc'
                },{
                    'label': 'Delete',
                    'field': 'Exception',
                    'sort': 'asc'
                },
            ],
            rows: [
                {
                    'Name': 'Test',
                    'Exception': 'SignUp',
                    'Type':'Url',
                    'Delete':<MDBBtn color="red" size="sm">X</MDBBtn>
                },
            ]
        };
        const handleClick = (id) => {
            this.setState({activeNav: id})
        };const SaveException = (id) => {

        };
        return (
            <div id="amazon-page">

                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal1} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('1')}>Visited Urls</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed bordered>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={table1.rows}/>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('1')}>Close</MDBBtn>
                            <MDBBtn onClick={() => this.toggle('addModal')} color="success">+</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal2} toggle={() => this.toggle('2')}>
                        <MDBModalHeader toggle={() => this.toggle('2')}>User Searches</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed bordered>
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
                        <MDBTable btn fixed bordered>
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
                <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.addModal} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('addModal')}>Add New Exception</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                label="Name"
                                error="wrong"
                                success="right"
                            /><MDBInput
                                label="Value"
                                error="wrong"
                                success="right"
                            />
                            <select className="browser-default custom-select">
                                <option>Type of Exception</option>
                                <option value="1">Url</option>
                                <option value="2">Regular Expression</option>
                                <option value="3">Wild Card</option>
                            </select>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => SaveException}>Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <i id={'amazon-page-bg'} className="fab fa-amazon mr-3"/>

                        <MDBCard className="d-flex mb-2">
                            <MDBCol md="6" lg="6">

                            <MDBCardBody>
                                <div className={'n-v-w'}>
                                    <h6 style={{textAlign: 'left'}} className={'justify-text-left'}>Privacy Level </h6>
                                    <NavBar handleClick={handleClick} navs={['', '', '', '', '']}
                                            activeNav={this.state.activeNav}/>
                                </div>
                                <p className="input-p">Blah Blah Blah</p>
                                {/*<div className="my-3">*/}
                                {/*<label htmlFor="customRange1">Privacy Level</label>*/}
                                {/*<input type="range" className="custom-range" id="customRange1"/>*/}
                                {/*</div>*/}
                            </MDBCardBody>
                            </MDBCol></MDBCard>
                    </MDBCol>
                </MDBRow>
                {this.state.resource ? this.state.resource["function"].includes('browsing') ?

                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
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

                                    </div>
                                </div>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : '' : ''}

                {this.state.resource && this.state.resource["function"].includes('apiCall') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className="d-flex mb-2">
                                <MDBCardBody>
                                    {this.state.connected === false ?
                                        <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connect to
                                            {' ' + this.state.resource.name}</MDBBtn> : ''
                                    } {this.state.connected === 'connecting' ?
                                    <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connecting</MDBBtn> : ''
                                }
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>
                                                <MDBCardTitle>User Info</MDBCardTitle>
                                                <MDBInput label="User Clicks" filled type="checkbox" id="uf1"/>
                                                <MDBInput label="User Reviewed Items" filled type="checkbox" id="uf2"/>
                                                <MDBInput label="Items Added to Cart" filled type="checkbox" id="uf3"/>
                                                <MDBInput label="Items Ready to Buy Now" filled type="checkbox"
                                                          id="uf4"/>
                                                <MDBInput label="Items Added to User's Wish List" filled type="checkbox"
                                                          id="uf5"/>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBBtn color="success">Save</MDBBtn>
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}
                {this.state.resource && this.state.resource["function"].includes('content') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className="d-flex mb-2">
                                <MDBCardBody>

                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>
                                                <MDBCardTitle>User Info</MDBCardTitle>
                                                <MDBInput label="User Clicks" filled type="checkbox" id="uf1"/>
                                                <MDBInput label="User Reviewed Items" filled type="checkbox" id="uf2"/>
                                                <MDBInput label="Items Added to Cart" filled type="checkbox" id="uf3"/>
                                                <MDBInput label="Items Ready to Buy Now" filled type="checkbox"
                                                          id="uf4"/>
                                                <MDBInput label="Items Added to User's Wish List" filled type="checkbox"
                                                          id="uf5"/>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBBtn color="success">Save</MDBBtn>
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}

            </div>
        )
    }
}

export default GeneralApiPage;