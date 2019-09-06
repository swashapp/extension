import React from 'react'
import {PrivacyPolicy} from './PrivacyPolicy.js'
import {License} from './License.js'
import ReactMarkdown from 'react-markdown'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,
    MDBCardBody,MDBContainer,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
	MDBModal,
	MDBModalHeader,
	MDBModalBody,
	MDBModalFooter,
	MDBBtn
} from 'mdbreact';

class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			privacyModal: false,
			name: "",
			description: "",
			version: "",
			homepage: "",
			PrivacyPolicy: "",
			License: ""
		};
    }

    componentDidMount() {
		this.setState({PrivacyPolicy: PrivacyPolicy, License: License});
        this.loadInfo()
    }
      
    loadInfo() {
		window.helper.load().then(db => {
            this.setState({
				name: db.configs.name,
				description: db.configs.description,
				version: db.configs.version,
				homepage: db.configs.homepage_url
			})
		});
    }
	
	toggle = (x) => {
		if (x === 'privacyModal')
            this.setState({
                privacyModal: !this.state.privacyModal
            });
        if (x === 'licensingModal')
            this.setState({
                licensingModal: !this.state.licensingModal
            });
        if (x === 'termsModal')
            this.setState({
                termsModal: !this.state.termsModal
            });        
    };
    render() {
        
        return (
            <div id="about">
                <React.Fragment>
					
					<MDBContainer>
						<MDBModal size="lg" isOpen={this.state.privacyModal} toggle={() => this.toggle('privacyModal')}>
							<MDBModalHeader toggle={() => this.toggle('privacyModal')}>Privacy Policy</MDBModalHeader>
							<MDBModalBody>
									<MDBCol md="12" lg="12" className={'full-expand'}>
										<MDBCardBody>
											<ReactMarkdown source={this.state.PrivacyPolicy}/>
										</MDBCardBody>
									</MDBCol>
							</MDBModalBody>
							<MDBModalFooter>
								<MDBBtn size="md" color="secondary" onClick={() => this.toggle('privacyModal')}>Close</MDBBtn>
								<MDBBtn size="md" color="secondary">Agree</MDBBtn>
							</MDBModalFooter>
						</MDBModal>
					</MDBContainer>
					
					<MDBContainer>
						<MDBModal size="lg" isOpen={this.state.licensingModal} toggle={() => this.toggle('licensingModal')}>
							<MDBModalHeader toggle={() => this.toggle('licensingModal')}>License</MDBModalHeader>
							<MDBModalBody>
									<MDBCol md="12" lg="12" className={'full-expand'}>
										<MDBCardBody>
											<ReactMarkdown source={this.state.License}/>
										</MDBCardBody>
									</MDBCol>
							</MDBModalBody>
						</MDBModal>
					</MDBContainer>
                    
                    <MDBRow className="justify-content-left">                  
                        <MDBCol md="12" lg="12">
                            <section className="text-center pb-3">
                                <MDBRow className="d-flex justify-content-left">
                                    <MDBCol lg="8" xl="8" className="mb-3 offset-md-2">
                                        <div className={'justify-content-left'}>
                                            <MDBCard className="d-flex mb-5">
                                                <MDBView>
                                                    <div className={'mg-tp-5'}>
                                                        About {this.state.name}
                                                    </div>
                                                </MDBView>
                                                <MDBCardBody>
													<MDBRow>
														<MDBCol md="4" className="d-flex justify-content-center text-center">
															<img src="../icons/surf128.png" height="128" width="128"></img>
														</MDBCol>
														<MDBCol md="8" className="text-left">
																<h1>{this.state.name}</h1>
																<b>Version: {this.state.version}</b><br/>
																<span>{this.state.description}</span>
														</MDBCol>
													</MDBRow>
                                                </MDBCardBody>

                                                <MDBCardFooter className="links-light profile-card-footer">
													<MDBRow className="justify-content-center">
														<MDBCol md="4">
															<a onClick={() => this.toggle('licensingModal')}><u><small>Licensing Information</small></u></a>
														</MDBCol>
														<MDBCol md="4">
															<a href="#"><u><small>End-User Rights</small></u></a>
														</MDBCol>
														<MDBCol md="4">
															<a onClick={() => this.toggle('privacyModal')}><u><small>Privacy Policy</small></u></a>
														</MDBCol>
													</MDBRow>
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
            </div>
        );
    }
}

export default AboutPage;