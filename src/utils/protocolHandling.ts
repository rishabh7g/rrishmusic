/**
 * Protocol Handling Utilities
 * Ensures proper HTTPS enforcement and seamless protocol handling
 */

/**
 * Check if the current environment supports HTTPS
 */
export const supportsHTTPS = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Always enforce HTTPS in production
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

/**
 * Get the canonical URL with proper protocol
 */
export const getCanonicalURL = (path: string = ''): string => {
  if (typeof window === 'undefined') {
    return `http://www.rrishmusic.com${path}`;
  }

  // For production, use HTTP since domain doesn't support HTTPS
  if (window.location.hostname === 'www.rrishmusic.com' || 
      window.location.hostname === 'rrishmusic.com') {
    return `http://www.rrishmusic.com${path}`;
  }

  // For local development
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1') {
    return `${window.location.protocol}//${window.location.host}${path}`;
  }

  // For GitHub Pages or other environments
  return `https://${window.location.host}${path}`;
};

/**
 * Enforce domain consistency (no HTTPS enforcement since domain doesn't support it)
 */
export const enforceHTTPS = (): boolean => {
  if (typeof window === 'undefined') return false;

  const { protocol, hostname, pathname, search, hash } = window.location;
  
  // Skip redirect for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return false;
  }

  // Redirect non-www to www for consistency (HTTP only since domain doesn't support HTTPS)
  if (protocol === 'http:' && hostname === 'rrishmusic.com') {
    const wwwUrl = `http://www.rrishmusic.com${pathname}${search}${hash}`;
    console.log('[ProtocolHandling] Redirecting to www subdomain:', wwwUrl);
    window.location.replace(wwwUrl);
    return true;
  }

  // Don't enforce HTTPS since domain doesn't support it
  return false;
};

/**
 * Get secure asset URL with proper protocol
 */
export const getSecureAssetURL = (assetPath: string): string => {
  if (!assetPath) return '';
  
  // If already a full URL, return as-is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  
  // Ensure leading slash
  const cleanPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  
  return getCanonicalURL(cleanPath);
};

/**
 * Initialize protocol handling on app startup
 */
export const initProtocolHandling = (): void => {
  if (typeof window === 'undefined') return;

  // Enforce HTTPS redirect
  const redirected = enforceHTTPS();
  
  if (!redirected) {
    console.log('[ProtocolHandling] Protocol handling initialized:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      canonical: getCanonicalURL()
    });
  }
};

/**
 * Check if URL handling is working correctly
 */
export const validateURLHandling = (): {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (typeof window === 'undefined') {
    return { isValid: true, issues, recommendations };
  }

  const { protocol, hostname } = window.location;

  // Check protocol
  if (hostname !== 'localhost' && hostname !== '127.0.0.1' && protocol !== 'https:') {
    issues.push('Site not using HTTPS in production');
    recommendations.push('Enable HTTPS redirect');
  }

  // Check subdomain consistency
  if (hostname === 'rrishmusic.com') {
    issues.push('Using non-www domain');
    recommendations.push('Redirect to www.rrishmusic.com for consistency');
  }

  // Check canonical URL
  const expectedCanonical = getCanonicalURL();
  if (!window.location.href.startsWith(expectedCanonical.split('?')[0])) {
    issues.push('URL does not match expected canonical format');
    recommendations.push(`Use canonical URL: ${expectedCanonical}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  };
};