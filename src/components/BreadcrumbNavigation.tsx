import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs, BreadcrumbItem } from '@/utils/pageHierarchy';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import '../styles/breadcrumbs.css';

/**
 * Props for BreadcrumbNavigation component
 */
interface BreadcrumbNavigationProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
  mobileCollapse?: boolean;
}

/**
 * Simple chevron right SVG icon
 */
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * Simple home SVG icon
 */
const HomeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

/**
 * Breadcrumb Navigation Component
 * 
 * Provides hierarchical navigation breadcrumbs with:
 * - Dynamic path-based breadcrumb generation
 * - Mobile-responsive design
 * - Accessibility compliance
 * - Service-aware styling
 * - Navigation history integration
 */
export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  className = '',
  showHome = true,
  maxItems = 5,
  separator,
  mobileCollapse = true
}) => {
  const location = useLocation();
  const { addToHistory } = useNavigationHistory();
  
  // Get breadcrumbs for current path
  const breadcrumbs = getBreadcrumbs(location.pathname);
  
  // Don't show breadcrumbs on home page or if only one item
  if (location.pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }
  
  // Limit breadcrumbs if maxItems specified
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0], // Always show root
        { 
          id: 'ellipsis', 
          title: '...', 
          shortTitle: '...', 
          path: '', 
          isActive: false, 
          isClickable: false 
        } as BreadcrumbItem,
        ...breadcrumbs.slice(-2) // Show last 2 items
      ]
    : breadcrumbs;
  
  /**
   * Handle breadcrumb click with history tracking
   */
  const handleBreadcrumbClick = (breadcrumb: BreadcrumbItem) => {
    if (breadcrumb.isClickable) {
      addToHistory(breadcrumb.path, breadcrumb.title);
    }
  };
  
  /**
   * Get service-specific styling classes
   */
  const getServiceClasses = (serviceType?: string) => {
    if (!serviceType) return '';
    
    const serviceClasses = {
      teaching: 'breadcrumb-teaching',
      performance: 'breadcrumb-performance',
      collaboration: 'breadcrumb-collaboration'
    };
    
    return serviceClasses[serviceType as keyof typeof serviceClasses] || '';
  };
  
  /**
   * Render breadcrumb separator
   */
  const renderSeparator = () => {
    if (separator) return separator;
    return (
      <ChevronRightIcon 
        className="breadcrumb-separator"
      />
    );
  };
  
  /**
   * Render individual breadcrumb item
   */
  const renderBreadcrumbItem = (breadcrumb: BreadcrumbItem) => {
    const serviceClasses = getServiceClasses(breadcrumb.serviceType);
    
    // Handle ellipsis
    if (breadcrumb.id === 'ellipsis') {
      return (
        <li key={breadcrumb.id} className="breadcrumb-ellipsis">
          <span className="breadcrumb-text">...</span>
        </li>
      );
    }
    
    // Render clickable breadcrumb
    if (breadcrumb.isClickable) {
      return (
        <li key={breadcrumb.id} className={`breadcrumb-item ${serviceClasses}`}>
          <Link
            to={breadcrumb.path}
            className="breadcrumb-link"
            onClick={() => handleBreadcrumbClick(breadcrumb)}
            aria-label={`Navigate to ${breadcrumb.title}`}
          >
            {/* Show home icon for root */}
            {breadcrumb.path === '/' && showHome ? (
              <>
                <HomeIcon className="breadcrumb-home-icon" />
                <span className="sr-only">{breadcrumb.title}</span>
              </>
            ) : (
              <>
                <span className="breadcrumb-text sm:hidden">
                  {breadcrumb.shortTitle || breadcrumb.title}
                </span>
                <span className="breadcrumb-text hidden sm:inline">
                  {breadcrumb.title}
                </span>
              </>
            )}
          </Link>
        </li>
      );
    }
    
    // Render active/non-clickable breadcrumb
    return (
      <li key={breadcrumb.id} className={`breadcrumb-item breadcrumb-active ${serviceClasses}`}>
        <span 
          className="breadcrumb-text breadcrumb-current"
          aria-current="page"
        >
          <span className="sm:hidden">
            {breadcrumb.shortTitle || breadcrumb.title}
          </span>
          <span className="hidden sm:inline">
            {breadcrumb.title}
          </span>
        </span>
      </li>
    );
  };
  
  return (
    <nav 
      className={`breadcrumb-navigation ${mobileCollapse ? 'mobile-collapse' : ''} ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="breadcrumb-list">
        {displayBreadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.id}>
            {renderBreadcrumbItem(breadcrumb)}
            {/* Add separator except for last item */}
            {index < displayBreadcrumbs.length - 1 && (
              <li className="breadcrumb-separator-item" aria-hidden="true">
                {renderSeparator()}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Compact Breadcrumb Navigation for mobile/header use
 */
export const CompactBreadcrumbNavigation: React.FC<{
  className?: string;
  showOnlyParent?: boolean;
}> = ({ className = '' }) => {
  return (
    <BreadcrumbNavigation
      className={`breadcrumb-compact ${className}`}
      maxItems={2}
      mobileCollapse={true}
      separator={<ChevronRightIcon className="w-3 h-3" />}
    />
  );
};

export default BreadcrumbNavigation;