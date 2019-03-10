import React from 'react';
import {ManualResource} from './ManualsDocs.jsx'
import {Route, Switch, withRouter} from 'react-router-dom';
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
import ReactMarkdown from 'react-markdown';
import NavBar from '../microcomponents/NavBar'

class Messages extends React.Component {
    state = {
        messages: []
    };
	
    componentDidMount() {
        //Load Messages
		let that = this;
		async function loader() {
			let retMessages = await window.helper.loadMessages();
			let modules = await window.helper.loadModules();
			let messages = [];
			for(let msgId in retMessages){
				let host = "Undetermined"
				let msg = retMessages[msgId];				
				try {
					host = (new URL(msg.origin)).host;					
				}
				catch(err) {
					
				}				
				delete msg.origin
				 messages.push({
                    msg: msg,
					msgId: msgId,
                    icon: modules[msg.header.module].icons[0],
                    link: host,
                    title: msg.header.module
                })
			}
			that.setState({messages : messages})
		}
		loader();
		this.interval = setInterval(loader, 1000);		
    };

    componentDidUpdate() {

    }
	
	componentWillUnmount() {
	  clearInterval(this.interval);
	}	

    render() {
        const deleteMsg = (message)=>{
            console.log('deleting msg ',message)			
			var messages = this.state.messages.filter(function(msg, index, arr){
				return msg.msgId != message.msgId;
			});
			//clearTimeout(message.msgId);			
			window.helper.cancelSending(message.msgId);
			this.setState({messages : messages});
        };
        return (
            <MDBContainer>
                <MDBRow id={'manual-row'} className="justify-content-left">

                    <MDBCol md="12" lg="12">

                        {this.state.messages[0] ? this.state.messages.map((ob, id) => <MDBCard key={id}
                                                                                               className="d-flex mb-2">
                            <MDBCol id={id} md="12" lg="12">

                                <MDBCardBody>
                                    <i className={'fa fa-arrow-down manual-page-arrow'}
                                       onClick={() => document.getElementById(id).classList.contains('full-expand') ? document.getElementById(id).classList.remove('full-expand') : document.getElementById(id).classList.add('full-expand')}/>
                                    <Message deleteMsg={deleteMsg} message={ob}/>
                                </MDBCardBody>
                            </MDBCol></MDBCard>
                        ) : ''}

                    </MDBCol>
                </MDBRow>
            </MDBContainer>)
    }
}

class Message extends React.Component {
    render() {

        return <div className={'row'}>
            <div className={'col-md-1'}>
                <i onClick={()=>this.props.deleteMsg(this.props.message)} className="fa fa-times-circle" style={{color:'red',fontSize:'20px',marginTop:'10px',cursor:'pointer'}}/>
            </div>
            <div className={'col-md-1'}>
                <img className={'message-icon'} src={'data:image/png;base64,'+this.props.message.icon} alt=""/>

            </div>
            <div className={'col-md-3'}>
                <h4 style={{padding: '0px 10px 20px'}}>
                    {this.props.message.title}
                </h4>
            </div>
            <div style={{marginTop:'5px'}} className={'col-md-7'}>
                {this.props.message.link}
            </div>

            <p><pre>{JSON.stringify(this.props.message.msg, null, 4)}</pre></p>
        </div>
    }
}

export default withRouter(Messages);