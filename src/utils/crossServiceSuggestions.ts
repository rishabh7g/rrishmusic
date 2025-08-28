/**
 * Cross-Service Suggestions Utility
 *
 * Intelligent system for suggesting complementary services across the platform
 * without interfering with primary conversion goals.
 *
 * Features:
 * - Context-aware suggestions based on current service
 * - Non-intrusive timing and placement logic
 * - Analytics tracking for suggestion effectiveness
 * - User preference handling (dismissal/interest)
 * - Smart suggestion scoring system
 */

import { ServiceType } from '@/utils/contactRouting'
import suggestionsData from '@/data/crossServiceSuggestions.json'

/**
 * Cross-service suggestion data
 */
export interface CrossServiceSuggestion {
  id: string
  targetService: ServiceType
  title: string
  description: string
  benefits: string[]
  ctaText: string
  priority: number
  contexts: SuggestionContext[]
  dismissable: boolean
}

/**
 * Suggestion context for determining when to show suggestions
 */
export interface SuggestionContext {
  fromService: ServiceType
  userAction?: string
  pageSection?: string
  timing: 'immediate' | 'after-engagement' | 'before-exit'
  placement: 'inline' | 'sidebar' | 'modal' | 'banner'
}

/**
 * User interaction tracking for suggestions
 */
export interface SuggestionInteraction {
  suggestionId: string
  action: 'viewed' | 'clicked' | 'dismissed' | 'interested'
  context: SuggestionContext
  timestamp: number
  userId?: string
  sessionId: string
}

/**
 * Suggestion configuration for each service relationship
 */
const CROSS_SERVICE_SUGGESTIONS: CrossServiceSuggestion[] =
  suggestionsData.suggestions as CrossServiceSuggestion[]

/**
 * Get suggestions for the current service context
 */
export function getSuggestionsForContext(
  fromService: ServiceType,
  pageSection?: string,
  timing: 'immediate' | 'after-engagement' | 'before-exit' = 'after-engagement'
): CrossServiceSuggestion[] {
  return CROSS_SERVICE_SUGGESTIONS.filter(suggestion =>
    suggestion.contexts.some(
      context =>
        context.fromService === fromService &&
        (!pageSection || context.pageSection === pageSection) &&
        context.timing === timing
    )
  ).sort((a, b) => b.priority - a.priority)
}

/**
 * Get the best suggestion for a specific context
 */
export function getBestSuggestionForContext(
  fromService: ServiceType,
  pageSection?: string,
  timing: 'immediate' | 'after-engagement' | 'before-exit' = 'after-engagement',
  excludeDismissed: string[] = []
): CrossServiceSuggestion | null {
  const suggestions = getSuggestionsForContext(
    fromService,
    pageSection,
    timing
  ).filter(suggestion => !excludeDismissed.includes(suggestion.id))

  return suggestions.length > 0 ? suggestions[0] : null
}

/**
 * Get suggestions by placement type
 */
export function getSuggestionsByPlacement(
  fromService: ServiceType,
  placement: 'inline' | 'sidebar' | 'modal' | 'banner',
  excludeDismissed: string[] = []
): CrossServiceSuggestion[] {
  return CROSS_SERVICE_SUGGESTIONS.filter(
    suggestion =>
      suggestion.contexts.some(
        context =>
          context.fromService === fromService && context.placement === placement
      ) && !excludeDismissed.includes(suggestion.id)
  ).sort((a, b) => b.priority - a.priority)
}

/**
 * Track suggestion interaction
 */
export function trackSuggestionInteraction(
  interaction: SuggestionInteraction
): void {
  // Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cross_service_suggestion', {
      event_category: 'Cross-Service Discovery',
      event_label: `${interaction.suggestionId}_${interaction.action}`,
      service_from: interaction.context.fromService,
      custom_map: {
        suggestion_id: interaction.suggestionId,
        action: interaction.action,
        placement: interaction.context.placement,
        timing: interaction.context.timing,
      },
    })
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Cross-Service Suggestion Interaction:', interaction)
  }

  // Store interaction in localStorage for user preferences
  try {
    const existingInteractions = localStorage.getItem(
      'cross_service_interactions'
    )
    const interactions = existingInteractions
      ? JSON.parse(existingInteractions)
      : []
    interactions.push(interaction)

    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100)
    }

    localStorage.setItem(
      'cross_service_interactions',
      JSON.stringify(interactions)
    )
  } catch {
    // Silently handle localStorage errors
    console.warn('Failed to store suggestion interaction')
  }
}

/**
 * Get dismissed suggestions from localStorage
 */
export function getDismissedSuggestions(): string[] {
  try {
    const interactions = localStorage.getItem('cross_service_interactions')
    if (!interactions) return []

    const parsedInteractions: SuggestionInteraction[] = JSON.parse(interactions)
    return parsedInteractions
      .filter(interaction => interaction.action === 'dismissed')
      .map(interaction => interaction.suggestionId)
  } catch {
    console.warn('Failed to get dismissed suggestions')
    return []
  }
}

/**
 * Check if user has shown interest in a service
 */
export function hasUserInterest(): boolean {
  try {
    const interactions = localStorage.getItem('cross_service_interactions')
    if (!interactions) return false

    const parsedInteractions: SuggestionInteraction[] = JSON.parse(interactions)
    return parsedInteractions.some(
      interaction =>
        interaction.action === 'interested' || interaction.action === 'clicked'
    )
  } catch {
    return false
  }
}

/**
 * Generate session ID for tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Determine optimal timing for showing suggestion
 */
export function getOptimalTiming(
  fromService: ServiceType,
  userEngagement: {
    timeOnPage: number
    scrollPercentage: number
    interactionCount: number
  }
): 'immediate' | 'after-engagement' | 'before-exit' {
  // Show immediately for high-intent contexts
  if (fromService === 'performance' && userEngagement.interactionCount > 2) {
    return 'immediate'
  }

  // Show after engagement for most contexts
  if (userEngagement.timeOnPage > 30 && userEngagement.scrollPercentage > 50) {
    return 'after-engagement'
  }

  // Show before exit for lower engagement
  return 'before-exit'
}

/**
 * Get contextual message for suggestion based on user behavior
 */
export function getContextualMessage(
  suggestion: CrossServiceSuggestion,
  userContext: {
    fromService: ServiceType
    timeOnPage: number
    hasEngaged: boolean
  }
): string {
  const { fromService, hasEngaged } = userContext

  if (hasEngaged && suggestionsData.contextualMessages[fromService]) {
    return suggestionsData.contextualMessages[fromService]
  }

  return suggestionsData.contextualMessages.default
}
