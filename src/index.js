import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter as Router } from 'react-router-dom';



const anchor = document.createElement('div');
anchor.id = 'extension-root';
document.body.insertBefore(anchor, document.body.childNodes[0]);




ReactDOM.render(<Router><App /></Router>, document.getElementById('extension-root'));
