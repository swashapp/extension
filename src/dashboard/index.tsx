import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/main.css';
import '../static/css/laptop.css';
import '../static/css/tablet.css';
import '../static/css/mobile.css';
import '../static/css/smobile.css';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';

import { helper } from '../core/webHelper';
import App from '../pages/app';

declare global {
  interface Window {
    helper: any;
  }
}
window.helper = helper;

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app'),
);
