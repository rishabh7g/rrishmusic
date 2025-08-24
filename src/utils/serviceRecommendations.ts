import { ServiceType } from '@/types/content';
import {
  ServiceRelationship,
  ServiceRecommendation,
  UserContext,
  RelationshipType,
  CrossServiceSuggestion,
  ServiceMetrics,
  CrossServiceCampaign
} from '@/types/serviceRelationships';

/**
 * Service Recommendations Engine
 * Intelligent system for suggesting related services and creating cross-service navigation
 */

/**
 * Static service relationship configuration
 * Defines how services relate to each other with strength and context
 */
const SERVICE_RELATIONSHIPS: ServiceRelationship[] = [
  // Teaching -> Performance relationships
  {
    fromService: 'teaching',
    toService: 'performance',
    relationshipType: 'progressive',
    strength: 0.9,
    context: ['skill_development', 'performance_prep', 'career_advancement'],
    description: 'Apply your guitar skills in live performance settings'
  },
  {
    fromService: 'teaching',
    toService: 'collaboration',
    relationshipType: 'complementary',
    strength: 0.7,
    context: ['skill_development', 'creative_project', 'career_advancement'],
    description: 'Collaborate with other musicians to enhance your learning'
  },
  
  // Performance -> Teaching relationships  
  {
    fromService: 'performance',
    toService: 'teaching',
    relationshipType: 'prerequisite',
    strength: 0.8,
    context: ['skill_development', 'performance_prep'],
    description: 'Develop solid fundamentals to enhance your performances'
  },
  {
    fromService: 'performance',
    toService: 'collaboration',
    relationshipType: 'complementary',
    strength: 0.9,
    context: ['creative_project', 'performance_prep', 'career_advancement'],
    description: 'Create collaborative projects for unique performance opportunities'
  },
  
  // Collaboration -> Teaching relationships
  {
    fromService: 'collaboration',
    toService: 'teaching',
    relationshipType: 'complementary',
    strength: 0.6,
    context: ['skill_development', 'creative_project'],
    description: 'Improve your skills to contribute more effectively to collaborations'
  },
  {
    fromService: 'collaboration',
    toService: 'performance',
    relationshipType: 'progressive',
    strength: 0.8,
    context: ['creative_project', 'performance_prep', 'career_advancement'],
    description: 'Showcase your collaborative work through live performances'
  }
];

/**
 * Cross-service suggestions for combined offerings
 */
const CROSS_SERVICE_SUGGESTIONS: CrossServiceSuggestion[] = [
  {
    title: 'Complete Musician Development',
    description: 'Combine lessons with performance opportunities to accelerate your musical growth',
    services: ['teaching', 'performance'],
    benefits: [
      'Apply lessons immediately in real performance contexts',
      'Build confidence through guided practice and live experience',
      'Develop both technical skills and stage presence',
      'Create a complete learning and performing cycle'
    ],
    callToAction: 'Explore Teaching + Performance Package',
    priority: 1
  },
  {
    title: 'Creative Collaboration Network',
    description: 'Join collaborative projects and showcase your work through performances',
    services: ['collaboration', 'performance'],
    benefits: [
      'Connect with other musicians and artists',
      'Create unique original content',
      'Gain performance experience with collaborative works',
      'Build a diverse portfolio of musical projects'
    ],
    callToAction: 'Join Creative Network',
    priority: 2
  },
  {
    title: 'Full-Service Musical Journey',
    description: 'Complete musical development from learning to performing to creating',
    services: ['teaching', 'performance', 'collaboration'],
    benefits: [
      'Comprehensive skill development across all musical areas',
      'Multiple revenue streams and opportunities',
      'Rich, diverse musical experience',
      'Professional network building across all service areas'
    ],
    callToAction: 'Start Complete Musical Journey',
    priority: 3
  }
];

/**
 * Service Analytics Class
 * Tracks user behavior and service performance metrics
 */
class ServiceAnalytics {
  private metrics: Map<ServiceType, ServiceMetrics> = new Map();
  
  updateMetrics(service: ServiceType, data: Partial<ServiceMetrics>): void {
    const current = this.metrics.get(service) || this.getDefaultMetrics(service);
    this.metrics.set(service, { ...current, ...data });
  }
  
  getMetrics(service: ServiceType): ServiceMetrics {
    return this.metrics.get(service) || this.getDefaultMetrics(service);
  }
  
