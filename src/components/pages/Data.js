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
        this.state = {          
            email: "",
            walletId: "",
            delay: 0
        };
    }

    componentDidMount() {
        this.loadSettings()
    }
      
    loadSettings() {
        // window.helper.load().then(db => {
        //  //document.getElementById('push').checked = db.configs.pushStatus;
        //  document.getElementById('email').setAttribute('valuex','1') ;
        //  document.getElementById('wallet').setAttribute('valuex','1') ;
        //  let email = db.profile.email;
        //  let walletId = db.profile.walletId;
        //  let that = this;            
  //           this.setState({email:email, walletId:walletId, delay:db.configs.delay})
        // });
    }
    handleChange(delay) {
        this.setState({delay: delay});
    }
    
    render() {
        let dataToBeSend = [
            {
                domain: "en.wikipedia.org",
                module: "BROWSE",
                dalay: 60,
                data: "{\r\n    \"header\": {\r\n        \"function\": \"browsing\",\r\n        \"module\": \"Surfing\",\r\n        \"collector\": \"Page Visit\",\r\n        \"privacyLevel\": 3,\r\n        \"version\": \"0.7.8\"\r\n    },\r\n    \"data\": {\r\n        \"url\": \"https:\/\/en.wikipedia.org\/9b43\/71672544\"\r\n    },\r\n    \"identity\": {\r\n        \"uid\": \"e9810fa424aeabf40e1dc0dad5eb02e6240e7530bc3ee836703df0d6ab60d284\",\r\n        \"walletId\": \"\",\r\n        \"email\": \"\"\r\n    }\r\n}"
            },
            {
                domain: "en.wikipedia.org",
                module: "BROWSE",
                dalay: 40,
                data: "{\r\n    \"header\": {\r\n        \"function\": \"browsing\",\r\n        \"module\": \"Surfing\",\r\n        \"collector\": \"Page Visit\",\r\n        \"privacyLevel\": 3,\r\n        \"version\": \"0.7.8\"\r\n    },\r\n    \"data\": {\r\n        \"url\": \"https:\/\/en.wikipedia.org\/9b43\/71672544\"\r\n    },\r\n    \"identity\": {\r\n        \"uid\": \"e9810fa424aeabf40e1dc0dad5eb02e6240e7530bc3ee836703df0d6ab60d284\",\r\n        \"walletId\": \"\",\r\n        \"email\": \"\"\r\n    }\r\n}"
            },
            {
                domain: "en.wikipedia.org",
                module: "BROWSE",
                dalay: 30,
                data: "{\r\n    \"header\": {\r\n        \"function\": \"browsing\",\r\n        \"module\": \"Surfing\",\r\n        \"collector\": \"Page Visit\",\r\n        \"privacyLevel\": 3,\r\n        \"version\": \"0.7.8\"\r\n    },\r\n    \"data\": {\r\n        \"url\": \"https:\/\/en.wikipedia.org\/9b43\/71672544\"\r\n    },\r\n    \"identity\": {\r\n        \"uid\": \"e9810fa424aeabf40e1dc0dad5eb02e6240e7530bc3ee836703df0d6ab60d284\",\r\n        \"walletId\": \"\",\r\n        \"email\": \"\"\r\n    }\r\n}"
            },
            {
                domain: "en.wikipedia.org",
                module: "BROWSE",
                dalay: 50,
                data: "{\r\n    \"header\": {\r\n        \"function\": \"browsing\",\r\n        \"module\": \"Surfing\",\r\n        \"collector\": \"Page Visit\",\r\n        \"privacyLevel\": 3,\r\n        \"version\": \"0.7.8\"\r\n    },\r\n    \"data\": {\r\n        \"url\": \"https:\/\/en.wikipedia.org\/9b43\/71672544\"\r\n    },\r\n    \"identity\": {\r\n        \"uid\": \"e9810fa424aeabf40e1dc0dad5eb02e6240e7530bc3ee836703df0d6ab60d284\",\r\n        \"walletId\": \"\",\r\n        \"email\": \"\"\r\n    }\r\n}"
            },
            {
                domain: "reddit.com",
                module: "BROWSE",
                dalay: 60,
                data: "{\r\n    \"header\": {\r\n        \"function\": \"browsing\",\r\n        \"module\": \"Surfing\",\r\n        \"collector\": \"Page Visit\",\r\n        \"privacyLevel\": 3,\r\n        \"version\": \"0.7.8\"\r\n    },\r\n    \"data\": {\r\n        \"url\": \"https:\/\/en.wikipedia.org\/9b43\/71672544\"\r\n    },\r\n    \"identity\": {\r\n        \"uid\": \"e9810fa424aeabf40e1dc0dad5eb02e6240e7530bc3ee836703df0d6ab60d284\",\r\n        \"walletId\": \"\",\r\n        \"email\": \"\"\r\n    }\r\n}"
            }
        ];

        let collapses = dataToBeSend.map((item)=>{
            return (<DelaySend isOpened={false} message={item} data={item.data} domain={item.domain} module={item.module} delay={item.delay} />);
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