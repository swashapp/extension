import React from 'react';
import {
    MDBTable, MDBTableBody,
    MDBTableHead
} from 'mdbreact';
import PrivacySelector from '../microcomponents/PrivacySelector'
import CustomSnackbar from '../microcomponents/CustomSnackbar';

let currentDate = new Date();
const sampleMessage = {
    header: {
        privacyLevel: 0
    },
    data: {
        out: {
            url: "https://www.test.com/path1/path2/sample?var1=sample",
            time: currentDate.getTime(),
            timeString: currentDate.toString(),
            text: "A sentence containing Swash",
            id: "324242342",
            userInfo: "John Doe",
            userAttr: "male"
        },
        schems: [
            { jpath: "$.url", type: "url" },
            { jpath: "$.time", type: "time" },
            { jpath: "$.timeString", type: "timeString" },
            { jpath: "$.text", type: "text" },
            { jpath: "$.id", type: "id" },
            { jpath: "$.userInfo", type: "userInfo" },
            { jpath: "$.userAttr", type: "userAttr" },
        ]
    }
}

const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";

const privacyData = [{ value: "Swash" }];

const dataTypes = [{ name: "url", title: "URL" },
    { name: "time", title: "Time" },
    { name: "timeString", title: "TimeString" },
    { name: "text", title: "Text" },
    { name: "id", title: "Id" },
    { name: "userInfo", title: "User Info" },
    { name: "userAttr", title: "User Attribute" }] 

class PrivacyLevel extends React.Component {    

    constructor(props) {
        super(props);
        this.state = {
            level: this.props.level,
            message: {}
        };
    }

    componentDidMount() {
        sampleMessage.header.privacyLevel = this.state.level;
        window.helper.enforcePolicy(sampleMessage, mSalt, salt, privacyData).then(message => {
            this.setState({message: message});
        })
    }


    componentDidUpdate(prevProps) {
        if (prevProps.level !== this.props.level) {
			sampleMessage.header.privacyLevel = this.props.level;
			window.helper.enforcePolicy(sampleMessage, mSalt, salt, privacyData).then(message => {
            this.setState({message: message, level: this.props.level})
			})
		}
	}

    setPrivacy(value) {
        window.helper.updatePrivacyLevel(value).then(() => {
            sampleMessage.header.privacyLevel = value;
            window.helper.enforcePolicy(sampleMessage, mSalt, salt, privacyData).then(message => {
                this.setState({ level: value,
                    message: message
                })
                this.refs.notify.handleNotification('Saved Successfully', 'success');
            })
            
        });
    }

    render() {
        
        let privacyTableDataRows = dataTypes.map((row, id) => {
            return (<tr key={id} className="table-row">
                <td className="table-text table-text-bold">{row.title}</td>
                <td className="table-text">{this.state.message.data?this.state.message.data[row.name]:''}</td>
            </tr>)
        });
        const rangeSelector = (<PrivacySelector handleClick={(value) => this.setPrivacy(value)}
            activeNav={this.state.level} />);

        return (
            <>
                <div className="privacy-block">
                    {rangeSelector}

                </div>
                <div>
                    <MDBTable>

                        <MDBTableHead>
                            <tr className="table-head-row">
                                <th className="table-text table-head-text privacy-level-table-type-th">Type</th>
                                <th className="table-text table-head-text privacy-level-table-datatobesent-th">Data to be sent</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {privacyTableDataRows}
                        </MDBTableBody>
                    </MDBTable>
                </div>
                <CustomSnackbar
                    ref='notify'
                />
            </>
        );
    }
}

export default PrivacyLevel;