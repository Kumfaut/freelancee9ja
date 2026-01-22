import './output.css'; 
import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
// Removed: import { BrowserRouter } from 'react-router-dom'; <--- This was the unused line

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);