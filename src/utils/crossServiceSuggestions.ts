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

import { ServiceType } from '@/utils/contactRouting';

/**
 * Cross-service suggestion data
 */
export interface CrossServiceSuggestion {
  id: string;
  targetService: ServiceType;
  title: string;
  description: string;
  benefits: string[];
  ctaText: string;
  priority: number;
  contexts: SuggestionContext[];
  dismissable: boolean;
}

/**
 * Suggestion context for determining when to show suggestions
 */
export interface SuggestionContext {
  fromService: ServiceType;
  userAction?: string;
  pageSection?: string;
  timing: 'immediate' | 'after-engagement' | 'before-exit';
  placement: 'inline' | 'sidebar' | 'modal' | 'banner';
}

/**
 * User interaction tracking for suggestions
 */
export interface SuggestionInteraction {
  suggestionId: string;
  action: 'viewed' | 'clicked' | 'dismissed' | 'interested';
  context: SuggestionContext;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

/**
 * Suggestion configuration for each service relationship
 */
const CROSS_SERVICE_SUGGESTIONS: CrossServiceSuggestion[] = [
  // From Teaching → Performance
  {
    id: 'teaching-to-performance-band',
    targetService: 'performance',
    title: 'See Rrish perform live',
    description: 'Experience the techniques you\'re learning in a professional performance setting',
    benefits: [
      'Watch advanced techniques in action',
      'See performance dynamics and stage presence',
      'Learn from real-world applications'
    ],
    ctaText: 'View Performance Schedule',
    priority: 8,
    contexts: [{
      fromService: 'teaching',
      pageSection: 'about-instructor',
      timing: 'after-engagement',
      placement: 'inline'
    }],
    dismissable: true
  },
  
  {
    id: 'teaching-to-performance-private',
    targetService: 'performance',
    title: 'Book a Private Performance',
    description: 'Arrange a personalized performance session for deeper learning',
    benefits: [
      'One-on-one performance demonstration',
      'Custom setlist based on your learning goals',
      'Q&A session with techniques explained'
    ],
    ctaText: 'Learn About Private Sessions',
    priority: 6,
    contexts: [{
      fromService: 'teaching',
      pageSection: 'advanced-packages',
      timing: 'after-engagement',
      placement: 'sidebar'
    }],
    dismissable: true
  },

  // From Performance → Teaching
  {
    id: 'performance-to-teaching-learn',
    targetService: 'teaching',
    title: 'Learn these techniques',
    description: 'Master the guitar skills you\'re hearing in personalized lessons',
    benefits: [
      'Learn the exact techniques from performances',
      'Personalized instruction at your pace',
      'Build skills from beginner to advanced'
    ],
    ctaText: 'Start Guitar Lessons',
    priority: 9,
    contexts: [{
      fromService: 'performance',
      pageSection: 'portfolio-gallery',
      timing: 'after-engagement',
      placement: 'inline'
    }],
    dismissable: true
  },

  {
    id: 'performance-to-teaching-style',
    targetService: 'teaching',
    title: 'Develop your performance style',
    description: 'Learn stage presence and performance techniques through focused lessons',
    benefits: [
      'Performance-focused instruction',
      'Stage presence and confidence building',
      'Real-world playing techniques'
    ],
    ctaText: 'Explore Performance Lessons',
    priority: 7,
    contexts: [{
      fromService: 'performance',
      pageSection: 'hero-section',
      timing: 'before-exit',
      placement: 'banner'
    }],
    dismissable: true
  },

  // From Performance → Collaboration
  {
    id: 'performance-to-collaboration-venue',
    targetService: 'collaboration',
    title: 'Collaborate on your event',
    description: 'Work together to create custom performances for your venue or event',
    benefits: [
      'Custom setlist development',
      'Long-term venue partnerships',
      'Collaborative creative process'
    ],
    ctaText: 'Discuss Collaboration',
    priority: 7,
    contexts: [{
      fromService: 'performance',
      pageSection: 'booking-info',
      timing: 'after-engagement',
      placement: 'inline'
    }],
    dismissable: true
  },

  // From Collaboration → Performance
  {
    id: 'collaboration-to-performance-showcase',
    targetService: 'performance',
    title: 'Showcase our collaboration',
    description: 'Present collaborative work through live performances',
    benefits: [
      'Live debut of collaborative pieces',
      'Professional presentation platform',
      'Audience engagement opportunities'
    ],
    ctaText: 'Plan Performance Showcase',
    priority: 6,
    contexts: [{
      fromService: 'collaboration',
      pageSection: 'project-examples',
      timing: 'after-engagement',
      placement: 'sidebar'
    }],
    dismissable: true
  },

  // From Collaboration → Teaching
  {
    id: 'collaboration-to-teaching-skills',
    targetService: 'teaching',
    title: 'Build collaboration skills',
    description: 'Develop the musical foundation for successful collaborative work',
    benefits: [
      'Learn collaboration fundamentals',
      'Develop listening and adaptation skills',
      'Build technical proficiency for projects'
    ],
    ctaText: 'Start Skill Building',
    priority: 8,
    contexts: [{
      fromService: 'collaboration',
      pageSection: 'requirements',
      timing: 'after-engagement',
      placement: 'inline'
    }],
    dismissable: true
  }
];

/**
 * Get suggestions for the current service context
 */
export function getSuggestionsForContext(
  fromService: ServiceType,
  pageSection?: string,
  timing: 'immediate' | 'after-engagement' | 'before-exit' = 'after-engagement'
): CrossServiceSuggestion[] {
  return CROSS_SERVICE_SUGGESTIONS
    .filter(suggestion => 
      suggestion.contexts.some(context =>
        context.fromService === fromService &&
        (!pageSection || context.pageSection === pageSection) &&
        context.timing === timing
      )
    )
    .sort((a, b) => b.priority - a.priority);
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
  const suggestions = getSuggestionsForContext(fromService, pageSection, timing)
    .filter(suggestion => !excludeDismissed.includes(suggestion.id));
  
  return suggestions.length > 0 ? suggestions[0] : null;
}

/**
 * Get suggestions by placement type
 */
export function getSuggestionsByPlacement(
  fromService: ServiceType,
  placement: 'inline' | 'sidebar' | 'modal' | 'banner',
  excludeDismissed: string[] = []
): CrossServiceSuggestion[] {
  return CROSS_SERVICE_SUGGESTIONS
    .filter(suggestion => 
      suggestion.contexts.some(context =>
        context.fromService === fromService &&
        context.placement === placement
      ) && !excludeDismissed.includes(suggestion.id)
    )
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Track suggestion interaction
 */
export function trackSuggestionInteraction(interaction: SuggestionInteraction): void {
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
        timing: interaction.context.timing
      }
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Cross-Service Suggestion Interaction:', interaction);
  }

