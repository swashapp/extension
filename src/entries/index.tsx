import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/index.css';
import '../static/css/laptop.css';
import '../static/css/tablet.css';
import '../static/css/mobile.css';
import '../static/css/smobile.css';

import App from '../pages/App';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app'),
);
