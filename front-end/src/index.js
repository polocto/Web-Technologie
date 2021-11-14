import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'typeface-roboto'
// Layout
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ContextProvider } from './Context';

const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
