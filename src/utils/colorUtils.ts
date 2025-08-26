/**
 * Color Utility Functions
 * 
 * Provides utilities for working with theme colors, contrast calculations,
 * and WCAG AA compliance checking for the RrishMusic theme system.
 */

import { ThemeColors } from '../styles/themes';

/**
 * Converts hex color to RGB values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculates the relative luminance of a color
 * Used for contrast ratio calculations
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  
  // Convert to sRGB
  const toLinear = (value: number): number => {
    const normalized = value / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Calculates the contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Checks if a color combination meets WCAG AA standard (4.5:1)
 */
export const meetsWCAGAA = (foreground: string, background: string): boolean => {
  return getContrastRatio(foreground, background) >= 4.5;
};

/**
 * Checks if a color combination meets WCAG AAA standard (7:1)
 */
export const meetsWCAGAAA = (foreground: string, background: string): boolean => {
  return getContrastRatio(foreground, background) >= 7;
};

/**
 * Validates all theme color combinations for WCAG AA compliance
 */
export const validateThemeContrast = (colors: ThemeColors): {
  isValid: boolean;
  violations: string[];
  warnings: string[];
} => {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Primary text on backgrounds
  const textOnBgCombos = [
    { name: 'Primary text on main background', fg: colors.text, bg: colors.background },
    { name: 'Primary text on secondary background', fg: colors.text, bg: colors.backgroundSecondary },
    { name: 'Secondary text on main background', fg: colors.textSecondary, bg: colors.background },
    { name: 'Muted text on main background', fg: colors.textMuted, bg: colors.background },
  ];

  // Interactive element combinations
  const interactiveCombos = [
    { name: 'Primary button', fg: '#FFFFFF', bg: colors.primary },
    { name: 'Secondary button', fg: colors.text, bg: colors.secondary },
    { name: 'Success state', fg: '#FFFFFF', bg: colors.success },
    { name: 'Warning state', fg: '#000000', bg: colors.warning },
    { name: 'Error state', fg: '#FFFFFF', bg: colors.error },
  ];

  // Check all combinations
  [...textOnBgCombos, ...interactiveCombos].forEach(({ name, fg, bg }) => {
    const ratio = getContrastRatio(fg, bg);
    
    if (ratio < 4.5) {
      violations.push(`${name}: ${ratio.toFixed(2)}:1 (below WCAG AA 4.5:1)`);
    } else if (ratio < 7) {
      warnings.push(`${name}: ${ratio.toFixed(2)}:1 (meets AA but below AAA 7:1)`);
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
    warnings,
  };
};

/**
 * Generates accessible color variants by adjusting lightness
 */
export const generateAccessibleVariant = (
  baseColor: string, 
  targetBackground: string,
  targetRatio: number = 4.5
): string => {
  const baseRgb = hexToRgb(baseColor);
  const bgLuminance = getLuminance(targetBackground);
  
  if (!baseRgb) return baseColor;

  // Convert RGB to HSL for easier manipulation
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff) % 6; break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    return [h, Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL back to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360; s /= 100; l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
  };

  const [h, s, l] = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
  
  // Adjust lightness to achieve target contrast ratio
  let adjustedL = l;
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const [r, g, b] = hslToRgb(h, s, adjustedL);
    const testColor = rgbToHex(r, g, b);
    const ratio = getContrastRatio(testColor, targetBackground);
    
    if (ratio >= targetRatio) {
      return testColor;
    }
    
    // Adjust lightness based on whether background is light or dark
    if (bgLuminance > 0.5) {
      // Light background, make color darker
      adjustedL = Math.max(0, adjustedL - 5);
    } else {
      // Dark background, make color lighter
      adjustedL = Math.min(100, adjustedL + 5);
    }
    
    attempts++;
  }
  
  return baseColor; // Fallback to original if no solution found
};

/**
 * Common theme-aware class combinations for consistent styling
 */
export const themeClasses = {
  // Cards and containers
  card: 'bg-theme-bg-secondary border border-theme-border shadow-theme theme-transition duration-theme-normal',
  cardHover: 'hover:bg-theme-bg-tertiary hover:border-theme-border-hover hover:shadow-theme-md',
  
  // Buttons
  buttonPrimary: 'bg-theme-primary text-white hover:bg-theme-primary-hover active:bg-theme-primary-active theme-transition duration-theme-fast',
  buttonSecondary: 'bg-theme-secondary text-theme-text hover:bg-theme-secondary-hover active:bg-theme-secondary-active theme-transition duration-theme-fast',
  buttonOutline: 'border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white theme-transition duration-theme-fast',
  
  // Text styles
  textPrimary: 'text-theme-text theme-transition duration-theme-normal',
  textSecondary: 'text-theme-text-secondary theme-transition duration-theme-normal',
  textMuted: 'text-theme-text-muted theme-transition duration-theme-normal',
  
  // Status colors
  textSuccess: 'text-theme-success',
  textWarning: 'text-theme-warning',
  textError: 'text-theme-error',
  textInfo: 'text-theme-info',
  
  // Backgrounds
  bgPrimary: 'bg-theme-bg theme-transition duration-theme-normal',
  bgSecondary: 'bg-theme-bg-secondary theme-transition duration-theme-normal',
  bgTertiary: 'bg-theme-bg-tertiary theme-transition duration-theme-normal',
  
  // Borders
  border: 'border-theme-border theme-transition duration-theme-normal',
  borderHover: 'hover:border-theme-border-hover theme-transition duration-theme-fast',
  divider: 'border-theme-divider',
  
  // Common combinations
  page: 'bg-theme-bg text-theme-text theme-transition duration-theme-normal',
  section: 'bg-theme-bg theme-transition duration-theme-normal',
  modal: 'bg-theme-bg border border-theme-border shadow-theme-xl theme-transition duration-theme-normal',
} as const;

/**
 * Gets appropriate text color for a given background color
 */
export const getTextColorForBackground = (backgroundColor: string): 'light' | 'dark' => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? 'dark' : 'light';
};

/**
 * Validates if a color string is a valid hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};