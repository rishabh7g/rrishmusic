/**
 * Theme Detection and Management Utilities
 * 
 * Provides utilities for system theme detection, localStorage management,
 * and theme application for the RrishMusic theme system.
 */

import { 
  ThemeMode, 
  ActiveTheme, 
  THEME_STORAGE_KEY, 
  DARK_MODE_MEDIA_QUERY,
  DEFAULT_THEME_MODE,
  createCSSCustomProperties,
  lightThemeColors,
  darkThemeColors,
  themeTransitions,
} from '../styles/themes';

/**
 * Theme animation state management
 */
interface ThemeTransitionState {
  isTransitioning: boolean;
  isInitialLoad: boolean;
  reducedMotion: boolean;
}

const transitionState: ThemeTransitionState = {
  isTransitioning: false,
  isInitialLoad: true,
  reducedMotion: false,
};

/**
 * Detects the system's preferred color scheme
 */
export const getSystemTheme = (): ActiveTheme => {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR
  }

  // Check if matchMedia is supported
  if (!window.matchMedia) {
    console.warn('matchMedia not supported, falling back to light theme');
    return 'light';
  }

  try {
    return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system theme preference:', error);
    return 'light';
  }
};

/**
 * Detects user's motion preferences
 */
export const getMotionPreference = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Default to no motion reduction for SSR
  }

  if (!window.matchMedia) {
    return false;
  }

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    console.warn('Failed to detect motion preference:', error);
    return false;
  }
};

/**
 * Creates a system theme change listener
 */
export const createSystemThemeListener = (callback: (theme: ActiveTheme) => void): (() => void) => {
  // Check if running in browser environment
  if (typeof window === 'undefined') {
    return () => {}; // No-op for SSR
  }

  if (!window.matchMedia) {
    console.warn('matchMedia not supported, theme listener disabled');
    return () => {};
  }

  try {
    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);
    
    const handleChange = (event: MediaQueryListEvent) => {
      const newTheme: ActiveTheme = event.matches ? 'dark' : 'light';
      callback(newTheme);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  } catch (error) {
    console.warn('Failed to create system theme listener:', error);
    return () => {};
  }
};

/**
 * Creates a motion preference change listener
 */
export const createMotionPreferenceListener = (callback: (reducedMotion: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (!window.matchMedia) {
    return () => {};
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      const reducedMotion = event.matches;
      transitionState.reducedMotion = reducedMotion;
      callback(reducedMotion);
    };

    // Set initial state
    transitionState.reducedMotion = mediaQuery.matches;

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  } catch (error) {
    console.warn('Failed to create motion preference listener:', error);
    return () => {};
  }
};

/**
 * Creates transition custom properties with enhanced animations
 */
const createTransitionCustomProperties = () => {
  const { duration, easing } = themeTransitions;

  return {
    // Enhanced durations for different use cases
    '--transition-duration-fast': duration.fast,
    '--transition-duration-normal': duration.normal,
    '--transition-duration-slow': duration.slow,
    
    // Enhanced easing curves for smooth transitions
    '--transition-easing-standard': easing.standard,
    '--transition-easing-emphasized': easing.emphasized,
    '--transition-easing-decelerated': easing.decelerated,
    
    // Performance-optimized properties for theme transitions
    '--transition-theme-colors': `
      background-color ${duration.normal} ${easing.standard},
      border-color ${duration.normal} ${easing.standard},
      color ${duration.normal} ${easing.standard}
    `,
    '--transition-theme-shadows': `
      box-shadow ${duration.normal} ${easing.standard},
      filter ${duration.normal} ${easing.standard}
    `,
    '--transition-theme-all': `
      background-color ${duration.normal} ${easing.standard},
      border-color ${duration.normal} ${easing.standard},
      color ${duration.normal} ${easing.standard},
      fill ${duration.normal} ${easing.standard},
      stroke ${duration.normal} ${easing.standard},
      box-shadow ${duration.normal} ${easing.standard}
    `,
  };
};

/**
 * Applies theme colors to CSS custom properties with enhanced transitions
 */
export const applyThemeToDocument = (activeTheme: ActiveTheme, forceTransition = false): void => {
  if (typeof document === 'undefined') {
    return; // Skip if not in browser environment
  }

  const colors = activeTheme === 'dark' ? darkThemeColors : lightThemeColors;
  const colorCustomProperties = createCSSCustomProperties(colors);
  const transitionCustomProperties = createTransitionCustomProperties();

  const root = document.documentElement;
  
  // Determine if transitions should be enabled
  const shouldTransition = !transitionState.isInitialLoad && 
                          !transitionState.reducedMotion && 
                          (forceTransition || !transitionState.isTransitioning);

  // Set transition state
  if (shouldTransition && !transitionState.isInitialLoad) {
    transitionState.isTransitioning = true;
    root.classList.add('theme-transitioning');
  }

  // Batch DOM updates for better performance
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      applyThemeStyles(root, colorCustomProperties, transitionCustomProperties, shouldTransition);
    });
  } else {
    // Fallback for environments without requestAnimationFrame
    applyThemeStyles(root, colorCustomProperties, transitionCustomProperties, shouldTransition);
  }

  // Mark as no longer initial load after first theme application
  if (transitionState.isInitialLoad) {
    setTimeout(() => {
      transitionState.isInitialLoad = false;
      root.classList.remove('theme-no-transition');
      root.classList.add('theme-loaded');
    }, 100); // Allow initial styles to settle
  }
};

