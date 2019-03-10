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

class GeneralApiPage extends React.Component {
    state = {
        modal1: false, addModal: false,
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
        console.log('did mount')
        if (this.props.resource[0]) {
            let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
            let resourse;
            for (let u in this.props.resource) {
                if (href === this.props.resource[u].name) {
                    resourse = this.props.resource[u];
                    break;
                }
            }
            ;
            if (resourse) {
                document.getElementById('enabled-switch').checked = resourse.is_enabled;
            }
            let content = [];
            if (resourse) {

                if (resourse.content)
                    for (let y in resourse.content) {
                        content.push({
							name: resourse.content[y].name,
                            title: resourse.content[y].title,
                            description: resourse.content[y].description,
                            is_enabled: resourse.content[y].is_enabled
                        })
                    }
                let browsing = [];
                if (resourse.browsing) {
                    for (let y in resourse.browsing) {
                        browsing.push({
							name: resourse.browsing[y].name,
                            title: resourse.browsing[y].title,
                            description: resourse.browsing[y].description,
                            is_enabled: resourse.browsing[y].is_enabled
                        })
                    }

                }
                let apiCall = [];
                if (!resourse.style) {
                    this.generateCss('red')
                } else {
                    this.generateCss('#' + resourse.style.mainColor)
                }
                if (resourse.apiCall) {
                    for (let y in resourse.apiCall) {
                        console.log('resourse.apiCall[y]', resourse.apiCall[y].name)
                        apiCall.push({
                            name: resourse.apiCall[y].name,							
                            title: resourse.apiCall[y].title,
                            description: resourse.apiCall[y].description,
                            is_enabled: resourse.apiCall[y].is_enabled
                        })
                    }
					let f  = setInterval(()=>{window.helper.isConnected(resourse.name).then(connected => {
						this.setState({connected:connected})
					});},1000);
					this.setState({intervalId: f});
                }
                console.log('setting state ', apiCall)
                this.setState({
                    resource: resourse,
					is_enabled:resourse.is_enabled,
                    page: href,
					url:resourse.URL[0],
					description:resourse.description,
                    activeNav: resourse.privacy_level,
					connected: resourse.access_token?true:false,
                    content: content,
                    browsing: browsing,
                    apiCall: apiCall,
                    title: resourse.title,
					name: resourse.name,
                    icon: resourse.icons[0],
					
                })

            } else {
                this.setState({x: !this.state.x})
                // this.setState({resource: resourse, page: href})
            }
            //this.setState({resource: resourse, page: href})
        }
    };

    componentDidUpdate() {
        console.log('did update')
        if (this.props.resource[0]) {
            let resourse;
            let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
            if (this.state.page !== href) {
                this.setState({page: href, content: [], browsing: [], apiCall: [], title: '', name: ''})
                for (let u in this.props.resource) {
                    if (href === this.props.resource[u].name)
                        resourse = this.props.resource[u];
                }
                ;
                let content = [];
                if (resourse.content) {
                    for (let y in resourse.content) {
                        content.push({
                            name: resourse.content[y].name,
							title: resourse.content[y].title,
                            description: resourse.content[y].description,
                            is_enabled: resourse.content[y].is_enabled
                        })
                    }
                }
                let browsing = [];
                if (resourse.browsing) {
                    for (let y in resourse.browsing) {
                        console.log('resourse.content[y]', resourse.browsing[y].name)
                        browsing.push({
                            name: resourse.browsing[y].name,							
                            title: resourse.browsing[y].title,
                            description: resourse.browsing[y].description,
                            is_enabled: resourse.browsing[y].is_enabled
                        })
                    }
                }

                let apiCall = [];
                if (resourse.apiCall) {
                    for (let y in resourse.apiCall) {
                        console.log('resourse.apiCall[y]', resourse.apiCall[y].name)
                        apiCall.push({
                            name: resourse.browsing[y].name,							
                            title: resourse.apiCall[y].title,
                            description: resourse.apiCall[y].description,
                            is_enabled: resourse.apiCall[y].is_enabled
                        })
                    }
                }
                console.log('setting state ', apiCall)

                setTimeout(() => {
                    this.generateCss('#' + resourse.style.mainColor)
                    console.log("{resource: resourse, page: href,activeNav:resourse.privacy_level,content:content,browsing:browsing}", {
                        resource: resourse,
                        page: href,
                        activeNav: resourse.privacy_level,
						connected: resourse.access_token?true:false,						
                        content: content,
                        browsing: browsing
                    })
                    this.setState({
                        resource: resourse,
                        page: href,url:resourse.URL[0],
                        activeNav: resourse.privacy_level,
						connected: resourse.access_token?true:false,						
                        content: content,description:resourse.description,
                        browsing: browsing,is_enabled:resourse.is_enabled,
                        apiCall: apiCall,
                        title: resourse.title,
						name: resourse.name,
                        icon: resourse.icons[0]
                    })
                    document.getElementById('enabled-switch').checked = resourse.is_enabled;
                    this.setState({
                        resource: resourse,
                        page: href,url:resourse.URL[0],description:resourse.description,
                        is_enabled: resourse.is_enabled,
                        activeNav: resourse.privacy_level,
						connected: resourse.access_token?true:false,						
                        title: resourse.title,
						name: resourse.name,
                        apiCall: apiCall,
                        icon: resourse.icons[0]
                    })
                }, 250)

            }
        }
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
        if (x === 'addModal')
            this.setState({
                addModal: !this.state.addModal
            });
    };

