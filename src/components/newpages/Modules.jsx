import React from 'react';
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
import NavBar from '../microcomponents/NavBar'

class Modules extends React.Component {
    state = {
        modal1: false, addModal: false,
        modal2: false, activeNav: 0, resources: [],
        modal3: false, connected: false
    };

    componentDidMount() {
        let resources = [];
        if (this.props.resource[0] && !this.state.resources[0]) {
            for (let i in this.props.resource) {
                resources.push({title: this.props.resource[i].name, icons: this.props.resource[i].icons})
            }
            this.setState({resources: resources})
        }
    };

    componentDidUpdate() {
        let resources = [];
        if (this.props.resource[0] && !this.state.resources[0]) {
            for (let i in this.props.resource) {
                resources.push({title: this.props.resource[i].name, icons: this.props.resource[i].icons})
            }
            this.setState({resources: resources})
        }
    }

    render() {
        const redirect = (title) => {
            this.props.history.push('/apis/' + title)
        };
        return (<MDBRow id='modules-row' className="justify-content-left">
            {this.state.resources.map((ob, id) => <MDBCol md="4" lg="3">
                    <MDBCard onClick={() => redirect(ob.title)} className="d-flex mb-2">
                        <MDBCardBody>
                            <div className='module-wr module-logo-wr'><img src={'data:image/png;base64,' + ob.icons[0]}/>
                            </div>
                            <div className='module-wr'> {ob.title}</div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            )}

        </MDBRow>)
    }
}

export default withRouter(Modules);