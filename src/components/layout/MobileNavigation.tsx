import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAVIGATION_ITEMS } from '@/utils/constants'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useSmoothScroll } from '@/hooks/useScrollSpy'

/**
 * Mobile Navigation Component
 * Optimized for touch interactions and mobile user experience
 */

interface MobileNavigationProps {
  /** Current active section for highlighting */
  activeSection?: string
  /** Optional additional CSS classes */
  className?: string
  /** Callback when navigation item is clicked */
  onNavigationClick?: (itemId: string) => void
}

/**
 * Navigation target type determination
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

  return { type: 'external' as const, url: item.href }
}

/**
 * Determine if navigation item is active
 */
const getIsItemActive = (
  item: (typeof NAVIGATION_ITEMS)[0],
  pathname: string,
  activeSection: string
): boolean => {
  const target = getNavigationTarget(item)

  if (target.type === 'route') {
    return pathname === target.path
  }

  if (target.type === 'scroll') {
    if (pathname === '/') {
      return activeSection === target.anchor || activeSection === item.id
    }
  }

  return false
}

/**
 * Mobile Navigation Item Component
 */
const MobileNavigationItem: React.FC<{
  item: (typeof NAVIGATION_ITEMS)[0]
  isActive: boolean
  onItemClick: (item: (typeof NAVIGATION_ITEMS)[0]) => void
  index: number
}> = React.memo(({ item, isActive, onItemClick, index }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onItemClick(item)
    },
    [item, onItemClick]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onItemClick(item)
      }
    },
    [item, onItemClick]
  )

  const target = getNavigationTarget(item)

  // Animation variants for staggered entrance
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05, // Stagger effect
        ease: 'easeOut',
      },
    },
  }

  const baseClassName = `
    touch-target-comfortable
    w-full text-left px-6 py-4 rounded-xl font-medium
    transition-all duration-200 ease-out
    flex items-center justify-between
    border border-transparent
    ${
      isActive
        ? 'bg-brand-blue-primary text-white border-brand-blue-primary/20 shadow-lg'
        : 'text-neutral-charcoal hover:bg-brand-blue-primary/10 hover:text-brand-blue-primary active:bg-brand-blue-primary/20'
    }
  `

  const content = (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-between w-full"
    >
      <span className="text-base font-semibold">{item.label}</span>
      {isActive && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-2 h-2 bg-white rounded-full"
          transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
        />
      )}
      {!isActive && (
        <motion.svg
          className="w-5 h-5 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          whileHover={{ x: 2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </motion.svg>
      )}
    </motion.div>
  )

  // Handle different navigation types
  if (target.type === 'route') {
    return (
      <motion.div variants={itemVariants}>
        <Link
          to={target.path}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={baseClassName}
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </Link>
      </motion.div>
    )
  }

  if (target.type === 'external') {
    return (
      <motion.div variants={itemVariants}>
        <a
          href={target.url}
          target="_blank"
          rel="noopener noreferrer"
          onKeyDown={handleKeyDown}
          className={baseClassName}
        >
          {content}
        </a>
      </motion.div>
    )
  }

  // Default to button for scroll navigation
  return (
    <motion.div variants={itemVariants}>
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={baseClassName}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </button>
    </motion.div>
  )
})

MobileNavigationItem.displayName = 'MobileNavigationItem'

/**
 * Mobile Navigation Menu Component
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection = '',
  className = '',
  onNavigationClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { smoothScrollTo } = useSmoothScroll()
  const device = useDeviceDetection()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Close menu on route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  /**
   * Handle navigation item clicks
   */
  const handleNavClick = useCallback(
    async (item: (typeof NAVIGATION_ITEMS)[0]) => {
      const target = getNavigationTarget(item)

      // Close menu with animation
      setIsAnimating(true)
      setIsMenuOpen(false)

      // Call optional callback
      onNavigationClick?.(item.id)

      try {
        if (target.type === 'route') {
          navigate(target.path)
        } else if (target.type === 'scroll') {
          if (location.pathname !== '/') {
            navigate('/', { replace: false })
            // Small delay to allow navigation
            setTimeout(() => {
              smoothScrollTo(target.anchor, 80)
            }, 100)
          } else {
            smoothScrollTo(target.anchor, 80)
          }
        }
      } catch (error) {
        console.error('[MobileNavigation] Error navigating to:', item, error)
        navigate('/')
      }

      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
    },
    [navigate, location.pathname, smoothScrollTo, onNavigationClick]
  )

  /**
   * Toggle menu state
   */
  const toggleMenu = useCallback(() => {
    if (!isAnimating) {
      setIsMenuOpen(!isMenuOpen)
    }
  }, [isMenuOpen, isAnimating])

  // Don't render on desktop
  if (device.isDesktop) {
    return null
  }

  // Menu animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: '-100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.05,
      },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  }

  const itemContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <div className={`mobile-only ${className}`} ref={menuRef}>
      {/* Mobile Header */}
      <div className="nav-mobile">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200"
              aria-label="Rrish Music - Home"
            >
              <span>Rrish</span>
            </Link>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="touch-target-comfortable relative z-50"
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
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              style={{ top: '64px' }} // Account for header height
            />

            {/* Menu Content */}
            <motion.div
              id="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-16 left-0 right-0 bottom-0 bg-white/95 backdrop-blur-optimized z-45 overflow-y-auto"
            >
              <div className="container-responsive py-8">
                {/* Skip to content link for accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focusable absolute top-4 left-4 bg-brand-blue-primary text-white px-4 py-2 rounded-md shadow-lg z-50"
                >
                  Skip to main content
                </a>

                {/* Navigation Items */}
                <motion.div
                  variants={itemContainerVariants}
                  className="space-y-3"
                >
                  {NAVIGATION_ITEMS.map((item, index) => (
                    <MobileNavigationItem
                      key={item.id}
                      item={item}
                      isActive={getIsItemActive(
                        item,
                        location.pathname,
                        activeSection
                      )}
                      onItemClick={handleNavClick}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* Footer Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 pt-6 border-t border-gray-200"
                >
                  <p className="text-center text-sm text-gray-600">
                    Professional Music Services in Melbourne
                  </p>
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Performances • Teaching • Collaboration
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

export default MobileNavigation
