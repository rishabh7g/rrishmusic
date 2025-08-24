/**
 * Routing utilities for GitHub Pages SPA compatibility
 * Handles URL construction and navigation for proper GitHub Pages deployment
 */

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
 */
export const navigateTo = (path: string): void => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  window.history.pushState(null, '', cleanPath);
  
  // Dispatch a popstate event to trigger React Router update
  window.dispatchEvent(new PopStateEvent('popstate'));
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