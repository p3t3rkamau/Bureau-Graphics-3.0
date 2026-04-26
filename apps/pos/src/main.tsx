import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initDb } from './services/db';

initDb();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
