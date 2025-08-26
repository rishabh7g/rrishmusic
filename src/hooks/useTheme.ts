/**
 * Theme Hook
 * 
 * Custom hook that provides convenient access to theme state and controls.
 * Wraps the ThemeContext with additional derived values and utility functions.
 */

import { useMemo } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import { getThemeModeLabel } from '../utils/themeHelpers';
import type { ThemeMode, ThemeConfig } from '../styles/themes';

/**
 * Enhanced theme hook return type
 */
export interface UseThemeReturn {
  /** Current theme mode (light, dark, or system) */
  mode: ThemeMode;
  
  /** Currently active theme (light or dark) */
  activeTheme: 'light' | 'dark';
  
  /** System's preferred theme */
  systemTheme: 'light' | 'dark';
  
  /** Whether user prefers reduced motion */
  reducedMotion: boolean;
  
  /** Whether the current theme is dark */
  isDark: boolean;
  
  /** Whether the current theme is light */
  isLight: boolean;
  
  /** Whether using system theme mode */
  isSystemMode: boolean;
  
  /** Whether theme system has been initialized */
  isInitialized: boolean;
  
  /** Human-readable label for current theme mode */
  modeLabel: string;
  
  /** Complete theme configuration object */
  themeConfig: ThemeConfig;
  
  /** Set theme mode */
  setTheme: (mode: ThemeMode) => void;
  
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  
  /** Cycle through all theme modes (light → dark → system) */
  cycleTheme: () => void;
  
  /** Force a theme transition (useful for testing) */
  forceTransition: () => void;
  
  /** Check if transitions are enabled (respects reduced motion) */
  transitionsEnabled: boolean;
  
  /** Get the opposite theme */
  oppositeTheme: 'light' | 'dark';
}

/**
 * Custom theme hook with enhanced functionality
 * 
 * Provides comprehensive theme state management and utility functions
 * including motion preference detection and transition controls.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { 
 *     isDark, 
 *     cycleTheme, 
 *     transitionsEnabled, 
 *     reducedMotion 
 *   } = useTheme();
 *   
 *   return (
 *     <div className={`${isDark ? 'dark-theme' : 'light-theme'} ${
 *       transitionsEnabled ? 'theme-transition' : ''
 *     }`}>
 *       <button onClick={cycleTheme}>
 *         Toggle Theme
 *       </button>
 *       {reducedMotion && <p>Reduced motion detected</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const context = useThemeContext();

  // Memoize derived values for performance
  const derivedValues = useMemo(() => {
    const isDark = context.activeTheme === 'dark';
    const isLight = context.activeTheme === 'light';
    const isSystemMode = context.mode === 'system';
    const modeLabel = getThemeModeLabel(context.mode);
    const transitionsEnabled = context.isInitialized && !context.reducedMotion;
    const oppositeTheme = isDark ? 'light' : 'dark';

    return {
      isDark,
      isLight,
      isSystemMode,
      modeLabel,
      transitionsEnabled,
      oppositeTheme,
    };
  }, [
    context.activeTheme, 
    context.mode, 
    context.isInitialized, 
    context.reducedMotion
  ]);

  return {
    // Core context values
    mode: context.mode,
    activeTheme: context.activeTheme,
    systemTheme: context.systemTheme,
    reducedMotion: context.reducedMotion,
    isInitialized: context.isInitialized,
    themeConfig: context.themeConfig,
    
    // Theme controls
    setTheme: context.setTheme,
    toggleTheme: context.toggleTheme,
    cycleTheme: context.cycleTheme,
    forceTransition: context.forceTransition,
    
    // Derived values
    ...derivedValues,
  } as const;
}

/**
 * Hook for theme-aware CSS classes
 * 
 * Returns commonly used CSS class combinations based on current theme state.
 * Useful for conditional styling without repeating theme logic.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const classes = useThemeClasses();
 *   
 *   return (
 *     <div className={classes.background}>
 *       <h1 className={classes.text}>Title</h1>
 *       <button className={classes.button}>Action</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useThemeClasses() {
  const { isDark, transitionsEnabled } = useTheme();

  return useMemo(() => {
    const transition = transitionsEnabled ? 'theme-transition' : '';
    const transitionFast = transitionsEnabled ? 'theme-transition-fast' : '';

    return {
      // Background classes
      background: `bg-theme-bg ${transition}`,
      backgroundSecondary: `bg-theme-bg-secondary ${transition}`,
      backgroundTertiary: `bg-theme-bg-tertiary ${transition}`,
      
      // Text classes
      text: `text-theme-text ${transition}`,
      textSecondary: `text-theme-text-secondary ${transition}`,
      textMuted: `text-theme-text-muted ${transition}`,
      
      // Border classes
      border: `border-theme-border ${transition}`,
      borderHover: `hover:border-theme-border-hover ${transitionFast}`,
      
      // Button classes
      button: `bg-theme-primary text-white hover:bg-theme-primary-hover ${transitionFast}`,
      buttonSecondary: `bg-theme-bg-secondary text-theme-text border border-theme-border hover:bg-theme-bg-tertiary ${transitionFast}`,
      
      // Card classes
      card: `bg-theme-bg-secondary border border-theme-border shadow-theme ${transition}`,
      
      // Utility classes
      transition,
      transitionFast,
      transitionColors: transitionsEnabled ? 'theme-transition-colors' : '',
      transitionShadows: transitionsEnabled ? 'theme-transition-shadows' : '',
      
      // Theme mode indicators
      themeMode: isDark ? 'theme-dark' : 'theme-light',
    };
  }, [isDark, transitionsEnabled]);
}

/**
 * Hook for theme-aware animations
 * 
 * Provides animation configurations that respect user's motion preferences.
 * 
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const animations = useThemeAnimations();
 *   
 *   return (
 *     <motion.div
 *       variants={animations.fadeIn}
 *       initial="hidden"
 *       animate="visible"
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useThemeAnimations() {
  const { reducedMotion, transitionsEnabled } = useTheme();

  return useMemo(() => {
    if (reducedMotion || !transitionsEnabled) {
      // Return minimal animations for reduced motion
      return {
        fadeIn: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } }
        },
        slideIn: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0 } }
        },
        scale: {
          hover: { scale: 1 },
          tap: { scale: 1 }
        }
      };
    }

    // Full animations for users who don't prefer reduced motion
    return {
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1, 
          transition: { 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] 
          } 
        }
      },
      slideIn: {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1] 
          } 
        }
      },
      scale: {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } }
      }
    };
  }, [reducedMotion, transitionsEnabled]);
}

export default useTheme;