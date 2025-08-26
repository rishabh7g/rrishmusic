/**
 * Theme System Constants and Definitions
 * 
 * Provides centralized theme configuration with color definitions,
 * CSS custom properties, and theme-specific styling constants.
 */

/**
 * Theme mode type definition
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme state interface for actual applied theme
 */
export type ActiveTheme = 'light' | 'dark';

/**
 * Complete theme configuration interface
 */
export interface ThemeConfig {
  mode: ThemeMode;
  activeTheme: ActiveTheme;
  colors: ThemeColors;
  transitions: ThemeTransitions;
}

/**
 * Color scheme definitions for both light and dark themes
 */
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Border and divider colors
  border: string;
  borderHover: string;
  divider: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Special colors
  accent: string;
  shadow: string;
  overlay: string;
}

/**
 * Animation and transition definitions
 */
export interface ThemeTransitions {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    standard: string;
    emphasized: string;
    decelerated: string;
  };
}

/**
 * Light theme color definitions
 */
export const lightThemeColors: ThemeColors = {
  // Primary colors
  primary: '#3B82F6', // Blue-500
  primaryHover: '#2563EB', // Blue-600
  primaryActive: '#1D4ED8', // Blue-700
  
  // Secondary colors
  secondary: '#6B7280', // Gray-500
  secondaryHover: '#4B5563', // Gray-600
  secondaryActive: '#374151', // Gray-700
  
  // Background colors
  background: '#FFFFFF', // White
  backgroundSecondary: '#F9FAFB', // Gray-50
  backgroundTertiary: '#F3F4F6', // Gray-100
  
  // Text colors
  text: '#111827', // Gray-900
  textSecondary: '#374151', // Gray-700
  textMuted: '#6B7280', // Gray-500
  
  // Border and divider colors
  border: '#D1D5DB', // Gray-300
  borderHover: '#9CA3AF', // Gray-400
  divider: '#E5E7EB', // Gray-200
  
  // Status colors
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Special colors
  accent: '#8B5CF6', // Violet-500
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Dark theme color definitions
 */
export const darkThemeColors: ThemeColors = {
  // Primary colors
  primary: '#60A5FA', // Blue-400
  primaryHover: '#3B82F6', // Blue-500
  primaryActive: '#2563EB', // Blue-600
  
  // Secondary colors
  secondary: '#9CA3AF', // Gray-400
  secondaryHover: '#D1D5DB', // Gray-300
  secondaryActive: '#F3F4F6', // Gray-100
  
  // Background colors
  background: '#111827', // Gray-900
  backgroundSecondary: '#1F2937', // Gray-800
  backgroundTertiary: '#374151', // Gray-700
  
  // Text colors
  text: '#F9FAFB', // Gray-50
  textSecondary: '#E5E7EB', // Gray-200
  textMuted: '#9CA3AF', // Gray-400
  
  // Border and divider colors
  border: '#4B5563', // Gray-600
  borderHover: '#6B7280', // Gray-500
  divider: '#374151', // Gray-700
  
  // Status colors
  success: '#34D399', // Emerald-400
  warning: '#FBBF24', // Amber-400
  error: '#F87171', // Red-400
  info: '#60A5FA', // Blue-400
  
  // Special colors
  accent: '#A78BFA', // Violet-400
  shadow: 'rgba(0, 0, 0, 0.25)',
  overlay: 'rgba(0, 0, 0, 0.75)',
};

/**
 * Theme transition configurations
 */
export const themeTransitions: ThemeTransitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    emphasized: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    decelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  },
};

/**
 * Complete theme configurations
 */
export const themes = {
  light: {
    mode: 'light' as ThemeMode,
    activeTheme: 'light' as ActiveTheme,
    colors: lightThemeColors,
    transitions: themeTransitions,
  },
  dark: {
    mode: 'dark' as ThemeMode,
    activeTheme: 'dark' as ActiveTheme,
    colors: darkThemeColors,
    transitions: themeTransitions,
  },
};

/**
 * CSS custom property mappings for theme colors
 */
export const createCSSCustomProperties = (colors: ThemeColors): Record<string, string> => {
  return {
    '--color-primary': colors.primary,
    '--color-primary-hover': colors.primaryHover,
    '--color-primary-active': colors.primaryActive,
    '--color-secondary': colors.secondary,
    '--color-secondary-hover': colors.secondaryHover,
    '--color-secondary-active': colors.secondaryActive,
    '--color-background': colors.background,
    '--color-background-secondary': colors.backgroundSecondary,
    '--color-background-tertiary': colors.backgroundTertiary,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-border': colors.border,
    '--color-border-hover': colors.borderHover,
    '--color-divider': colors.divider,
    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-error': colors.error,
    '--color-info': colors.info,
    '--color-accent': colors.accent,
    '--color-shadow': colors.shadow,
    '--color-overlay': colors.overlay,
  };
};

/**
 * Default theme mode for initial load
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system';

/**
 * Local storage key for theme persistence
 */
export const THEME_STORAGE_KEY = 'rrishmusic-theme-mode';

/**
 * Media query for system dark mode detection
 */
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)';