/**
 * Theme Toggle Component
 * 
 * Reusable theme toggle button with accessibility features and smooth transitions
 * Supports three-state cycling: Light → Dark → System → Light
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
 * Get variant classes for styling
 */
const getVariantClasses = (variant: 'primary' | 'secondary' | 'ghost', isDark: boolean) => {
  const baseClasses = 'transition-colors duration-200';
  
  switch (variant) {
    case 'primary':
      return `${baseClasses} ${
        isDark 
          ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500' 
          : 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-400'
      }`;
    case 'secondary':
      return `${baseClasses} ${
        isDark
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
      }`;
    default: // 'ghost'
      return `${baseClasses} ${
        isDark
          ? 'hover:bg-gray-800 text-gray-300 border border-transparent hover:border-gray-600'
          : 'hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'
      }`;
  }
};

/**
 * Theme Toggle Component
 * 
 * Accessible button that cycles through theme modes with smooth animations.
 * Integrates with the theme system via useTheme hook.
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
  } = useTheme();

  const sizeClasses = getSizeClasses(size);
  const variantClasses = getVariantClasses(variant, isDark);

  /**
   * Handle theme toggle with cycling through all modes
   */
  const handleToggle = useCallback(() => {
    if (!disabled && isInitialized) {
      cycleTheme();
    }
  }, [disabled, isInitialized, cycleTheme]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  /**
   * Get the next theme in cycle for accessibility label
   */
  const getNextTheme = (currentMode: ThemeMode): string => {
    switch (currentMode) {
      case 'light':
        return 'Dark';
      case 'dark':
        return 'System';
      case 'system':
        return 'Light';
      default:
        return 'Dark';
    }
  };

  const nextTheme = getNextTheme(mode);
  const ariaLabel = customAriaLabel || `Switch to ${nextTheme} theme. Current: ${modeLabel}`;

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

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <motion.button
        type="button"
        className={`
          inline-flex items-center justify-center rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${sizeClasses.button}
          ${variantClasses}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={ariaLabel}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        whileHover={disabled ? undefined : { scale: 1.05 }}
        transition={{ duration: 0.1 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1] // Custom easing for smooth feel
            }}
            className={`flex items-center justify-center ${sizeClasses.icon}`}
          >
            {ThemeIcons[mode]}
          </motion.div>
        </AnimatePresence>
      </motion.button>
      
      {showLabel && (
        <motion.span
          className={`${sizeClasses.text} font-medium select-none`}
          initial={false}
          animate={{ 
            color: isDark ? '#e5e7eb' : '#374151' 
          }}
          transition={{ duration: 0.2 }}
        >
          {modeLabel}
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