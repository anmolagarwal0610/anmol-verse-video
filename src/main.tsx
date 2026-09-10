
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom'; // Changed from HashRouter
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Supabase OAuth flow needs BrowserRouter for redirects to work
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
