/**
 * Theme Management Hook
 * 
 * Provides convenient access to theme state and controls with additional
 * utilities for theme-aware component development.
 */

import { useCallback, useMemo } from 'react';
import { useThemeContext, type ThemeContextValue } from '../contexts/ThemeContext';
import { 
  type ThemeMode, 
  type ActiveTheme,
  type ThemeColors,
  lightThemeColors,
  darkThemeColors,
} from '../styles/themes';
import {
  getThemeModeLabel,
  getThemeModeIcon,
  isValidThemeMode,
} from '../utils/themeHelpers';

/**
 * Extended theme hook interface with additional utilities
 */
export interface UseThemeReturn extends ThemeContextValue {
  /** Quick access to current theme colors */
  colors: ThemeColors;
  
  /** Whether the current theme is dark */
  isDark: boolean;
  
  /** Whether the current theme is light */
  isLight: boolean;
  
  /** Whether system theme is being used */
  isSystemMode: boolean;
  
  /** Human-readable label for current theme mode */
  modeLabel: string;
  
  /** Emoji icon for current theme mode */
  modeIcon: string;
  
  /** Set theme with validation */
  setThemeSafe: (mode: unknown) => boolean;
  
  /** Get colors for specific theme */
  getThemeColors: (theme: ActiveTheme) => ThemeColors;
  
  /** Check if theme matches system preference */
  matchesSystem: boolean;
}

/**
 * Theme management hook
 * 
 * Provides comprehensive theme state access and controls with additional
 * utilities for theme-aware development. Extends the base theme context
 * with computed properties and helper methods.
 * 
 * @returns Extended theme interface with state, controls, and utilities
 * 
 * @example
 * ```tsx
 * import { useTheme } from '@/hooks/useTheme';
 * 
 * const MyComponent = () => {
 *   const { 
 *     activeTheme, 
 *     colors, 
 *     isDark, 
 *     toggleTheme,
 *     modeLabel 
 *   } = useTheme();
 * 
 *   return (
 *     <div style={{ backgroundColor: colors.background }}>
 *       <h1 style={{ color: colors.text }}>
 *         Current theme: {modeLabel}
 *       </h1>
 *       <button onClick={toggleTheme}>
 *         Switch to {isDark ? 'light' : 'dark'} theme
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const themeContext = useThemeContext();
  
  const {
    mode,
    activeTheme,
    systemTheme,
    themeConfig,
    isInitialized,
    setTheme,
    toggleTheme,
    cycleTheme,
  } = themeContext;

  // Computed properties
  const colors = useMemo(() => themeConfig.colors, [themeConfig.colors]);
  const isDark = activeTheme === 'dark';
  const isLight = activeTheme === 'light';
  const isSystemMode = mode === 'system';
  const modeLabel = getThemeModeLabel(mode);
  const modeIcon = getThemeModeIcon(mode);
  const matchesSystem = activeTheme === systemTheme;

  // Helper methods
  const setThemeSafe = useCallback((unknownMode: unknown): boolean => {
    if (isValidThemeMode(unknownMode)) {
      setTheme(unknownMode);
      return true;
    }
    console.warn('Invalid theme mode provided:', unknownMode);
    return false;
  }, [setTheme]);

  const getThemeColors = useCallback((theme: ActiveTheme): ThemeColors => {
    return theme === 'dark' ? darkThemeColors : lightThemeColors;
  }, []);

  return {
    // Base context values
    mode,
    activeTheme,
    systemTheme,
    themeConfig,
    isInitialized,
    setTheme,
    toggleTheme,
    cycleTheme,
    
    // Extended properties
    colors,
    isDark,
    isLight,
    isSystemMode,
    modeLabel,
    modeIcon,
    matchesSystem,
    
    // Helper methods
    setThemeSafe,
    getThemeColors,
  };
};

/**
 * Simplified theme hook that only returns essential theme information
 * Useful for components that only need basic theme access
 */
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};

/**
 * Hook for theme mode information only
 * Useful for theme switcher components
 */
export const useThemeMode = () => {
  const { 
    mode, 
    activeTheme, 
    systemTheme, 
    isSystemMode, 
    modeLabel, 
    modeIcon,
    matchesSystem,
    setTheme,
    toggleTheme,
    cycleTheme,
  } = useTheme();

  return {
    mode,
    activeTheme,
    systemTheme,
    isSystemMode,
    modeLabel,
    modeIcon,
    matchesSystem,
    setTheme,
    toggleTheme,
    cycleTheme,
  };
};

/**
 * Hook for theme state information only
 * Useful for conditional rendering based on theme
 */
export const useThemeState = () => {
  const { 
    activeTheme, 
    isDark, 
    isLight, 
    isSystemMode, 
    isInitialized,
    matchesSystem,
  } = useTheme();

  return {
    activeTheme,
    isDark,
    isLight,
    isSystemMode,
    isInitialized,
    matchesSystem,
  };
};

/**
 * Theme detection hook for SSR-safe theme access
 * Returns theme information with SSR-safe defaults
 */
export const useThemeDetection = () => {
  const { 
    mode, 
    activeTheme, 
    systemTheme, 
    isInitialized,
  } = useTheme();

  // Provide SSR-safe defaults before initialization
  return {
    mode: isInitialized ? mode : 'light' as ThemeMode,
    activeTheme: isInitialized ? activeTheme : 'light' as ActiveTheme,
    systemTheme: isInitialized ? systemTheme : 'light' as ActiveTheme,
    isInitialized,
    isSSR: !isInitialized,
  };
};

export default useTheme;