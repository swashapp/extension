import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import '../static/css/shared.css';
import '../static/css/new-tab.css';

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
const container = document.getElementById('newTab');
const root = createRoot(container!);
root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
);
