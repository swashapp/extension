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
    MDBModalFooter,
	MDBPopover, 
	MDBPopoverBody, 
	MDBPopoverHeader,
	MDBIcon
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Module extends React.Component {
    mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
    salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
    privacyData = [{value:"SurfStreamr"}];
    message = {
        header: {
             privacyLevel: 0
        },
        data: {
            out: {
                url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                time: "1556528945964",
                timeString:"Mon Apr 29 2019 13:29:49 GMT+0430 (Iran Daylight Time)",
                text: "This is a simple Text That contains <b>SurfStreamr</b> as a personal data",
                id: "324242342",
                userInfo: "John Doe",
                userAttr: "male"
            },
            schems: [
                    {jpath:"$.url", type: "url"},
                    {jpath:"$.time", type: "time"},
                    {jpath:"$.timeString", type: "timeString"},
                    {jpath:"$.text", type: "text"},
                    {jpath:"$.id", type: "id"},
                    {jpath:"$.userInfo", type: "userInfo"},
                    {jpath:"$.userAttr", type: "userAttr"},
                ]
        }
    }
    state = {
        modal1: false,
        modal2: false,
		modal3: false,
        activeNav: 0,
        resource: false,
        connected: false,
		filter_editable: false,
		browsing_filter: [],
        x: false,
        activeNav2: 0,
        pMessage: {
            data: {
                url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                time: "1556528945964",
                timeString:"Mon Apr 29 2019 13:29:49 GMT+0430 (Iran Daylight Time)",
                text: "This is a simple Text That contains <b>SurfStreamr</b> as a personal data",
                id: "324242342",
                userInfo: "John Doe",
                userAttr: "male"
            }
        }
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
                activeNav2: 0,
				filter_editable: module.filter_editable,				
                pMessage: {
                    data: {
                        url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                        time: "1556528945964",
                        timeString:"Mon Apr 29 2019 13:29:49 GMT+0430 (Iran Daylight Time)",
                        text: "This is a simple Text That contains <b>SurfStreamr</b> as a personal data",
                        id: "324242342",
                        userInfo: "John Doe",
                        userAttr: "male"
                    }
                },
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
.fa-save, .fa-save:hover{
    background-color: ` + style + `;
}
.text-highlight {
	color: ` + style + `;
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
        
         const handleClick2 = (id) => {
            this.message.header.privacyLevel = id;
            window.helper.enforcePolicy(this.message, this.mSalt, this.salt, this.privacyData).then((message)  => {
                this.setState({pMessage: message, activeNav2: id});            
            })
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
		const saveMatchingUrls = (settings) => {
			if(this.state.filter_editable) {
				let urlsString = document.getElementById("matchingUrls").value;
				let urls = urlsString.split("\n").map((ob,id) => ob.trim(" \r"));
				settings.browsing_filter = {};
				settings.browsing_filter.urls = urls;
			}
		}
        const saveAllConfirm = ()=>{
			var settings = {};
			saveMatchingUrls(settings);
			savePrivacyLevel(settings)
			saveViews(settings)
			let moduleName = this.state.name;
			window.helper.config_module(moduleName, settings).then(()=>{
				this.props.reload();
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
				
				<MDBContainer>
                    <MDBModal size="fluid" isOpen={this.state.modal2} toggle={() => this.toggle('2')}>
                        <MDBModalHeader toggle={() => this.toggle('2')}>Privacy Enforcement Guide</MDBModalHeader>
                        <MDBModalBody>											
							<p>
								Before each message be sent to Streamr Marketplace a privacy enforcement mechanism will transform data. The mechanism works based on data type and privacy level. To show you how the privacy mechanism transform each data type, we provided some sample data types. Just move the navigation bar to see what happens to each data type.
							</p>
							<div className={'n-v-w'}>
								<NavBar handleClick={handleClick2} navs={['Lowest', 'Low', 'Medium', 'High', 'Highest']}
								activeNav={this.state.activeNav2}/>
							</div>
							<br/>
							<br/>
							<MDBTable>
								<MDBTableHead>
									<tr>
									<th>Data Type</th>
									<th>Data Before Privacy Enforcement</th>
									<th>Data After Privacy Enforcement</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td class="text-highlight">URL</td>
										<td>{this.message.data.out.url}</td>
										<td>{this.state.pMessage.data.url}</td>
									</tr>
									<tr>
										<td class="text-highlight">Time</td>
										<td>{this.message.data.out.time}</td>
										<td>{this.state.pMessage.data.time}</td>
									</tr>
									<tr>
										<td class="text-highlight">TimeString</td>
										<td>{this.message.data.out.timeString}</td>
										<td>{this.state.pMessage.data.timeString}</td>
									</tr>
									<tr>
										<td class="text-highlight">Text</td>
										<td dangerouslySetInnerHTML={{__html: this.message.data.out.text}}></td>
										<td dangerouslySetInnerHTML={{__html: this.state.pMessage.data.text}}></td>
									</tr>
									<tr>
										<td class="text-highlight">Id</td>
										<td>{this.message.data.out.id}</td>
										<td>{this.state.pMessage.data.id}</td>
									</tr>
									<tr>
										<td class="text-highlight">UserInfo</td>
										<td>{this.message.data.out.userInfo}</td>
										<td>{this.state.pMessage.data.userInfo}</td>
									</tr>
									<tr>
										<td class="text-highlight">UserAttr</td>
										<td>{this.message.data.out.userAttr}</td>
										<td>{this.state.pMessage.data.userAttr}</td>
									</tr>
								</MDBTableBody>
                            </MDBTable>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
				
				<MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal3} toggle={() => this.toggle('3')}>
                        <MDBModalHeader toggle={() => this.toggle('3')}>Matching URLs Guide</MDBModalHeader>
                        <MDBModalBody>											
							<p>
								All match patterns are specified as strings. Apart from the special &lt;all_urls&gt; pattern, match patterns consist of three parts: <i>scheme</i>, <i>host</i>, and <i>path</i>. The scheme and host are separated by ://.
									<br/>
									[scheme]://[host][path]
							</p>														
							<h2>Examples</h2>
							<MDBTable>
								<MDBTableHead>
									<tr>
									<th>Pattern</th>
									<th>Description</th>
									<th>Example Matches</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td class="text-highlight">
											&lt;all_urls&gt;
										</td>
										<td>
											Match all URLs.
										</td>
										<td>
											http://example.org/
											<br/>
											https://a.org/some/path/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*/*
										</td>
										<td>
											Match all HTTP, HTTPS URLs.
										</td>
										<td>
											http://example.org/
											<br/>
											https://a.org/some/path/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*.streamr.com/*
										</td>
										<td>
											Match all HTTP, HTTPS URLs that are hosted at "streamr.com" or one of its subdomains.
										</td>
										<td>
											http://streamr.com
											<br/>
											https://marketplace.streamr.com
											<br/>
											https://streamr.com/help/api
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://streamr.com/
										</td>
										<td>
											Match all HTTP, HTTPS and WebSocket URLs that are hosted at exactly "streamr.com/".											
										</td>
										<td>
											http://streamr.com/
											https://streamr.com/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://*/path
										</td>
										<td>
											Match HTTPS URLs on any host, whose path is "path".
										</td>
										<td>
											https://streamr.com/path
											<br/>
											https://marketplace.streamr.com/path
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com/*
										</td>
										<td>
											Match HTTPS URLs only at "streamr.com", with any URL path and URL query string.
										</td>
										<td>
											https://streamr.com/
											<br/>
											https://streamr.com/path
											<br/>
											https://streamr.com/path/to/doc?foo=1
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com/*/b/*/
										</td>
										<td>
											Match HTTPS URLs hosted on "streamr.com", whose path contains a component "b" somewhere in the middle. Will match URLs with query strings, if the string ends in a /.
										</td>
										<td>
											https://streamr.com/a/b/c/
											<br/>
											https://streamr.com/d/b/f/
											<br/>
											https://streamr.com/a/b/c/d/
										</td>
									</tr>
								</MDBTableBody>
                            </MDBTable>
							
							<h2>Invalid match patterns</h2>
							<MDBTable>
								<MDBTableHead>
									<tr>
									<th>Invalid pattern</th>
									<th>Reason</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td class="text-highlight">
											https://streamr.com
										</td>
										<td>
											No path.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.*.com/
										</td>
										<td>
											"*" in host must be at the start.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://*reamer.com/
										</td>
										<td>
											"*" in host must be the only character or be followed by ".".
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											http*://streamr.com/
										</td>
										<td>
											 	"*" in scheme must be the only character.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com:80/
										</td>
										<td>
											Host must not include a port number.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*
										</td>
										<td>
											Empty path: this should be "*://*/*".
										</td>
									</tr>									
								</MDBTableBody>
                            </MDBTable>

                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
				
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <img className='general-api-logo' src={this.state.icon}/>

                        <MDBCard className="d-flex mb-2" style={{    minHeight: '220px'}}>
                            <MDBCol md="6" lg="6">

                                <MDBCardBody>
									{this.state.filter_editable?<>									
										<MDBCardTitle>Matching URls
											<MDBBtn size="sm" onClick={() => this.toggle('3')} className="btn-primary-outline bg-transparent" color="white ">
												<i class="far fa-question-circle fa-2x"></i>
											</MDBBtn>
										</MDBCardTitle>
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text" id="basic-addon">
													<i className="fas fa-pencil-alt prefix"></i>
												</span>
											</div>
											<textarea className="form-control" id="matchingUrls" defaultValue={this.state.module.browsing_filter.urls.join("\n")} rows="5"></textarea>
										</div>
										</>
									:''}

                                    <p className="input-p">
                                        {this.state.description}
                                    </p>
                                    <h4 className="input-p">
                                        {this.state.url}
                                    </h4>
                                </MDBCardBody>
                            </MDBCol>
                        </MDBCard>

                    </MDBCol>

                </MDBRow>

                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">

                        <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')} >										
                                <MDBCardBody>
                                    <MDBCardTitle>Privacy Level
											<MDBBtn size="sm" onClick={() => this.toggle('2')} className="btn-primary-outline bg-transparent" color="white ">
												<i class="far fa-question-circle fa-2x"></i>
											</MDBBtn>										
									</MDBCardTitle>

                                    {/*<h2 style={{fontWeight: '600', padding: ' 5px 0 30px 0'}}>{this.state.title}</h2>*/}
                                    <div className={'n-v-w'}>
                                        <NavBar handleClick={handleClick} navs={['Lowest', 'Low', 'Medium', 'High', 'Highest']}
                                                activeNav={this.state.activeNav}/>
                                    </div>
                                </MDBCardBody>

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
															<MDBTooltip	placement="top" domElement>
																<div>
																	<MDBInput label={ob.title} onChange={changeCheckBox} filled
																			  checked={ob.is_enabled} type="checkbox"
																			  id={this.state.views[key].name + "-" + id}></MDBInput>
																</div>
																<div>
																	{ob.description}
																</div>
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
