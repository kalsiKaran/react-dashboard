import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContextProvider } from './contexts/ContextProvider';
import './styles/index.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>
);

