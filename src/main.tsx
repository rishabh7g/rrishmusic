import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeRouting } from '@/utils/routing'

// Initialize routing utilities for GitHub Pages SPA support
// This handles any redirects from 404.html and sets up route validation
const cleanupRouting = initializeRouting();

// Cleanup routing listeners on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupRouting);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)