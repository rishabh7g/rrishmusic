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
 * - Primary: Performances (highest revenue potential)
 * - Secondary: Teaching services (Approach, Lessons)  
 * - Tertiary: Standard navigation (Home, About, Contact)
 */
const getNavigationItemType = (itemId: string): NavigationItemType => {
  if (itemId === 'performances') {
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
  
  // Desktop active indicators
  const baseClasses = "absolute -bottom-1 left-0 right-0";
  switch (type) {
    case 'primary':
      return `${baseClasses} h-1 bg-brand-blue-primary`;
    case 'secondary':
      return `${baseClasses} h-0.5 bg-brand-blue-secondary`;
    case 'tertiary':
      return `${baseClasses} h-0.5 bg-brand-blue-primary`;
  }
};

/**
 * Memoized hamburger icon component to prevent unnecessary re-renders
 */
const HamburgerIcon = React.memo<{ isOpen: boolean }>(({ isOpen }) => (
  <svg
    className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {isOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
));
HamburgerIcon.displayName = 'HamburgerIcon';

/**
 * Determines if a navigation item is active based on current route and section
 */
const getIsItemActive = (item: typeof NAVIGATION_ITEMS[0], location: Location, activeSection: string): boolean => {
  // For performances, check if we're on the /performance route
  if (item.id === 'performances') {
    return location.pathname === '/performance';
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

  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;
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
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <>
          {item.label}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className={getActiveIndicatorStyles(itemType, false)}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (index || 0) * 0.1 }}
      >
        {target.type === 'route' ? (
          <Link
            to={target.path}
            onClick={() => onClick(item)}
            className={combinedClassName}
            role="menuitem"
            aria-label={`Navigate to ${item.label} page`}
          >
            {content}
          </Link>
        ) : (
          <button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={combinedClassName}
            role="menuitem"
            aria-label={`Navigate to ${item.label} section`}
          >
            {content}
          </button>
        )}
      </motion.div>
    );
  }

  return target.type === 'route' ? (
    <Link
      to={target.path}
      className={combinedClassName}
      aria-label={`Navigate to ${item.label} page`}
    >
      {content}
    </Link>
  ) : (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={combinedClassName}
      aria-label={`Navigate to ${item.label} section`}
    >
      {content}
    </button>
  );
});
NavigationItem.displayName = 'NavigationItem';

/**
 * Memoized logo component
 */
const Logo = React.memo(() => (
  <Link to="/">
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="font-heading font-bold text-xl text-brand-blue-primary cursor-pointer"
      aria-label="RrishMusic home"
    >
      RrishMusic
    </motion.div>
  </Link>
));
Logo.displayName = 'Logo';

export const Navigation: React.FC<NavigationProps> = ({ activeSection: overrideActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const smoothScrollTo = useSmoothScroll();

  // Memoize section IDs to prevent unnecessary recalculations
  const sectionIds = useMemo(() => 
    NAVIGATION_ITEMS
      .filter(item => item.id !== 'performances') // Exclude performances from scroll spy
      .map(item => item.id), 
    []
  );

  // Use scroll spy only on the home page, otherwise use empty string
  const scrollSpyActiveSection = useScrollSpy(
    location.pathname === '/' ? sectionIds : [], 
    {
      offset: 100,
      throttle: 50,
      rootMargin: '-10% 0px -85% 0px',
    }
  );

  // Use override if provided (mainly for testing), otherwise use scroll spy result
  const activeSection = overrideActiveSection || scrollSpyActiveSection;

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu handlers
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        isMobileMenuOpen &&
        !target.closest('.mobile-menu') && 
        !target.closest('.mobile-menu-button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = useCallback((item: typeof NAVIGATION_ITEMS[0]) => {
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
    
    setIsMobileMenuOpen(false);
  }, [navigate, location.pathname, smoothScrollTo]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Memoize navigation classes
  const navClasses = useMemo(() => {
    return `
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
        : 'bg-white/90 backdrop-blur-sm border-b border-neutral-gray-light'
      }
    `;
  }, [scrolled]);

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
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand-blue-primary text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={navClasses}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {desktopNavItems}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-neutral-charcoal hover:text-brand-blue-primary transition-colors mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <HamburgerIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                style={{ top: '64px' }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Menu Panel */}
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden mobile-menu"
                role="menu"
                aria-label="Mobile navigation menu"
              >
                <div className="container-custom py-4">
                  <div className="flex flex-col space-y-4">
                    {mobileNavItems}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};