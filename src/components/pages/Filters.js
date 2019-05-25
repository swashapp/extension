import React from 'react';
import { Route, Switch ,withRouter} from 'react-router-dom';
import remove from '../../assets/close-50.png'
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
    MDBView
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Filters extends React.Component {
    mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
    salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
	sampleId = "c1edf5cf-25ad-44bf-884a-f0b8416da28d";
    privacyData = [{value:"John"}, {value:"Doe"}, {value:"jdoe@gmail"}, {value:"22433223"}];	
    state = {
        addFilterModal:false,
        addMaskModal: false,
        maskGuideModal: false,
        filterGuideModal: false,
        activeNav: 0,
        resources: [],
        filters: [],
        msaks: [],
        pMessage: {
            data: {                
                texts: ["<b>John Doe</b> was born on February 25, 1953 in Decatur, Illinois, USA as <b>John</b> Nommenson Duchac. He is an actor, known for Road House",
                "Please send an e-mail to <b>jdoe@gmail</b> or call <b>22433223</b>."]
            }
        },
    };

    sampleMessage = {
        header: {
             privacyLevel: 0
        },
        data: {
            out: {
                texts: ["<b>John Doe</b> was born on February 25, 1953 in Decatur, Illinois, USA as <b>John</b> Nommenson Duchac. He is an actor, known for Road House",
                "Please send an e-mail to <b>jdoe@gmail</b> or call <b>22433223</b>."]                
            },
            schems: [                    
                    {jpath:"$.texts[*]", type: "text"}
                ]
        }
    }
    
    componentDidMount() {
        let resources =[];
		if(this.props.resource[0]&& !this.state.resources[0]){
			for(let i in this.props.resource){
				resources.push({title:this.props.resource[i].name,icon:''})
			}
			this.setState({resources:resources})
		}
		let that = this;
		async function loader() {
			let filters = await window.helper.loadFilters();
			let newFilters = [];
			for(let x in filters){
				 newFilters.push({
					'value': filters[x].value,
					'type':filters[x].type,
					'internal': filters[x].type,
					'delete':filters[x].internal?'':<img src={remove} style={{cursor: 'pointer'}} onClick={()=>{that.deleteFilterRecord(filters[x].value)}} height="20" width="20"/>
				})
			}

            let masks = await window.helper.loadPrivacyData();
			let newMasks = [];
			for(let x in masks){
				 newMasks.push({
					'value': masks[x].value,
					'delete':<img src={remove} style={{cursor: 'pointer'}} onClick={()=>{that.deleteMaskRecord(masks[x].value)}} height="20" width="20"/>                    
				})
			}
            
			that.setState({filters : newFilters, masks: newMasks})
		}
		loader();
    };

    componentDidUpdate() {
        let resources =[];
        if(this.props.resource[0]&& !this.state.resources[0]){
            for(let i in this.props.resource){
                resources.push({title:this.props.resource[i].name,icon:''})
            }
            this.setState({resources:resources})
        }
    }
    deleteFilterRecord(id){
        let newArray = [];
        let storageArray = [];
        for(let i in this.state.filters){
           
            if(this.state.filters[i].value !== id){
                newArray.push(this.state.filters[i]);
                storageArray.push({type: this.state.filters[i].type, value: this.state.filters[i].value, internal: this.state.filters[i].internal})
            }                    
        }
        window.helper.saveFilters(storageArray)        
        this.setState({filters: newArray});        
    }
    
    deleteMaskRecord(id){
        let newArray = [];
        let storageArray = [];
        for(let i in this.state.masks){

            if(this.state.masks[i].value !== id){
                newArray.push(this.state.masks[i]);
                storageArray.push({value:this.state.masks[i].value})

            }
        }
        window.helper.savePrivacyData(storageArray)
        this.setState({masks:newArray});
    }

    
    render(){
        let filtersTable = {
            columns: [
               
                {
                    'label': 'Value',
                    'field': 'value',
                    'sort': 'asc',
                    'minimal': 'lg'
                },{
                    'label': 'Type',
                    'field': 'Exception',
                    'sort': 'asc',
                    'minimal': 'sm'
                },{
                    'label': 'Delete',
                    'field': 'Action',
                    'sort': 'asc',
                    'minimal': 'sm'
                },
            ],
            rows: []
        };
        
         let masksTable = {
            columns: [
               
                {
                    'label': 'Value',
                    'field': 'value',
                    'sort': 'asc',
                    'minimal': 'lg'
                },{
                    'label': 'Delete',
                    'field': 'Action',
                    'sort': 'asc',
                    'minimal': 'sm'
                },
            ],
            rows: []
        };
        const  toggle = (x) => {
            if (x === 'filter')
                this.setState({
                    addFilterModal: !this.state.addFilterModal
                });
            if (x === 'mask')
                this.setState({
                    addMaskModal: !this.state.addMaskModal
                }); 
            if (x === 'maskGuide')
                this.setState({
                    maskGuideModal: !this.state.maskGuideModal
                }); 
             if (x === 'filterGuide')
                this.setState({
                    filterGuideModal: !this.state.filterGuideModal
                }); 
        };
        const addFilter = ()=>{
            let that = this;
            let f = {
                value : document.getElementById('filterValue').value,
                type  : document.getElementById('filterOption').value,
                internal: false
            };            
            let f1 = {
                value : f.value,
                type  : f.type,
				internal: false,
                'delete':<img src={remove} style={{cursor: 'pointer'}} onClick={()=>that.deleteFilterRecord(f.value)} height="20" width="20"/>                
            };
            let allow = true;
            window.helper.loadFilters().then(filter => {
                for(let i in filter){
                    if(filter[i].value === f.value){
                        allow = false ;                        
                    }
                }
                if(allow){                   
                  filter.push(f);
                  window.helper.saveFilters(filter);
                }else{
                    alert('duplicate')
                }
             
                }).then(() => {
                    window.helper.loadFilters();
                }).then(() => {		
                    if(allow){
                        this.state.filters.push(f1)
                        this.setState({filters: this.state.filters})
                    }                                    
                    toggle('filter')
                });                        
        };
        
        const addMask = () => {
            let that = this;
            let f = {
                value: document.getElementById('maskValue').value,
            };            
            let f1 = {
                value: f.value,
                'delete': <img src={remove} style={{cursor: 'pointer'}} onClick={() => that.deleteMaskRecord(f.value)} height="20" width="20"/>
            };

            let allow = true;
            window.helper.loadPrivacyData().then(pData => {
                for (let i in pData) {
                    if (pData[i].value === f.value) {
                        allow = false;
                    }
                }
                if (allow) {
                    pData.push(f);
                    window.helper.savePrivacyData(pData);
                    let i = this.state.masks;
                    i.push(f1)
                    this.setState({masks:i})
                } else {
                    alert('duplicate')
                }
                toggle('mask')
            })
        };
        
        
        const handleMask = (id) => {
            this.sampleMessage.header.privacyLevel = id;            
            window.helper.enforcePolicy(this.sampleMessage, this.mSalt, this.salt, this.privacyData).then((message)  => {
                this.setState({pMessage: message, activeNav: id});            
            })            
        };
                
     
        return ( 
        
            <MDBRow className="justify-content-left">
                
                <MDBModal size="lg" isOpen={this.state.filterGuideModal} toggle={() => toggle('filterGuide')}>
                        <MDBModalHeader toggle={() => toggle('filterGuide')}>Matching URLs Guide</MDBModalHeader>
                        <MDBModalBody>											
							<p>
                                Filtering mechanism is used to exclude domains and URLs that their data are not going to be sent to Streamr Marketplace. This mechanism is independent of modules filtering mechanism and is a complementary mechanism that gives a user the ability to enforce advanced filters by combining modules whitelist mechanism and filters blacklist mechanism. Filters can by defined in one of this ways:
                                <ul>
                                    <li>
                                        <b>Exacht Matching</b>: URLs with value exactly equal to this value will be excluded
                                    </li>
                                    <li>
                                        <b>Regular Expression Matching</b>: URLs that matches this regular expression will be exculded
                                    </li>
                                    <li>
                                        <b>Wildcard Matching</b>: URLs that matches this wildcard will be excluded
                                    </li>
                                </ul>
                                
							</p>														
							<h5>Exact Matching Examples</h5>
							<MDBTable>
								<MDBTableHead>
									<tr>
                                        <th>Pattern</th>
                                        <th>Description</th>									
									</tr>
								</MDBTableHead>
								<MDBTableBody>								
									<tr>
										<td class="text-highlight">
											https://www.streamr.com/core
										</td>
										<td>
											Match just https://www.streamr.com/core URL.
										</td>										
									</tr>
									<tr>
										<td class="text-highlight">
											https://www.streamr.com/login
										</td>
										<td>
											Match just https://www.streamr.com/login URL.
										</td>										
									</tr>									
								</MDBTableBody>
                            </MDBTable>
							
                            <h5>Reqular Expression Matching Examples</h5>
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
                                            https:\/\/(drive|docs|accounts)\.google\.com\/.*
                                        </td>
                                        <td>
                                            Match Google drive, docs, and accounts sub-domains
                                        </td>
                                        <td>
                                            http://accounts.google.com/
                                            <br/>
                                            http://drive.google.com/
                                            <br/>
                                            https://docs.google.com/
                                        </td>
                                    </tr>                                       
                                </MDBTableBody>
                            </MDBTable>

                            <h5>Wildcard Matching Examples</h5>
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
                                            *streamr.com*
                                        </td>
                                        <td>
                                            All Streamr domains and subdomains
                                        </td>
                                        <td>
                                            https://www.streamr.com/core
                                            <br/>
                                            https://marketplace.streamr.com/
                                        </td>
                                    </tr>                                       
                                </MDBTableBody>
                            </MDBTable>

                            </MDBModalBody>
                    </MDBModal>
            
            
            
                <MDBModal size="lg" isOpen={this.state.maskGuideModal} toggle={() => toggle('maskGuide')}>
                    <MDBModalHeader toggle={() => toggle('maskGuide')}>Text Masking Guide</MDBModalHeader>
                    <MDBModalBody>											
                        <p>
                            You can mask all your protected data in a text data type before being sent to Streamr Marketplace. The masknig mechanism transforms 
                            a text data type based on the privacy level. Consider we added <b>"John"</b>, <b>"Doe"</b>, <b>"jdoe@gmail.com"</b>, and <b>"22433223"</b> as protected data to "Text Masking" table. Just move the navigation bar to see what happens to these protected data in text data types.
                        </p>
                        <div className={'n-v-w mb-3'}>
                            <NavBar handleClick={handleMask} navs={['Lowest', 'Low', 'Medium', 'High', 'Highest']}
                            activeNav={this.state.activeNav}/>
                        </div>
                        
                        <MDBTable>
                        
                            <MDBTableHead>
                                <tr>                               
                                    <th>Data Before Privacy Enforcement</th>
                                    <th>Data After Privacy Enforcement</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {this.sampleMessage.data.out.texts.map((txt, id) => 
                                    <tr>                                    
                                        <td dangerouslySetInnerHTML={{__html: this.sampleMessage.data.out.texts[id]}}></td>
                                        <td dangerouslySetInnerHTML={{__html: this.state.pMessage.data.texts[id]}}></td>
                                    </tr>                                
                                )}                                
                            </MDBTableBody>
                        </MDBTable>
                        
                    </MDBModalBody>
                </MDBModal>
                
                
                
                <MDBModal size="md" isOpen={this.state.addFilterModal} toggle={() => toggle('filter')}>                    
                    <MDBModalHeader toggle={() => toggle('filter')}>Add New Filter</MDBModalHeader>
                    <MDBModalBody>
                        <MDBInput id={'filterValue'}
                            label="Value"
                            error="wrong"
                            success="right"
                        />
                        <select id='filterOption' className="browser-default custom-select">
                            <option value="exact">Exact</option>
                            <option value="regex">Regular Expression</option>
                            <option value="wildcard">Wild Card</option>
                        </select>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn onClick={addFilter} color="blue" >Save</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
                                
                <MDBModal size="md" isOpen={this.state.addMaskModal} toggle={() => toggle('mask')}>

                    <MDBModalHeader toggle={() => toggle('mask')}>Add New Mask</MDBModalHeader>
                    <MDBModalBody>
                        <MDBInput id={'maskValue'}
                                  label="Value"
                                  error="wrong"
                                  success="right"
                        />

                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn onClick={addMask} color="blue">Save</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>                
                
                
                <MDBRow className="justify-content-left mb-5">
                    <MDBCol md="10" lg="10" className="offset-md-1">
                        <MDBCard className="d-flex mb-2">
                            <MDBView className="customHeader">
                                <div className={'mg-tp-5'}>
                                    URLs to exclude                                    
                                    <i class="far fa-question-circle fa-x ml-1" onClick={() => toggle('filterGuide')} style={{cursor: 'pointer'}}></i>
                                </div>
                            </MDBView>
                            <MDBCol md="12" lg="12">
                                <MDBCardBody>
                                    <MDBTable btn fixed>
                                        <MDBTableHead columns={filtersTable.columns}/>
                                        <MDBTableBody rows={this.state.filters.map((f, index) => ({value: f.value, type: f.type, delete: f.delete}))}/>
                                    </MDBTable>
                                    <MDBRow>
                                        <MDBBtn onClick={() => toggle('filter')} color="blue"><i class="fa fa-plus" aria-hidden="true"></i>
                                        </MDBBtn>
                                    </MDBRow>                                                  
                                </MDBCardBody>
                            </MDBCol>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                
                
                <MDBRow className="justify-content-left">
                    <MDBCol md="10" lg="10" className="offset-md-1">
                        <MDBCard className="d-flex mb-2">                            
                            <MDBView className="customHeader">
                                <div className={'mg-tp-5'}>
                                    Text masking
                                    <i class="far fa-question-circle fa-x ml-1"  onClick={() => toggle('maskGuide')} style={{cursor: 'pointer'}}></i>
                                </div>
                            </MDBView>
                            <MDBCol md="12" lg="12">
                                <MDBCardBody>
                                    <MDBTable btn fixed>
                                        <MDBTableHead columns={masksTable.columns}/>
                                        <MDBTableBody rows={this.state.masks}/>
                                    </MDBTable>
                                    <MDBRow>
                                        <MDBBtn onClick={() => toggle('mask')} color="blue"><i class="fa fa-plus" aria-hidden="true"></i>
                                        </MDBBtn>
                                    </MDBRow>                                                  
                                </MDBCardBody>
                            </MDBCol>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                
                
        </MDBRow>)
    }
}

export default withRouter(Filters);