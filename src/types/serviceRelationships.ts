import { ServiceType } from '@/types/content'

/**
 * Service Relationship Types
 * Defines how different services relate to each other and user contexts
 */

/**
 * User context information for service recommendations
 */
export interface UserContext {
  currentService: ServiceType
  visitedServices: ServiceType[]
  timeSpentOnService: Record<ServiceType, number>
  interactions: ServiceInteraction[]
  preferences: UserPreferences
}

/**
 * Service interaction tracking
 */
export interface ServiceInteraction {
  serviceType: ServiceType
  interactionType: 'view' | 'click' | 'form_interaction' | 'contact' | 'booking'
  timestamp: number
  duration?: number
  metadata?: Record<string, unknown>
}

/**
 * User preferences for service recommendations
 */
export interface UserPreferences {
  primaryInterest: ServiceType
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  budget?: 'low' | 'medium' | 'high'
  availability?: 'flexible' | 'limited' | 'weekends_only'
}

/**
 * Service relationship definition
 */
export interface ServiceRelationship {
  fromService: ServiceType
  toService: ServiceType
  relationshipType: RelationshipType
  strength: number // 0-1, higher means stronger relationship
  context: RelationshipContext[]
  description: string
}

/**
 * Types of relationships between services
 */
export type RelationshipType =
  | 'complementary' // Services that work well together
  | 'progressive' // Natural progression from one to another
  | 'alternative' // Alternative options for similar goals
  | 'prerequisite' // One service prepares for another
  | 'collaborative' // Services often combined in projects
  | 'seasonal' // Services popular at different times

/**
 * Context in which relationships are relevant
 */
export type RelationshipContext =
  | 'skill_development' // Learning and improvement context
  | 'performance_prep' // Preparing for performances
  | 'creative_project' // Working on creative collaborations
  | 'career_advancement' // Professional development
  | 'hobby_exploration' // Casual interest and exploration
  | 'event_planning' // Planning specific events

/**
 * Service recommendation with reasoning
 */
export interface ServiceRecommendation {
  service: ServiceType
  confidence: number // 0-1, how confident we are in this recommendation
  reasoning: string[]
  relationshipType: RelationshipType
  context: RelationshipContext[]
  priority: 'high' | 'medium' | 'low'
  actionText: string // CTA text for the recommendation
  url: string // Link to the recommended service
}

/**
 * Cross-service suggestion configuration
 */
export interface CrossServiceSuggestion {
  title: string
  description: string
  services: ServiceType[]
  benefits: string[]
  callToAction: string
  priority: number
}

/**
 * Service transition tracking
 */
export interface ServiceTransition {
  from: ServiceType
  to: ServiceType
  timestamp: number
  method: 'direct_link' | 'navigation' | 'recommendation' | 'search'
  success: boolean
  metadata?: Record<string, unknown>
}

/**
 * Navigation context for preserving state during transitions
 */
export interface NavigationContext {
  previousService: ServiceType | null
  breadcrumbs: BreadcrumbItem[]
  preservedState: Record<string, unknown>
  returnUrl?: string
  userIntent: string
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  service: ServiceType
  title: string
  url: string
  timestamp: number
}

/**
 * Service analytics and metrics
 */
export interface ServiceMetrics {
  service: ServiceType
  conversionRate: number
  averageTimeSpent: number
  popularTransitions: ServiceTransition[]
  userSatisfactionScore: number
  commonDropoffPoints: string[]
}

/**
 * Cross-service campaign configuration
 */
export interface CrossServiceCampaign {
  id: string
  name: string
  description: string
  sourceServices: ServiceType[]
  targetService: ServiceType
  incentive?: string
  validUntil?: Date
  conditions: CampaignCondition[]
}

/**
 * Campaign condition for targeted recommendations
 */
export interface CampaignCondition {
  type:
    | 'user_type'
    | 'time_spent'
    | 'interactions'
    | 'service_history'
    | 'seasonal'
  value: unknown
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range'
}

export default {
  ServiceType,
  UserContext,
  ServiceInteraction,
  UserPreferences,
  ServiceRelationship,
  RelationshipType,
  RelationshipContext,
  ServiceRecommendation,
  CrossServiceSuggestion,
  ServiceTransition,
  NavigationContext,
  BreadcrumbItem,
  ServiceMetrics,
  CrossServiceCampaign,
  CampaignCondition,
}
