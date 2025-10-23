/**
 * LoadingState Block Component
 * Loading spinner and message for async content
 * Accepts props from JSON schema validation
 */

import type { LoadingStateBlockProps } from '@/lib/schemas'

export function LoadingState({ message }: LoadingStateBlockProps) {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center transition-theme-colors">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme-primary mx-auto mb-4"></div>
        <p className="text-theme-text-secondary">{message}</p>
      </div>
    </div>
  )
}
