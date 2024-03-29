import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/new-tab/main.css';
import '../static/css/new-tab/mobile.css';
import '../static/css/new-tab/smobile.css';

import { helper } from '../core/webHelper';
import App from '../pages/new-tab';

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
  document.getElementById('newTab'),
);
