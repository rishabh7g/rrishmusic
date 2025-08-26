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
        <div 
          className="min-h-screen flex items-center justify-center bg-theme-bg transition-theme-colors" 
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md mx-auto text-center p-6">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-theme-text mb-2 transition-theme-colors">
              Something went wrong
            </h2>
            <p className="text-theme-text-secondary mb-6 transition-theme-colors">
              We encountered an unexpected error. Don't worry - we have several recovery options to get you back to enjoying RrishMusic.
            </p>
            
            <div className="space-y-3">
              {/* Primary recovery action */}
              {this.state.retryCount < this.maxRetries ? (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-theme-primary text-white px-6 py-3 rounded-lg hover:bg-theme-primary/90 transition-theme-colors font-semibold"
                >
                  Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/${this.maxRetries})`}
                </button>
              ) : (
                <div className="text-sm text-theme-text-muted p-2 bg-theme-bg-secondary rounded transition-theme-colors">
                  Max retries reached. Please try other options below.
                </div>
              )}
              
              {/* Safe navigation options */}
              <button
                onClick={this.handleGoHome}
                className="w-full bg-theme-secondary text-white px-6 py-3 rounded-lg hover:bg-theme-secondary/90 transition-theme-colors font-semibold"
              >
                Go to Homepage
              </button>
              
              <button
                onClick={this.handleSafeRefresh}
                className="w-full bg-theme-bg-tertiary text-theme-text px-6 py-3 rounded-lg hover:bg-theme-bg-tertiary/80 transition-theme-colors font-semibold"
              >
                Safe Refresh
              </button>

              {/* Additional options */}
              <div className="pt-2 border-t border-theme-divider transition-theme-colors">
                <button
                  onClick={this.handleReportProblem}
                  className="w-full bg-theme-bg-secondary text-theme-text-secondary px-6 py-3 rounded-lg hover:bg-theme-bg-tertiary transition-theme-colors font-medium text-sm"
                >
                  Report this Problem
                </button>
              </div>
            </div>

            {/* User-friendly error explanation */}
            <div className="mt-6 p-4 bg-theme-info/10 border border-theme-info/20 rounded-lg text-sm text-theme-info transition-theme-colors">
              <h3 className="font-medium mb-1">What happened?</h3>
              <p className="text-theme-info/80">
                A technical issue occurred while loading the page. This is rare and we're constantly working to prevent these errors.
              </p>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-theme-text-muted hover:text-theme-text-secondary transition-theme-colors">
                  View Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-theme-error/10 border border-theme-error/20 rounded text-xs font-mono overflow-auto max-h-32 transition-theme-colors">
                  <div className="text-theme-error font-semibold mb-2 transition-theme-colors">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <pre className="whitespace-pre-wrap text-theme-error/80 text-xs transition-theme-colors">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-theme-info/80 text-xs transition-theme-colors">
                      Component Stack:
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                  <div className="mt-2 text-theme-text-muted text-xs transition-theme-colors">
                    <p>Retry Count: {this.state.retryCount}</p>
                    <p>URL: {window.location.href}</p>
                    <p>Time: {new Date().toISOString()}</p>
                  </div>
                </div>
              </details>
            )}

            {/* Production error details - only show contact info */}
            {process.env.NODE_ENV === 'production' && (
              <div className="mt-6 p-4 bg-theme-bg-secondary border border-theme-border rounded-lg text-sm text-theme-text-secondary transition-theme-colors">
                <p>If the problem persists, please contact support or refresh the page.</p>
              </div>
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