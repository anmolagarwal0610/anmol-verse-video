
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Get the base URL from the environment or use a default
const basename = import.meta.env.BASE_URL || '/';

// Determine if we're in production or preview mode
const isProduction = import.meta.env.PROD;

// Use HashRouter for production/preview to avoid 404s with direct URL access
// This ensures all routes work even when accessed directly
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isProduction ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>
);
