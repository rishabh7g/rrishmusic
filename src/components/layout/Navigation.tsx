import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate, Location } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '@/utils/constants'
import { useSmoothScroll, useScrollSpy } from '@/hooks/useScrollSpy'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface NavigationProps {
  // Optional activeSection override - mainly for testing
  activeSection?: string
}

/**
 * Navigation item hierarchy types for service-based visual prioritization
 */
type NavigationItemType = 'primary' | 'secondary' | 'tertiary'

/**
 * Determines the navigation item type based on service hierarchy:
 * - Primary: Home and main service pages (Performances, Collaboration)
 * - Secondary: Teaching services (Approach, Lessons)
 * - Tertiary: Standard navigation (About, Contact)
 */
const getNavigationItemType = (itemId: string): NavigationItemType => {
  if (['home', 'performance', 'collaboration'].includes(itemId)) {
    return 'primary'
  }
  if (['approach', 'lessons'].includes(itemId)) {
    return 'secondary'
  }
  return 'tertiary'
}

/**
 * Gets styling classes for navigation items based on hierarchy
 */
const getNavigationItemStyles = (
  type: NavigationItemType,
  isActive: boolean,
  isMobile: boolean
) => {
  const baseClasses =
    'font-heading transition-all duration-200 focus-visible-enhanced'

  if (isMobile) {
    const mobileBase = `${baseClasses} text-left py-3 px-6 rounded-xl block w-full touch-target-comfortable`

    switch (type) {
      case 'primary':
        return `${mobileBase} font-semibold text-responsive-base ${
          isActive
            ? 'text-white bg-theme-primary border border-theme-primary/20 shadow-lg'
            : 'text-theme-text hover:text-theme-primary hover:bg-theme-primary/10 hover:border hover:border-theme-primary/20 active:bg-theme-primary/20'
        }`
      case 'secondary':
        return `${mobileBase} font-medium text-responsive-base ${
          isActive
            ? 'text-white bg-theme-secondary border border-theme-secondary/20 shadow-lg'
            : 'text-theme-text hover:text-theme-secondary hover:bg-theme-secondary/10 active:bg-theme-secondary/15'
        }`
      case 'tertiary':
        return `${mobileBase} font-medium text-responsive-base ${
          isActive
            ? 'text-white bg-theme-primary border border-theme-primary/20 shadow-lg'
            : 'text-theme-text hover:text-theme-primary hover:bg-theme-bg-secondary active:bg-theme-bg-tertiary'
        }`
    }
  }

  // Desktop styles with visual hierarchy and dark mode support
  const desktopBase = `${baseClasses} relative touch-target px-4 py-2 rounded-lg`

  switch (type) {
    case 'primary':
      return `${desktopBase} font-bold text-lg ${
        isActive
          ? 'text-theme-primary'
          : 'text-theme-text hover:text-theme-primary hover:scale-105 hover:bg-theme-primary/5'
      }`
    case 'secondary':
      return `${desktopBase} font-semibold ${
        isActive
          ? 'text-theme-secondary'
          : 'text-theme-text hover:text-theme-secondary hover:bg-theme-secondary/5'
      }`
    case 'tertiary':
      return `${desktopBase} font-medium ${
        isActive
          ? 'text-theme-primary'
          : 'text-theme-text hover:text-theme-primary hover:bg-theme-bg-secondary'
      }`
  }
}

/**
 * Gets active indicator styles based on item type
 */
const getActiveIndicatorStyles = (
  type: NavigationItemType,
  isMobile: boolean
) => {
  if (isMobile) {
    const baseClasses = 'w-2 h-2 rounded-full'
    switch (type) {
      case 'primary':
        return `${baseClasses} bg-white`
      case 'secondary':
        return `${baseClasses} bg-white`
      case 'tertiary':
        return `${baseClasses} bg-white`
    }
  }

  // Desktop active indicator with theme support
  const baseClasses = 'absolute -bottom-1 left-2 right-2 h-0.5 rounded-full'
  switch (type) {
    case 'primary':
      return `${baseClasses} bg-theme-primary`
    case 'secondary':
      return `${baseClasses} bg-theme-secondary`
    case 'tertiary':
      return `${baseClasses} bg-theme-primary`
  }
}

