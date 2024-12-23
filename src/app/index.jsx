import React from 'react';
import ReactDOM from 'react-dom/client'; // Import `createRoot` from `react-dom/client`
import { App } from './App';
import './styles/index.css'; // Ensure this matches your structure

// Create a root and render the application
const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root for React 18
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
