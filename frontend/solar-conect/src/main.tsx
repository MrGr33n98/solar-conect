import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async'; // Import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider> {/* Add HelmetProvider here */}
      <App />
    </HelmetProvider>
  </StrictMode>
);
