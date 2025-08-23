/**
 * Error handling utilities for React components
 * Separated from components to comply with react-refresh/only-export-components ESLint rule
 */

/**
 * Hook-based error handler for functional components
 * Note: This doesn't catch errors in event handlers or async code
 */
export function useErrorHandler(): (error: Error) => void {
  return (error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    
    // In a real app, you might want to dispatch to a global error state
    // or show a toast notification
    if (process.env.NODE_ENV === 'production') {
      // Log to error monitoring service
      console.warn('Production error from hook:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Re-throw in development for debugging
      throw error;
    }
  };
}