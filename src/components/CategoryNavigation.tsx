import React, { useState, useEffect } from 'react'
import { CategoryItem } from '@/hooks/useScrollSpy'
import {
  useCategoryNavigation,
  useCategoryBreadcrumbs,
} from '@/hooks/useCategoryNavigation'

interface CategoryNavigationProps {
  /**
   * Categories to display in navigation
   */
  categories: CategoryItem[]

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Navigation style variant
   */
  variant?: 'horizontal' | 'vertical' | 'tabs' | 'pills'

  /**
   * Show category descriptions
   */
  showDescriptions?: boolean

  /**
   * Show navigation indicators (dots, progress bar)
   */
  showIndicators?: boolean

  /**
   * Show breadcrumbs
   */
  showBreadcrumbs?: boolean

  /**
   * Enable mobile hamburger menu
   */
  mobileMenu?: boolean

  /**
   * Callback when category changes
   */
  onCategoryChange?: (categoryId: string) => void
}

/**
 * Sophisticated Category Navigation Component
 *
 * Features:
 * - Multiple layout variants
 * - Smooth scrolling between categories
 * - Context awareness and scroll position memory
 * - Mobile-optimized navigation
 * - Keyboard accessibility
 * - Progress indicators
 * - Breadcrumb trail
 */
export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  className = '',
  variant = 'horizontal',
  showDescriptions = false,
  showIndicators = true,
  showBreadcrumbs = false,
  mobileMenu = true,
  onCategoryChange,
}) => {
  const {
    activeCategory,
    isNavigating,
    navigationHistory,
    navigateToCategory,
    navigateNext,
    navigatePrevious,
    goBack,
  } = useCategoryNavigation(categories, {
    scrollOffset: 80,
    updateURL: true,
    persistScrollPosition: true,
  })

  const breadcrumbs = useCategoryBreadcrumbs(
    categories,
    activeCategory,
    navigationHistory
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Notify parent of category changes
  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange(activeCategory)
    }
  }, [activeCategory, onCategoryChange])

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId !== activeCategory && !isNavigating) {
      navigateToCategory(categoryId)
      setIsMobileMenuOpen(false)
    }
  }

  const renderCategoryButton = (category: CategoryItem, isActive: boolean) => {
    const baseClasses = `
      category-nav-button
      relative px-4 py-3 rounded-lg font-medium transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-brand-blue-primary focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const variantClasses = {
      horizontal: isActive
        ? 'bg-brand-blue-primary text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-100 hover:text-brand-blue-primary',
      vertical: isActive
        ? 'bg-brand-blue-primary text-white border-l-4 border-brand-blue-dark'
        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-blue-primary border-l-4 border-transparent',
      tabs: isActive
        ? 'border-b-2 border-brand-blue-primary text-brand-blue-primary bg-brand-blue-primary/5'
        : 'border-b-2 border-transparent text-gray-600 hover:text-brand-blue-primary hover:border-gray-300',
      pills: isActive
        ? 'bg-brand-blue-primary text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-brand-blue-primary',
    }

    return (
      <button
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        disabled={isNavigating}
        className={`${baseClasses} ${variantClasses[variant]}`}
        aria-current={isActive ? 'page' : undefined}
        aria-describedby={
          showDescriptions && category.description
            ? `${category.id}-desc`
            : undefined
        }
      >
        <div className="flex items-center space-x-2">
          {category.icon && (
            <span
              className="w-5 h-5"
              dangerouslySetInnerHTML={{ __html: category.icon }}
            />
          )}
          <span>{category.label}</span>
        </div>

        {showDescriptions && category.description && (
          <p
            id={`${category.id}-desc`}
            className="text-xs mt-1 opacity-75 line-clamp-2"
          >
            {category.description}
          </p>
        )}

        {/* Active indicator */}
        {isActive && (
          <div
            className={`
            absolute transition-all duration-300
            ${variant === 'horizontal' ? 'bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-t' : ''}
            ${variant === 'vertical' ? 'left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r' : ''}
            ${variant === 'tabs' ? 'bottom-0 left-0 w-full h-0.5 bg-brand-blue-primary' : ''}
            ${variant === 'pills' ? 'inset-0 bg-brand-blue-primary rounded-lg -z-10' : ''}
          `}
          />
        )}
      </button>
    )
  }

  const renderProgressIndicator = () => {
    if (!showIndicators || categories.length === 0) return null

    const activeIndex = categories.findIndex(cat => cat.id === activeCategory)
    const progressPercentage = ((activeIndex + 1) / categories.length) * 100

    return (
      <div className="category-progress-indicator mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            {activeIndex + 1} of {categories.length}
          </span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-blue-primary rounded-full h-2 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    )
  }

  const renderBreadcrumbs = () => {
    if (!showBreadcrumbs || breadcrumbs.length === 0) return null

    return (
      <nav
        className="category-breadcrumbs mb-4"
        aria-label="Category breadcrumb"
      >
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.id} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
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
              {crumb.isClickable ? (
                <button
                  onClick={() => navigateToCategory(crumb.id)}
                  className="text-gray-500 hover:text-brand-blue-primary transition-colors"
                  disabled={isNavigating}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-brand-blue-primary font-medium">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  const renderDesktopNavigation = () => {
    const containerClasses = {
      horizontal: 'flex items-center space-x-2 overflow-x-auto pb-2',
      vertical: 'flex flex-col space-y-2',
      tabs: 'flex items-center space-x-0 border-b border-gray-200',
      pills: 'flex flex-wrap gap-2',
    }

    return (
      <div
        className={`category-navigation ${containerClasses[variant]} ${className}`}
      >
        {categories.map(category =>
          renderCategoryButton(category, category.id === activeCategory)
        )}
      </div>
    )
  }

  const renderMobileNavigation = () => {
    if (!mobileMenu) return renderDesktopNavigation()

    const activeLabel =
      categories.find(cat => cat.id === activeCategory)?.label ||
      'Select Category'

    return (
      <div className="category-navigation-mobile sm:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm"
          disabled={isNavigating}
        >
          <span className="font-medium text-gray-700">{activeLabel}</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                disabled={isNavigating}
                className={`
                  w-full text-left px-4 py-3 transition-colors
                  ${
                    category.id === activeCategory
                      ? 'bg-brand-blue-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                <div className="flex items-center space-x-2">
                  {category.icon && (
                    <span
                      className="w-5 h-5"
                      dangerouslySetInnerHTML={{ __html: category.icon }}
                    />
                  )}
                  <span>{category.label}</span>
                </div>
                {showDescriptions && category.description && (
                  <p className="text-xs mt-1 opacity-75">
                    {category.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderNavigationControls = () => {
    return (
      <div className="category-navigation-controls flex items-center space-x-2 mt-4">
        <button
          onClick={navigatePrevious}
          disabled={isNavigating}
          className="p-2 text-gray-500 hover:text-brand-blue-primary disabled:opacity-50 transition-colors"
          aria-label="Previous category"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={navigateNext}
          disabled={isNavigating}
          className="p-2 text-gray-500 hover:text-brand-blue-primary disabled:opacity-50 transition-colors"
          aria-label="Next category"
        >
          <svg
            className="w-5 h-5"
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
        </button>

        {navigationHistory.length > 0 && (
          <button
            onClick={goBack}
            disabled={isNavigating}
            className="p-2 text-gray-500 hover:text-brand-blue-primary disabled:opacity-50 transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest('.category-navigation-mobile')
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobileMenuOpen])

  if (categories.length === 0) {
    return null
  }

  return (
    <div className={`category-navigation-container relative ${className}`}>
      {renderBreadcrumbs()}

      {/* Desktop Navigation */}
      <div className="hidden sm:block">{renderDesktopNavigation()}</div>

      {/* Mobile Navigation */}
      {renderMobileNavigation()}

      {renderProgressIndicator()}
      {renderNavigationControls()}

      {/* Loading overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-brand-blue-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default CategoryNavigation
