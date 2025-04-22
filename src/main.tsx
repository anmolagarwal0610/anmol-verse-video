
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Add performance measurement
const startTime = performance.now();
console.log('⏱️ Application bootstrap started');

// Using HashRouter ensures that direct URL access works in all environments
// HashRouter uses URL fragments (#) which don't require server-side configuration
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);

// Log performance after render
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log(`⏱️ Application loaded in ${loadTime.toFixed(2)}ms`);
  
  // Report performance metrics if available
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
      console.log(`📊 DOM Content Loaded: ${navTiming.domContentLoadedEventEnd - navTiming.startTime}ms`);
      console.log(`📊 Load Complete: ${navTiming.loadEventEnd - navTiming.startTime}ms`);
    }
  }
});

// Add a cache-warming strategy for static assets
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register in production to avoid caching during development
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  });
}
