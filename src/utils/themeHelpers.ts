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
} from '../styles/themes';

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
    return 'light'; // Fallback for older browsers
  }

  // Use matchMedia to detect system preference
  const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);
  return mediaQuery.matches ? 'dark' : 'light';
};

/**
 * Saves theme mode to localStorage
 */
export const saveThemeToStorage = (mode: ThemeMode): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  } catch (error) {
    // Silently fail if localStorage is not available (e.g., private browsing)
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Loads theme mode from localStorage
 */
export const loadThemeFromStorage = (): ThemeMode => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        return savedTheme as ThemeMode;
      }
    }
  } catch (error) {
    // Silently fail if localStorage is not available
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
 * Creates a system theme change listener
 */
export const createSystemThemeListener = (
  callback: (theme: ActiveTheme) => void
): (() => void) => {
  // Return no-op if not in browser environment
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY);
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  // Add listener
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }

  // Return cleanup function
  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.removeListener(handleChange);
    }
  };
};

/**
 * Applies theme colors to CSS custom properties
 */
export const applyThemeToDocument = (activeTheme: ActiveTheme): void => {
  if (typeof document === 'undefined') {
    return; // Skip if not in browser environment
  }

  const colors = activeTheme === 'dark' ? darkThemeColors : lightThemeColors;
  const customProperties = createCSSCustomProperties(colors);

  // Apply custom properties to document root
  const root = document.documentElement;
  Object.entries(customProperties).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Update theme class on document element for CSS targeting
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(`theme-${activeTheme}`);

  // Update data attribute for additional CSS targeting
  root.setAttribute('data-theme', activeTheme);
};

/**
 * Prevents flash of unstyled content (FOUC) by applying theme immediately
 * This should be called as early as possible in the application lifecycle
 */
export const preventFOUC = (): void => {
  if (typeof document === 'undefined') {
    return; // Skip if not in browser environment
  }

  try {
    // Load saved theme mode
    const savedMode = loadThemeFromStorage();
    
    // Resolve active theme
    const activeTheme = resolveActiveTheme(savedMode);
    
    // Apply theme immediately
    applyThemeToDocument(activeTheme);
    
    // Add a class to indicate theme has been applied
    document.documentElement.classList.add('theme-loaded');
  } catch (error) {
    console.warn('Failed to prevent FOUC:', error);
    // Apply light theme as fallback
    applyThemeToDocument('light');
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
 * Validates if a string is a valid theme mode
 */
export const isValidThemeMode = (mode: unknown): mode is ThemeMode => {
  return typeof mode === 'string' && ['light', 'dark', 'system'].includes(mode);
};

/**
 * Gets a human-readable label for theme mode
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
      return 'Unknown';
  }
};

/**
 * Gets an emoji icon for theme mode
 */
export const getThemeModeIcon = (mode: ThemeMode): string => {
  switch (mode) {
    case 'light':
      return '☀️';
    case 'dark':
      return '🌙';
    case 'system':
      return '🖥️';
    default:
      return '❓';
  }
};