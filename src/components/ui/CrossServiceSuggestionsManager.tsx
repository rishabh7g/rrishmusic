/**
 * Cross-Service Suggestions Manager
 *
 * Central manager for displaying cross-service suggestions across different
 * page contexts. Handles suggestion placement, timing, and user preferences.
 *
 * Features:
 * - Context-aware suggestion management
 * - Multiple placement zones (inline, sidebar, banner)
 * - User preference handling
 * - Performance optimization with lazy loading
 * - Analytics aggregation
 */

import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getSuggestionsByPlacement,
  getDismissedSuggestions,
  hasUserInterest,
  type CrossServiceSuggestion,
} from '@/utils/crossServiceSuggestions'
import { detectServiceContext, type ServiceType } from '@/utils/contactRouting'
import { CrossServiceSuggestion as CrossServiceSuggestionComponent } from '@/components/ui/CrossServiceSuggestion'

/**
 * Props for the Cross-Service Suggestions Manager
 */
interface CrossServiceSuggestionsManagerProps {
  /**
   * Force specific service context (optional)
   */
  forceService?: ServiceType

  /**
   * Current page section for context
   */
  pageSection?: string

  /**
   * Placements to show suggestions in
   */
  placements?: ('inline' | 'sidebar' | 'banner')[]

  /**
   * Maximum suggestions per placement
   */
  maxSuggestionsPerPlacement?: number

  /**
   * Global disable flag
   */
  disabled?: boolean

  /**
   * Respect user dismissals
   */
  respectDismissals?: boolean

  /**
   * Additional CSS classes for container
   */
  className?: string
}

/**
 * Cross-Service Suggestions Manager Component
 */
export const CrossServiceSuggestionsManager: React.FC<
  CrossServiceSuggestionsManagerProps
> = ({
  forceService,
  pageSection,
  placements = ['inline'],
  maxSuggestionsPerPlacement = 1,
  disabled = false,
  respectDismissals = true,
  className = '',
}) => {
  const location = useLocation()
  const [currentService, setCurrentService] = useState<ServiceType>('general')
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)

  /**
   * Detect current service context
   */
  useEffect(() => {
    if (forceService) {
      setCurrentService(forceService)
    } else {
      const context = detectServiceContext(location)
      setCurrentService(context.serviceType)
    }
  }, [location, forceService])

  /**
   * Load user preferences
   */
  useEffect(() => {
    if (respectDismissals) {
      const dismissed = getDismissedSuggestions()
      setDismissedSuggestions(dismissed)
    }

    // Check if suggestions should be enabled
    // Don't show if user has shown no interest after significant interaction
    const shouldShow =
      !disabled &&
      (!respectDismissals ||
        !hasUserInterest() ||
        dismissedSuggestions.length < 3)

    setSuggestionsVisible(shouldShow)
  }, [currentService, disabled, respectDismissals, dismissedSuggestions.length])

  /**
   * Handle suggestion dismissal
   */
  const handleSuggestionDismiss = (suggestion: CrossServiceSuggestion) => {
    const updatedDismissed = [...dismissedSuggestions, suggestion.id]
    setDismissedSuggestions(updatedDismissed)
  }

  /**
   * Handle suggestion interest
   */
  const handleSuggestionInterest = (suggestion: CrossServiceSuggestion) => {
    // Could be used for personalization in future
    console.log('User interested in:', suggestion.targetService)
  }

  if (disabled || !suggestionsVisible || currentService === 'general') {
    return null
  }

  return (
    <div className={`cross-service-suggestions-manager ${className}`}>
      {placements.map(placement => {
        const suggestions = getSuggestionsByPlacement(
          currentService,
          placement,
          respectDismissals ? dismissedSuggestions : []
        ).slice(0, maxSuggestionsPerPlacement)

        return suggestions.map(suggestion => (
          <CrossServiceSuggestionComponent
            key={`${placement}-${suggestion.id}`}
            fromService={currentService}
            pageSection={pageSection}
            placement={placement}
            timing="after-engagement"
            onDismiss={handleSuggestionDismiss}
            onInterest={handleSuggestionInterest}
            className={`mb-6 ${placement === 'banner' ? 'fixed top-20 left-4 right-4 z-40' : ''}`}
          />
        ))
      })}
    </div>
  )
}

export default CrossServiceSuggestionsManager