/**
 * Determines navigation type and target based on href
 */
const getNavigationTarget = (item: (typeof NAVIGATION_ITEMS)[0]) => {
  if (!item.href) {
    return { type: 'scroll' as const, anchor: item.id }
  }

  if (item.href.startsWith('/')) {
    return { type: 'route' as const, path: item.href }
  }

  if (item.href.startsWith('#')) {
    return { type: 'scroll' as const, anchor: item.href.substring(1) }
  }

  // External or other links
  return { type: 'external' as const, url: item.href }
}

/**
 * Determines if a navigation item is currently active
 */
const getIsItemActive = (
  item: (typeof NAVIGATION_ITEMS)[0],
  location: Location,
  activeSection: string
): boolean => {
  const target = getNavigationTarget(item)

  if (target.type === 'route') {
    return location.pathname === target.path
  }

  if (target.type === 'scroll') {
    // For scroll targets, check if we're on the home page and the section is active
    if (location.pathname === '/') {
      return activeSection === target.anchor || activeSection === item.id
    }
  }

  return false
}

/**
 * Scroll spy configuration for anchor navigation items
 */
const getScrollSpyItems = () =>
  NAVIGATION_ITEMS.filter(item => {
    const target = getNavigationTarget(item)
    return target.type === 'scroll'
  }).map(item => {
    const target = getNavigationTarget(item)
    return target.type === 'scroll' ? target.anchor : item.id
  })

/**
 * Memoized navigation item component
 */
const NavigationItem = React.memo<{
  item: (typeof NAVIGATION_ITEMS)[0]
  isActive: boolean
  onClick: (item: (typeof NAVIGATION_ITEMS)[0]) => void
  className?: string
  isMobile?: boolean
  index?: number
}>(({ item, isActive, onClick, className, isMobile, index }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onClick(item)
    },
    [onClick, item]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(item)
      }
    },
    [onClick, item]
  )

  const itemType = useMemo(() => getNavigationItemType(item.id), [item.id])
  const baseClassName = useMemo(
    () => getNavigationItemStyles(itemType, isActive, !!isMobile),
    [itemType, isActive, isMobile]
  )

  const target = getNavigationTarget(item)

  const content = (
    <>
      {isMobile ? (
        <div className="flex items-center justify-between w-full">
          <span className="font-semibold">{item.label}</span>
          {isActive ? (
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              className={getActiveIndicatorStyles(itemType, true)}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
            />
          ) : (
            <svg
              className="w-5 h-5 opacity-60 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>
      ) : (
        <>
          <span>{item.label}</span>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className={getActiveIndicatorStyles(itemType, false)}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </>
      )}
    </>
  )

  const animationStyles =
    isMobile && typeof index !== 'undefined'
      ? {
          animationDelay: `${index * 50}ms`,
          transitionDelay: `${index * 50}ms`,
        }
      : undefined

  // Handle different navigation types
  if (target.type === 'route') {
    return (
      <Link
        to={target.path}
        onClick={handleClick}
        className={`${baseClassName} ${className || ''}`}
        aria-current={isActive ? 'page' : undefined}
        onKeyDown={handleKeyDown}
        style={animationStyles}
      >
        {content}
      </Link>
    )
  }

  if (target.type === 'external') {
    return (
      <a
        href={target.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClassName} ${className || ''}`}
        onKeyDown={handleKeyDown}
        style={animationStyles}
      >
        {content}
      </a>
    )
  }

  // Default to button for scroll navigation and other actions
  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${baseClassName} ${className || ''}`}
      aria-current={isActive ? 'page' : undefined}
      style={animationStyles}
    >
      {content}
    </button>
  )
})

NavigationItem.displayName = 'NavigationItem'

/**
 * Main Navigation Component with Responsive Design and Dark Mode Support
 */
