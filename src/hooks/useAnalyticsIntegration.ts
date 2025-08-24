/**
 * Analytics Integration Hook
 * 
 * Centralized hook for integrating advanced analytics throughout the application.
 * Provides easy-to-use methods for tracking user behavior, conversions, and
 * optimizing the user experience across all services.
 * 
 * Features:
 * - Automatic conversion funnel tracking
 * - User behavior analysis
 * - A/B testing integration
 * - Performance monitoring
 * - Real-time optimization recommendations
 */

import { useEffect, useCallback, useState } from 'react';
import { useAdvancedAnalytics } from '@/utils/advancedAnalytics';
import { useUpsellingAnalytics } from '@/utils/upsellingAnalytics';
import { ServiceType } from '@/utils/contactRouting';

/**
 * Analytics integration configuration
 */
interface AnalyticsConfig {
  enableFunnelTracking?: boolean;
  enableBehaviorAnalysis?: boolean;
  enableABTesting?: boolean;
  enableRealTimeOptimization?: boolean;
  debugMode?: boolean;
}

/**
 * User session data
 */
interface UserSession {
  sessionId: string;
  startTime: number;
  currentService?: ServiceType;
  engagementLevel: 'low' | 'medium' | 'high';
  conversionLikelihood: number;
  recommendedActions: string[];
}

/**
 * Page tracking data
 */
interface PageTracking {
  service: ServiceType;
  section: string;
  timeOnSection: number;
  interactions: number;
  scrollDepth: number;
}

/**
 * Analytics Integration Hook
 */
