import React, {Fragment} from 'react';
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
	MDBIcon,
	MDBView
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Modules extends React.Component {
	moduleTypes = [
		{
			type: "builtin",
			title: "Built-in Modules"
		},
		{
			type: "marketplace",
			title: "Marketplace Modules"
		},
	]
    state = {
        modal1: false, addModal: false,
        modal2: false, activeNav: 0,
		resources: [],
        modal3: false, connected: false,
		isHovering: {}
    };

    componentDidMount() {
        let resources = [];
        if (this.props.resource[0]) {
            for (let i in this.props.resource) {
				this.state.isHovering[this.props.resource[i].name] = false;
            }
            this.setState({resources: this.props.resource})
        }
    };

    componentDidUpdate() {
        let resources = [];
        if (this.props.resource[0] && !this.state.resources[0]) {
            for (let i in this.props.resource) {
                resources.push({
					name: this.props.resource[i].name,
					title: this.props.resource[i].title,
					icons: this.props.resource[i].icons,
					is_enabled:this.props.resource[i].is_enabled,
					type:this.props.resource[i].type
				})
            }

            this.setState({resources: resources})
        }
    }

    render() {
        const redirect = (name) => {
            this.props.history.push('/apis/' + name)
        };
		
		const handleMouseHover = (id) => {
			this.state.isHovering[id] = !this.state.isHovering[id];
			this.setState({isHovering: this.state.isHovering});
		}
		
		const removeModule = (moduleName) => {
			function arrayRemove(arr, value) {
			   return arr.filter(function(ele){
				   return ele.name != value;
			   });
			}
			window.helper.removeModule(moduleName).then(x => {				
				let modules = arrayRemove(this.state.resources, moduleName);
				this.setState({resources: modules});
				this.props.reload();
			});			
			
		}
		
        return (
				<>
				{this.moduleTypes.map((mOb,mId) => 
					<div>
					<MDBView className="border-bottom mb-3">
						<h4 className="h4-responsive text-black">{mOb.title}</h4>
					</MDBView>
					<Fragment>
						<MDBRow id='modules-row' className="justify-content-left mb-5">
						{this.state.resources.map((ob, id) => <>
						{(mOb.type == ob.type)? <MDBCol key={id} md="4" lg="3">
								<MDBCard  onMouseEnter={() => handleMouseHover(ob.name)} onMouseLeave={ () => handleMouseHover(ob.name)} className={(ob.is_enabled?'d-flex mb-2':'d-flex mb-2 disabled-module')}>
									<MDBRow>							
											<MDBCol md="10" className="offset-md-0">
												{this.state.isHovering[ob.name]?
												<div>
													{(ob.type == "builtin")?
														<img src={lockedIcon} height="20" width="20"/>
													:<img src={closeIcon} onClick={() => {removeModule(ob.name)}} height="20" width="20"/>}									
													{(ob.is_verified)?<img src={verifiedIcon} height="20" width="20" />:''
													}
												</div>
												:<div>
													<div height="20" width="20" style={{paddingTop:24.5}} />
												</div>}
											</MDBCol>
									</MDBRow>
									<MDBCardBody onClick={() => redirect(ob.name)} className={(ob.is_enabled?'':'disabled-module')}>
										<div className='module-wr module-logo-wr'><img src={ob.icons[0]}/>
										</div>
										<div className='module-wr'> {ob.name}</div>
									</MDBCardBody>
								</MDBCard>
							</MDBCol>
						:''}
						</>)}

					</MDBRow>
					</Fragment>
					</div>
				)}
			</>)
    }
}

export default withRouter(Modules);