import { useState, useEffect, useCallback } from 'react';

/**
 * Device type enumeration
 */
export enum DeviceType {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
}

/**
 * Screen size breakpoints (matches CSS breakpoints)
 */
export const BREAKPOINTS = {
  xs: 320,   // Small phones
  sm: 640,   // Large phones
  md: 768,   // Tablets
  lg: 1024,  // Small desktops
  xl: 1280,  // Large desktops
  '2xl': 1536, // Extra large desktops
} as const;

/**
 * Device detection result interface
 */
export interface DeviceInfo {
  /** Current device type */
  deviceType: DeviceType;
  /** Screen width in pixels */
  screenWidth: number;
  /** Screen height in pixels */
  screenHeight: number;
  /** Is mobile device */
  isMobile: boolean;
  /** Is tablet device */
  isTablet: boolean;
  /** Is desktop device */
  isDesktop: boolean;
  /** Is touch-enabled device */
  isTouchDevice: boolean;
  /** Is in portrait orientation */
  isPortrait: boolean;
  /** Is in landscape orientation */
  isLandscape: boolean;
  /** Current breakpoint name */
  breakpoint: keyof typeof BREAKPOINTS | 'xs';
  /** Viewport width (same as screenWidth, for consistency) */
  viewportWidth: number;
  /** Viewport height (same as screenHeight, for consistency) */
  viewportHeight: number;
  /** Is small screen (below tablet) */
  isSmallScreen: boolean;
  /** Is medium screen (tablet range) */
  isMediumScreen: boolean;
  /** Is large screen (desktop and above) */
  isLargeScreen: boolean;
  /** Device pixel ratio */
  pixelRatio: number;
  /** User agent string */
  userAgent: string;
  /** Is iOS device */
  isIOS: boolean;
  /** Is Android device */
  isAndroid: boolean;
  /** Has hover capability */
  canHover: boolean;
}

/**
 * Determine device type based on screen width
 */
const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.md) {
    return DeviceType.Mobile;
  } else if (width < BREAKPOINTS.lg) {
    return DeviceType.Tablet;
  } else {
    return DeviceType.Desktop;
  }
};

/**
 * Get current breakpoint name based on width
 */
const getBreakpoint = (width: number): keyof typeof BREAKPOINTS | 'xs' => {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Detect if device has touch capability
 */
const getTouchCapability = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - Legacy browser support
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Detect device user agent information
 */
const getUserAgentInfo = () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      isIOS: false,
      isAndroid: false,
    };
  }

  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  return {
    userAgent,
    isIOS,
    isAndroid,
  };
};

/**
 * Check if device has hover capability
 */
const getHoverCapability = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Use CSS media query to detect hover capability
  return window.matchMedia('(hover: hover)').matches;
};

/**
 * Get initial device information
 */
const getInitialDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    // Server-side rendering defaults
    return {
      deviceType: DeviceType.Desktop,
      screenWidth: 1024,
      screenHeight: 768,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      isPortrait: false,
      isLandscape: true,
      breakpoint: 'lg',
      viewportWidth: 1024,
      viewportHeight: 768,
      isSmallScreen: false,
      isMediumScreen: false,
      isLargeScreen: true,
      pixelRatio: 1,
      userAgent: '',
      isIOS: false,
      isAndroid: false,
      canHover: true,
    };
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const deviceType = getDeviceType(screenWidth);
  const breakpoint = getBreakpoint(screenWidth);
  const isTouchDevice = getTouchCapability();
  const { userAgent, isIOS, isAndroid } = getUserAgentInfo();
  const canHover = getHoverCapability();
  const pixelRatio = window.devicePixelRatio || 1;

  return {
    deviceType,
    screenWidth,
    screenHeight,
    isMobile: deviceType === DeviceType.Mobile,
    isTablet: deviceType === DeviceType.Tablet,
    isDesktop: deviceType === DeviceType.Desktop,
    isTouchDevice,
    isPortrait: screenHeight > screenWidth,
    isLandscape: screenWidth > screenHeight,
    breakpoint,
    viewportWidth: screenWidth,
    viewportHeight: screenHeight,
    isSmallScreen: screenWidth < BREAKPOINTS.md,
    isMediumScreen: screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.lg,
    isLargeScreen: screenWidth >= BREAKPOINTS.lg,
    pixelRatio,
    userAgent,
    isIOS,
    isAndroid,
    canHover,
  };
};

/**
 * Hook for detecting device characteristics and screen size
 * 
 * @param throttleMs - Milliseconds to throttle resize events (default: 100)
 * @returns Device information object
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const device = useDeviceDetection();
 *   
 *   return (
 *     <div>
 *       {device.isMobile && <MobileView />}
 *       {device.isTablet && <TabletView />}
 *       {device.isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useDeviceDetection = (throttleMs: number = 100): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getInitialDeviceInfo);

  /**
   * Update device information
   */
  const updateDeviceInfo = useCallback(() => {
    if (typeof window === 'undefined') return;

    const newDeviceInfo = getInitialDeviceInfo();
    
    // Only update if there's a meaningful change
    setDeviceInfo(prevInfo => {
      const hasChanged = 
        prevInfo.screenWidth !== newDeviceInfo.screenWidth ||
        prevInfo.screenHeight !== newDeviceInfo.screenHeight ||
        prevInfo.deviceType !== newDeviceInfo.deviceType ||
        prevInfo.breakpoint !== newDeviceInfo.breakpoint ||
        prevInfo.isPortrait !== newDeviceInfo.isPortrait;

      return hasChanged ? newDeviceInfo : prevInfo;
    });
  }, []);

  /**
   * Throttled resize handler
   */
  const throttledUpdateDeviceInfo = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDeviceInfo, throttleMs);
    };
  }, [updateDeviceInfo, throttleMs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create throttled handler
    const handleResize = throttledUpdateDeviceInfo();
    const handleOrientationChange = () => {
      // Small delay for orientation change to complete
      setTimeout(updateDeviceInfo, 150);
    };

    // Initial update on mount (for hydration)
    updateDeviceInfo();

    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [throttledUpdateDeviceInfo, updateDeviceInfo]);

  return deviceInfo;
};

/**
 * Hook for simple breakpoint detection
 * 
 * @param breakpoint - Breakpoint to check against
 * @returns Boolean indicating if current screen is at or above the breakpoint
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const isTabletUp = useBreakpoint('md');
 *   const isDesktopUp = useBreakpoint('lg');
 *   
 *   return (
 *     <div>
 *       {isTabletUp ? <TabletView /> : <MobileView />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  const deviceInfo = useDeviceDetection();
  const targetWidth = BREAKPOINTS[breakpoint];
  
  return deviceInfo.screenWidth >= targetWidth;
};

/**
 * Hook for media query matching
 * 
 * @param query - CSS media query string
 * @returns Boolean indicating if the media query matches
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 *   
 *   return (
 *     <div className={prefersDarkMode ? 'dark' : 'light'}>
 *       Content here
 *     </div>
 *   );
 * }
 * ```
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    
    // Use addEventListener for modern browsers, addListener for older ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // @ts-expect-error - Legacy browser support
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // @ts-expect-error - Legacy browser support
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Export device detection utilities
 */
export const deviceUtils = {
  getDeviceType,
  getBreakpoint,
  getTouchCapability,
  getUserAgentInfo,
  getHoverCapability,
  BREAKPOINTS,
} as const;

export default useDeviceDetection;