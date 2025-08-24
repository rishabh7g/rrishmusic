import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate, Location } from "react-router-dom";
import { NAVIGATION_ITEMS } from "@/utils/constants";
import { useSmoothScroll, useScrollSpy } from "@/hooks/useScrollSpy";

interface NavigationProps {
  // Optional activeSection override - mainly for testing
  activeSection?: string;
}

/**
 * Navigation item hierarchy types for service-based visual prioritization
 */
type NavigationItemType = 'primary' | 'secondary' | 'tertiary';

/**
 * Determines the navigation item type based on service hierarchy:
 * - Primary: Performances and Collaboration (highest revenue potential)
 * - Secondary: Teaching services (Approach, Lessons)  
 * - Tertiary: Standard navigation (Home, About, Contact)
 */
const getNavigationItemType = (itemId: string): NavigationItemType => {
  if (itemId === 'performances' || itemId === 'collaboration') {
    return 'primary';
  }
  if (itemId === 'approach' || itemId === 'lessons') {
    return 'secondary';
  }
  return 'tertiary';
};

/**
 * Gets styling classes for navigation items based on hierarchy
 */
const getNavigationItemStyles = (
  type: NavigationItemType,
  isActive: boolean,
  isMobile: boolean
) => {
  const baseClasses = "font-heading transition-all duration-200";
  
  if (isMobile) {
    const mobileBase = `${baseClasses} text-left py-2 px-4 rounded-lg block w-full`;
    
    switch (type) {
      case 'primary':
        return `${mobileBase} font-semibold ${
          isActive
            ? "text-brand-blue-primary bg-brand-blue-primary/15 border border-brand-blue-primary/20"
            : "text-neutral-charcoal hover:text-brand-blue-primary hover:bg-brand-blue-primary/10 hover:border hover:border-brand-blue-primary/20"
        }`;
      case 'secondary':
        return `${mobileBase} font-medium ${
          isActive
            ? "text-brand-blue-secondary bg-brand-blue-secondary/10"
            : "text-neutral-charcoal hover:text-brand-blue-secondary hover:bg-brand-blue-secondary/5"
        }`;
      case 'tertiary':
        return `${mobileBase} font-medium ${
          isActive
            ? "text-brand-blue-primary bg-brand-blue-primary/10"
            : "text-neutral-charcoal hover:text-brand-blue-primary hover:bg-gray-50"
        }`;
    }
  }
  
  // Desktop styles with visual hierarchy
  const desktopBase = `${baseClasses} relative`;
  
  switch (type) {
    case 'primary':
      return `${desktopBase} font-bold text-lg ${
        isActive
          ? "text-brand-blue-primary"
          : "text-neutral-charcoal hover:text-brand-blue-primary hover:scale-105"
      }`;
    case 'secondary':
      return `${desktopBase} font-semibold ${
        isActive
          ? "text-brand-blue-secondary"
          : "text-neutral-charcoal hover:text-brand-blue-secondary"
      }`;
    case 'tertiary':
      return `${desktopBase} font-medium ${
        isActive
          ? "text-brand-blue-primary"
          : "text-neutral-charcoal hover:text-brand-blue-primary"
      }`;
  }
};

/**
 * Gets active indicator styles based on item type
 */
const getActiveIndicatorStyles = (type: NavigationItemType, isMobile: boolean) => {
  if (isMobile) {
    const baseClasses = "w-2 h-2 rounded-full";
    switch (type) {
      case 'primary':
        return `${baseClasses} bg-brand-blue-primary`;
      case 'secondary':
        return `${baseClasses} bg-brand-blue-secondary`;
      case 'tertiary':
        return `${baseClasses} bg-brand-blue-primary`;
    }
  }

  // Desktop active indicator
  const baseClasses = "absolute -bottom-1 left-0 right-0 h-0.5 rounded-full";
  switch (type) {
    case 'primary':
      return `${baseClasses} bg-brand-blue-primary`;
    case 'secondary':
      return `${baseClasses} bg-brand-blue-secondary`;
    case 'tertiary':
      return `${baseClasses} bg-brand-blue-primary`;
  }
};

/**
 * Scroll spy configuration to exclude route-based navigation items
 */
const getScrollSpyItems = () => 
  NAVIGATION_ITEMS
    .filter(item => !['performances', 'collaboration'].includes(item.id)) // Exclude route-based items from scroll spy
    .map(item => item.id);

/**
 * Determines if a navigation item is currently active
 */
const getIsItemActive = (item: typeof NAVIGATION_ITEMS[0], location: Location, activeSection: string): boolean => {
  // For performances, check if we're on the /performance route
  if (item.id === 'performances') {
    return location.pathname === '/performance';
  }
  // For collaboration, check if we're on the /collaboration route
  if (item.id === 'collaboration') {
    return location.pathname === '/collaboration';
  }
  
  // For other items, use scroll-based active section on home page
  if (location.pathname === '/') {
    return activeSection === item.id;
  }
  
  return false;
};

