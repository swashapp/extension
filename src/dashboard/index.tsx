import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/main.css';
import '../static/css/laptop.css';
import '../static/css/tablet.css';
import '../static/css/mobile.css';
import '../static/css/smobile.css';
import '../static/css/dark.css';
import 'react-keyed-file-browser/dist/react-keyed-file-browser.css';

import { helper } from '../core/webHelper';
import App from '../pages/app';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare global {
  interface Window {
    helper: any;
  }
}
window.helper = helper;

const theme = createTheme();

ReactDOM.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
  document.getElementById('app'),
);
