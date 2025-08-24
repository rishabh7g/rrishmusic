/**
 * Cross-Service Upselling Analytics and Optimization System
 * 
 * Advanced analytics for measuring cross-service upselling effectiveness
 * and optimizing suggestion algorithms for better conversion rates.
 * 
 * Features:
 * - Real-time upselling analytics tracking
 * - A/B testing for different suggestion strategies
 * - User behavior analysis and optimization
 * - Service cross-conversion measurement
 * - Automated suggestion effectiveness scoring
 */

import { ServiceType } from '@/utils/contactRouting';
import { CrossServiceSuggestion } from '@/utils/crossServiceSuggestions';

/**
 * Analytics event types for upselling tracking
 */
export interface UpsellingEvent {
  eventId: string;
  suggestionId: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  eventType: 'suggestion_viewed' | 'suggestion_clicked' | 'suggestion_dismissed' | 
             'service_inquiry' | 'cross_service_conversion' | 'upselling_success';
  fromService: ServiceType;
  targetService?: ServiceType;
  context: {
    pageSection: string;
    placement: string;
    timing: string;
    timeOnPage: number;
    scrollPercentage: number;
    userEngagement: number;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Upselling performance metrics
 */
export interface UpsellingMetrics {
  suggestionId: string;
  impressions: number;
  clicks: number;
  dismissals: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
  dismissalRate: number;
  avgTimeToClick: number;
  avgEngagementScore: number;
  effectivenessScore: number;
}

/**
 * Cross-service conversion tracking
 */
export interface CrossServiceConversion {
  conversionId: string;
  originalService: ServiceType;
  convertedService: ServiceType;
  suggestionId?: string;
  timestamp: number;
  conversionValue: number;
  conversionPath: string[];
  userJourney: UpsellingEvent[];
}

/**
 * A/B testing configuration for upselling strategies
 */
export interface UpsellingABTest {
  testId: string;
  testName: string;
  variants: UpsellingTestVariant[];
  targetService: ServiceType;
  status: 'active' | 'paused' | 'completed';
  startDate: number;
  endDate?: number;
  sampleSize: number;
  results?: UpsellingTestResults;
}

export interface UpsellingTestVariant {
  variantId: string;
  variantName: string;
  suggestionConfig: Partial<CrossServiceSuggestion>;
  weight: number;
  userAllocation: number;
}

export interface UpsellingTestResults {
  testId: string;
  variants: Record<string, UpsellingMetrics>;
  winner?: string;
  confidence: number;
  significanceLevel: number;
}

/**
 * Advanced upselling analytics class
 */
export class UpsellingAnalytics {
  private events: UpsellingEvent[] = [];
  private metrics: Map<string, UpsellingMetrics> = new Map();
  private conversions: CrossServiceConversion[] = [];
  private activeTests: Map<string, UpsellingABTest> = new Map();
  
  /**
   * Track upselling event
   */
  trackEvent(event: Omit<UpsellingEvent, 'eventId' | 'timestamp'>): void {
    const upsellingEvent: UpsellingEvent = {
      ...event,
      eventId: this.generateEventId(),
      timestamp: Date.now()
    };
    
    this.events.push(upsellingEvent);
    this.updateMetrics(upsellingEvent);
    
    // Store in localStorage for persistence
    try {
      const storedEvents = JSON.parse(localStorage.getItem('rrish_upselling_events') || '[]');
      storedEvents.push(upsellingEvent);
      
      // Keep only last 1000 events
      if (storedEvents.length > 1000) {
        storedEvents.splice(0, storedEvents.length - 1000);
      }
      
      localStorage.setItem('rrish_upselling_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.warn('Failed to store upselling event:', error);
    }
  }

  /**
   * Track cross-service conversion
   */
  trackConversion(conversion: Omit<CrossServiceConversion, 'conversionId' | 'timestamp'>): void {
    const crossServiceConversion: CrossServiceConversion = {
      ...conversion,
      conversionId: this.generateConversionId(),
      timestamp: Date.now()
    };
    
    this.conversions.push(crossServiceConversion);
    
    // Track conversion event
    this.trackEvent({
      suggestionId: conversion.suggestionId || 'direct',
      userId: undefined,
      sessionId: this.getSessionId(),
      eventType: 'cross_service_conversion',
      fromService: conversion.originalService,
      targetService: conversion.convertedService,
      context: {
        pageSection: 'conversion',
        placement: 'direct',
        timing: 'immediate',
        timeOnPage: 0,
        scrollPercentage: 0,
        userEngagement: 100
      },
      metadata: {
        conversionValue: conversion.conversionValue,
        conversionPath: conversion.conversionPath
      }
    });
  }

  /**
   * Get upselling metrics for a suggestion
   */
  getMetrics(suggestionId: string): UpsellingMetrics | null {
    return this.metrics.get(suggestionId) || null;
  }

  /**
   * Get all upselling metrics
   */
  getAllMetrics(): UpsellingMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get cross-service conversion rate
   */
  getCrossServiceConversionRate(fromService: ServiceType, toService: ServiceType): number {
    const totalInquiries = this.events.filter(e => 
      e.eventType === 'service_inquiry' && e.fromService === fromService
    ).length;
    
    const conversions = this.conversions.filter(c => 
      c.originalService === fromService && c.convertedService === toService
    ).length;
    
    return totalInquiries > 0 ? (conversions / totalInquiries) * 100 : 0;
  }

  /**
   * Get top performing suggestions
   */
  getTopPerformingSuggestions(limit: number = 5): UpsellingMetrics[] {
    return this.getAllMetrics()
      .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
      .slice(0, limit);
  }

  /**
   * Get underperforming suggestions for optimization
   */
  getUnderperformingSuggestions(threshold: number = 2): UpsellingMetrics[] {
    return this.getAllMetrics()
      .filter(m => m.effectivenessScore < threshold)
      .sort((a, b) => a.effectivenessScore - b.effectivenessScore);
  }

  /**
   * Calculate upselling ROI
   */
  calculateUpsellingROI(timeframe: number = 30): number {
    const cutoffTime = Date.now() - (timeframe * 24 * 60 * 60 * 1000);
    
    const recentConversions = this.conversions.filter(c => c.timestamp >= cutoffTime);
    const totalValue = recentConversions.reduce((sum, c) => sum + c.conversionValue, 0);
    
    // Assuming average implementation cost
    const implementationCost = 5000; // Base cost for upselling system
    
    return totalValue > implementationCost ? 
      ((totalValue - implementationCost) / implementationCost) * 100 : 0;
  }

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getAllMetrics();
    
    // Low CTR recommendations
    const lowCTR = metrics.filter(m => m.clickThroughRate < 2);
    if (lowCTR.length > 0) {
      recommendations.push(`${lowCTR.length} suggestions have low click-through rates. Consider improving headlines or placement.`);
    }
    
    // High dismissal rate recommendations
    const highDismissal = metrics.filter(m => m.dismissalRate > 30);
    if (highDismissal.length > 0) {
      recommendations.push(`${highDismissal.length} suggestions have high dismissal rates. Review targeting and timing.`);
    }
    
    // Low conversion recommendations
    const lowConversion = metrics.filter(m => m.conversionRate < 1);
    if (lowConversion.length > 0) {
      recommendations.push(`${lowConversion.length} suggestions have low conversion rates. Consider A/B testing different approaches.`);
    }
    
    // Cross-service conversion opportunities
    const serviceRates = this.calculateServiceConversionMatrix();
    Object.entries(serviceRates).forEach(([fromTo, rate]) => {
      if (rate < 5) {
        recommendations.push(`${fromTo} conversion rate is ${rate}%. Consider new suggestion strategies.`);
      }
    });
    
    return recommendations;
  }

  /**
   * Private helper methods
   */
  private updateMetrics(event: UpsellingEvent): void {
    const existing = this.metrics.get(event.suggestionId) || {
      suggestionId: event.suggestionId,
      impressions: 0,
      clicks: 0,
      dismissals: 0,
      conversions: 0,
      clickThroughRate: 0,
      conversionRate: 0,
      dismissalRate: 0,
      avgTimeToClick: 0,
      avgEngagementScore: 0,
      effectivenessScore: 0
    };

    switch (event.eventType) {
      case 'suggestion_viewed':
        existing.impressions++;
        break;
      case 'suggestion_clicked':
        existing.clicks++;
        break;
      case 'suggestion_dismissed':
        existing.dismissals++;
        break;
      case 'upselling_success':
        existing.conversions++;
        break;
    }

    // Update calculated metrics
    existing.clickThroughRate = existing.impressions > 0 ? 
      (existing.clicks / existing.impressions) * 100 : 0;
    
    existing.conversionRate = existing.clicks > 0 ? 
      (existing.conversions / existing.clicks) * 100 : 0;
    
    existing.dismissalRate = existing.impressions > 0 ? 
      (existing.dismissals / existing.impressions) * 100 : 0;

    // Calculate effectiveness score (composite metric)
    existing.effectivenessScore = this.calculateEffectivenessScore(existing);

    this.metrics.set(event.suggestionId, existing);
  }

  private calculateEffectivenessScore(metrics: UpsellingMetrics): number {
    // Weighted composite score
    const ctrWeight = 0.3;
    const conversionWeight = 0.4;
    const dismissalWeight = 0.2;
    const engagementWeight = 0.1;

    const ctrScore = Math.min(metrics.clickThroughRate / 10, 10); // Cap at 10% CTR = 10 points
    const conversionScore = Math.min(metrics.conversionRate / 5, 10); // Cap at 5% CR = 10 points  
    const dismissalScore = Math.max(10 - (metrics.dismissalRate / 5), 0); // Penalty for dismissals
    const engagementScore = Math.min(metrics.avgEngagementScore, 10); // Cap at 10 points

    return (
      ctrScore * ctrWeight +
      conversionScore * conversionWeight +
      dismissalScore * dismissalWeight +
      engagementScore * engagementWeight
    );
  }

  private calculateServiceConversionMatrix(): Record<string, number> {
    const matrix: Record<string, number> = {};
    const services: ServiceType[] = ['teaching', 'performance', 'collaboration'];
    
    services.forEach(from => {
      services.forEach(to => {
        if (from !== to) {
          const rate = this.getCrossServiceConversionRate(from, to);
          matrix[`${from}-to-${to}`] = rate;
        }
      });
    });
    
    return matrix;
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversionId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('rrish_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('rrish_session_id', sessionId);
    }
    return sessionId;
  }
}

/**
 * Global analytics instance
 */
export const upsellingAnalytics = new UpsellingAnalytics();

/**
 * React hook for upselling analytics
 */
export function useUpsellingAnalytics() {
  const trackSuggestionView = (suggestionId: string, context: UpsellingEvent['context']) => {
    upsellingAnalytics.trackEvent({
      suggestionId,
      sessionId: upsellingAnalytics['getSessionId'](),
      eventType: 'suggestion_viewed',
      fromService: context.pageSection.includes('teaching') ? 'teaching' : 
                   context.pageSection.includes('performance') ? 'performance' : 'collaboration',
      context
    });
  };

  const trackSuggestionClick = (suggestionId: string, targetService: ServiceType, context: UpsellingEvent['context']) => {
    upsellingAnalytics.trackEvent({
      suggestionId,
      sessionId: upsellingAnalytics['getSessionId'](),
      eventType: 'suggestion_clicked',
      fromService: context.pageSection.includes('teaching') ? 'teaching' : 
                   context.pageSection.includes('performance') ? 'performance' : 'collaboration',
      targetService,
      context
    });
  };

  const trackSuggestionDismiss = (suggestionId: string, context: UpsellingEvent['context']) => {
    upsellingAnalytics.trackEvent({
      suggestionId,
      sessionId: upsellingAnalytics['getSessionId'](),
      eventType: 'suggestion_dismissed',
      fromService: context.pageSection.includes('teaching') ? 'teaching' : 
                   context.pageSection.includes('performance') ? 'performance' : 'collaboration',
      context
    });
  };

  const trackConversion = (originalService: ServiceType, convertedService: ServiceType, value: number) => {
    upsellingAnalytics.trackConversion({
      originalService,
      convertedService,
      conversionValue: value,
      conversionPath: [originalService, convertedService],
      userJourney: []
    });
  };

  return {
    trackSuggestionView,
    trackSuggestionClick,
    trackSuggestionDismiss,
    trackConversion,
    getMetrics: upsellingAnalytics.getMetrics.bind(upsellingAnalytics),
    getAllMetrics: upsellingAnalytics.getAllMetrics.bind(upsellingAnalytics),
    getTopPerforming: upsellingAnalytics.getTopPerformingSuggestions.bind(upsellingAnalytics),
    getRecommendations: upsellingAnalytics.generateOptimizationRecommendations.bind(upsellingAnalytics)
  };
}