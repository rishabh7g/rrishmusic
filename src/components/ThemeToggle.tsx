/**
 * Theme Toggle Component
 * 
 * Radio switch toggle between light and dark themes with sun/moon icons
 * Replaces three-state cycling with simple binary toggle
 * Respects user's motion preferences and provides enhanced animations
 */

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import type { ThemeMode } from '../styles/themes';

/**
 * Theme Toggle Props
 */
interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Show labels alongside icons */
  showLabel?: boolean;
  
  /** Custom button styling */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /** Disable the toggle */
  disabled?: boolean;
  
  /** Custom aria-label */
  'aria-label'?: string;
}

/**
 * Icon Components for each theme state
 */
const ThemeIcons = {
  light: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  dark: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
} as const;

/**
 * Get size classes for button and icon
 */
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        button: 'h-8 w-8 text-sm',
        icon: 'w-4 h-4',
        text: 'text-xs',
      };
    case 'lg':
      return {
        button: 'h-12 w-12 text-lg',
        icon: 'w-6 h-6',
        text: 'text-base',
      };
    default: // 'md'
      return {
        button: 'h-10 w-10 text-base',
        icon: 'w-5 h-5',
        text: 'text-sm',
      };
  }
};

/**
 * Get variant classes for styling with theme-aware transitions
 */
const getVariantClasses = (variant: 'primary' | 'secondary' | 'ghost', isDark: boolean, transitionsEnabled: boolean) => {
  const transitionClass = transitionsEnabled ? 'transition-theme-colors duration-theme-fast' : '';
  
  switch (variant) {
    case 'primary':
      return `${transitionClass} ${
        isDark 
          ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500' 
          : 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-400'
      }`;
    case 'secondary':
      return `${transitionClass} ${
        isDark
          ? 'bg-theme-bg-secondary hover:bg-theme-bg-tertiary text-theme-text border border-theme-border'
          : 'bg-theme-bg-secondary hover:bg-theme-bg-tertiary text-theme-text border border-theme-border'
      }`;
    default: // 'ghost'
      return `${transitionClass} ${
        isDark
          ? 'hover:bg-theme-bg-secondary text-theme-text-secondary border border-transparent hover:border-theme-border'
          : 'hover:bg-theme-bg-secondary text-theme-text-secondary border border-transparent hover:border-theme-border'
      }`;
  }
};

/**
 * Theme Toggle Component
 * 
 * Accessible button that cycles through theme modes with smooth animations.
 * Integrates with the enhanced theme system and respects motion preferences.
 * 
 * @example
 * ```tsx
 * <ThemeToggle size="md" showLabel={true} variant="ghost" />
 * ```
 */
export default function ThemeToggle({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'ghost',
  disabled = false,
  'aria-label': customAriaLabel,
}: ThemeToggleProps) {
  const {
    mode,
    isDark,
    isInitialized,
    modeLabel,
    cycleTheme,
    transitionsEnabled,
    reducedMotion,
  } = useTheme();

  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant, isDark, transitionsEnabled);

  /**
   * Handle theme toggle between light and dark only
   */
  const handleToggle = useCallback(() => {
    if (!disabled && isInitialized) {
      // Binary toggle - only light and dark, no system
      if (mode === 'light' || mode === 'system') {
        cycleTheme(); // This will set to dark
      } else {
        // Force set to light mode
        const themeSystem = (window as any).__themeSystem;
        if (themeSystem && themeSystem.setMode) {
          themeSystem.setMode('light');
        }
      }
    }
  }, [disabled, isInitialized, mode, cycleTheme]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  // Binary switch - only light/dark
  const currentTheme = mode === 'system' ? (isDark ? 'dark' : 'light') : mode;
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  const ariaLabel = customAriaLabel || `Switch to ${nextTheme} mode. Current: ${currentTheme} mode`;

  // Show loading state before theme system initializes
  if (!isInitialized) {
    return (
      <div 
        className={`
          inline-flex items-center justify-center rounded-md 
          ${sizeClasses.button}
          ${variantClasses}
          opacity-50 cursor-not-allowed
          ${className}
        `}
        aria-label="Loading theme preferences"
      >
        <div className={`${sizeClasses.icon} animate-pulse`}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
    );
  }

  // Icon transition animations (respects motion preferences)
  const iconAnimations = reducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0 }
  } : {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 180, scale: 0.5 },
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 0.2, 1] // Custom easing for smooth feel
    }
  };

  // Button animations (respects motion preferences)
  const buttonAnimations = reducedMotion ? {
    whileTap: undefined,
    whileHover: undefined,
    transition: { duration: 0 }
  } : {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.02 },
    transition: { duration: 0.1 }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Radio Switch Toggle */}
      <motion.button
        type="button"
        className={`
          relative inline-flex items-center rounded-full p-1 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${size === 'sm' ? 'h-6 w-11' : size === 'lg' ? 'h-8 w-14' : 'h-7 w-12'}
          ${currentTheme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        {...buttonAnimations}
      >
        {/* Sun Icon (Light Mode) */}
        <motion.div
          className={`
            absolute left-1 flex items-center justify-center rounded-full
            ${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}
            ${currentTheme === 'light' ? 'text-yellow-500' : 'text-gray-400'}
          `}
          animate={reducedMotion ? {} : {
            opacity: currentTheme === 'light' ? 1 : 0.6,
            scale: currentTheme === 'light' ? 1 : 0.8,
          }}
        >
          {ThemeIcons.light}
        </motion.div>

        {/* Toggle Slider */}
        <motion.div
          className={`
            relative flex items-center justify-center rounded-full bg-white shadow-md
            ${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}
          `}
          animate={reducedMotion ? {} : {
            x: currentTheme === 'dark' ? (size === 'sm' ? 20 : size === 'lg' ? 24 : 22) : 0,
          }}
          transition={reducedMotion ? {} : {
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Current Theme Icon */}
          <div className={`
            ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}
            ${currentTheme === 'dark' ? 'text-blue-600' : 'text-yellow-500'}
          `}>
            {currentTheme === 'dark' ? ThemeIcons.dark : ThemeIcons.light}
          </div>
        </motion.div>

        {/* Moon Icon (Dark Mode) */}
        <motion.div
          className={`
            absolute right-1 flex items-center justify-center rounded-full
            ${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'}
            ${currentTheme === 'dark' ? 'text-blue-100' : 'text-gray-400'}
          `}
          animate={reducedMotion ? {} : {
            opacity: currentTheme === 'dark' ? 1 : 0.6,
            scale: currentTheme === 'dark' ? 1 : 0.8,
          }}
        >
          {ThemeIcons.dark}
        </motion.div>
      </motion.button>
      
      {showLabel && (
        <motion.span
          className={`
            ${sizeClasses.text} 
            font-medium select-none 
            text-theme-text
            ${transitionsEnabled ? 'theme-transition-colors' : ''}
          `}
          initial={false}
          animate={reducedMotion ? {} : { 
            opacity: 1
          }}
          transition={reducedMotion ? {} : { duration: 0.2 }}
        >
          {currentTheme === 'light' ? 'Light' : 'Dark'}
        </motion.span>
      )}
    </div>
  );
}

/**
 * Named exports for convenience
 */
export { ThemeToggle };
export type { ThemeToggleProps };