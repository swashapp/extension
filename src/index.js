import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './index.css';
import './laptop.css';
import './tablet.css';
import './mobile.css';
import './smobile.css';
import App from './App';
import {HashRouter as Router} from 'react-router-dom';

const anchor = document.createElement('div');
anchor.id = 'extension-root';
document.body.insertBefore(anchor, document.body.childNodes[0]);

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('extension-root')
);
