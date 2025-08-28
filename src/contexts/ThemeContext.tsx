/**
 * Theme Context Provider
 *
 * Provides theme state management and system preference detection
 * for the RrishMusic application using React Context API.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { ThemeMode, ActiveTheme, ThemeConfig, themes } from '../styles/themes'
import {
  getSystemTheme,
  saveThemeToStorage,
  loadThemeFromStorage,
  resolveActiveTheme,
  createSystemThemeListener,
  createMotionPreferenceListener,
  applyThemeToDocument,
  toggleTheme as toggleThemeHelper,
  getNextThemeMode,
  getMotionPreference,
} from '../utils/themeHelpers'

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current theme mode (light, dark, or system) */
  mode: ThemeMode

  /** Currently active theme (light or dark) */
  activeTheme: ActiveTheme

  /** System's preferred theme */
  systemTheme: ActiveTheme

  /** Whether user prefers reduced motion */
  reducedMotion: boolean

  /** Complete theme configuration object */
  themeConfig: ThemeConfig

  /** Whether theme system has been initialized */
  isInitialized: boolean

  /** Set theme mode */
  setTheme: (mode: ThemeMode) => void

  /** Toggle between light and dark themes */
  toggleTheme: () => void

  /** Cycle through all theme modes (light → dark → system) */
  cycleTheme: () => void

  /** Force a theme transition (useful for testing) */
  forceTransition: () => void
}

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Theme provider component props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode

  /** Optional default theme mode (defaults to stored or system preference) */
  defaultMode?: ThemeMode

  /** Whether to prevent FOUC by applying theme synchronously */
  preventFOUC?: boolean
}

/**
 * Theme provider component
 *
 * Manages theme state, system preference detection, localStorage persistence,
 * and motion preference detection. Automatically applies theme changes to the
 * document and provides theme context with enhanced transition animations.
 */
export function ThemeProvider({
  children,
  defaultMode,
  preventFOUC = true,
}: ThemeProviderProps) {
  // Initialize theme state
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (defaultMode) return defaultMode
    return loadThemeFromStorage()
  })

  const [systemTheme, setSystemTheme] = useState<ActiveTheme>(() => {
    return getSystemTheme()
  })

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return getMotionPreference()
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate active theme
  const activeTheme = resolveActiveTheme(mode)

  // Get theme configuration
  const themeConfig = themes[activeTheme]

  /**
   * Updates theme mode and persists to localStorage
   */
  const setTheme = (newMode: ThemeMode) => {
    setModeState(newMode)
    saveThemeToStorage(newMode)
  }

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    const newMode = toggleThemeHelper(mode)
    setTheme(newMode)
  }

  /**
   * Cycles through all theme modes
   */
  const cycleTheme = () => {
    const nextMode = getNextThemeMode(mode)
    setTheme(nextMode)
  }

  /**
   * Forces a theme transition (useful for testing or manual triggers)
   */
  const forceTransition = () => {
    applyThemeToDocument(activeTheme, true)
  }

  // Apply theme to document when active theme changes
  useEffect(() => {
    if (isInitialized) {
      applyThemeToDocument(activeTheme, false)
    }
  }, [activeTheme, isInitialized])

  // Set up system theme listener
  useEffect(() => {
    const cleanup = createSystemThemeListener(newSystemTheme => {
      setSystemTheme(newSystemTheme)

      // If in system mode, this will trigger a theme change
      if (mode === 'system') {
        // The activeTheme will automatically update due to resolveActiveTheme
        // No need to manually call setTheme here
      }
    })

    return cleanup
  }, [mode])

  // Set up motion preference listener
  useEffect(() => {
    const cleanup = createMotionPreferenceListener(newReducedMotion => {
      setReducedMotion(newReducedMotion)
    })

    return cleanup
  }, [])

  // Initialize theme system
  useEffect(() => {
    // Apply theme immediately on mount to prevent FOUC
    if (preventFOUC) {
      applyThemeToDocument(activeTheme, false)
    }

    // Mark as initialized after initial theme application
    const initTimer = setTimeout(() => {
      setIsInitialized(true)
    }, 50) // Small delay to ensure styles are applied

    return () => clearTimeout(initTimer)
  }, [preventFOUC, activeTheme])

  // Context value
  const contextValue: ThemeContextValue = {
    mode,
    activeTheme,
    systemTheme,
    reducedMotion,
    themeConfig,
    isInitialized,
    setTheme,
    toggleTheme,
    cycleTheme,
    forceTransition,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Custom hook to access theme context
 *
 * @throws {Error} If used outside of ThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(
      'useThemeContext must be used within a ThemeProvider. ' +
        'Make sure your component is wrapped with <ThemeProvider>.'
    )
  }

  return context
}

export default ThemeContext