  // Store interaction in localStorage for user preferences
  try {
    const existingInteractions = localStorage.getItem('cross_service_interactions');
    const interactions = existingInteractions ? JSON.parse(existingInteractions) : [];
    interactions.push(interaction);
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    localStorage.setItem('cross_service_interactions', JSON.stringify(interactions));
  } catch {
    // Silently handle localStorage errors
    console.warn('Failed to store suggestion interaction');
  }
}

/**
 * Get dismissed suggestions from localStorage
 */
export function getDismissedSuggestions(): string[] {
  try {
    const interactions = localStorage.getItem('cross_service_interactions');
    if (!interactions) return [];
    
    const parsedInteractions: SuggestionInteraction[] = JSON.parse(interactions);
    return parsedInteractions
      .filter(interaction => interaction.action === 'dismissed')
      .map(interaction => interaction.suggestionId);
  } catch {
    console.warn('Failed to get dismissed suggestions');
    return [];
  }
}

/**
 * Check if user has shown interest in a service
 */
export function hasUserInterest(): boolean {
  try {
    const interactions = localStorage.getItem('cross_service_interactions');
    if (!interactions) return false;
    
    const parsedInteractions: SuggestionInteraction[] = JSON.parse(interactions);
    return parsedInteractions.some(interaction => 
      interaction.action === 'interested' || 
      interaction.action === 'clicked'
    );
  } catch {
    return false;
  }
}

/**
 * Generate session ID for tracking
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine optimal timing for showing suggestion
 */
export function getOptimalTiming(
  fromService: ServiceType,
  userEngagement: {
    timeOnPage: number;
    scrollPercentage: number;
    interactionCount: number;
  }
): 'immediate' | 'after-engagement' | 'before-exit' {
  // Show immediately for high-intent contexts
  if (fromService === 'performance' && userEngagement.interactionCount > 2) {
    return 'immediate';
  }
  
  // Show after engagement for most contexts
  if (userEngagement.timeOnPage > 30 && userEngagement.scrollPercentage > 50) {
    return 'after-engagement';
  }
  
  // Show before exit for lower engagement
  return 'before-exit';
}

/**
 * Get contextual message for suggestion based on user behavior
 */
export function getContextualMessage(
  suggestion: CrossServiceSuggestion,
  userContext: {
    fromService: ServiceType;
    timeOnPage: number;
    hasEngaged: boolean;
  }
): string {
  const { fromService, hasEngaged } = userContext;
  
  if (fromService === 'teaching' && hasEngaged) {
    return "Since you're interested in learning, you might also enjoy...";
  }
  
  if (fromService === 'performance' && hasEngaged) {
    return "Enjoyed the performance? You might also be interested in...";
  }
  
  if (fromService === 'collaboration' && hasEngaged) {
    return "Looking for creative partnerships? Consider also...";
  }
  
  return "You might also be interested in...";
}