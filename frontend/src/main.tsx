import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import AuthProvider from './context/AuthContext';
import LeaveProvider from './context/LeaveContext';
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
    <PrimeReactProvider>
      <AuthProvider>
        <LeaveProvider>
          <App />
        </LeaveProvider>
      </AuthProvider>
    </PrimeReactProvider>
    </Router>
  </React.StrictMode>
);