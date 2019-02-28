import React from 'react';
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

class Manuals extends React.Component {
    state = {manual: []};

    componentDidMount() {
        let mockData = ['\n' +
        '# Zare\n' +
        '\n' +
        '## 1 - Install\n' +
        '\n' +
        '### `npm install`\n' +
        '\n' +
        '## 2 - Fix\n' +
        '\n' +
        '### `npm audit fix`\n' +
        '\n' +
        '## 3 - Start',
            '# `npm start`\n' +
            '\n' +
            '## 4 - Build\n' +
            '\n' +
            '### `npm run build`\n' +
            '\n' +
            '### `npm run migrate`\n' +
            '\n' +
            'you can use `npm run migrate -- --dst=../firefox/dashboard2` if you want to change dst folder or src.\n',
            '\n' +
            '\n' +
            '## Manual After Build\n' +
            '\n' +
            '### 0- Copy index.html along with static folder to dashboard folder in extension root directory\n' +
            '\n' +
            '### 1- Replace Resources in Html file starting with \'/static\' with \'./static\'\n' +
            '\n' +
            '### 2- Copy the Inline script from HTML file to file :\n' +
            '\n' +
            '`sc.js` \n' +
            '\n' +
            '### 3- Replace urls starting with \'/static/\' with \'../\' in css files.\n' +
            '\n', '\n' +
            '## Available Scripts\n' +
            '\n' +
            'In the project directory, you can run:\n' +
            '\n' +
            '### `npm start`\n' +
            '\n' +
            'Runs the app in the development mode.<br>\n' +
            'Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\n' +
            '\n' +
            'The page will reload if you make edits.<br>\n' +
            'You will also see any lint errors in the console.\n' +
            '\n' +
            '### `npm test`\n' +
            '\n' +
            'Launches the test runner in the interactive watch mode.<br>\n' +
            'See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.\n' +
            '\n' +
            '### `npm run build`']
        this.setState({manual: mockData})
    };

    componentDidUpdate() {

    }

    render() {

        return (
            <MDBContainer>
                <MDBRow id={'manual-row'} className="justify-content-left">

                    <MDBCol md="12" lg="12">
                        {this.state.manual.map((ob, id) => <MDBCard  key={id} className="d-flex mb-2">
                            <MDBCol id={id} md="12" lg="12">

                                <MDBCardBody>
                                    <i className={'fa fa-arrow-down manual-page-arrow'}
                                       onClick={() => document.getElementById(id).classList.contains('full-expand') ? document.getElementById(id).classList.remove('full-expand'):document.getElementById(id).classList.add('full-expand')}/>
                                    <ReactMarkdown source={ob}/>

                                </MDBCardBody>
                            </MDBCol></MDBCard>
                        )}

                    </MDBCol>
                </MDBRow>
            </MDBContainer>)
    }
}

export default withRouter(Manuals);