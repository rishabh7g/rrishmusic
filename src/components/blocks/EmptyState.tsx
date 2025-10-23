/**
 * EmptyState Block Component
 * Empty state UI for when no content is available
 * Accepts props from JSON schema validation
 */

import type { EmptyStateBlockProps } from '@/lib/schemas'

export function EmptyState({ title, description }: EmptyStateBlockProps) {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center transition-theme-colors">
      <div className="text-center max-w-md px-4">
        <p className="text-theme-text-secondary mb-4">{title}</p>
        <p className="text-sm text-theme-text-secondary">{description}</p>
      </div>
    </div>
  )
}
