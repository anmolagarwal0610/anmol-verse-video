
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Using HashRouter ensures that direct URL access works in all environments
// HashRouter uses URL fragments (#) which don't require server-side configuration
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
