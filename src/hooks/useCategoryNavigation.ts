import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  CategoryItem, 
  CategoryScrollState,
  useCategoryScrollSpy, 
  useCategorySmoothScroll 
} from './useScrollSpy';

interface CategoryNavigationOptions {
  /**
   * Default category to show on load
   */
  defaultCategory?: string;
  
  /**
   * Scroll offset for navigation
   */
  scrollOffset?: number;
  
  /**
   * Enable URL hash updates
   */
  updateURL?: boolean;
  
  /**
   * Enable scroll position persistence
   */
  persistScrollPosition?: boolean;
}

interface CategoryNavigationState {
  /**
   * Currently active category
   */
  activeCategory: string;
  
  /**
   * Is navigation currently animating
   */
  isNavigating: boolean;
  
  /**
   * Available categories
   */
  categories: CategoryItem[];
  
  /**
   * Current scroll state
   */
  scrollState: CategoryScrollState;
  
  /**
   * Navigation history for back/forward
   */
  navigationHistory: string[];
}

interface CategoryNavigationActions {
  /**
   * Navigate to a specific category
   */
  navigateToCategory: (categoryId: string) => void;
  
  /**
   * Navigate to next category
   */
  navigateNext: () => void;
  
  /**
   * Navigate to previous category
   */
  navigatePrevious: () => void;
  
  /**
   * Go back in navigation history
   */
  goBack: () => void;
  
  /**
   * Reset navigation to default state
   */
  reset: () => void;
  
  /**
   * Set categories dynamically
   */
  setCategories: (categories: CategoryItem[]) => void;
}

/**
 * Comprehensive category navigation hook
 * Manages category switching, scroll state, and navigation history
 */
export const useCategoryNavigation = (
  initialCategories: CategoryItem[],
  options: CategoryNavigationOptions = {}
): CategoryNavigationState & CategoryNavigationActions => {
  const {
    defaultCategory,
    scrollOffset = 80,
    updateURL = true,
    persistScrollPosition = true
  } = options;

  // Internal state
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  
  // Determine initial category
  const initialCategory = useMemo(() => {
    // Try URL hash first
    const hash = window.location.hash.replace('#', '');
    if (hash && categories.some(cat => cat.id === hash)) {
      return hash;
    }
    
    // Use default category if provided
    if (defaultCategory && categories.some(cat => cat.id === defaultCategory)) {
      return defaultCategory;
    }
    
    // Fallback to first category
    return categories[0]?.id || '';
  }, [categories, defaultCategory]);

  // Scroll spy and smooth scrolling
  const scrollState = useCategoryScrollSpy(categories, { offset: scrollOffset });
  const { scrollToCategory, scrollToPreviousPosition } = useCategorySmoothScroll(categories);
  
  // Scroll position storage for persistence
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  // Update URL hash when category changes
  useEffect(() => {
    if (updateURL && scrollState.activeCategory) {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== scrollState.activeCategory) {
        window.history.replaceState(null, '', `#${scrollState.activeCategory}`);
      }
    }
  }, [scrollState.activeCategory, updateURL]);

  // Store scroll positions for each category
  useEffect(() => {
    if (persistScrollPosition && scrollState.previousCategory && scrollState.scrollPosition > 0) {
      setScrollPositions(prev => ({
        ...prev,
        [scrollState.previousCategory!]: scrollState.scrollPosition
      }));
    }
  }, [scrollState.previousCategory, scrollState.scrollPosition, persistScrollPosition]);

  // Navigation actions
  const navigateToCategory = useCallback((categoryId: string) => {
    const targetCategory = categories.find(cat => cat.id === categoryId);
    if (!targetCategory || isNavigating) return;

    setIsNavigating(true);
    
    // Add to navigation history
    if (scrollState.activeCategory !== categoryId) {
      setNavigationHistory(prev => [...prev, scrollState.activeCategory].slice(-10)); // Keep last 10
    }

    // Restore scroll position if available
    const savedPosition = persistScrollPosition ? scrollPositions[categoryId] : null;
    
    if (savedPosition && savedPosition > 0) {
      scrollToPreviousPosition(savedPosition);
    } else {
      scrollToCategory(categoryId, scrollOffset);
    }

    // Reset navigation state after animation
    setTimeout(() => {
      setIsNavigating(false);
    }, 600); // Match typical scroll animation duration
  }, [
    categories, 
    isNavigating, 
    scrollState.activeCategory, 
    scrollToCategory, 
    scrollToPreviousPosition,
    scrollPositions,
    persistScrollPosition,
    scrollOffset
  ]);

  const navigateNext = useCallback(() => {
    const currentIndex = categories.findIndex(cat => cat.id === scrollState.activeCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    navigateToCategory(categories[nextIndex].id);
  }, [categories, scrollState.activeCategory, navigateToCategory]);

  const navigatePrevious = useCallback(() => {
    const currentIndex = categories.findIndex(cat => cat.id === scrollState.activeCategory);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    navigateToCategory(categories[prevIndex].id);
  }, [categories, scrollState.activeCategory, navigateToCategory]);

  const goBack = useCallback(() => {
    if (navigationHistory.length === 0) return;
    
    const previousCategory = navigationHistory[navigationHistory.length - 1];
    setNavigationHistory(prev => prev.slice(0, -1));
    navigateToCategory(previousCategory);
  }, [navigationHistory, navigateToCategory]);

  const reset = useCallback(() => {
    setNavigationHistory([]);
    setScrollPositions({});
    if (initialCategory) {
      navigateToCategory(initialCategory);
    }
  }, [initialCategory, navigateToCategory]);

  const setCategoriesAction = useCallback((newCategories: CategoryItem[]) => {
    setCategories(newCategories);
    setScrollPositions({}); // Clear stored positions when categories change
    setNavigationHistory([]);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isNavigating) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (event.altKey) {
            event.preventDefault();
            navigatePrevious();
          }
          break;
        case 'ArrowRight':
          if (event.altKey) {
            event.preventDefault();
            navigateNext();
          }
          break;
        case 'Escape':
          event.preventDefault();
          reset();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isNavigating, navigateNext, navigatePrevious, reset]);

  return {
    // State
    activeCategory: scrollState.activeCategory,
    isNavigating,
    categories,
    scrollState,
    navigationHistory,
    
    // Actions
    navigateToCategory,
    navigateNext,
    navigatePrevious,
    goBack,
    reset,
    setCategories: setCategoriesAction
  };
};

/**
 * Hook for category navigation breadcrumbs
 */
export const useCategoryBreadcrumbs = (
  categories: CategoryItem[],
  activeCategory: string,
  navigationHistory: string[]
) => {
  return useMemo(() => {
    const breadcrumbs = [];
    
    // Add navigation history as breadcrumb trail
    for (const categoryId of navigationHistory.slice(-3)) { // Show last 3
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        breadcrumbs.push({
          id: category.id,
          label: category.label,
          isActive: false,
          isClickable: true
        });
      }
    }
    
    // Add current category
    const current = categories.find(cat => cat.id === activeCategory);
    if (current) {
      breadcrumbs.push({
        id: current.id,
        label: current.label,
        isActive: true,
        isClickable: false
      });
    }
    
    return breadcrumbs;
  }, [categories, activeCategory, navigationHistory]);
};

export default useCategoryNavigation;