/**
 * Teaching Pricing Hook
 * State management and utilities for teaching service pricing
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LessonPackage,
  PricingCalculation,
  PricingOptions,
  getAllPackagesWithPricing,
  calculatePackagePricing,
  comparePackages,
  getRecommendedPackage
} from '@/utils/pricingCalculator';

export interface TeachingPricingState {
  packages: LessonPackage[];
  selectedPackage: LessonPackage | null;
  selectedPackageId: string | null;
  pricing: PricingCalculation | null;
  comparison: Array<{
    package: LessonPackage;
    pricing: PricingCalculation;
    valueScore: number;
  }>;
  recommendedPackageId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseTeachingPricingOptions {
  initialPackageId?: string;
  pricingOptions?: PricingOptions;
  userProfile?: {
    experience?: 'beginner' | 'intermediate' | 'advanced';
    commitment?: 'low' | 'medium' | 'high';
    budget?: 'low' | 'medium' | 'high';
  };
  enableComparison?: boolean;
  comparisonPackages?: string[];
}

export interface UseTeachingPricingReturn {
  state: TeachingPricingState;
  actions: {
    selectPackage: (packageId: string) => void;
    clearSelection: () => void;
    updatePricingOptions: (options: Partial<PricingOptions>) => void;
    refreshPricing: () => void;
    getPackageById: (id: string) => LessonPackage | null;
    calculateCustomPackage: (sessions: number) => PricingCalculation;
  };
  computed: {
    hasDiscount: boolean;
    savingsAmount: number;
    pricePerLesson: number;
    isRecommended: boolean;
    comparisonEnabled: boolean;
  };
}

/**
 * Hook for managing teaching pricing state and calculations
 */
export function useTeachingPricing(
  options: UseTeachingPricingOptions = {}
): UseTeachingPricingReturn {
  const {
    initialPackageId,
    pricingOptions = {},
    userProfile,
    enableComparison = true,
    comparisonPackages = ['foundation', 'transformation']
  } = options;

  // Core pricing state
  const [state, setState] = useState<TeachingPricingState>({
    packages: [],
    selectedPackage: null,
    selectedPackageId: initialPackageId || null,
    pricing: null,
    comparison: [],
    recommendedPackageId: null,
    isLoading: true,
    error: null
  });

  // Current pricing options
  const [currentPricingOptions, setCurrentPricingOptions] = useState<PricingOptions>(pricingOptions);

  /**
   * Select package by ID
   */
  const selectPackageById = useCallback((
    packageId: string,
    availablePackages?: LessonPackage[]
  ) => {
    const packages = availablePackages || state.packages;
    const selectedPackage = packages.find(pkg => pkg.id === packageId) || null;
    
    if (selectedPackage) {
      const pricing = calculatePackagePricing(selectedPackage.sessions, currentPricingOptions);
      
      setState(prev => ({
        ...prev,
        selectedPackage,
        selectedPackageId: packageId,
        pricing
      }));
    }
  }, [state.packages, currentPricingOptions]);

  /**
   * Load all packages with pricing
   */
  const loadPackages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate async data loading (could be from API)
      const packages = getAllPackagesWithPricing(currentPricingOptions);
      
      // Get recommended package
      let recommendedPackageId = null;
      if (userProfile) {
        recommendedPackageId = getRecommendedPackage(
          userProfile.experience || 'beginner',
          userProfile.commitment || 'medium',
          userProfile.budget || 'medium'
        );
      }

      // Generate comparison if enabled
      let comparison: TeachingPricingState['comparison'] = [];
      if (enableComparison) {
        comparison = comparePackages(comparisonPackages, currentPricingOptions);
      }

      setState(prev => ({
        ...prev,
        packages,
        recommendedPackageId,
        comparison,
        isLoading: false
      }));

      // Select initial package if specified
      if (initialPackageId) {
        selectPackageById(initialPackageId, packages);
      } else if (recommendedPackageId) {
        selectPackageById(recommendedPackageId, packages);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load pricing',
        isLoading: false
      }));
    }
  }, [currentPricingOptions, userProfile, enableComparison, comparisonPackages, initialPackageId, selectPackageById]);

  /**
   * Public action: Select package
   */
  const selectPackage = useCallback((packageId: string) => {
    selectPackageById(packageId);
  }, [selectPackageById]);

  /**
   * Public action: Clear selection
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedPackage: null,
      selectedPackageId: null,
      pricing: null
    }));
  }, []);

  /**
   * Public action: Update pricing options
   */
  const updatePricingOptions = useCallback((newOptions: Partial<PricingOptions>) => {
    setCurrentPricingOptions(prev => ({
      ...prev,
      ...newOptions
    }));
  }, []);

  /**
   * Public action: Refresh pricing data
   */
  const refreshPricing = useCallback(() => {
    loadPackages();
  }, [loadPackages]);

  /**
   * Public action: Get package by ID
   */
  const getPackageById = useCallback((id: string): LessonPackage | null => {
    return state.packages.find(pkg => pkg.id === id) || null;
  }, [state.packages]);

  /**
   * Public action: Calculate custom package pricing
   */
  const calculateCustomPackage = useCallback((sessions: number): PricingCalculation => {
    return calculatePackagePricing(sessions, currentPricingOptions);
  }, [currentPricingOptions]);

  // Computed values
  const computed = useMemo(() => ({
    hasDiscount: Boolean(state.pricing?.discountApplied),
    savingsAmount: state.pricing?.savings || 0,
    pricePerLesson: state.pricing?.pricePerLesson || 0,
    isRecommended: state.selectedPackageId === state.recommendedPackageId,
    comparisonEnabled: enableComparison && state.comparison.length > 0
  }), [
    state.pricing,
    state.selectedPackageId,
    state.recommendedPackageId,
    enableComparison,
    state.comparison
  ]);

  // Load packages on mount or when options change
  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  // Update selected package pricing when options change
  useEffect(() => {
    if (state.selectedPackageId && state.selectedPackage) {
      const updatedPricing = calculatePackagePricing(
        state.selectedPackage.sessions,
        currentPricingOptions
      );
      
      setState(prev => ({
        ...prev,
        pricing: updatedPricing
      }));
    }
  }, [currentPricingOptions, state.selectedPackageId, state.selectedPackage]);

  return {
    state,
    actions: {
      selectPackage,
      clearSelection,
      updatePricingOptions,
      refreshPricing,
      getPackageById,
      calculateCustomPackage
    },
    computed
  };
}

/**
 * Hook for simple package selection without full state management
 */
export function useSimplePackageSelection(
  packages: LessonPackage[],
  initialPackageId?: string
) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || packages[0]?.id || ''
  );

  const selectedPackage = useMemo(() => 
    packages.find(pkg => pkg.id === selectedPackageId) || null,
    [packages, selectedPackageId]
  );

  const selectNext = useCallback(() => {
    const currentIndex = packages.findIndex(pkg => pkg.id === selectedPackageId);
    const nextIndex = (currentIndex + 1) % packages.length;
    setSelectedPackageId(packages[nextIndex].id);
  }, [packages, selectedPackageId]);

  const selectPrevious = useCallback(() => {
    const currentIndex = packages.findIndex(pkg => pkg.id === selectedPackageId);
    const prevIndex = currentIndex === 0 ? packages.length - 1 : currentIndex - 1;
    setSelectedPackageId(packages[prevIndex].id);
  }, [packages, selectedPackageId]);

  return {
    selectedPackageId,
    selectedPackage,
    setSelectedPackageId,
    selectNext,
    selectPrevious
  };
}

export default useTeachingPricing;