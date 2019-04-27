import React from 'react';
import {withRouter} from 'react-router-dom';

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

class Module extends React.Component {
    state = {
        modal1: false,
        modal2: false, activeNav: 0, resource: false,
        modal3: false, connected: false, x: false
    };
    componentWillUnmount(){
        try {
            clearInterval(this.state.intervalId)
        }
        catch(e){
			
		}
    }
    componentDidMount() {
        if (this.props.resource[0]) {
			console.log(this.props.resource)
            let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
            let module;
			let views = {};
            for (let u in this.props.resource) {
                if (href === this.props.resource[u].name) {
                    module = this.props.resource[u];
                    break;
                }
            }
            if (module) {
                document.getElementById('enabled-switch').checked = module.is_enabled;
            }
			if(module)
			{
				for(let view of module.viewGroups) {
					views[view.name] = {
						name: view.name,
						title: view.title,
						items: []
						}
				}
				let functions = module.functions;
				for(let func of functions) {
					if(module[func]) {
						let index = 0
						for (let item of module[func]) {
							views[item.viewGroup].items.push({
								name: item.name,
								title: item.title,
								description: item.description,
								is_enabled: item.is_enabled,
								func: func,
								index: index
							})
							index++;
						}
					}
				}
			}
            
			if (!module.style) {
				this.generateCss('red')
			} else {
				this.generateCss('#' + module.style.mainColor)
			}
			
			if (module.apiCall) {			  
				let f  = setInterval(()=>{window.helper.isConnected(module.name).then(connected => {
					this.setState({connected:connected})
				});},1000);
				this.setState({intervalId: f});
			}                

			this.setState({
				module: module,
				is_enabled: module.is_enabled,
				page: href,
				url:module.URL[0],
				description:module.description,
				activeNav: module.privacy_level,
				connected: module.access_token?true:false,
				views: views,
				title: module.title,
				name: module.name,
				icon: module.icons[0],				
			})

		} else {
			this.setState({x: !this.state.x})
		}
    };

    componentDidUpdate() {
    }

