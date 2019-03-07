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
				let msg = retMessages[msgId];
				 messages.push({
                    msg: JSON.stringify(msg, null, 10),
                    icon: modules[msg.header.module].icons[0],
                    link: msg.origin,
                    title: msg.header.module
                })
			}
			that.setState({messages : messages})
		}
		loader();
    };

    componentDidUpdate() {

    }

    render() {
        const deleteMsg = (message)=>{
            console.log('delting msg ',message)
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

            <p>{this.props.message.msg}</p>
        </div>
    }
}

export default withRouter(Messages);