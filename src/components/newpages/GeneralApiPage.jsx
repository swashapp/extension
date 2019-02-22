import React from 'react';
import { withRouter} from 'react-router-dom';

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
        modal1: false,addModal:false,
        modal2: false, activeNav: 0, resource: false,
        modal3: false, connected: false
    };

    componentDidMount() {
        if(this.props.resource[0]){
        let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
        let resourse;
        for (let u in this.props.resource) {
            if (href === this.props.resource[u].name) {
                resourse = this.props.resource[u];
				break;
			}
        }
        ;
        if(resourse){
            document.getElementById('enabled-switch').checked = resourse.is_enabled;
        }
        if(resourse){
            let content = [];
            if(resourse.content)
                for (let y in resourse.content){
                    content.push({title:resourse.content[y].name,description:resourse.content[y].description,is_enabled:resourse.content[y].is_enabled})
        }
        let browsing = [];
        if(resourse.browsing){
            for (let y in resourse.browsing){
                browsing.push({title:resourse.browsing[y].name,description:resourse.browsing[y].description,is_enabled:resourse.browsing[y].is_enabled})
            }
            console.log('sadasd',resourse.style)
            if(!resourse.style){
                this.generateCss('red')
            }
             else{
                 this.generateCss('#'+resourse.style.mainColor)
             }
            this.setState({resource: resourse, page: href,activeNav:resourse.privacy_level,content:content,browsing:browsing,title:resourse.name,icon:resourse.icons[0]})
        }}
        else{
           // this.setState({resource: resourse, page: href})
        }
        //this.setState({resource: resourse, page: href})
        }
    };

    componentDidUpdate() {
        if(this.props.resource[0]){
        let resourse;
        let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
        if (this.state.page !== href) {
            this.setState({page :href,content:[],browsing:[],title:'',})
            for (let u in this.props.resource) {
                if (href === this.props.resource[u].name)
                    resourse = this.props.resource[u];
            };
            let content = [];
            if(resourse.content){
                for (let y in resourse.content){
                    content.push({title:resourse.content[y].name,description:resourse.content[y].description,is_enabled:resourse.content[y].is_enabled})
            }}
            let browsing = [];
            if(resourse.browsing){
                for (let y in resourse.browsing){
                    console.log('resourse.content[y]',resourse.browsing[y].name)
                    browsing.push({title:resourse.browsing[y].name,description:resourse.browsing[y].description,is_enabled:resourse.browsing[y].is_enabled})
            }}
            setTimeout(()=>{
                this.generateCss('#'+resourse.style.mainColor)
                console.log("{resource: resourse, page: href,activeNav:resourse.privacy_level,content:content,browsing:browsing}",{resource: resourse, page: href,activeNav:resourse.privacy_level,content:content,browsing:browsing})
                this.setState({resource: resourse, page: href,activeNav:resourse.privacy_level,content:content,browsing:browsing,title:resourse.name,icon:resourse.icons[0]})
            document.getElementById('enabled-switch').checked = resourse.is_enabled;
            this.setState({resource: resourse, page: href,is_enabled:resourse.is_enabled,activeNav:resourse.privacy_level,title:resourse.name,icon:resourse.icons[0]})},250)
            
        }
        }
    }
    generateCss (style){
        console.log('stylestylestyle ',style)
        if(!style){
            style = 'red'
        }
        console.log('style ',style)
        let i = `
        #general-api-wrapper .btn-secondary{
        background: `+style+`!important;
        }
        #general-api-wrapper .nav-h.ok{
                 box-shadow:0 0 7px 2px `+style+`!important;
 background: `+style+`!important;
 }
        #general-api-wrapper .nav-bar-line.active{
                border-bottom: 3px solid `+style+`;
        }
        #general-api-wrapper .nav-selected{
            border: 5px solid `+style+`;
        }
        #general-api-wrapper input[type="checkbox"].switch:checked + div{
                background-color: `+style+`!important;
        }
#general-api-wrapper .form-check-input[type=checkbox].filled-in:checked+label:after, label.btn input[type=checkbox].filled-in:checked+label:after {
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  background-color: `+style+`;
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
        const addModal = ()=>{

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
                },{
                    'label': 'Type',
                    'field': 'Exception',
                    'sort': 'asc'
                },{
                    'label': 'Delete',
                    'field': 'Exception',
                    'sort': 'asc'
                },
            ],
            rows: [
                {
                    'Name': 'Test',
                    'Exception': 'SignUp',
                    'Type':'Url',
                    'Delete':<MDBBtn color="red" size="sm">X</MDBBtn>
                },
            ]
        };
        const handleClick = (id) => {
            this.setState({activeNav: id})
        };const SaveException = (id) => {

        };
        const savePrivacyLevel = ()=>{
            let object = {};
            object[this.state.page] = {'privacyLevel':this.state.activeNav,enabled:document.getElementById('enabled-switch').checked}
			
            window.helper.save(object)
        }
        const saveContent = ()=>{
           let uz = {};
            for(let y in this.state.content){
                let f = document.getElementById('content'+y).checked;
                uz[this.state.content[y].title] = f                
            }
            window.helper.save(uz)
        }
        const saveBrowsing = ()=>{
            console.log('browsing')
            let uz = {};
            for(let y in this.state.browsing){
                let f = document.getElementById('browsing'+y).checked;
                uz[this.state.browsing[y].title] = f                
            }
            window.helper.save(uz)
        }
        return (
            <div id="general-api-wrapper">
            <div id='xx' className='col-md-2'>
                                <MDBCard className="d-flex mb-2">
                                <MDBCardBody>
                                <div className={'back-bt'} onClick={()=>this.props.history.push('/modules')}>
                                    {'< Back'} 
                                </div>
                                </MDBCardBody>
                                  </MDBCard>
        </div>
                <MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal1} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('1')}>Visited Urls</MDBModalHeader>
                        <MDBModalBody>
                            <MDBTable btn fixed bordered>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={table1.rows}/>
                            </MDBTable>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => this.toggle('1')}>Close</MDBBtn>
                            <MDBBtn onClick={() => this.toggle('addModal')} color="secondary">+</MDBBtn>
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
                       <img className='general-api-logo' src={'data:image/png;base64,'+this.state.icon}/>

                        <MDBCard className="d-flex mb-2">
                            <MDBCol md="6" lg="6">

                            <MDBCardBody>
                            <h2 style={{fontWeight:'600',padding:' 5px 0 30px 0'}}>{this.state.title}</h2>
                            <div className='row'>
                            
                            <div className="col-md-6">Status : </div>
                            <div className="col-md-6">
                    <input id='enabled-switch' className='switch' type='checkbox'/>
                    <div className='switch-wrap'>
                        <p className="enabled"></p>
                        <p className="disabled"></p>
                        <div className='enable-circle'></div>
                    </div>                            </div>

                </div>
                                <div className={'n-v-w'}>
                                    <NavBar handleClick={handleClick} navs={['', '', '', '', '']}
                                            activeNav={this.state.activeNav}/>
                                </div>
                                <p className="input-p">Blah Blah Blah</p>
                                {/*<div className="my-3">*/}
                                {/*<label htmlFor="customRange1">Privacy Level</label>*/}
                                {/*<input type="range" className="custom-range" id="customRange1"/>*/}
                                {/*</div>*/}
                            </MDBCardBody>
                            </MDBCol>
                            
                             <MDBBtn onClick={()=>{savePrivacyLevel()}} color="secondary">Confirm</MDBBtn>

                            </MDBCard>
                            
                    </MDBCol>
                    
                </MDBRow>
                {this.state.resource ?  this.state.browsing&&this.state.resource["functions"].includes('browsing') ?

                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className="d-flex mb-2 ">
                                <div className="row">
                                    <div className="col-md-12">
                                        <MDBCardBody>
                                            <MDBCardTitle>Browsing Data</MDBCardTitle>
                                                                                        <div className={'row'}>

                                            {this.state.browsing.map((ob,id)=>
                                                <div className="col-md-4 col-lg-3">
                                                    <MDBInput defaultChecked={ob.is_enabled} label={ob.title} filled type="checkbox" id={'browsing'+id}>

                                                    </MDBInput>
                                                
                                            </div>)}
                                                                                            </div>

                                            

                                        </MDBCardBody>
                                    </div>
                                    <div className="col-md-6">

                                    </div>
                                </div>
                                                                    <MDBBtn onClick={saveBrowsing} color="secondary">Confirm</MDBBtn>

                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : '' : ''}

                {this.state.resource && this.state.resource["functions"].includes('apiCall') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className="d-flex mb-2">
                                <MDBCardBody>
                                    {this.state.connected === false ?
                                        <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connect to
                                            {' ' + this.state.resource.name}</MDBBtn> : ''
                                    } {this.state.connected === 'connecting' ?
                                    <MDBBtn color="indigo"><i className="fab fa-facebook mr-3"/>Connecting</MDBBtn> : ''
                                }
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>
                                                <MDBCardTitle>User Info</MDBCardTitle>
                                                <MDBInput label="User Clicks" filled type="checkbox" id="uf1"/>
                                                <MDBInput label="User Reviewed Items" filled type="checkbox" id="uf2"/>
                                                <MDBInput label="Items Added to Cart" filled type="checkbox" id="uf3"/>
                                                <MDBInput label="Items Ready to Buy Now" filled type="checkbox"
                                                          id="uf4"/>
                                                <MDBInput label="Items Added to User's Wish List" filled type="checkbox"
                                                          id="uf5"/>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBBtn color="secondary">Confirm</MDBBtn>
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}
                {this.state.resource && this.state.content && this.state.resource["functions"].includes('content') ?
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className="d-flex mb-2">
                                <MDBCardBody>

                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody>
                                                <MDBCardTitle>User Info</MDBCardTitle>
                                                 <MDBRow className="justify-content-left">
                                                {this.state.content.map((ob,id)=><MDBCol md="4" lg="3">
                                                <MDBInput label={ob.title} defaultChecked={ob.is_enabled} filled type="checkbox" id={'content'+id}/></MDBCol>
                                                )}
                                                 </MDBRow>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>
                                    <MDBBtn onClick={saveContent} color="secondary">Confirm</MDBBtn>
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow> : ''}

            </div>
        )
    }
}

export default withRouter(GeneralApiPage);