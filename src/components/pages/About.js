import React from 'react'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,
    MDBCardBody,MDBContainer,
    MDBCardTitle,
    MDBCardText,
    MDBCardFooter,
} from 'mdbreact';

class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {			
			name: "",
			description: "",
			version: "",
			homepage: ""
		};
    }

    componentDidMount() {
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
	
    render() {
        
        return (
            <div id="about">
                <React.Fragment>
                    
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
															<a href="#"><u><small>Licensing Information</small></u></a>
														</MDBCol>
														<MDBCol md="4">
															<a href="#"><u><small>End-User Rights</small></u></a>
														</MDBCol>
														<MDBCol md="4">
															<a href="#"><u><small>Privacy Policy</small></u></a>
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