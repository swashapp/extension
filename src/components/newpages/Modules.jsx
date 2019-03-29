import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import closeIcon from '../../statics/images/close-50.png';
import verifiedIcon from '../../statics/images/verified-account-30.png';
import lockedIcon from '../../statics/images/lock-100.png';
import blankIcon from '../../statics/images/blank-100.png';

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
    MDBModalFooter,
	MDBIcon
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Modules extends React.Component {
    state = {
        modal1: false, addModal: false,
        modal2: false, activeNav: 0, resources: [],
        modal3: false, connected: false,
		isHovering: {}
    };

    componentDidMount() {
        let resources = [];
        if (this.props.resource[0] && !this.state.resources[0]) {
            for (let i in this.props.resource) {
                console.log('x',this.props.resource[i])
                resources.push({title: this.props.resource[i].name, 
								icons: this.props.resource[i].icons,
								is_enabled:this.props.resource[i].is_enabled,
								is_verified:this.props.resource[i].is_verified,
								type:this.props.resource[i].type
								})
				this.state.isHovering[this.props.resource[i].name] = false;
            }
            console.log(resources)
            this.setState({resources: resources})
        }
    };

    componentDidUpdate() {
        let resources = [];
        if (this.props.resource[0] && !this.state.resources[0]) {
            for (let i in this.props.resource) {
                resources.push({title: this.props.resource[i].name, icons: this.props.resource[i].icons,is_enabled:this.props.resource[i].is_enabled})
            }
            console.log(resources)

            this.setState({resources: resources})
        }
    }

    render() {
        const redirect = (title) => {
            this.props.history.push('/apis/' + title)
        };
		
		const handleMouseHover = (id) => {
			this.state.isHovering[id] = !this.state.isHovering[id];
			this.setState({isHovering: this.state.isHovering});
		}
		
		const removeModule = (moduleName) => {
			window.helper.removeModule(moduleName);
		}
		
        return (<MDBRow id='modules-row' className="justify-content-left">
            {this.state.resources.map((ob, id) => <MDBCol key={id} md="4" lg="3">
                    <MDBCard  onMouseEnter={() => handleMouseHover(ob.title)} onMouseLeave={ () => handleMouseHover(ob.title)} className={(ob.is_enabled?'d-flex mb-2':'d-flex mb-2 disabled-module')}>
						<MDBRow>							
								<MDBCol md="10" className="offset-md-0">
									{this.state.isHovering[ob.title]?
									<div>
										{(ob.type == "native")?
											<img src={lockedIcon} height="20" width="20"/>
										:<img src={closeIcon} onClick={() => {removeModule(ob.title)}} height="20" width="20"/>}									
										{(ob.is_verified)?<img src={verifiedIcon} height="20" width="20" />:''
										}
									</div>
									:<div style = {{paddingTop : 20 }}/>}
								</MDBCol>
						</MDBRow>
                        <MDBCardBody onClick={() => redirect(ob.title)} className={(ob.is_enabled?'':'disabled-module')}>
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