export function useAnalyticsIntegration(config: AnalyticsConfig = {}) {
  const {
    enableFunnelTracking = true,
    enableBehaviorAnalysis = true,
    enableABTesting = true,
    enableRealTimeOptimization = true,
    debugMode = false
  } = config;

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [currentPageTracking, setCurrentPageTracking] = useState<PageTracking | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    trackConversionStage,
    getPerformanceDashboard,
    getABTestVariant,
    analyzeUserBehavior,
    getOptimizationRecommendations
  } = useAdvancedAnalytics();

  const {
    trackSuggestionView,
    trackSuggestionClick,
    trackConversion: trackUpsellingConversion
  } = useUpsellingAnalytics();

  /**
   * Initialize analytics system
   */
  useEffect(() => {
    if (!isInitialized) {
      initializeAnalytics();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  /**
   * Initialize analytics session
   */
  const initializeAnalytics = useCallback(() => {
    const sessionId = getOrCreateSessionId();
    
    const session: UserSession = {
      sessionId,
      startTime: Date.now(),
      engagementLevel: 'low',
      conversionLikelihood: 0,
      recommendedActions: []
    };

    setUserSession(session);

    if (debugMode) {
      console.log('Analytics initialized:', session);
    }

    // Track session start
    if (enableFunnelTracking) {
      trackConversionStage('teaching', 'session_start', sessionId);
    }
  }, [enableFunnelTracking, debugMode, trackConversionStage]);

  /**
   * Track page view
   */
  const trackPageView = useCallback((service: ServiceType, section: string = 'main') => {
    if (!enableFunnelTracking || !userSession) return;

    // Track conversion stage
    trackConversionStage(service, 'landing', userSession.sessionId);

    // Initialize page tracking
    setCurrentPageTracking({
      service,
      section,
      timeOnSection: 0,
      interactions: 0,
      scrollDepth: 0
    });

    // Update user session
    setUserSession(prev => prev ? {
      ...prev,
      currentService: service
    } : prev);

    if (debugMode) {
      console.log(`Page view tracked: ${service}/${section}`);
    }
  }, [enableFunnelTracking, userSession, trackConversionStage, debugMode]);

  /**
   * Track user engagement
   */
  const trackEngagement = useCallback((
    action: 'scroll' | 'click' | 'hover' | 'form_interaction',
    data?: Record<string, unknown>
  ) => {
    if (!enableBehaviorAnalysis || !userSession || !currentPageTracking) return;

    // Update page tracking
    setCurrentPageTracking(prev => prev ? {
      ...prev,
      interactions: prev.interactions + 1,
      scrollDepth: action === 'scroll' && data?.depth ? 
        Math.max(prev.scrollDepth, data.depth as number) : prev.scrollDepth
    } : prev);

    // Calculate engagement level
    const engagementScore = calculateEngagementScore(currentPageTracking);
    const engagementLevel = engagementScore > 70 ? 'high' : 
                          engagementScore > 30 ? 'medium' : 'low';

    // Update user session
    setUserSession(prev => prev ? {
      ...prev,
      engagementLevel,
      conversionLikelihood: calculateConversionLikelihood(engagementScore, currentPageTracking)
    } : prev);

    if (debugMode) {
      console.log(`Engagement tracked: ${action}`, { engagementScore, engagementLevel });
    }
  }, [enableBehaviorAnalysis, userSession, currentPageTracking, debugMode]);

  /**
   * Track conversion funnel progression
   */
  const trackFunnelProgression = useCallback((
    service: ServiceType,
    stage: 'information_view' | 'pricing_view' | 'inquiry_form' | 'conversion'
  ) => {
    if (!enableFunnelTracking || !userSession) return;

    trackConversionStage(service, stage, userSession.sessionId);

    if (debugMode) {
      console.log(`Funnel progression: ${service} -> ${stage}`);
    }
  }, [enableFunnelTracking, userSession, trackConversionStage, debugMode]);

  /**
   * Track service inquiry
   */
  const trackServiceInquiry = useCallback((service: ServiceType, inquiryData?: Record<string, unknown>) => {
    if (!userSession) return;

    // Track funnel progression
    if (enableFunnelTracking) {
      trackConversionStage(service, 'inquiry_form', userSession.sessionId);
    }

    // Update conversion likelihood
    setUserSession(prev => prev ? {
      ...prev,
      conversionLikelihood: Math.min(prev.conversionLikelihood + 40, 100)
    } : prev);

    if (debugMode) {
      console.log(`Service inquiry tracked: ${service}`, inquiryData);
    }
  }, [userSession, enableFunnelTracking, trackConversionStage, debugMode]);

  /**
   * Track conversion
   */
  const trackConversion = useCallback((
    service: ServiceType,
    conversionValue: number = 0,
    conversionData?: Record<string, unknown>
  ) => {
    if (!userSession) return;

    // Track funnel conversion
    if (enableFunnelTracking) {
      trackConversionStage(service, 'conversion', userSession.sessionId);
    }

    // Track upselling conversion if applicable
    if (userSession.currentService && userSession.currentService !== service) {
      trackUpsellingConversion(userSession.currentService, service, conversionValue);
    }

    // Update user session
    setUserSession(prev => prev ? {
      ...prev,
      conversionLikelihood: 100
    } : prev);

    if (debugMode) {
      console.log(`Conversion tracked: ${service}`, { conversionValue, conversionData });
    }
  }, [
    userSession,
    enableFunnelTracking,
    trackConversionStage,
    trackUpsellingConversion,
    debugMode
  ]);

  /**
   * Get A/B test variant
   */
  const getTestVariant = useCallback((testId: string): string | null => {
    if (!enableABTesting || !userSession) return null;

    const variant = getABTestVariant(testId, userSession.sessionId);

    if (debugMode && variant) {
      console.log(`A/B test variant: ${testId} -> ${variant}`);
    }

    return variant;
  }, [enableABTesting, userSession, getABTestVariant, debugMode]);

  /**
   * Get real-time recommendations
   */
  const getRealtimeRecommendations = useCallback((): string[] => {
    if (!enableRealTimeOptimization || !userSession || !currentPageTracking) return [];

    const recommendations: string[] = [];

    // Low engagement recommendations
    if (userSession.engagementLevel === 'low' && currentPageTracking.timeOnSection > 30) {
      recommendations.push('Consider showing engaging content or interactive elements');
    }

    // High bounce risk
    if (currentPageTracking.scrollDepth < 25 && currentPageTracking.timeOnSection > 10) {
      recommendations.push('User might leave soon - consider showing value proposition');
    }

    // High conversion likelihood
    if (userSession.conversionLikelihood > 70 && currentPageTracking.service) {
      recommendations.push(`User shows high intent for ${currentPageTracking.service} - prioritize conversion elements`);
    }

    // Cross-service opportunity
    if (userSession.engagementLevel === 'high' && currentPageTracking.interactions > 5) {
      recommendations.push('Good opportunity for cross-service suggestions');
    }

    return recommendations;
  }, [enableRealTimeOptimization, userSession, currentPageTracking]);

  /**
   * Get performance insights
   */
  const getPerformanceInsights = useCallback(() => {
    if (!enableRealTimeOptimization) return null;

    try {
      const dashboard = getPerformanceDashboard();
      const optimizations = getOptimizationRecommendations();

      return {
        dashboard,
        optimizations,
        userSession,
        currentPageTracking,
        recommendations: getRealtimeRecommendations()
      };
    } catch (error) {
      if (debugMode) {
        console.error('Failed to get performance insights:', error);
      }
      return null;
    }
  }, [
    enableRealTimeOptimization,
    getPerformanceDashboard,
    getOptimizationRecommendations,
    userSession,
    currentPageTracking,
    getRealtimeRecommendations,
    debugMode
  ]);

  /**
   * Track cross-service suggestion interaction
   */
  const trackSuggestionInteraction = useCallback((
    action: 'view' | 'click' | 'dismiss',
    suggestionId: string,
    fromService: ServiceType,
    toService: ServiceType
  ) => {
    if (!userSession || !currentPageTracking) return;

    const context = {
      pageSection: currentPageTracking.section,
      placement: 'inline' as const,
      timing: 'after-engagement' as const,
      timeOnPage: Date.now() - userSession.startTime,
      scrollPercentage: currentPageTracking.scrollDepth,
      userEngagement: userSession.engagementLevel === 'high' ? 100 : 
                     userSession.engagementLevel === 'medium' ? 60 : 30
    };

    switch (action) {
      case 'view':
        trackSuggestionView(suggestionId, context);
        break;
      case 'click':
        trackSuggestionClick(suggestionId, toService, context);
        trackFunnelProgression(toService, 'information_view');
        break;
      case 'dismiss':
        // Track dismissal (handled by existing system)
        break;
    }

    if (debugMode) {
      console.log(`Suggestion ${action}: ${fromService} -> ${toService}`);
    }
  }, [
    userSession,
    currentPageTracking,
    trackSuggestionView,
    trackSuggestionClick,
    trackFunnelProgression,
    debugMode
  ]);

  /**
   * Helper functions
   */
  const getOrCreateSessionId = (): string => {
    let sessionId = sessionStorage.getItem('rrish_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('rrish_session_id', sessionId);
    }
    return sessionId;
  };

  const calculateEngagementScore = (pageTracking: PageTracking): number => {
    let score = 0;
    
    // Time spent (max 40 points)
    score += Math.min(pageTracking.timeOnSection / 60, 40);
    
    // Interactions (max 30 points)
    score += Math.min(pageTracking.interactions * 5, 30);
    
    // Scroll depth (max 30 points)
    score += Math.min(pageTracking.scrollDepth * 0.3, 30);
    
    return score;
  };

  const calculateConversionLikelihood = (engagementScore: number, pageTracking: PageTracking): number => {
    let likelihood = engagementScore * 0.5;
    
    // Boost for specific sections
    if (pageTracking.section === 'pricing_view') likelihood += 20;
    if (pageTracking.section === 'inquiry_form') likelihood += 30;
    
    // Boost for high interaction
    if (pageTracking.interactions > 10) likelihood += 15;
    
    return Math.min(likelihood, 100);
  };

  return {
    // Session data
    userSession,
    currentPageTracking,
    isInitialized,

    // Tracking methods
    trackPageView,
    trackEngagement,
    trackFunnelProgression,
    trackServiceInquiry,
    trackConversion,
    trackSuggestionInteraction,

    // Optimization methods
    getTestVariant,
    getRealtimeRecommendations,
    getPerformanceInsights,

    // Analytics state
    engagementLevel: userSession?.engagementLevel || 'low',
    conversionLikelihood: userSession?.conversionLikelihood || 0,
    recommendations: getRealtimeRecommendations()
  };
}