    render() {
        const addModal = () => {

        };
        let table1 = {
            columns: [
                {
                    'label': 'Name',
                    'field': 'check',
                    'sort': 'asc'
                },
                {
                    'label': 'Value',
                    'field': 'Exception',
                    'sort': 'asc'
                }, {
                    'label': 'Type',
                    'field': 'Exception',
                    'sort': 'asc'
                }, {
                    'label': 'Delete',
                    'field': 'Exception',
                    'sort': 'asc'
                },
            ],
            rows: [
                {
                    'Name': 'Test',
                    'Exception': 'SignUp',
                    'Type': 'Url',
                    'Delete': <MDBBtn color="red" size="sm">X</MDBBtn>
                },
            ]
        };
        const handleClick = (id) => {
            this.setState({activeNav: id})
        };
        const SaveException = (id) => {

        };
        const savePrivacyLevel = (settings) => {
			settings.privacy_level = this.state.activeNav;
			settings.is_enabled = document.getElementById('enabled-switch').checked;
            this.state.resource.privacy_level = settings.privacy_level
            this.state.resource.is_enabled = settings.is_enabled
        }
        const saveContent = (settings) => {
            let uz = {};
			settings.content = {};
            for (let y in this.state.content) {
                let f = document.getElementById('content' + y).checked;
                uz[this.state.content[y].name] = f;
				let name = this.state.content[y].name;
				settings.content[this.state.content[y].name] = f;

            }
            for (let x in this.state.resource.content) {
                this.state.resource.content[x].is_enabled = uz[this.state.resource.content[x].name];
            }			

        }
        const saveBrowsing = (settings) => {
            console.log('browsing')
			settings.browsing = {};
            let uz = {};
            for (let y in this.state.browsing) {
                let f = document.getElementById('browsing' + y).checked;
                uz[this.state.browsing[y].name] = f;
				settings.browsing[this.state.browsing[y].name] = f;
            }
            for (let x in this.state.resource.browsing) {
                this.state.resource.browsing[x].is_enabled = uz[this.state.resource.browsing[x].name];
            }
        }
        const saveApiCall = (settings) => {
            console.log('apiCall')
			settings.apiCall = {};
            let uz = {};
            for (let y in this.state.apiCall) {
                let f = document.getElementById('apiCall' + y).checked;
                uz[this.state.apiCall[y].name] = f;
				settings.apiCall[this.state.apiCall[y].name] = f;
            }
            for (let x in this.state.resource.apiCall) {
                this.state.resource.apiCall[x].is_enabled = uz[this.state.resource.apiCall[x].name];
            }
        }
        const changeCheckBox = (e) => {
            console.log('e', e.target, e.target.checked, e.id);
            if (e.target.id.indexOf('content') !== -1) {
                let id = e.target.id.substring(7);
                console.log('id', id)
                let content = this.state.content;
                content[id].is_enabled = e.target.checked
                this.setState({content: content})
            }
            if (e.target.id.indexOf('apiCall') !== -1) {
                let id = e.target.id.substring(7);
                console.log('id', id)

                let apiCall = this.state.apiCall;
                apiCall[id].is_enabled = e.target.checked
                this.setState({apiCall: apiCall})
            }
            if (e.target.id.indexOf('browsing') !== -1) {
                let id = e.target.id.substring(8);
                console.log('id', id)

                let browsing = this.state.browsing;
                console.log('browsing', browsing)

                browsing[id].is_enabled = e.target.checked
                this.setState({browsing: browsing})
            }

        };
        const switchChange = ()=>{
            console.log('switch changed',this.state.is_enabled,document.getElementById('enabled-switch').checked)
            this.setState({is_enabled:!this.state.is_enabled})
        };
        const saveAll = ()=>{
            this.setState({
                modal1: !this.state.modal1
            })        };
        const saveAllConfirm = ()=>{
			var settings = {};
			savePrivacyLevel(settings)
			saveApiCall(settings)
			saveContent(settings)
			saveBrowsing(settings)
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
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal2} toggle={() => this.toggle('2')}>
                        <MDBModalHeader toggle={() => this.toggle('2')}>User Searches</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed bordered>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={table1.rows}/>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('2')}>Close</MDBBtn>
                            <MDBBtn color="primary">Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer><MDBContainer>
                <MDBModal size="lg" isOpen={this.state.modal3} toggle={() => this.toggle('3')}>
                    <MDBModalHeader toggle={() => this.toggle('3')}>User Experience</MDBModalHeader>
                    <MDBModalBody>
                        <MDBTable btn fixed bordered>
                            <MDBTableHead columns={table1.columns}/>
                            <MDBTableBody rows={table1.rows}/>
                        </MDBTable>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={() => this.toggle('3')}>Close</MDBBtn>
                        <MDBBtn color="primary">Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
                <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.addModal} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('addModal')}>Add New Exception</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                label="Name"
                                error="wrong"
                                success="right"
                            /><MDBInput
                            label="Value"
                            error="wrong"
                            success="right"
                        />
                            <select className="browser-default custom-select">
                                <option>Type of Exception</option>
                                <option value="1">Url</option>
                                <option value="2">Regular Expression</option>
                                <option value="3">Wild Card</option>
                            </select>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => SaveException}>Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <img className='general-api-logo' src={'data:image/png;base64,' + this.state.icon}/>

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
                {this.state.resource ? this.state.browsing && this.state.resource["functions"].includes('browsing') ?

                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <MDBCardBody>
                                            <MDBCardTitle>Browsing Data</MDBCardTitle>
                                            <div className={'row'}>

                                                {this.state.browsing.map((ob, id) =>
                                                    <div className="col-md-2 col-lg-4">
                                                        <MDBInput label={ob.title} filled checked={ob.is_enabled}
                                                                  onChange={changeCheckBox} type="checkbox"
                                                                  id={'browsing' + id}/>

                                                    </div>)}
                                            </div>


                                        </MDBCardBody>
                                    </div>
                                    <div className="col-md-6">

                                    </div>
                                </div>
                                {/*<MDBBtn onClick={saveBrowsing} color="secondary">Confirm</MDBBtn>*/}

                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : '' : ''}

                {this.state.resource && this.state.resource["functions"].includes('apiCall') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')}>
                                <MDBCardBody>
                                    <MDBCardTitle>API Call</MDBCardTitle>
                                    {this.state.connected === false ?
                                        <MDBBtn onClick={connect} color="indigo">                        <img className='general-api-logo-2' src={'data:image/png;base64,' + this.state.icon}/>
 Connect to
                                            {' ' + this.state.resource.name}</MDBBtn> : ''
                                    } {this.state.connected === true ?
                                    <MDBBtn onClick={disconnect} color="indigo">                        <img className='general-api-logo-2' src={'data:image/png;base64,' + this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                {this.state.connected === 'connecting' ?
                                    <MDBBtn onClick={disconnect} color="red">                        <img className='general-api-logo-2' src={'data:image/png;base64,' + this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody >
                                                <div className={'row'}>

                                                    {this.state.apiCall.map((ob, id) =>
                                                        <div className="col-md-2 col-lg-4">
                                                            <MDBInput label={ob.title} onChange={changeCheckBox} filled
                                                                      checked={ob.is_enabled} type="checkbox"
                                                                      id={'apiCall' + id}></MDBInput>

                                                        </div>)}
                                                </div>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    {/*<MDBBtn color="secondary">Confirm</MDBBtn>*/}
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}
                {this.state.resource && this.state.content && this.state.resource["functions"].includes('content') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')}>
                                <MDBCardBody>
                                    <MDBCardTitle>Content Data</MDBCardTitle>
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>

                                                <MDBRow className="justify-content-left">
                                                    {this.state.content.map((ob, id) => <MDBCol md="2" lg="4">
                                                            <MDBInput label={ob.title} filled onChange={changeCheckBox}
                                                                      checked={ob.is_enabled} type="checkbox"
                                                                      id={'content' + id}/>
                                                        </MDBCol>
                                                    )}
                                                </MDBRow>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    {/*<MDBBtn onClick={saveContent} color="secondary">Confirm</MDBBtn>*/}
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}

            </div>
        )
    }
}
export default withRouter(GeneralApiPage);
