import React from 'react';
import { Route, Switch ,withRouter} from 'react-router-dom';
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

class Filters extends React.Component {
    state = {
        modal1: false,addModal:false,
        modal2: false, activeNav: 0, resources: [],
        modal3: false, connected: false,filters:[]
    };

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
					'Exception': filters[x].value,
					'Type':filters[x].type,
					'Delete':<MDBBtn onClick={()=>this.deleteRecords(filters[x].value)} color="red" size="sm"><i class="fa fa-trash" aria-hidden="true"></i></MDBBtn>
				})
			}
			that.setState({filters : newFilters})
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
    deleteRecords(id){
        let newArray = [];
        let storageArray = [];
        for(let i in this.state.filters){
            if(this.state.filters[i].Exception !== id){
                newArray.push(this.state.filters[i]);
                                storageArray.push({type:this.state.filters[i].Type,value:this.state.filters[i].Exception})

            }
         
            
        }
        window.helper.save(storageArray)
        this.setState({filters:newArray});
        
    }
        render(){
           let table1 = {
            columns: [
               
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
               
            ]
        };
         const  toggle = (x) => {
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
        const addFilter = ()=>{
            let f = {
                value : document.getElementById('value').value,
                type  : document.getElementById('option').value
            };
            let s =  document.getElementById('value').value;
           
            let f1 = {
                value : document.getElementById('value').value,
                type  : document.getElementById('option').value,
                'Delete':<MDBBtn onClick={()=>this.deleteRecords(s)} color="red" size="sm"><i class="fa fa-trash" aria-hidden="true"></i>
</MDBBtn>
            };
            window.helper.loadFilters().then(filter => {
				filter.push(f);
				window.helper.saveFilters(filter);
				}).then(() => {
					window.helper.loadFilters();
				}).then(() => {					
					this.state.filters.push(f1)
					toggle('addModal')
				});            
            
        };
        return ( <MDBContainer><MDBRow className="justify-content-left">
        <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.addModal} toggle={() => toggle('1')}>
                    
                        <MDBModalHeader toggle={() => toggle('addModal')}>Add New Filter</MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput id={'value'}
                                label="Value"
                                error="wrong"
                                success="right"
                            />
                            <select id='option' className="browser-default custom-select">
                                <option value='-1'>Type of Filter</option>
                                <option value="exact">Exact</option>
                                <option value="regex">Regular Expression</option>
                                <option value="wildcard">Wild Card</option>
                            </select>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn onClick={addFilter} color="blue" >Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
                    <MDBCol md="12" lg="12">
                   <MDBCard className="d-flex mb-2">
                            <MDBCol md="12" lg="12">
                            <MDBCardBody>
                            <MDBTable btn fixed bordered>
                                <MDBTableHead columns={table1.columns}/>
                                <MDBTableBody rows={this.state.filters}/>
                            </MDBTable>
                            <MDBRow>
                            <MDBBtn onClick={() => toggle('addModal')} color="blue"><i class="fa fa-plus" aria-hidden="true"></i>
</MDBBtn>
                            </MDBRow>
                                                   
                            </MDBCardBody>
                            </MDBCol></MDBCard>
                    </MDBCol></MDBRow></MDBContainer> )
    }
}

export default withRouter(Filters);