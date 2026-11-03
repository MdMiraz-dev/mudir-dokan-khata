import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './components/ErrorBoundary';
import { KhataProvider } from './context/KhataContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <KhataProvider>
        <App />
      </KhataProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
