import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useServiceContext } from '@/hooks/useServiceContext';
import { useSmoothScroll } from '@/hooks/useScrollSpy';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ServiceNavigationItem, ServiceCTA } from '@/types/serviceContext';

/**
 * Props for ContextAwareHeader component
 */
interface ContextAwareHeaderProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Navigation item component with context-aware styling
 */
const ContextualNavigationItem: React.FC<{
  item: ServiceNavigationItem;
  isActive: boolean;
  primaryColor: string;
  onClick: (item: ServiceNavigationItem) => void;
  isMobile?: boolean;
}> = ({ item, isActive, primaryColor, onClick, isMobile }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick(item);
  }, [onClick, item]);

  const baseStyles = isMobile 
    ? "block w-full text-left py-3 px-4 rounded-lg font-medium transition-all duration-200"
    : "relative px-4 py-2 rounded-lg font-medium transition-all duration-200";
  
  const activeStyles = isActive
    ? `text-white shadow-lg ${isMobile ? 'bg-current' : ''}`
    : `hover:text-current hover:bg-black/5 ${isMobile ? 'hover:bg-black/10' : ''}`;

  const content = (
    <>
      <span className={item.highlighted ? 'font-semibold' : ''}>{item.label}</span>
      {!isMobile && isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-2 right-2 h-0.5 bg-current rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </>
  );

  const dynamicStyles = {
    color: isActive ? 'white' : 'inherit',
    backgroundColor: isActive ? primaryColor : 'transparent'
  };

  if (item.type === 'route') {
    return (
      <Link
        to={item.href}
        onClick={handleClick}
        className={`${baseStyles} ${activeStyles}`}
        style={dynamicStyles}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${activeStyles}`}
      style={dynamicStyles}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </button>
  );
};

/**
 * CTA button component with contextual styling
 */
const ContextualCTA: React.FC<{
  cta: ServiceCTA;
  primaryColor: string;
  onClick: (cta: ServiceCTA) => void;
  className?: string;
}> = ({ cta, primaryColor, onClick, className = '' }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick(cta);
  }, [onClick, cta]);

  const variantStyles = {
    primary: `text-white font-semibold shadow-lg hover:shadow-xl`,
    secondary: `text-current border border-current hover:bg-current hover:text-white`,
    outline: `text-current border border-current hover:bg-current hover:text-white`
  };

  const dynamicStyles = {
    backgroundColor: cta.variant === 'primary' ? primaryColor : 'transparent',
    borderColor: cta.variant !== 'primary' ? primaryColor : 'transparent',
    color: cta.variant === 'primary' ? 'white' : primaryColor
  };

  const content = (
    <>
      <span>{cta.text}</span>
      {cta.icon && (
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {cta.icon === 'calendar' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          )}
          {cta.icon === 'music' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          )}
          {cta.icon === 'users' && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
          )}
          {!cta.icon && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          )}
        </svg>
      )}
    </>
  );

  if (cta.type === 'route') {
    return (
      <Link
        to={cta.href}
        onClick={handleClick}
        className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${variantStyles[cta.variant]} ${className}`}
        style={dynamicStyles}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${variantStyles[cta.variant]} ${className}`}
      style={dynamicStyles}
    >
      {content}
    </button>
  );
};

/**
 * Context-Aware Header Component
 * 
 * Features:
 * - Adapts navigation and styling based on current service context
 * - Smooth transitions between service contexts
 * - Service-specific CTAs and navigation items
 * - Mobile-optimized responsive design
 * - Accessibility compliant with WCAG standards
 */
export const ContextAwareHeader: React.FC<ContextAwareHeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const device = useDeviceDetection();
  const navigate = useNavigate();
  const { smoothScrollTo } = useSmoothScroll();
  
  const {
    currentService,
    services,
    isTransitioning,
    getCurrentNavigation,
    getCurrentPrimaryCTA,
    getCurrentSecondaryCTA
  } = useServiceContext();

  const currentServiceData = services[currentService];
  const navigationItems = getCurrentNavigation();
  const primaryCTA = getCurrentPrimaryCTA();
  const secondaryCTA = getCurrentSecondaryCTA();

  /**
   * Handle navigation item clicks with intelligent routing
   */
  const handleNavClick = useCallback((item: ServiceNavigationItem) => {
    setIsMenuOpen(false);
    
    if (item.type === 'route') {
      navigate(item.href);
    } else if (item.type === 'anchor') {
      if (item.href.startsWith('#')) {
        const anchor = item.href.substring(1);
        if (window.location.pathname !== '/') {
          navigate('/', { replace: false });
          setTimeout(() => smoothScrollTo(anchor, 80), 100);
        } else {
          smoothScrollTo(anchor, 80);
        }
      }
    } else if (item.type === 'external') {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
  }, [navigate, smoothScrollTo]);

  /**
   * Handle CTA clicks
   */
  const handleCTAClick = useCallback((cta: ServiceCTA) => {
    if (cta.type === 'route') {
      navigate(cta.href);
    } else if (cta.type === 'anchor') {
      if (cta.href.startsWith('#')) {
        const anchor = cta.href.substring(1);
        smoothScrollTo(anchor, 80);
      }
    } else if (cta.type === 'external') {
      window.open(cta.href, '_blank', 'noopener,noreferrer');
    }
  }, [navigate, smoothScrollTo]);

  /**
   * Toggle mobile menu
   */
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  // Determine which navigation items are active
  const navigationWithActiveState = useMemo(() => 
    navigationItems.map(item => ({
      ...item,
      isActive: item.type === 'route' 
        ? window.location.pathname === item.href
        : item.highlighted || false
    })), [navigationItems]
  );

  // Animation variants for header transitions
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focusable absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-md shadow-lg z-50"
      >
        Skip to main content
      </a>

      <motion.header
        className={`context-aware-header backdrop-blur-sm bg-white/95 border-b border-gray-200 sticky top-0 z-40 ${className}`}
        variants={headerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        style={{
          borderBottomColor: isTransitioning ? 'transparent' : currentServiceData.primaryColor
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with service context */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold transition-colors duration-300 hover:scale-105"
              style={{ color: currentServiceData.primaryColor }}
              aria-label={`${currentServiceData.name} - Home`}
            >
              <motion.span
                key={currentService}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Rrish
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            {device.isDesktop && (
              <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {navigationWithActiveState.map((item) => (
                      <ContextualNavigationItem
                        key={item.id}
                        item={item}
                        isActive={item.isActive}
                        primaryColor={currentServiceData.primaryColor}
                        onClick={handleNavClick}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </nav>
            )}

            {/* Desktop CTAs */}
            {device.isDesktop && (
              <div className="hidden md:flex items-center space-x-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {secondaryCTA && (
                      <ContextualCTA
                        cta={secondaryCTA}
                        primaryColor={currentServiceData.primaryColor}
                        onClick={handleCTAClick}
                      />
                    )}
                    <ContextualCTA
                      cta={primaryCTA}
                      primaryColor={currentServiceData.primaryColor}
                      onClick={handleCTAClick}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            {!device.isDesktop && (
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg transition-colors duration-200"
                style={{ color: currentServiceData.primaryColor }}
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
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {!device.isDesktop && isMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden bg-white/98 backdrop-blur-sm border-t border-gray-200 shadow-lg"
              style={{ borderTopColor: currentServiceData.primaryColor }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {/* Mobile Navigation Items */}
                <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                  {navigationWithActiveState.map((item) => (
                    <ContextualNavigationItem
                      key={item.id}
                      item={item}
                      isActive={item.isActive}
                      primaryColor={currentServiceData.primaryColor}
                      onClick={handleNavClick}
                      isMobile
                    />
                  ))}
                </nav>

                {/* Mobile CTAs */}
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  {secondaryCTA && (
                    <ContextualCTA
                      cta={secondaryCTA}
                      primaryColor={currentServiceData.primaryColor}
                      onClick={handleCTAClick}
                      className="w-full justify-center"
                    />
                  )}
                  <ContextualCTA
                    cta={primaryCTA}
                    primaryColor={currentServiceData.primaryColor}
                    onClick={handleCTAClick}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default ContextAwareHeader;