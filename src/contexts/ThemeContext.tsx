/**
 * Theme Context Provider
 * 
 * Provides theme state management and system preference detection
 * for the RrishMusic application using React Context API.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  ThemeMode,
  ActiveTheme,
  ThemeConfig,
  themes,
} from '../styles/themes';
import {
  getSystemTheme,
  saveThemeToStorage,
  loadThemeFromStorage,
  resolveActiveTheme,
  createSystemThemeListener,
  applyThemeToDocument,
  toggleTheme as toggleThemeHelper,
  getNextThemeMode,
} from '../utils/themeHelpers';

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current theme mode (light, dark, or system) */
  mode: ThemeMode;
  
  /** Currently active theme (light or dark) */
  activeTheme: ActiveTheme;
  
  /** System's preferred theme */
  systemTheme: ActiveTheme;
  
  /** Complete theme configuration object */
  themeConfig: ThemeConfig;
  
  /** Whether theme system has been initialized */
  isInitialized: boolean;
  
  /** Set theme mode */
  setTheme: (mode: ThemeMode) => void;
  
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  
  /** Cycle through all theme modes (light → dark → system) */
  cycleTheme: () => void;
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme provider component props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  
  /** Optional default theme mode (defaults to stored or system preference) */
  defaultMode?: ThemeMode;
  
  /** Whether to prevent FOUC by applying theme synchronously */
  preventFOUC?: boolean;
}

/**
 * Theme provider component
 * 
 * Manages theme state, system preference detection, and localStorage persistence.
 * Automatically applies theme changes to the document and provides theme context.
 */
export function ThemeProvider({
  children,
  defaultMode,
  preventFOUC = true,
}: ThemeProviderProps) {
  // Initialize theme state
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (defaultMode) return defaultMode;
    return loadThemeFromStorage();
  });
  
  const [systemTheme, setSystemTheme] = useState<ActiveTheme>(() => {
    return getSystemTheme();
  });
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate active theme
  const activeTheme = resolveActiveTheme(mode);
  
  // Get theme configuration
  const themeConfig = themes[activeTheme];

  /**
   * Updates theme mode and persists to localStorage
   */
  const setTheme = (newMode: ThemeMode) => {
    setModeState(newMode);
    saveThemeToStorage(newMode);
  };

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    const newMode = toggleThemeHelper(mode);
    setTheme(newMode);
  };

  /**
   * Cycles through all theme modes
   */
  const cycleTheme = () => {
    const nextMode = getNextThemeMode(mode);
    setTheme(nextMode);
  };

  // Apply theme to document when active theme changes
  useEffect(() => {
    applyThemeToDocument(activeTheme);
  }, [activeTheme]);

  // Set up system theme listener
  useEffect(() => {
    const cleanup = createSystemThemeListener((newSystemTheme) => {
      setSystemTheme(newSystemTheme);
    });

    // Mark as initialized after setting up listeners
    setIsInitialized(true);

    return cleanup;
  }, []);

  // Apply theme immediately on mount to prevent FOUC
  useEffect(() => {
    if (preventFOUC) {
      applyThemeToDocument(activeTheme);
    }
  }, [preventFOUC, activeTheme]);

  // Context value
  const contextValue: ThemeContextValue = {
    mode,
    activeTheme,
    systemTheme,
    themeConfig,
    isInitialized,
    setTheme,
    toggleTheme,
    cycleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to access theme context
 * 
 * @throws {Error} If used outside of ThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error(
      'useThemeContext must be used within a ThemeProvider. ' +
      'Make sure your component is wrapped with <ThemeProvider>.'
    );
  }
  
  return context;
}

export default ThemeContext;