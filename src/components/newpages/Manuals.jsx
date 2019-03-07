import React from 'react';
import {ManualResource} from './ManualsDocs.jsx'
import {Route, Switch, withRouter} from 'react-router-dom';
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
import ReactMarkdown from 'react-markdown';
import NavBar from '../microcomponents/NavBar'

class Manuals extends React.Component {
    state = {manual: []};

    componentDidMount() {
        console.log('s',ManualResource)
        this.setState({manual:ManualResource})
        
    };

    componentDidUpdate() {

    }

    render() {

        return (
            <MDBContainer>
                <MDBRow id={'manual-row'} className="justify-content-left">

                    <MDBCol md="12" lg="12">
                        {this.state.manual[0]?this.state.manual.map((ob, id) => <MDBCard  key={id} className="d-flex mb-2">
                            <MDBCol id={id} md="12" lg="12">

                                <MDBCardBody>
                                    <i className={'fa fa-arrow-down manual-page-arrow'}
                                       onClick={() => document.getElementById(id).classList.contains('full-expand') ? document.getElementById(id).classList.remove('full-expand'):document.getElementById(id).classList.add('full-expand')}/>
                                    <ReactMarkdown source={ob}/>

                                </MDBCardBody>
                            </MDBCol></MDBCard>
                        ):''}

                    </MDBCol>
                </MDBRow>
            </MDBContainer>)
    }
}

export default withRouter(Manuals);