export const Navigation: React.FC<NavigationProps> = ({
  activeSection: propActiveSection,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { smoothScrollTo } = useSmoothScroll()
  const device = useDeviceDetection()

  // Use scroll spy only for items that should be tracked on home page
  const scrollSpyItems = useMemo(() => getScrollSpyItems(), [])
  const detectedActiveSection = useScrollSpy(scrollSpyItems, {
    offset: 100,
    throttle: 50,
    rootMargin: '-10% 0px -85% 0px',
  })

  // Use prop override or detected section
  const activeSection = propActiveSection || detectedActiveSection

  /**
   * Handle navigation clicks with intelligent routing
   */
  const handleNavClick = useCallback(
    (item: (typeof NAVIGATION_ITEMS)[0]) => {
      setIsAnimating(true)
      setIsMenuOpen(false)

      const target = getNavigationTarget(item)

      try {
        if (target.type === 'route') {
          // Direct route navigation
          navigate(target.path)
        } else if (target.type === 'scroll') {
          // Scroll to anchor navigation
          if (location.pathname !== '/') {
            // If we're not on the home page, navigate there first
            navigate('/', { replace: false })
            // Small delay to allow navigation to complete before scrolling
            setTimeout(() => {
              smoothScrollTo(target.anchor, 80)
            }, 100)
          } else {
            // If we're already on the home page, just scroll
            smoothScrollTo(target.anchor, 80)
          }
        } else if (target.type === 'external') {
          // External links are handled by the anchor element directly
          return
        }
      } catch (error) {
        console.error('[Navigation] Error navigating to:', item, error)
        // Fallback to homepage
        navigate('/')
      } finally {
        setTimeout(() => setIsAnimating(false), 300)
      }
    },
    [navigate, location.pathname, smoothScrollTo]
  )

  /**
   * Toggle mobile menu
   */
  const toggleMenu = useCallback(() => {
    if (!isAnimating) {
      setIsMenuOpen(!isMenuOpen)
    }
  }, [isMenuOpen, isAnimating])

  /**
   * Close mobile menu when clicking outside or on escape
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('main-navigation')
      if (nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  /**
   * Close mobile menu on route changes
   */
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Memoize navigation items for performance
  const desktopNavItems = useMemo(
    () =>
      NAVIGATION_ITEMS.map(item => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={getIsItemActive(item, location, activeSection)}
          onClick={handleNavClick}
        />
      )),
    [location, activeSection, handleNavClick]
  )

  const mobileNavItems = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item, index) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={getIsItemActive(item, location, activeSection)}
          onClick={handleNavClick}
          isMobile
          index={index}
        />
      )),
    [location, activeSection, handleNavClick]
  )

  // Menu animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focusable absolute top-4 left-4 bg-theme-primary text-white px-4 py-2 rounded-md shadow-lg z-50 transition-theme-colors"
      >
        Skip to main content
      </a>

      <nav
        id="main-navigation"
        className="nav-mobile backdrop-blur-optimized bg-theme-bg/95 border-b border-theme-border transition-colors duration-200"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto max-w-7xl p-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-theme-primary hover:text-theme-primary-hover transition-colors duration-200 touch-target"
              aria-label="Rrish Music - Home"
            >
              <span>Rrish</span>
            </Link>

            {/* Desktop Navigation */}
            {device.isDesktop && (
              <div className="desktop-only flex items-center space-x-2">
                {desktopNavItems}
                <ThemeToggle size="md" variant="ghost" className="ml-4" />
              </div>
            )}

            {/* Mobile Navigation Controls */}
            {!device.isDesktop && (
              <div className="flex items-center space-x-2">
                <ThemeToggle size="sm" variant="ghost" />
                <motion.button
                  onClick={toggleMenu}
                  className="mobile-only touch-target-comfortable relative z-50 text-theme-text hover:text-theme-primary transition-colors duration-200"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Toggle navigation menu"
                  whileTap={{ scale: 0.95 }}
                  disabled={isAnimating}
                >
                  <motion.div
                    animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6"
                  >
                    {isMenuOpen ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </motion.div>
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {!device.isDesktop && (
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-menu"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="nav-mobile-menu open bg-theme-bg/98 backdrop-blur-optimized border-t border-theme-border shadow-lg transition-colors duration-200"
              >
                <div className="container mx-auto max-w-7xl p-4 py-6 space-y-2">
                  {mobileNavItems}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>

    </>
  )
}

export default Navigation
