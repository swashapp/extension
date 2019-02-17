import React from 'react'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,
    MDBMask,
    MDBCardImage,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,MDBInput,
    MDBCardFooter,
    MDBBtn,
    MDBIcon
} from 'mdbreact';
import src1 from '../../assets/img-1.jpg';

const ProfilePage = () => {
    return (
        <React.Fragment>
            <MDBRow className="justify-content-center">

                <MDBCol md="12" lg="12">
                    <section className="text-center pb-3">
                        <MDBRow className="d-flex justify-content-left">
                            <MDBCol lg="4" xl="4" className="mb-3">
                                <MDBCard className="d-flex mb-5">
                                    <MDBView>
                                        {/*<img*/}
                                            {/*src="https://mdbootstrap.com/img/Mockups/Horizontal/6-col/pro-profile-page.jpg"*/}
                                            {/*alt="Project" className="img-fluid"/>*/}
                                            <div className={'profile-img'}>
                                        <MDBIcon icon="user-circle" className="mr-3"/>
                                            </div>
                                        <MDBMask overlay="white-slight"/>
                                    </MDBView>
                                    <MDBCardBody>
                                        <MDBCardTitle className="font-bold mb-3">
                                            <strong>Gholam Abbas Mir Kazemi</strong>
                                        </MDBCardTitle>
                                        {/*<MDBCardText>Some quick example text to build on the card title and make up the*/}
                                            {/*bulk of the card's content.</MDBCardText>*/}
                                    </MDBCardBody>
                                    <MDBCardFooter className="links-light profile-card-footer">
                                         <span className="right">
                                            <a className="p-2" href="#profile">
                                                Change Avatar
                                                <MDBIcon icon="image" className="ml-1"/>
                                            </a>
                                         </span>
                                    </MDBCardFooter>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol lg="8" xl="8" className="mb-3">
                                <div className={'justify-content-left'}>

                                <MDBCard className="d-flex mb-5">

                                    <MDBView>
                                       Change Profile Details
                                    </MDBView>

                                    <MDBCardBody>
                                        <MDBCardTitle className="font-bold mb-3">
                                        </MDBCardTitle>
                                        {/*<MDBCardText>Some quick example text to build on the card title and make up the*/}
                                            {/*bulk of the card's content.</MDBCardText>*/}
                                        <MDBInput label="Wallet Id " icon="user" />
                                        <MDBInput label="Email Address" icon="envelope" />
                                        <p className={'input-p'}>Optional : If you Provide Email , It may Increase Your Income</p>
                                        <div className={'input-title'}>
                                            <h5 style={{display:'inline-flex',color: '#757575'}}>Push Messages : </h5>
                                            <React.Fragment>
                                                <input className={'switch'} type={'checkbox'}/>
                                                <div>
                                                    <div></div>
                                                </div>
                                            </React.Fragment>
                                        </div>
                                        <p className={'input-p'}>Optional : If you Enable Push , It may Increase Your Income</p>

                                    </MDBCardBody>

                                    <MDBCardFooter className="links-light profile-card-footer">
                                         <strong >Save Changes</strong>
                                    </MDBCardFooter>
                                </MDBCard>
                                </div>

                            </MDBCol>

                        </MDBRow>

                    </section>
                </MDBCol>
            </MDBRow>
        </React.Fragment>
    );
}

export default ProfilePage;