/**
 * Gets the navigation target (route or anchor) for an item
 */
const getNavigationTarget = (item: typeof NAVIGATION_ITEMS[0]) => {
  if (item.id === 'performances') {
    return { type: 'route' as const, path: '/performance' };
  }
  if (item.id === 'collaboration') {
    return { type: 'route' as const, path: '/collaboration' };
  }
  return { type: 'scroll' as const, anchor: item.id };
};

/**
 * Memoized navigation item component for better performance with service hierarchy styling
 */
const NavigationItem = React.memo<{
  item: typeof NAVIGATION_ITEMS[0];
  isActive: boolean;
  onClick: (item: typeof NAVIGATION_ITEMS[0]) => void;
  className?: string;
  isMobile?: boolean;
  index?: number;
}>(({ item, isActive, onClick, className, isMobile, index }) => {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [onClick, item]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const itemType = useMemo(() => getNavigationItemType(item.id), [item.id]);
  const baseClassName = useMemo(() => 
    getNavigationItemStyles(itemType, isActive, !!isMobile), 
    [itemType, isActive, isMobile]
  );

  const target = getNavigationTarget(item);
  const content = (
    <>
      {isMobile ? (
        <div className="flex items-center justify-between">
          <span>{item.label}</span>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={getActiveIndicatorStyles(itemType, true)}
            />
          )}
        </div>
      ) : (
        <>
          <span>{item.label}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className={getActiveIndicatorStyles(itemType, false)}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </>
      )}
    </>
  );

  if (target.type === 'route') {
    return (
      <Link
        to={target.path}
        className={`${baseClassName} ${className || ''}`}
        aria-current={isActive ? 'page' : undefined}
        onKeyDown={handleKeyDown}
        style={
          isMobile && typeof index !== 'undefined'
            ? { animationDelay: `${index * 50}ms` }
            : undefined
        }
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${baseClassName} ${className || ''}`}
      aria-current={isActive ? 'page' : undefined}
      style={
        isMobile && typeof index !== 'undefined'
          ? { animationDelay: `${index * 50}ms` }
          : undefined
      }
    >
      {content}
    </button>
  );
});

NavigationItem.displayName = 'NavigationItem';

/**
 * Main Navigation Component
 */
export const Navigation: React.FC<NavigationProps> = ({ activeSection: propActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { smoothScrollTo } = useSmoothScroll();
  
  // Use scroll spy only for items that should be tracked on home page
  const scrollSpyItems = useMemo(() => getScrollSpyItems(), []);
  const detectedActiveSection = useScrollSpy(scrollSpyItems, {
    offset: 100,
    throttle: 50,
    rootMargin: '-10% 0px -85% 0px',
  });
  
  // Use prop override or detected section
  const activeSection = propActiveSection || detectedActiveSection;

  /**
   * Handle navigation clicks with route or scroll behavior
   */
  const handleNavClick = useCallback((item: typeof NAVIGATION_ITEMS[0]) => {
    setIsMenuOpen(false);
    
    const target = getNavigationTarget(item);
    
    if (target.type === 'route') {
      navigate(target.path);
    } else {
      // If we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
        // Small delay to allow navigation to complete before scrolling
        setTimeout(() => {
          smoothScrollTo(target.anchor, 80);
        }, 100);
      } else {
        smoothScrollTo(target.anchor, 80);
      }
    }
  }, [navigate, location.pathname, smoothScrollTo]);

  /**
   * Close mobile menu when clicking outside or on escape
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('main-navigation');
      if (nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  /**
   * Close mobile menu on route changes
   */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Memoize navigation items for performance
  const desktopNavItems = useMemo(() => 
    NAVIGATION_ITEMS.map((item) => (
      <NavigationItem
        key={item.id}
        item={item}
        isActive={getIsItemActive(item, location, activeSection)}
        onClick={handleNavClick}
      />
    )), [location, activeSection, handleNavClick]
  );
  const mobileNavItems = useMemo(() => 
    NAVIGATION_ITEMS.map((item, index) => (
      <NavigationItem
        key={item.id}
        item={item}
        isActive={getIsItemActive(item, location, activeSection)}
        onClick={handleNavClick}
        isMobile
        index={index}
      />
    )), [location, activeSection, handleNavClick]
  );
  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-brand-blue-primary px-4 py-2 rounded-md shadow-lg z-50"
      >
        Skip to main content
      </a>

      <nav
        id="main-navigation"
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200"
              aria-label="Rrish Music - Home"
            >
              <span>Rrish</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {desktopNavItems}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {mobileNavItems}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Navigation spacer to prevent content overlap */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
};

export default Navigation;