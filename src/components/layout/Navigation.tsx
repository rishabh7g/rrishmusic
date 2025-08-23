import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAVIGATION_ITEMS } from "@/utils/constants";
import { scrollToSection } from "@/utils/helpers";
import { useSmoothScroll } from "@/hooks/useScrollSpy";

interface NavigationProps {
  activeSection?: string;
}

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
 * Memoized navigation item component for better performance
 */
const NavigationItem = React.memo<{
  item: typeof NAVIGATION_ITEMS[0];
  isActive: boolean;
  onClick: (id: string) => void;
  className?: string;
  isMobile?: boolean;
  index?: number;
}>(({ item, isActive, onClick, className, isMobile, index }) => {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const baseClassName = useMemo(() => {
    const base = "font-heading font-medium transition-all duration-200";
    
    if (isMobile) {
      return `${base} text-left py-2 px-4 rounded-lg ${
        isActive
          ? "text-brand-blue-primary bg-brand-blue-primary/10"
          : "text-neutral-charcoal hover:text-brand-blue-primary hover:bg-gray-50"
      }`;
    }
    
    return `${base} relative ${
      isActive
        ? "text-brand-blue-primary"
        : "text-neutral-charcoal hover:text-brand-blue-primary"
    }`;
  }, [isMobile, isActive]);

  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;

  const content = (
    <>
      {isMobile ? (
        <div className="flex items-center justify-between">
          <span>{item.label}</span>
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-brand-blue-primary rounded-full"
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
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-blue-primary"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (index || 0) * 0.1 }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={combinedClassName}
        role="menuitem"
        aria-label={`Navigate to ${item.label} section`}
      >
        {content}
      </motion.button>
    );
  }

  return (
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
const Logo = React.memo<{ onClick: () => void }>(({ onClick }) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="font-heading font-bold text-xl text-brand-blue-primary cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="RrishMusic home"
    >
      RrishMusic
    </motion.div>
  );
});
Logo.displayName = 'Logo';

export const Navigation: React.FC<NavigationProps> = ({ activeSection = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const smoothScrollTo = useSmoothScroll();

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

  const handleNavClick = useCallback((sectionId: string) => {
    // Use optimized smooth scroll
    smoothScrollTo(sectionId, 80); // 80px offset for fixed nav
    setIsMobileMenuOpen(false);
  }, [smoothScrollTo]);

  const handleLogoClick = useCallback(() => {
    handleNavClick('hero');
  }, [handleNavClick]);

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
        isActive={activeSection === item.id}
        onClick={handleNavClick}
      />
    )), [activeSection, handleNavClick]
  );

  const mobileNavItems = useMemo(() => 
    NAVIGATION_ITEMS.map((item, index) => (
      <NavigationItem
        key={item.id}
        item={item}
        isActive={activeSection === item.id}
        onClick={handleNavClick}
        isMobile
        index={index}
      />
    )), [activeSection, handleNavClick]
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
            <Logo onClick={handleLogoClick} />

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