/**
 * Apply theme styles to document element
 */
function applyThemeStyles(
  root: HTMLElement, 
  colorCustomProperties: Record<string, string>,
  transitionCustomProperties: Record<string, string>,
  shouldTransition: boolean
) {
  // Apply color custom properties
  Object.entries(colorCustomProperties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Apply transition custom properties
  Object.entries(transitionCustomProperties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Set theme class for CSS-based transitions
  if (root.className) {
    root.className = root.className
      .replace(/\btheme-light\b|\btheme-dark\b/g, '')
      .trim();
  }
  root.classList.add(`theme-${getActiveThemeFromProperties(colorCustomProperties)}`);

  // Enable transitions after initial styles are set
  if (shouldTransition) {
    // Use setTimeout to ensure styles have been applied
    setTimeout(() => {
      root.classList.remove('theme-no-transition');
      
      // Clear transition state after animation completes
      setTimeout(() => {
        transitionState.isTransitioning = false;
        root.classList.remove('theme-transitioning');
      }, parseInt(themeTransitions.duration.normal) + 50);
    }, 16); // Next frame
  } else {
    // Disable transitions for initial load or reduced motion
    root.classList.add('theme-no-transition');
  }
}

/**
 * Determine active theme from CSS properties
 */
function getActiveThemeFromProperties(properties: Record<string, string>): ActiveTheme {
  const primaryColor = properties['--color-primary'];
  return primaryColor === '#3b82f6' ? 'light' : 'dark';
}

/**
 * Saves theme preference to localStorage
 */
export const saveThemeToStorage = (mode: ThemeMode): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Loads theme preference from localStorage
 */
export const loadThemeFromStorage = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    
    // Validate stored value
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }

  return DEFAULT_THEME_MODE;
};

/**
 * Resolves the active theme based on mode and system preference
 */
export const resolveActiveTheme = (mode: ThemeMode): ActiveTheme => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode as ActiveTheme;
};

/**
 * Enhanced FOUC prevention with transition optimization
 */
export const preventFOUC = (): void => {
  if (typeof document === 'undefined') {
    return;
  }
  
  try {
    // Set initial state
    transitionState.isInitialLoad = true;
    transitionState.reducedMotion = getMotionPreference();
    
    // Load saved theme mode
    const savedMode = loadThemeFromStorage();
    
    // Resolve active theme
    const activeTheme = resolveActiveTheme(savedMode);
    
    // Apply theme immediately without transitions
    const root = document.documentElement;
    root.classList.add('theme-no-transition', 'theme-loading');
    
    // Apply theme styles
    applyThemeToDocument(activeTheme, false);
    
    // Remove loading class and enable transitions after initial render
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        root.classList.remove('theme-loading');
        
        // Set up motion preference detection
        createMotionPreferenceListener((reducedMotion) => {
          if (reducedMotion) {
            root.classList.add('theme-no-transition');
          } else {
            root.classList.remove('theme-no-transition');
          }
        });
      });
    } else {
      // Fallback for environments without requestAnimationFrame
      setTimeout(() => {
        root.classList.remove('theme-loading');
      }, 0);
    }
  } catch (error) {
    console.warn('Failed to prevent FOUC:', error);
    // Apply light theme as fallback
    applyThemeToDocument('light', false);
  }
};

/**
 * Toggles between light and dark themes (ignores system)
 */
export const toggleTheme = (currentMode: ThemeMode): ThemeMode => {
  if (currentMode === 'system') {
    // If currently system, toggle to opposite of system preference
    const systemTheme = getSystemTheme();
    return systemTheme === 'dark' ? 'light' : 'dark';
  }
  
  // Toggle between light and dark
  return currentMode === 'light' ? 'dark' : 'light';
};

/**
 * Gets the next theme in the cycle: light → dark → system
 */
export const getNextThemeMode = (currentMode: ThemeMode): ThemeMode => {
  switch (currentMode) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'system';
    case 'system':
      return 'light';
    default:
      return 'light';
  }
};

/**
 * Gets the previous theme in the cycle: system → dark → light
 */
export const getPreviousThemeMode = (currentMode: ThemeMode): ThemeMode => {
  switch (currentMode) {
    case 'light':
      return 'system';
    case 'dark':
      return 'light';
    case 'system':
      return 'dark';
    default:
      return 'light';
  }
};

/**
 * Gets a human-readable label for the theme mode
 */
export const getThemeModeLabel = (mode: ThemeMode): string => {
  switch (mode) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'system':
      return 'System';
    default:
      return 'Light';
  }
};

/**
 * Checks if the current environment supports theme transitions
 */
export const supportsThemeTransitions = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for CSS custom property support
  const supportsCustomProperties = CSS && CSS.supports && CSS.supports('color', 'var(--test)');
  
  // Check for transition support
  const supportsTransitions = CSS && CSS.supports && CSS.supports('transition', 'color 0.3s');
  
  return supportsCustomProperties && supportsTransitions;
};

/**
 * Forces a theme transition (useful for testing or manual triggers)
 */
export const forceThemeTransition = (activeTheme: ActiveTheme): void => {
  applyThemeToDocument(activeTheme, true);
};

/**
 * Gets current transition state (useful for debugging)
 */
export const getTransitionState = (): ThemeTransitionState => {
  return { ...transitionState };
};