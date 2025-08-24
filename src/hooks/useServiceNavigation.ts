/**
 * Service Navigation Hook
 * 
 * Manages interactive navigation between services with smooth transitions,
 * keyboard support, and accessibility features
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ServiceType } from '@/types/content';
import { 
  scrollToService, 
  debounceScroll,
  isElementInViewport 
} from '@/utils/smoothScroll';

export interface NavigationState {
  activeService: ServiceType | null;
  isNavigating: boolean;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  navigationHistory: ServiceType[];
}

export interface NavigationActions {
  navigateToService: (service: ServiceType) => Promise<void>;
  navigateNext: () => Promise<void>;
  navigatePrevious: () => Promise<void>;
  setActiveService: (service: ServiceType | null) => void;
  resetNavigation: () => void;
}

const SERVICES_ORDER: ServiceType[] = ['performance', 'teaching', 'collaboration'];

/**
 * Service Navigation Hook
 */
export const useServiceNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    activeService: null,
    isNavigating: false,
    canNavigateNext: true,
    canNavigatePrevious: true,
    navigationHistory: []
  });

  const scrollPositionsRef = useRef<{ position: number; timestamp: number }[]>([]);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Update navigation state
   */
  const updateNavigationState = useCallback((updates: Partial<NavigationState>) => {
    setNavigationState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Check which services can be navigated to
   */
  const updateNavigationCapabilities = useCallback(() => {
    const currentIndex = navigationState.activeService 
      ? SERVICES_ORDER.indexOf(navigationState.activeService) 
      : -1;

    updateNavigationState({
      canNavigateNext: currentIndex < SERVICES_ORDER.length - 1,
      canNavigatePrevious: currentIndex > 0
    });
  }, [navigationState.activeService, updateNavigationState]);

  /**
   * Navigate to specific service
   */
  const navigateToService = useCallback(async (service: ServiceType): Promise<void> => {
    if (navigationState.isNavigating) return;

    updateNavigationState({ 
      isNavigating: true,
      activeService: service,
      navigationHistory: [...navigationState.navigationHistory, service]
    });

    try {
      await scrollToService(service, { duration: 800, easing: 'ease-in-out' });
      
      // Focus the service element for accessibility
      const element = document.getElementById(`service-${service}`);
      if (element) {
        element.focus({ preventScroll: true });
      }
    } catch (error) {
      console.error(`Failed to navigate to ${service}:`, error);
    } finally {
      // Clear navigation state after animation
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      navigationTimeoutRef.current = setTimeout(() => {
        updateNavigationState({ isNavigating: false });
      }, 100);
    }
  }, [navigationState.isNavigating, navigationState.navigationHistory, updateNavigationState]);

  /**
   * Navigate to next service
   */
  const navigateNext = useCallback(async (): Promise<void> => {
    if (!navigationState.canNavigateNext || !navigationState.activeService) return;

    const currentIndex = SERVICES_ORDER.indexOf(navigationState.activeService);
    const nextService = SERVICES_ORDER[currentIndex + 1];
    
    if (nextService) {
      await navigateToService(nextService);
    }
  }, [navigationState.canNavigateNext, navigationState.activeService, navigateToService]);

  /**
   * Navigate to previous service
   */
  const navigatePrevious = useCallback(async (): Promise<void> => {
    if (!navigationState.canNavigatePrevious || !navigationState.activeService) return;

    const currentIndex = SERVICES_ORDER.indexOf(navigationState.activeService);
    const previousService = SERVICES_ORDER[currentIndex - 1];
    
    if (previousService) {
      await navigateToService(previousService);
    }
  }, [navigationState.canNavigatePrevious, navigationState.activeService, navigateToService]);

  /**
   * Set active service without navigation
   */
  const setActiveService = useCallback((service: ServiceType | null) => {
    updateNavigationState({ activeService: service });
  }, [updateNavigationState]);

  /**
   * Reset navigation state
   */
  const resetNavigation = useCallback(() => {
    setNavigationState({
      activeService: null,
      isNavigating: false,
      canNavigateNext: true,
      canNavigatePrevious: true,
      navigationHistory: []
    });
  }, []);

  /**
   * Handle scroll detection for active service
   */
  const handleScroll = useCallback(() => {
    if (navigationState.isNavigating) return;

    // Determine which service is currently in viewport
    for (const service of SERVICES_ORDER) {
      const element = document.getElementById(`service-${service}`);
      if (element && isElementInViewport(element)) {
        if (navigationState.activeService !== service) {
          setActiveService(service);
        }
        break;
      }
    }

    // Track scroll positions for velocity calculation
    scrollPositionsRef.current.push({
      position: window.pageYOffset,
      timestamp: Date.now()
    });

    // Keep only recent positions (last 5)
    if (scrollPositionsRef.current.length > 5) {
      scrollPositionsRef.current = scrollPositionsRef.current.slice(-5);
    }
  }, [navigationState.isNavigating, navigationState.activeService, setActiveService]);

  /**
   * Debounced scroll handler
   */
  const debouncedHandleScroll = useCallback(
    debounceScroll(handleScroll, 50),
    [handleScroll]
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (navigationState.isNavigating) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'j':
        event.preventDefault();
        navigateNext();
        break;
      case 'ArrowUp':
      case 'k':
        event.preventDefault();
        navigatePrevious();
        break;
      case '1':
        event.preventDefault();
        navigateToService('performance');
        break;
      case '2':
        event.preventDefault();
        navigateToService('teaching');
        break;
      case '3':
        event.preventDefault();
        navigateToService('collaboration');
        break;
      case 'Home':
        event.preventDefault();
        navigateToService('performance');
        break;
      case 'End':
        event.preventDefault();
        navigateToService('collaboration');
        break;
    }
  }, [navigationState.isNavigating, navigateNext, navigatePrevious, navigateToService]);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    document.addEventListener('keydown', handleKeyNavigation);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      document.removeEventListener('keydown', handleKeyNavigation);
      
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [debouncedHandleScroll, handleKeyNavigation]);

  /**
   * Update navigation capabilities when active service changes
   */
  useEffect(() => {
    updateNavigationCapabilities();
  }, [updateNavigationCapabilities]);

  /**
   * Initialize with first service on mount
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigationState.activeService) {
        setActiveService('performance');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [navigationState.activeService, setActiveService]);

  const actions: NavigationActions = {
    navigateToService,
    navigateNext,
    navigatePrevious,
    setActiveService,
    resetNavigation
  };

  return {
    ...navigationState,
    ...actions,
    servicesOrder: SERVICES_ORDER
  };
};