    generateCss(style) {
        console.log('stylestylestyle ', style)
        if (!style) {
            style = 'red'
        }
        console.log('style ', style)
        let i = `
        #general-api-wrapper .btn-secondary{
        background: ` + style + `!important;
        }
        #general-api-wrapper .nav-h.ok{
                 box-shadow:0 0 7px 2px ` + style + `!important;
 background: ` + style + `!important;
 }
        #general-api-wrapper .nav-bar-line.active{
                border-bottom: 3px solid ` + style + `;
        }
        #general-api-wrapper .nav-selected{
            border: 5px solid ` + style + `;
        }
        #general-api-wrapper input[type="checkbox"].switch:checked + div{
                background-color: ` + style + `!important;
        }
        .btn-indigo {
    background-color:` + style + ` !important;
    color: #fff !important;
}
#general-api-wrapper .form-check-input[type=checkbox].filled-in:checked+label:after, label.btn input[type=checkbox].filled-in:checked+label:after {
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  background-color: ` + style + `;
  z-index: 0;
}

        `
        console.log('xxxxxxxxxx')
        document.getElementById('theme').innerHTML = i
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
        const handleClick = (id) => {
            this.setState({activeNav: id})
        };

        const savePrivacyLevel = (settings) => {
			settings.privacy_level = this.state.activeNav;
			settings.is_enabled = document.getElementById('enabled-switch').checked;
            this.state.module.privacy_level = settings.privacy_level
            this.state.module.is_enabled = settings.is_enabled
        }
        const changeCheckBox = (e) => {
			let viewName = e.target.id.split("-")[0];
			let id = e.target.id.split("-")[1];
			let views = this.state.views;
			views[viewName].items[id].is_enabled = e.target.checked;
			this.setState({views: views});
        };
        const switchChange = ()=>{
            console.log('switch changed',this.state.is_enabled,document.getElementById('enabled-switch').checked)
            this.setState({is_enabled:!this.state.is_enabled})
        };
        const saveAll = ()=>{
            this.setState({
                modal1: !this.state.modal1
            })        
		};
		
        const saveViews = (settings) => {
			for(let func of this.state.module.functions) {
				settings[func] = {}
			}			
			let views = this.state.views
            for (let viewName in views) {
				{
					for (let itemId in views[viewName].items) {
						let f = document.getElementById(viewName + "-" + itemId).checked;
						settings[views[viewName].items[itemId].func][views[viewName].items[itemId].name] = f;
						views[viewName].items[itemId].is_enabled = f;
						this.state.module[views[viewName].items[itemId].func][views[viewName].items[itemId].index].is_enabled = f;
					}
				}				
            }
			this.setState({views: views, module: this.state.module});
        }
        const saveAllConfirm = ()=>{
			var settings = {};
			savePrivacyLevel(settings)
			saveViews(settings)
			let moduleName = this.state.name;
			window.helper.config_module(moduleName, settings).then(()=>{
				this.setState({
					modal1: !this.state.modal1
				})
			});		
			
			console.log('save allll')
        };
		const connect = ()=>{
			window.helper.startAuth(this.state.name).then(x => {
				let moduleName = this.state.name;                                               
                this.setState({connected:'connecting'})				
			});
		}
		const disconnect = ()=>{
			window.helper.removeAuth(this.state.name).then(x => {
				let moduleName = this.state.name;
				window.helper.isConnected(moduleName).then(connected => {
					this.state.connected = connected;
				});
			});
		}

		
        return (
            <div id="general-api-wrapper">
                <div className={'save-bt-fix'}><i onClick={saveAll} className={'fa fa-save'}/></div>
                <div id='xx' className='col-md-12'>
                    <MDBCard className="d-flex mb-2">
                        <MDBCardBody>
                            <div className={'container-fluid'}>
                                <div className="row">
                                    <div className="col-md-2 back-bt"
                                         onClick={() => this.props.history.push('/modules')}>
                                        <i className='fa fa-arrow-left'/>
                                    </div>
                                    <div className="col-md-7 back-bt module-title" id={'api-name'}>
                                        {this.state.name}
                                    </div>
                                    <div className="col-md-3 back-bt">
                                        <div className='row'>

                                            <div className="col-md-6">Status :</div>
                                            <div className="col-md-6">
                                                <input onChange={switchChange} id='enabled-switch' className='switch' type='checkbox'/>
                                                <div className='switch-wrap'>
                                                    <p className="enabled"></p>
                                                    <p className="disabled"></p>
                                                    <div className='enable-circle'></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </div>
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal1} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('1')}>Save Configurations</MDBModalHeader>
                        <MDBModalBody>
                            <h5>By clicking on "Confirm" Your changes will take effect immediately.</h5>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('1')}>Close</MDBBtn>
                            <MDBBtn onClick={saveAllConfirm} color="secondary">Confirm Changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <img className='general-api-logo' src={this.state.icon}/>

                        <MDBCard className="d-flex mb-2" style={{    minHeight: '220px'}}>
                            <MDBCol md="6" lg="6">

                                <MDBCardBody>
                                    {/*<h2 style={{fontWeight: '600', padding: ' 5px 0 30px 0'}}>{this.state.title}</h2>*/}

                                    <p className="input-p">
                                        {this.state.description}
                                    </p>
                                    <h4 className="input-p">
                                        {this.state.url}
                                    </h4>
                                    {/*<div className="my-3">*/}
                                    {/*<label htmlFor="customRange1">Privacy Level</label>*/}
                                    {/*<input type="range" className="custom-range" id="customRange1"/>*/}
                                    {/*</div>*/}
                                </MDBCardBody>
                            </MDBCol>

                            {/*<MDBBtn onClick={()=>{savePrivacyLevel()}} color="secondary">Confirm</MDBBtn>*/}

                        </MDBCard>

                    </MDBCol>

                </MDBRow>

                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">

                        <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')} >

                            <MDBCol md="6" lg="6">

                                <MDBCardBody>
                                    <MDBCardTitle>Privacy Level</MDBCardTitle>

                                    {/*<h2 style={{fontWeight: '600', padding: ' 5px 0 30px 0'}}>{this.state.title}</h2>*/}
                                    <div className={'n-v-w'}>
                                        <NavBar handleClick={handleClick} navs={['', '', '', '', '']}
                                                activeNav={this.state.activeNav}/>
                                    </div>
                                </MDBCardBody>
                            </MDBCol>

                            {/*<MDBBtn onClick={()=>{savePrivacyLevel()}} color="secondary">Confirm</MDBBtn>*/}

                        </MDBCard>

                    </MDBCol>

                </MDBRow>
                {this.state.views? Object.keys(this.state.views).map((key,index) =>
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')}>
                                <MDBCardBody>
                                    <MDBCardTitle>{this.state.views[key].title}</MDBCardTitle>
                                    {key=="API" && this.state.connected === false ?
                                        <MDBBtn onClick={connect} color="indigo">                        <img className='general-api-logo-2' src={this.state.icon}/>
 Connect to
                                            {' ' + this.state.module.name}</MDBBtn> : ''
                                    } {key=="API" && this.state.connected === true ?
                                    <MDBBtn onClick={disconnect} color="indigo">                        <img className='general-api-logo-2' src={this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                {key=="API" && this.state.connected === 'connecting' ?
                                    <MDBBtn onClick={disconnect} color="red">                        <img className='general-api-logo-2' src={this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody >
                                                <div className={'row'}>

                                                    {this.state.views[key].items.map((ob, id) =>
                                                        <div className="col-md-2 col-lg-4">
															<div style={{ display: "flex" }}>
															<MDBTooltip	placement="top" color="green" tooltipContent={ob.description}>
																<MDBInput label={ob.title} onChange={changeCheckBox} filled
																		  checked={ob.is_enabled} type="checkbox"
																		  id={this.state.views[key].name + "-" + id}></MDBInput>
															</MDBTooltip>
															</div>

                                                        </div>)}
                                                </div>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>                                    
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>):''}

            </div>
        )
    }
}
export default withRouter(Module);
