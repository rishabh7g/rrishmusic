/**
 * Responsive utility functions for better mobile-first development
 */

/**
 * Get viewport width safely
 */
export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0;
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

/**
 * Get viewport height safely
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

/**
 * Check if current viewport is mobile size
 */
export function isMobile(): boolean {
  return getViewportWidth() < 768; // md breakpoint
}

/**
 * Check if current viewport is tablet size
 */
export function isTablet(): boolean {
  const width = getViewportWidth();
  return width >= 768 && width < 1024; // between md and lg
}

/**
 * Check if current viewport is desktop size
 */
export function isDesktop(): boolean {
  return getViewportWidth() >= 1024; // lg and above
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const width = getViewportWidth();
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Breakpoint values matching Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Check if viewport width matches or exceeds a breakpoint
 */
export function isBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  return getViewportWidth() >= BREAKPOINTS[breakpoint];
}

/**
 * Responsive class helper for conditional styling
 */
export function responsiveClass(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  const classes = [base];
  
  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);
  
  return classes.join(' ');
}