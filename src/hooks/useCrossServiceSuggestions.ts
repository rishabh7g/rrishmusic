/**
 * Cross-Service Suggestions Hook
 * 
 * Custom React hook for managing cross-service suggestions
 * with proper separation from components.
 */

import { useState, useEffect } from 'react';
import { 
  getSuggestionsByPlacement,
  getDismissedSuggestions,
  type ServiceType
} from '@/utils/crossServiceSuggestions';

/**
 * Hook for managing cross-service suggestions
 */
export const useCrossServiceSuggestions = (
  serviceType: ServiceType
) => {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    setDismissedSuggestions(getDismissedSuggestions());
  }, []);

  const getSuggestions = (placement: 'inline' | 'sidebar' | 'banner') => {
    return getSuggestionsByPlacement(serviceType, placement, dismissedSuggestions);
  };

  const dismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  return {
    getSuggestions,
    dismissSuggestion,
    dismissedSuggestions
  };
};