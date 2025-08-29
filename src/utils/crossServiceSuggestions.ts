/**
 * Simplified Cross-Service Suggestions Utility
 * Basic implementation for component compatibility during cleanup phase
 */

import { ServiceType } from '@/utils/contactRouting'

export interface CrossServiceSuggestion {
  id: string
  title: string
  description: string
  targetService: ServiceType
  fromServices: ServiceType[]
  ctaText: string
  benefits: string[]
  dismissable: boolean
  priority: number
}

// Mock data for basic functionality
const mockSuggestions: CrossServiceSuggestion[] = [
  {
    id: 'performance-to-teaching',
    title: 'Enhance Your Skills with Private Lessons',
    description:
      'Take your musical journey further with personalized instruction.',
    targetService: 'teaching',
    fromServices: ['performance'],
    ctaText: 'Learn More',
    benefits: [
      'Personalized instruction',
      'Flexible scheduling',
      'All skill levels',
    ],
    dismissable: true,
    priority: 1,
  },
  {
    id: 'teaching-to-performance',
    title: 'Showcase Your Talent',
    description: 'Ready to perform? Let us help you find the perfect venue.',
    targetService: 'performance',
    fromServices: ['teaching'],
    ctaText: 'Book Performance',
    benefits: [
      'Professional venues',
      'Event coordination',
      'Marketing support',
    ],
    dismissable: true,
    priority: 1,
  },
]

export const getBestSuggestionForContext = (
  fromService: ServiceType,
  pageSection?: string,
  timing?: string,
  dismissedSuggestions?: string[]
): CrossServiceSuggestion | null => {
  // Simple logic for now
  const suggestion = mockSuggestions.find(
    s =>
      s.fromServices.includes(fromService) &&
      !dismissedSuggestions?.includes(s.id)
  )
  return suggestion || null
}

export const getDismissedSuggestions = (): string[] => {
  try {
    const dismissed = localStorage.getItem('dismissedSuggestions')
    return dismissed ? JSON.parse(dismissed) : []
  } catch {
    return []
  }
}

export const getSuggestionsByPlacement = (
  placement: string
): CrossServiceSuggestion[] => {
  return mockSuggestions
}

export const hasUserInterest = (suggestionId: string): boolean => {
  return false
}

export const trackSuggestionInteraction = (interaction: {
  suggestionId: string
  action: string
  context: any
  timestamp: number
  sessionId: string
}) => {
  // Basic tracking - just log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Suggestion interaction:', interaction)
  }
}

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const getContextualMessage = (
  suggestion: CrossServiceSuggestion,
  context: { fromService: ServiceType; timeOnPage: number; hasEngaged: boolean }
): string => {
  return 'You might also be interested in:'
}
