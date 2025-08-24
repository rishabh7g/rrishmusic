import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ServiceType } from '@/types/content';
import {
  NavigationContext,
  ServiceTransition,
  UserContext,
  ServiceInteraction,
  BreadcrumbItem
} from '@/types/serviceRelationships';

/**
 * Service Transitions Hook
 * Manages context-aware navigation between services with state preservation
 */

interface UseServiceTransitionsConfig {
  enableAnalytics?: boolean;
  preserveScrollPosition?: boolean;
  enableBreadcrumbs?: boolean;
  maxBreadcrumbs?: number;
}

interface ServiceTransitionState {
  currentService: ServiceType | null;
  previousService: ServiceType | null;
  navigationContext: NavigationContext | null;
  breadcrumbs: BreadcrumbItem[];
  userContext: UserContext;
  isTransitioning: boolean;
}

export const useServiceTransitions = (config: UseServiceTransitionsConfig = {}) => {
  const {
    enableAnalytics = true,
    preserveScrollPosition = true,
    enableBreadcrumbs = true,
    maxBreadcrumbs = 5
  } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const sessionStartTime = useRef(Date.now());
  
  // State management
  const [state, setState] = useState<ServiceTransitionState>({
    currentService: null,
    previousService: null,
    navigationContext: null,
    breadcrumbs: [],
    userContext: {
      currentService: 'teaching', // default
      visitedServices: [],
      timeSpentOnService: {},
      interactions: [],
      preferences: {
        primaryInterest: 'teaching',
        goals: []
      }
    },
    isTransitioning: false
  });

  // Service detection from current route
  const detectServiceFromPath = useCallback((pathname: string): ServiceType | null => {
    if (pathname.includes('/teaching')) return 'teaching';
    if (pathname.includes('/performance')) return 'performance';
    if (pathname.includes('/collaboration')) return 'collaboration';
    return null;
  }, []);

  // Initialize service from current location
  useEffect(() => {
    const currentService = detectServiceFromPath(location.pathname);
    if (currentService && currentService !== state.currentService) {
      setState(prevState => ({
        ...prevState,
        currentService,
        userContext: {
          ...prevState.userContext,
          currentService,
          visitedServices: [...new Set([...prevState.userContext.visitedServices, currentService])]
        }
      }));
    }
  }, [location.pathname, detectServiceFromPath, state.currentService]);

  // Track time spent on service
  useEffect(() => {
    if (!state.currentService) return;

    const startTime = Date.now();
    const service = state.currentService;

    return () => {
      const timeSpent = Date.now() - startTime;
      setState(prevState => ({
        ...prevState,
        userContext: {
          ...prevState.userContext,
          timeSpentOnService: {
            ...prevState.userContext.timeSpentOnService,
            [service]: (prevState.userContext.timeSpentOnService[service] || 0) + timeSpent
          }
        }
      }));
    };
  }, [state.currentService]);

  /**
   * Navigate to a different service with context preservation
   */
  const transitionToService = useCallback((
    targetService: ServiceType,
    options: {
      preserveContext?: boolean;
      userIntent?: string;
      method?: 'direct_link' | 'navigation' | 'recommendation' | 'search';
      metadata?: Record<string, unknown>;
    } = {}
  ) => {
    const {
      preserveContext = true,
      userIntent = 'user_navigation',
      method = 'navigation',
      metadata = {}
    } = options;

    setState(prevState => ({ ...prevState, isTransitioning: true }));

    // Create navigation context
    const navigationContext: NavigationContext = {
      previousService: state.currentService,
      breadcrumbs: [...state.breadcrumbs],
      preservedState: preserveContext ? {
        scrollPosition: preserveScrollPosition ? window.scrollY : 0,
        timestamp: Date.now(),
        userIntent
      } : {},
      returnUrl: location.pathname,
      userIntent
    };

    // Update breadcrumbs
    let newBreadcrumbs = [...state.breadcrumbs];
    if (enableBreadcrumbs && state.currentService) {
      const breadcrumb: BreadcrumbItem = {
        service: state.currentService,
        title: getServiceDisplayName(state.currentService),
        url: location.pathname,
        timestamp: Date.now()
      };

      newBreadcrumbs = [breadcrumb, ...newBreadcrumbs.slice(0, maxBreadcrumbs - 1)];
    }

    // Track transition
    if (enableAnalytics && state.currentService) {
      const transition: ServiceTransition = {
        from: state.currentService,
        to: targetService,
        timestamp: Date.now(),
        method,
        success: true,
        metadata
      };

      trackServiceTransition(transition);
    }

    // Update state before navigation
    setState(prevState => ({
      ...prevState,
      previousService: prevState.currentService,
      currentService: targetService,
      navigationContext,
      breadcrumbs: newBreadcrumbs,
      userContext: {
        ...prevState.userContext,
        currentService: targetService,
        visitedServices: [...new Set([...prevState.userContext.visitedServices, targetService])]
      }
    }));

    // Navigate to target service
    const targetPath = getServicePath(targetService);
    navigate(targetPath, {
      state: { navigationContext, preserveContext }
    });

    // Reset transition state after a brief delay
    setTimeout(() => {
      setState(prevState => ({ ...prevState, isTransitioning: false }));
    }, 100);
  }, [state, location.pathname, navigate, enableAnalytics, enableBreadcrumbs, maxBreadcrumbs, preserveScrollPosition]);

  /**
   * Navigate back to previous service
   */
  const goBack = useCallback(() => {
    if (state.navigationContext?.returnUrl) {
      navigate(state.navigationContext.returnUrl);
    } else if (state.previousService) {
      transitionToService(state.previousService, {
        method: 'navigation',
        userIntent: 'back_navigation'
      });
    } else {
      navigate('/');
    }
  }, [state.navigationContext, state.previousService, navigate, transitionToService]);

  /**
   * Clear breadcrumbs and reset navigation history
   */
  const resetNavigation = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      breadcrumbs: [],
      navigationContext: null,
      previousService: null
    }));
  }, []);

  /**
   * Track service interaction
   */
  const trackInteraction = useCallback((
    interactionType: ServiceInteraction['interactionType'],
    metadata: Record<string, unknown> = {}
  ) => {
    if (!state.currentService) return;

    const interaction: ServiceInteraction = {
      serviceType: state.currentService,
      interactionType,
      timestamp: Date.now(),
      metadata
    };

    setState(prevState => ({
      ...prevState,
      userContext: {
        ...prevState.userContext,
        interactions: [...prevState.userContext.interactions, interaction]
      }
    }));
  }, [state.currentService]);

  /**
   * Get service navigation suggestions based on current context
   */
  const getNavigationSuggestions = useCallback(() => {
    // This would integrate with the recommendation engine
    // For now, return simple suggestions based on current service
    if (!state.currentService) return [];

    const suggestions = {
      teaching: [
        { service: 'performance' as ServiceType, reason: 'Apply your skills on stage' },
        { service: 'collaboration' as ServiceType, reason: 'Learn with other musicians' }
      ],
      performance: [
        { service: 'teaching' as ServiceType, reason: 'Improve your skills' },
        { service: 'collaboration' as ServiceType, reason: 'Create unique performances' }
      ],
      collaboration: [
        { service: 'teaching' as ServiceType, reason: 'Enhance your contribution' },
        { service: 'performance' as ServiceType, reason: 'Showcase your collaborations' }
      ]
    };

    return suggestions[state.currentService] || [];
  }, [state.currentService]);

  return {
    // Current state
    currentService: state.currentService,
    previousService: state.previousService,
    breadcrumbs: state.breadcrumbs,
    userContext: state.userContext,
    navigationContext: state.navigationContext,
    isTransitioning: state.isTransitioning,

    // Navigation methods
    transitionToService,
    goBack,
    resetNavigation,

    // Analytics methods
    trackInteraction,
    getNavigationSuggestions,

    // Computed properties
    canGoBack: !!(state.navigationContext?.returnUrl || state.previousService),
    sessionDuration: Date.now() - sessionStartTime.current,
    visitedServicesCount: state.userContext.visitedServices.length,
    totalInteractions: state.userContext.interactions.length
  };
};

/**
 * Utility functions
 */
function getServiceDisplayName(service: ServiceType): string {
  const names = {
    teaching: 'Guitar Lessons',
    performance: 'Live Performances',
    collaboration: 'Music Collaboration'
  };
  return names[service];
}

function getServicePath(service: ServiceType): string {
  return `/${service}`;
}

function trackServiceTransition(transition: ServiceTransition): void {
  // In a real implementation, this would send data to analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('[Service Transition]', transition);
  }
}

/**
 * Higher-order hook for service-specific components
 */
export const useServiceContext = (serviceType: ServiceType) => {
  const transitions = useServiceTransitions();
  
  useEffect(() => {
    // Auto-track view interaction when component mounts
    transitions.trackInteraction('view');
  }, [transitions, serviceType]);

  return {
    ...transitions,
    isCurrentService: transitions.currentService === serviceType,
    suggestionsForThisService: transitions.getNavigationSuggestions()
  };
};

export default useServiceTransitions;