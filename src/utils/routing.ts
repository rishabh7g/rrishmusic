/**
 * Routing utilities for GitHub Pages SPA compatibility
 * Handles URL construction and navigation for proper GitHub Pages deployment
 * Enhanced for page refresh 404 error prevention
 */

/**
 * Valid routes in the application
 */
export const VALID_ROUTES = [
  '/',
  '/performance', 
  '/collaboration',
  // Legacy routes that redirect
  '/home',
  '/performances'
] as const;

/**
 * Check if a route is valid in our application
 */
export const isValidRoute = (path: string): boolean => {
  return VALID_ROUTES.includes(path as typeof VALID_ROUTES[number]);
};

/**
 * Get the base URL for the application
 * Handles different environments (development, production, GitHub Pages)
 */
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // In browser environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Development environment
      return window.location.origin;
    }
    
    // Production environment (GitHub Pages or custom domain)
    return window.location.origin;
  }
  
  // Server-side rendering fallback
  return '';
};

/**
 * Create a proper URL for navigation
 * Ensures compatibility with GitHub Pages SPA routing
 */
export const createUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Navigate to a route programmatically
 * Uses React Router history API for SPA navigation
 * Includes validation and error handling for page refresh scenarios
 */
export const navigateTo = (path: string): void => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Validate route before navigation
  if (!isValidRoute(cleanPath)) {
    console.warn(`[Routing] Invalid route attempted: ${cleanPath}. Redirecting to homepage.`);
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return;
  }
  
  try {
    window.history.pushState(null, '', cleanPath);
    
    // Dispatch a popstate event to trigger React Router update
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Log successful navigation in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Routing] Navigated to: ${cleanPath}`);
    }
  } catch (error) {
    console.error(`[Routing] Navigation failed for ${cleanPath}:`, error);
    // Fallback to homepage
    window.location.href = '/';
  }
};

/**
 * Check if current route matches a given path
 * Useful for active navigation states
 */
export const isCurrentRoute = (path: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const currentPath = window.location.pathname;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return currentPath === cleanPath;
};

/**
 * Get current route path
 * Returns the current pathname without the base URL
 */
export const getCurrentRoute = (): string => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
};

/**
 * Validate if a URL is within the current domain
 * Security check for navigation
 */
export const isInternalUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const targetUrl = new URL(url, window.location.origin);
    return targetUrl.origin === window.location.origin;
  } catch {
    // If URL parsing fails, treat as relative/internal
    return !url.startsWith('http');
  }
};

/**
 * Safe navigation function that handles both internal and external URLs
 */
export const safeNavigate = (url: string, external = false): void => {
  if (external || !isInternalUrl(url)) {
    // External URL - open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    // Internal URL - use SPA navigation
    try {
      const targetUrl = new URL(url, window.location.origin);
      navigateTo(targetUrl.pathname);
    } catch {
      // Fallback for relative URLs
      navigateTo(url);
    }
  }
};

/**
 * Handle GitHub Pages SPA redirect from 404.html
 * This function processes the encoded URL parameters from 404.html redirect
 */
export const handleSPARedirect = (): void => {
  if (typeof window === 'undefined') return;
  
  const search = window.location.search;
  
  // Check if we have SPA redirect parameters (from 404.html)
  if (search && search[1] === '/') {
    try {
      // Decode the path from search parameters
      const decoded = search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&');
      }).join('?');
      
      // Extract the original path
      const originalPath = decoded.split('?')[0];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[SPA Redirect] Processing redirect from 404.html');
        console.log('[SPA Redirect] Original search:', search);
        console.log('[SPA Redirect] Decoded path:', originalPath);
      }
      
      // Validate the redirected route
      if (isValidRoute(originalPath)) {
        // Replace the current history entry with the correct URL
        window.history.replaceState(null, null, originalPath + window.location.hash);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[SPA Redirect] Successfully restored route:', originalPath);
        }
      } else {
        // Invalid route, redirect to homepage
        console.warn('[SPA Redirect] Invalid route in redirect:', originalPath);
        window.history.replaceState(null, null, '/');
      }
    } catch (error) {
      console.error('[SPA Redirect] Error processing redirect:', error);
      // Fallback to homepage
      window.history.replaceState(null, null, '/');
    }
  }
};

/**
 * Initialize routing utilities
 * Call this on app startup to handle any SPA redirects
 */
export const initializeRouting = (): void => {
  handleSPARedirect();
  
  // Add listener for popstate events to handle browser navigation
  const handlePopState = () => {
    const currentPath = getCurrentRoute();
    if (!isValidRoute(currentPath)) {
      console.warn(`[Routing] Invalid route detected: ${currentPath}. Redirecting to homepage.`);
      navigateTo('/');
    }
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};