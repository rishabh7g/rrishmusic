/**
 * Error Boundary Component for React Application
 * Provides production-ready error handling with fallback UI
 * Enhanced with SPA routing support and GitHub Pages compatibility
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { safeNavigate } from '@/utils/routing';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; resetError: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    // Reset error boundary when children change
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: 0,
      });
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // Placeholder for error logging service integration
    // e.g., Sentry, LogRocket, or custom analytics
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount,
    };

    // Example: Send to analytics or error monitoring service
    console.warn('[ErrorBoundary] Production error logged:', errorData);
  }

  private handleRetry = (): void => {
    const newRetryCount = this.state.retryCount + 1;
    
    if (newRetryCount > this.maxRetries) {
      console.warn('[ErrorBoundary] Max retries exceeded, redirecting to homepage');
      this.handleGoHome();
      return;
    }

    console.log(`[ErrorBoundary] Retry attempt ${newRetryCount}/${this.maxRetries}`);
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount,
    });
  };

  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  private handleGoHome = (): void => {
    try {
      console.log('[ErrorBoundary] Navigating to homepage');
      
      // Use the safe navigation utility to avoid 404s
      safeNavigate('/');
      
      // Reset error boundary state after successful navigation
      setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: 0,
        });
      }, 100);
    } catch (error) {
      console.error('[ErrorBoundary] Error during homepage navigation:', error);
      // Last resort: force page reload to homepage
      window.location.href = window.location.origin + '/';
    }
  };

  private handleSafeRefresh = (): void => {
    try {
      console.log('[ErrorBoundary] Performing safe refresh');
      
      const currentPath = window.location.pathname;
      
      // Check if we're on a valid route that can be refreshed safely
      const validRoutes = ['/', '/performance', '/collaboration'];
      
      if (validRoutes.includes(currentPath)) {
        // Safe to reload current page
        window.location.reload();
      } else {
        // Navigate to homepage instead of refreshing invalid route
        console.warn('[ErrorBoundary] Current route may not be safe to refresh, redirecting to homepage');
        this.handleGoHome();
      }
    } catch (error) {
      console.error('[ErrorBoundary] Error during safe refresh:', error);
      // Fallback to homepage navigation
      this.handleGoHome();
    }
  };

  private handleReportProblem = (): void => {
    const errorDetails = {
      error: this.state.error?.message || 'Unknown error',
      stack: this.state.error?.stack || 'No stack trace',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
    };

    // Create a mailto link with error details
    const subject = encodeURIComponent('RrishMusic - Error Report');
    const body = encodeURIComponent(`Hello,

I encountered an error on RrishMusic:

Error: ${errorDetails.error}
URL: ${errorDetails.url}
Time: ${errorDetails.timestamp}
Retry Count: ${errorDetails.retryCount}

Additional Details:
${errorDetails.stack}

Please help resolve this issue.

Thank you!`);

    const mailtoLink = `mailto:hello@rrishmusic.com?subject=${subject}&body=${body}`;
    
    try {
      window.open(mailtoLink, '_blank');
    } catch (error) {
      console.error('[ErrorBoundary] Error opening email client:', error);
      // Fallback: copy to clipboard or show alert
      alert('Please email hello@rrishmusic.com with the error details from the browser console.');
    }
  };

  public render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI with error and resetError props
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({ error: this.state.error, resetError: this.resetError });
        }
        return this.props.fallback;
      }

      // Enhanced fallback UI with multiple recovery options
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" role="alert">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-6xl mb-4">🎵</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" role="heading" aria-level={1}>
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry - we have several recovery options to get you back to enjoying RrishMusic.
            </p>
            
            <div className="space-y-3">
              {/* Primary recovery action */}
              {this.state.retryCount < this.maxRetries ? (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-secondary transition-colors font-semibold"
                >
                  Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/${this.maxRetries})`}
                </button>
              ) : (
                <div className="text-sm text-gray-500 p-2 bg-gray-100 rounded">
                  Max retries reached. Please try other options below.
                </div>
              )}
              
              {/* Safe navigation options */}
              <button
                onClick={this.handleGoHome}
                className="w-full bg-brand-blue-secondary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-primary transition-colors font-semibold"
              >
                Go to Homepage
              </button>
              
              <button
                onClick={this.handleSafeRefresh}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Safe Refresh
              </button>

              {/* Additional options */}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={this.handleReportProblem}
                  className="w-full bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Report this Problem
                </button>
              </div>
            </div>

            {/* User-friendly error explanation */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1" role="heading" aria-level={2}>What happened?</p>
              <p className="text-blue-600">
                A technical issue occurred while loading the page. This is rare and we're constantly working to prevent these errors.
              </p>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  View Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded text-xs font-mono overflow-auto max-h-32">
                  <div className="text-red-700 font-semibold mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <pre className="whitespace-pre-wrap text-red-600 text-xs">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-blue-600 text-xs">
                      Component Stack:
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                  <div className="mt-2 text-gray-600 text-xs">
                    <p>Retry Count: {this.state.retryCount}</p>
                    <p>URL: {window.location.href}</p>
                    <p>Time: {new Date().toISOString()}</p>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error boundary wrapper for smaller components
 * Enhanced with consistent styling and recovery options
*/

export default ErrorBoundary;