  private getDefaultMetrics(service: ServiceType): ServiceMetrics {
    return {
      service,
      conversionRate: 0,
      averageTimeSpent: 0,
      popularTransitions: [],
      userSatisfactionScore: 0,
      commonDropoffPoints: []
    };
  }
}

/**
 * Service Recommendations Engine Class
 */
export class ServiceRecommendationEngine {
  private analytics: ServiceAnalytics;
  private campaigns: CrossServiceCampaign[];
  
  constructor() {
    this.analytics = new ServiceAnalytics();
    this.campaigns = [];
  }
  
  /**
   * Generate service recommendations based on user context
   */
  generateRecommendations(
    userContext: UserContext,
    options: {
      maxRecommendations?: number;
      minConfidence?: number;
      excludeServices?: ServiceType[];
    } = {}
  ): ServiceRecommendation[] {
    const {
      maxRecommendations = 3,
      minConfidence = 0.3,
      excludeServices = []
    } = options;
    
    const currentService = userContext.currentService;
    const availableServices = this.getAvailableServices(currentService, excludeServices);
    
    const recommendations: ServiceRecommendation[] = [];
    
    // Generate recommendations based on service relationships
    for (const targetService of availableServices) {
      const relationship = this.findRelationship(currentService, targetService);
      if (!relationship) continue;
      
      const confidence = this.calculateConfidence(relationship, userContext);
      if (confidence < minConfidence) continue;
      
      const recommendation = this.createRecommendation(
        relationship,
        userContext,
        confidence
      );
      
      recommendations.push(recommendation);
    }
    
    // Sort by confidence and priority
    recommendations.sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      const scoreDiff = priorityScore[b.priority] - priorityScore[a.priority];
      return scoreDiff !== 0 ? scoreDiff : b.confidence - a.confidence;
    });
    
    return recommendations.slice(0, maxRecommendations);
  }
  
  /**
   * Get cross-service suggestions for bundled offerings
   */
  getCrossServiceSuggestions(
    currentService: ServiceType,
    userContext: UserContext
  ): CrossServiceSuggestion[] {
    return CROSS_SERVICE_SUGGESTIONS
      .filter(suggestion => suggestion.services.includes(currentService))
      .filter(suggestion => {
        // Filter based on user preferences if available
        if (userContext.preferences.goals.length > 0) {
          const goals = userContext.preferences.goals.join(' ').toLowerCase();
          return suggestion.benefits.some(benefit => 
            benefit.toLowerCase().includes('skill') && goals.includes('skill') ||
            benefit.toLowerCase().includes('perform') && goals.includes('perform') ||
            benefit.toLowerCase().includes('collaborat') && goals.includes('collaborat')
          );
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * Find relationship between two services
   */
  private findRelationship(from: ServiceType, to: ServiceType): ServiceRelationship | null {
    return SERVICE_RELATIONSHIPS.find(
      rel => rel.fromService === from && rel.toService === to
    ) || null;
  }
  
  /**
   * Calculate confidence score for a recommendation
   */
  private calculateConfidence(
    relationship: ServiceRelationship,
    userContext: UserContext
  ): number {
    let confidence = relationship.strength;
    
    // Boost confidence based on user interactions
    const interactionBoost = userContext.interactions
      .filter(int => int.interactionType !== 'view')
      .length * 0.1;
    confidence += Math.min(interactionBoost, 0.2);
    
    // Boost confidence based on time spent
    const timeSpent = userContext.timeSpentOnService[userContext.currentService] || 0;
    const timeBoost = Math.min(timeSpent / 60000, 0.15); // Cap at 1 minute
    confidence += timeBoost;
    
    // Consider user preferences
    if (userContext.preferences.primaryInterest === relationship.toService) {
      confidence += 0.2;
    }
    
    // Context matching
    const contextMatch = this.calculateContextMatch(relationship, userContext);
    confidence += contextMatch * 0.15;
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Calculate how well relationship context matches user context
   */
  private calculateContextMatch(
    relationship: ServiceRelationship,
    userContext: UserContext
  ): number {
    // This is a simplified version - in a real implementation,
    // we'd analyze user behavior to infer context
    const userGoals = userContext.preferences.goals || [];
    let matchScore = 0;
    
    relationship.context.forEach(context => {
      if (userGoals.some(goal => goal.includes(context.replace('_', ' ')))) {
        matchScore += 0.25;
      }
    });
    
    return Math.min(matchScore, 1.0);
  }
  
  /**
   * Create a service recommendation object
   */
  private createRecommendation(
    relationship: ServiceRelationship,
    userContext: UserContext,
    confidence: number
  ): ServiceRecommendation {
    const service = relationship.toService;
    
    return {
      service,
      confidence,
      reasoning: this.generateReasoning(relationship, userContext),
      relationshipType: relationship.relationshipType,
      context: relationship.context,
      priority: this.calculatePriority(confidence, relationship),
      actionText: this.generateActionText(service, relationship.relationshipType),
      url: this.getServiceUrl(service)
    };
  }
  
  /**
   * Generate reasoning for why this service is recommended
   */
  private generateReasoning(
    relationship: ServiceRelationship,
    userContext: UserContext
  ): string[] {
    const reasoning: string[] = [relationship.description];
    
    // Add context-based reasoning
    if (userContext.timeSpentOnService[userContext.currentService] > 30000) {
      reasoning.push('Based on your interest in ' + userContext.currentService);
    }
    
    if (userContext.interactions.length > 3) {
      reasoning.push('You seem engaged with our services');
    }
    
    return reasoning;
  }
  
  /**
   * Calculate recommendation priority
   */
  private calculatePriority(
    confidence: number,
    relationship: ServiceRelationship
  ): 'high' | 'medium' | 'low' {
    if (confidence > 0.7 && relationship.strength > 0.8) return 'high';
    if (confidence > 0.5 && relationship.strength > 0.6) return 'medium';
    return 'low';
  }
  
  /**
   * Generate action text for recommendation
   */
  private generateActionText(service: ServiceType, relationshipType: RelationshipType): string {
    const actionMap: Record<ServiceType, Record<RelationshipType, string>> = {
      teaching: {
        complementary: 'Start Learning Guitar',
        progressive: 'Begin Your Musical Journey',
        alternative: 'Explore Guitar Lessons',
        prerequisite: 'Build Your Foundation',
        collaborative: 'Learn Through Collaboration',
        seasonal: 'Perfect Time to Start Learning'
      },
      performance: {
        complementary: 'Book a Performance',
        progressive: 'Take the Stage',
        alternative: 'Explore Performance Options',
        prerequisite: 'Prepare for Performance',
        collaborative: 'Perform Collaboratively',
        seasonal: 'Seasonal Performance Opportunities'
      },
      collaboration: {
        complementary: 'Start Collaborating',
        progressive: 'Create Together',
        alternative: 'Explore Collaboration',
        prerequisite: 'Join Creative Projects',
        collaborative: 'Find Your Creative Community',
        seasonal: 'Seasonal Collaboration Projects'
      }
    };
    
    return actionMap[service]?.[relationshipType] || `Explore ${service}`;
  }
  
  /**
   * Get URL for service
   */
  private getServiceUrl(service: ServiceType): string {
    return `/${service}`;
  }
  
  /**
   * Get available services excluding current and excluded ones
   */
  private getAvailableServices(
    currentService: ServiceType,
    excludeServices: ServiceType[]
  ): ServiceType[] {
    const allServices: ServiceType[] = ['teaching', 'performance', 'collaboration'];
    return allServices.filter(
      service => service !== currentService && !excludeServices.includes(service)
    );
  }
}

/**
 * Default recommendation engine instance
 */
export const recommendationEngine = new ServiceRecommendationEngine();

/**
 * Utility functions for easy access to recommendations
 */
export const getServiceRecommendations = (
  currentService: ServiceType,
  userContext: Partial<UserContext> = {}
): ServiceRecommendation[] => {
  const fullContext: UserContext = {
    currentService,
    visitedServices: [currentService],
    timeSpentOnService: { [currentService]: Date.now() },
    interactions: [],
    preferences: { primaryInterest: currentService, goals: [] },
    ...userContext
  };
  
  return recommendationEngine.generateRecommendations(fullContext);
};

export const getCrossServiceSuggestions = (
  currentService: ServiceType,
  userContext: Partial<UserContext> = {}
): CrossServiceSuggestion[] => {
  const fullContext: UserContext = {
    currentService,
    visitedServices: [currentService],
    timeSpentOnService: { [currentService]: Date.now() },
    interactions: [],
    preferences: { primaryInterest: currentService, goals: [] },
    ...userContext
  };
  
  return recommendationEngine.getCrossServiceSuggestions(currentService, fullContext);
};

export default {
  ServiceRecommendationEngine,
  recommendationEngine,
  getServiceRecommendations,
  getCrossServiceSuggestions
};