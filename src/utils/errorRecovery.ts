/**
 * Error Recovery Utilities for GitHub Pages SPA
 * Provides safe error recovery mechanisms that work with SPA routing
 */

import { safeNavigate, isValidRoute, getCurrentRoute } from './routing'

/**
 * Error recovery strategies
 */
export type RecoveryStrategy =
  | 'retry'
  | 'navigate-home'
  | 'safe-refresh'
  | 'report'

/**
 * Error recovery context information
 */
export interface RecoveryContext {
  error: Error
  url: string
  retryCount: number
  timestamp: string
  userAgent: string
  strategy: RecoveryStrategy
}

/**
 * Safe error recovery that works with GitHub Pages SPA routing
 */
export class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager
  private maxRetries = 3
  private retryDelay = 1000 // 1 second

  public static getInstance(): ErrorRecoveryManager {
    if (!ErrorRecoveryManager.instance) {
      ErrorRecoveryManager.instance = new ErrorRecoveryManager()
    }
    return ErrorRecoveryManager.instance
  }

  /**
   * Attempt to recover from an error using the specified strategy
   */
  public async recoverFromError(
    error: Error,
    strategy: RecoveryStrategy = 'retry',
    retryCount = 0
  ): Promise<boolean> {
    const context: RecoveryContext = {
      error,
      url: window.location.href,
      retryCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      strategy,
    }

    console.log(
      `[ErrorRecovery] Attempting recovery with strategy: ${strategy}`,
      context
    )

    try {
      switch (strategy) {
        case 'retry':
          return await this.retryOperation(context)

        case 'navigate-home':
          return await this.navigateToHomepage()

        case 'safe-refresh':
          return await this.performSafeRefresh()

        case 'report':
          return await this.reportError(context)

        default:
          console.warn(
            `[ErrorRecovery] Unknown strategy: ${strategy}, falling back to navigate-home`
          )
          return await this.navigateToHomepage()
      }
    } catch (recoveryError) {
      console.error('[ErrorRecovery] Recovery attempt failed:', recoveryError)

      // Last resort: force navigation to homepage
      if (strategy !== 'navigate-home') {
        return await this.navigateToHomepage()
      }

      return false
    }
  }

  /**
   * Retry the current operation with exponential backoff
   */
  private async retryOperation(context: RecoveryContext): Promise<boolean> {
    if (context.retryCount >= this.maxRetries) {
      console.warn(
        '[ErrorRecovery] Max retries exceeded, switching to navigation strategy'
      )
      return await this.navigateToHomepage()
    }

    const delay = this.retryDelay * Math.pow(2, context.retryCount)
    console.log(
      `[ErrorRecovery] Retrying in ${delay}ms (attempt ${context.retryCount + 1}/${this.maxRetries})`
    )

    return new Promise(resolve => {
      setTimeout(() => {
        // Trigger a re-render by dispatching a custom event
        window.dispatchEvent(
          new CustomEvent('error-boundary-retry', {
            detail: { retryCount: context.retryCount + 1 },
          })
        )
        resolve(true)
      }, delay)
    })
  }

  /**
   * Safely navigate to homepage
   */
  private async navigateToHomepage(): Promise<boolean> {
    try {
      console.log('[ErrorRecovery] Navigating to homepage')

      // Use safe navigation to avoid 404s
      safeNavigate('/')

      // Wait for navigation to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      return true
    } catch (navigationError) {
      console.error(
        '[ErrorRecovery] Homepage navigation failed:',
        navigationError
      )

      // Last resort: force reload to homepage
      window.location.href = window.location.origin + '/'
      return true // Assume this will work
    }
  }

  /**
   * Perform a safe refresh that won't cause 404s
   */
  private async performSafeRefresh(): Promise<boolean> {
    try {
      const currentPath = getCurrentRoute()

      if (isValidRoute(currentPath)) {
        console.log(
          `[ErrorRecovery] Safe refresh of valid route: ${currentPath}`
        )
        window.location.reload()
        return true
      } else {
        console.warn(
          `[ErrorRecovery] Current route ${currentPath} is not safe to refresh, navigating to homepage`
        )
        return await this.navigateToHomepage()
      }
    } catch (refreshError) {
      console.error('[ErrorRecovery] Safe refresh failed:', refreshError)
      return await this.navigateToHomepage()
    }
  }

  /**
   * Report the error to support
   */
  private async reportError(context: RecoveryContext): Promise<boolean> {
    try {
      const errorReport = {
        error: context.error.message,
        stack: context.error.stack || 'No stack trace available',
        url: context.url,
        userAgent: context.userAgent,
        timestamp: context.timestamp,
        retryCount: context.retryCount,
        routeInfo: {
          currentRoute: getCurrentRoute(),
          isValidRoute: isValidRoute(getCurrentRoute()),
        },
      }

      // Create detailed error report
      const subject = encodeURIComponent(
        `RrishMusic Error Report - ${context.error.name}`
      )
      const body = encodeURIComponent(`
RrishMusic Error Report
=======================

Error Details:
- Message: ${errorReport.error}
- Time: ${errorReport.timestamp}
- URL: ${errorReport.url}
- Route: ${errorReport.routeInfo.currentRoute} (valid: ${errorReport.routeInfo.isValidRoute})
- Retry Count: ${errorReport.retryCount}

Technical Details:
- User Agent: ${errorReport.userAgent}
- Stack Trace:
${errorReport.stack}

Please investigate and resolve this issue.

Generated by Error Recovery System
      `)

      const mailtoLink = `mailto:hello@rrishmusic.com?subject=${subject}&body=${body}`

      // Attempt to open email client
      window.open(mailtoLink, '_blank', 'noopener,noreferrer')

      console.log('[ErrorRecovery] Error report initiated')
      return true
    } catch (reportError) {
      console.error('[ErrorRecovery] Error reporting failed:', reportError)

      // Fallback: show alert with basic info
      alert(
        `An error occurred on RrishMusic. Please contact hello@rrishmusic.com with the following details:\n\nError: ${context.error.message}\nURL: ${context.url}\nTime: ${context.timestamp}`
      )

      return true
    }
  }

  /**
   * Get recommended recovery strategy based on error and context
   */
  public getRecommendedStrategy(
    error: Error,
    retryCount = 0
  ): RecoveryStrategy {
    // Check error type for specific handling
    if (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk')
    ) {
      // JavaScript chunk loading errors - try refresh first
      return retryCount < 2 ? 'safe-refresh' : 'navigate-home'
    }

    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      // Network-related errors - retry with backoff
      return retryCount < this.maxRetries ? 'retry' : 'navigate-home'
    }

    if (
      error.name === 'TypeError' &&
      error.message.includes('Cannot read property')
    ) {
      // Component/data errors - navigation might help
      return retryCount < 1 ? 'retry' : 'navigate-home'
    }

    // Default strategy based on retry count
    if (retryCount < this.maxRetries) {
      return 'retry'
    }

    return 'navigate-home'
  }

  /**
   * Log error for analytics and monitoring
   */
  public logError(context: RecoveryContext): void {
    if (process.env.NODE_ENV === 'production') {
      // In production, you could send this to an error tracking service
      // like Sentry, LogRocket, or custom analytics
      console.warn('[ErrorRecovery] Production error logged:', {
        ...context,
        // Don't log sensitive data
        userAgent: context.userAgent.substring(0, 100) + '...',
      })
    } else {
      // Development logging
      console.group('[ErrorRecovery] Development Error Log')
      console.error('Error:', context.error)
      console.log('Context:', context)
      console.groupEnd()
    }
  }
}

/**
 * Convenience function to create error recovery manager instance
 */
export const errorRecovery = ErrorRecoveryManager.getInstance()

/**
 * Hook for React components to handle errors with recovery
 */
export function useErrorRecovery() {
  const manager = ErrorRecoveryManager.getInstance()

  return {
    recoverFromError: (error: Error, strategy?: RecoveryStrategy) =>
      manager.recoverFromError(error, strategy),
    getRecommendedStrategy: (error: Error, retryCount?: number) =>
      manager.getRecommendedStrategy(error, retryCount),
    logError: (
      error: Error,
      strategy: RecoveryStrategy = 'retry',
      retryCount = 0
    ) =>
      manager.logError({
        error,
        url: window.location.href,
        retryCount,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        strategy,
      }),
  }
}
