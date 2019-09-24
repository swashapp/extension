import React from 'react';
import {
    MDBTable, MDBTableBody,
    MDBTableHead
} from 'mdbreact';

class PrivacyLevel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {level: this.props.level};
  }


  render() {
    // TODO table data
    let privacyTableData = [
      [
            {
                type: "URL",
                data: "www.test.com",
                refreshed: "-"
            },{
                type: "Time",
data: "Thu 15 Aug 2019",
refreshed: "-"
            },{
                type: "Text",
data: "A sentence containing *****",
refreshed: "-"
            },{
                type: "Id",
data: "e0ede487Xc0a2",
refreshed: "Every Hour"
            },{
                type: "Name",
data: "Cx53eeApH63xV2LqP0x33",
refreshed: "-"
            },{
                type: "Gender",
data: "zp93jY7eXcQsW8mNh33tY",
            refreshed: "-"
            }
        ],
        [
            {
                type: "URL",
                data: "www.test.com",
                refreshed: "-"
            },{
                type: "Time",
data: "Thu 15 Aug 2019",
refreshed: "-"
            },{
                type: "Text",
data: "A sentence containing *****",
refreshed: "-"
            },{
                type: "Id",
data: "e0ede487Xc0a2",
refreshed: "Every Hour"
            },{
                type: "Name",
data: "Cx53eeApH63xV2LqP0x33",
refreshed: "-"
            },{
                type: "Gender",
data: "zp93jY7eXcQsW8mNh33tY",
            refreshed: "-"
            }
        ],
        [
            {
                type: "URL",
                data: "www.test.com",
                refreshed: "-"
            },{
                type: "Time",
data: "Thu 15 Aug 2019",
refreshed: "-"
            },{
                type: "Text",
data: "A sentence containing *****",
refreshed: "-"
            },{
                type: "Id",
data: "e0ede487Xc0a2",
refreshed: "Every Hour"
            },{
                type: "Name",
data: "Cx53eeApH63xV2LqP0x33",
refreshed: "-"
            },{
                type: "Gender",
data: "zp93jY7eXcQsW8mNh33tY",
            refreshed: "--"
            }
        ]


    ];
        let privacyTableDataRows =  privacyTableData[this.state.level].map( (row, id) => { return (<tr key={id}  className="table-row">                                    
                                                <td className="table-text table-head-text">{row.type}</td>
                                                <td className="table-text">{row.data}</td>
                                                <td className="table-text">{row.refreshed}</td>
                                            </tr>)});
    return (
      <>
          <div className="privacy-block">
                            <input type="range" className="privacy-range" min="0" max="2" 
                              defaultValue={this.state.level} 
                              onChange={(event) => this.setState({level: event.target.value})}/>
                            <div>
                                <div className={`privacy-label ${this.state.level == "0" ? 'privacy-label-selected':''}`}  
                                  style={{position: "absolute", bottom: 36, left: 24}}>LOW</div>
                                <div className={`privacy-label ${this.state.level == "1" ? 'privacy-label-selected':''}`}  
                                  style={{position: "absolute", bottom: 36, left: 304}}>MEDIUM</div>
                                <div className={`privacy-label ${this.state.level == "2" ? 'privacy-label-selected':''}`}  
                                  style={{position: "absolute", bottom: 36, right: 24}}>HIGH</div>
                            </div>
                        </div>
                        <div>
                            <MDBTable>
                            
                                <MDBTableHead>
                                    <tr className="table-head-row">                               
                                        <th className="table-text table-head-text">Type</th>
                                        <th className="table-text table-head-text">Data to be sent</th>
                                        <th className="table-text table-head-text">Refreshed</th>
                                    </tr>
                                </MDBTableHead>
                                <MDBTableBody>
                                    {privacyTableDataRows}                                
                                </MDBTableBody>
                            </MDBTable>
                        </div>
              </>
    );
  }
}

export default PrivacyLevel;