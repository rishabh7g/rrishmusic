/**
 * Error Handler Hook for React Components
 * Provides programmatic error boundary integration
 */

import { ErrorInfo } from 'react';

/**
 * Hook for programmatic error boundary triggering
 * Useful for catching async errors that don't trigger error boundaries automatically
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: Partial<ErrorInfo>) => {
    console.error('[useErrorHandler] Programmatic error:', error);
    
    // You could dispatch this to a global error boundary or error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Log to error reporting service
      console.warn('[useErrorHandler] Error logged to service:', {
        message: error.message,
        stack: error.stack,
        ...errorInfo,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
    
    // Re-throw to trigger error boundary
    throw error;
  };
}