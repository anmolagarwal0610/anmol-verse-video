
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Always use HashRouter for all environments to ensure consistent routing behavior
// This prevents 404 errors with direct URL access in production/preview environments
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
