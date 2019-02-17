import React from 'react';
import {MDBSwitch, MDBDropdown} from 'mdbreact';
import {
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBCardTitle,
    MDBCardText,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from "mdbreact";

class Google extends React.Component {
    render() {
        return (
            <React.Fragment>
                <a href="https://mdbootstrap.com/docs/react/forms/switch/">https://mdbootstrap.com/docs/react/forms/switch/</a>
                <MDBCol>
                    <MDBCard style={{width: "22rem"}}>
                        <MDBCardImage className="img-fluid"
                                      src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" waves/>
                        <MDBCardBody>
                            <MDBCardTitle>Card title</MDBCardTitle>
                            <MDBCardText>
                                Some quick example text to build on the card title and make
                                up the bulk of the card&apos;s content.
                            </MDBCardText>
                            <MDBBtn href="#">MDBBtn</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                    <React.Fragment>
                        <input className={'switch'} type={'checkbox'}/>
                        <div>
                            <div></div>
                        </div>
                    </React.Fragment>
                </MDBCol></React.Fragment>
        )
    }
};

export default Google;