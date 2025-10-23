/**
 * Block Error Fallback Component
 * Displays a styled error message for individual block failures
 * with instructions to check the console for detailed error information
 */

import { ReactNode } from 'react'

interface BlockErrorFallbackProps {
  blockName?: string
  onRetry?: () => void
}

export function BlockErrorFallback({
  blockName = 'Section',
  onRetry,
}: BlockErrorFallbackProps): ReactNode {
  return (
    <div
      className="w-full py-16 px-4 bg-red-50/50 border border-red-200/50 rounded-lg mx-auto my-8 max-w-4xl"
      role="alert"
    >
      <div className="text-center">
        {/* Error Icon */}
        <div className="text-4xl mb-3">⚠️</div>

        {/* Error Title */}
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error Loading {blockName}
        </h3>

        {/* Error Description */}
        <p className="text-sm text-red-800 mb-4">
          We encountered an issue while loading this section. Please check the
          browser console for detailed error information.
        </p>

        {/* Console Instructions */}
        <div className="bg-white/60 rounded p-3 mb-4 text-left max-w-md mx-auto text-xs text-gray-700">
          <p className="font-mono font-medium mb-2">
            📋 To view error details:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Open Developer Tools (F12 or Cmd+Option+I)</li>
            <li>Go to the Console tab</li>
            <li>Look for the red error message with "ERROR BOUNDARY CAUGHT"</li>
            <li>Check the error type, message, and component stack</li>
          </ul>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-block px-6 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        )}

        {/* Support Message */}
        <p className="text-xs text-red-700 mt-4">
          If this problem persists, please contact support at{' '}
          <a
            href="mailto:hello@rrishmusic.com"
            className="underline hover:no-underline font-medium"
          >
            hello@rrishmusic.com
          </a>
        </p>
      </div>
    </div>
  )
}
