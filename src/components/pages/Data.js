import React from 'react'
import 'react-widgets/dist/css/react-widgets.css';
import 'react-notifications/lib/notifications.css';
import NumberPicker from 'react-widgets/lib/NumberPicker'

import simpleNumberLocalizer from 'react-widgets-simple-number';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DelaySend from '../microcomponents/DelaySend';

import remove from '../../assets/close-50.png'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,MDBModalBody,MDBModalHeader,
    MDBMask,MDBTable, MDBTableBody,
    MDBTableHead,MDBModalFooter,
    MDBCardImage,MDBModal,
    MDBCardBody,MDBContainer,
    MDBCardTitle,
    MDBCardText, MDBInput,
    MDBCardFooter,
    MDBBtn,
    MDBIcon
} from 'mdbreact';
import src1 from '../../assets/img-1.jpg';

simpleNumberLocalizer();


class DataPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        messages: [],
        delay:0
    };
      
    loadDelay() {
        window.helper.load().then(db => {
            let that = this;            
            this.setState({delay:db.configs.delay})
        });
    }


    componentDidMount() {
        this.loadDelay()
        //Load Messages
        let that = this;
        
        async function loader() {
            let retMessages = await window.helper.loadMessages();
            let db = await window.helper.load();
            let modules = db.modules;
            let delay = db.configs.delay*60000;
            let currentTime = Number((new Date()).getTime());
            let messages = [];
            for(let msgId in retMessages){
                let host = "Undetermined"
                let msg = retMessages[msgId].message;
                let percentage = Math.round((currentTime - retMessages[msgId].createTime)*100/delay);
                percentage = (percentage > 100)?100:percentage;
                try {
                    host = (new URL(msg.origin)).host;                  
                }
                catch(err) {
                    
                }               
                //delete msg.origin
                 messages.push({
                    percentage: percentage,
                    currentTime: currentTime,
                    msg: msg,
                    msgId: retMessages[msgId].id,
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
            var messages = this.state.messages.filter(function(msg, index, arr){
                return msg.msgId != message.msgId;
            });
            //clearTimeout(message.msgId);          
            window.helper.cancelSending(message.msgId);
            this.setState({messages : messages});
        };
        const saveDelay = (delay) => {
            window.helper.saveConfigs({delay: delay}).then(() => {
                NotificationManager.success('Configuration is updated successfully', 'Update Configuration');
            })
            
        };


        let collapses = this.state.messages.map((item)=>{
            return (<DelaySend isOpened={false} message={item} onDelete={deleteMsg} />);
        });

        
        return (
            <div id="settings-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Collected data</div>
                            <div className="swash-p">
                            The data collected from your browsing sessions is shown here before being sent. You can check and delete it here. You can also adjust the sending delay to a level that suits you.
                            </div>
                            <div>
                                <div className="form-caption">Delay data send</div>
                                <div>
                                    <NumberPicker
                                        onChange={value => saveDelay(value)}
                                        defaultValue={5}
                                        className="delayNumberPicker"
                                      />
                                      <div style={{marginLeft: "8px", height: "40px", float: "left", lineHeight: "40px"}} >Minutes</div>
                                </div>
                            </div>
                        </div>

                        
                        

                        <div className="setting-part">
                            {collapses}                    
                        </div>                         

                    </div>

                </React.Fragment>
                <NotificationContainer/>
            </div>
        );
    }
}


export default DataPage;