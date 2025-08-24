import React, { Suspense, useEffect, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from '@/components/layout/Navigation'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { AnalyticsDebugPanel } from "@/components/debug/AnalyticsDebugPanel"
import { initProtocolHandling, validateURLHandling } from '@/utils/protocolHandling'
import { performanceMonitor, startPerformanceMonitoring } from '@/utils/performanceMonitor'
import uiMessages from '@/data/ui/messages.json'
import "@/index.css"

// Lazy load page components for code splitting
const Home = lazy(() => 
  import('@/components/pages/Home').then(module => {
    performanceMonitor.mark('home-page-loaded');
    return { default: module.Home };
  })
);

const Performance = lazy(() => 
  import('@/components/pages/Performance').then(module => {
    performanceMonitor.mark('performance-page-loaded');
    return { default: module.Performance };
  })
);

const Collaboration = lazy(() => 
  import('@/components/pages/Collaboration').then(module => {
    performanceMonitor.mark('collaboration-page-loaded');
    return { default: module.Collaboration };
  })
);

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

/**
 * Enhanced loading fallback component with performance hints
 */
const AppLoadingFallback: React.FC<{ pageName?: string }> = ({ pageName }) => {
  useEffect(() => {
    if (pageName) {
      performanceMonitor.mark(`${pageName}-loading-start`);
    }
  }, [pageName]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-primary mx-auto mb-4"></div>
        <p className="text-gray-600">
          {pageName ? `Loading ${pageName}...` : uiMessages.loading.default}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-400 mt-2">Code splitting in progress...</p>
        )}
      </div>
    </div>
  )
}

/**
 * Global error fallback component
 */
const AppErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {uiMessages.errors.generic.title}
      </h1>
      <p className="text-gray-600 mb-6">
        {uiMessages.errors.generic.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        {uiMessages.errors.generic.actionText}
      </button>
    </div>
  </div>
)

/**
 * Enhanced Performance monitoring component
 */
const PerformanceMonitor: React.FC = () => {
  React.useEffect(() => {
    // Initialize comprehensive performance monitoring
    const monitor = startPerformanceMonitoring({
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableAnalytics: process.env.NODE_ENV === 'production',
      threshold: {
        fcp: 1500, // Stricter FCP threshold for better UX
        lcp: 2000, // Stricter LCP threshold
        fid: 100,
        cls: 0.1,
        pageLoad: 2000 // Target: under 2 seconds
      }
    });

    // Legacy observer for development logging compatibility
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(uiMessages.performance.monitoring.lcp, entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            console.log(uiMessages.performance.monitoring.fid, (entry as PerformanceEventTiming).processingStart - entry.startTime)
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as LayoutShiftEntry
            if (!layoutShiftEntry.hadRecentInput) {
              console.log(uiMessages.performance.monitoring.cls, layoutShiftEntry.value)
            }
          }
        }
      })

      try {
        observer.observe({
          entryTypes: [
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
          ],
        })
      } catch (error) {
        console.warn(uiMessages.performance.monitoring.unsupported, error)
      }

      // Log performance recommendations after page load
      setTimeout(() => {
        const recommendations = monitor.getRecommendations();
        if (recommendations.length > 0) {
          console.group('[Performance Recommendations]');
          recommendations.forEach(rec => console.log(`• ${rec}`));
          console.groupEnd();
        }
      }, 5000);

      return () => {
        observer.disconnect()
        monitor.cleanup()
      }
    }

    return () => monitor.cleanup()
  }, [])

  return null
}

/**
 * Protocol handling component - ensures proper HTTPS enforcement
 */
const ProtocolHandler: React.FC = () => {
  useEffect(() => {
    // Initialize protocol handling on app startup
    initProtocolHandling()

    // Validate URL handling in development
    if (process.env.NODE_ENV === 'development') {
      const validation = validateURLHandling()
      if (!validation.isValid) {
        console.warn('[ProtocolHandling] URL validation issues:', validation.issues)
        console.info('[ProtocolHandling] Recommendations:', validation.recommendations)
      }
    }
  }, [])

  return null
}

/**
 * Preloader component for critical resources
 */
const ResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical CSS and fonts
    const criticalResources = [
      // Add critical resources here
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap'
    ];

    criticalResources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Preload hero images for faster LCP
    const heroImages = [
      '/images/hero-bg.jpg',
      '/images/performance-hero.jpg'
    ];

    heroImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const externalDomains = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ];

    externalDomains.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });

  }, []);

  return null;
};

/**
 * Layout wrapper component that provides consistent navigation
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Navigation />
      {children}
    </div>
  )
}

/**
 * Route wrapper with performance tracking
 */
interface RouteWrapperProps {
  children: React.ReactNode;
  routeName: string;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children, routeName }) => {
  useEffect(() => {
    performanceMonitor.mark(`${routeName}-route-start`);
    
    return () => {
      performanceMonitor.measure(`${routeName}-route-total`);
    };
  }, [routeName]);

  return (
    <ErrorBoundary 
      fallback={<AppErrorFallback />}
      onError={(error, errorInfo) => {
        console.error(`[${routeName} Route Error]`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

/**
 * Main App component with React Router configuration and performance optimizations
 * 
 * Features:
 * - Code splitting for all major routes
 * - Comprehensive performance monitoring
 * - Resource preloading for critical assets
 * - Enhanced error boundaries with route-specific handling
 * - DNS prefetching for external resources
 * 
 * Routes:
 * - / : Home page with all teaching-focused sections
 * - /performance : Performance services page
 * - /collaboration : Collaboration services page
 * - /* : Redirects to home
 */
function App(): React.JSX.Element {
  useEffect(() => {
    performanceMonitor.mark('app-start');
    
    // Mark app as fully loaded after all initial effects
    const loadTimeout = setTimeout(() => {
      performanceMonitor.measure('app-initialization');
    }, 100);

    return () => clearTimeout(loadTimeout);
  }, []);

  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <PerformanceMonitor />
      <ProtocolHandler />
      <ResourcePreloader />
      
      <Router>
        <AppLayout>
          <Suspense fallback={<AppLoadingFallback />}>
            <Routes>
              {/* Home route - All existing sections */}
              <Route 
                path="/" 
                element={
                  <RouteWrapper routeName="home">
                    <Suspense fallback={<AppLoadingFallback pageName="Home" />}>
                      <Home />
                    </Suspense>
                  </RouteWrapper>
                } 
              />
              
              {/* Performance route - Performance services page */}
              <Route 
                path="/performance" 
                element={
                  <RouteWrapper routeName="performance">
                    <Suspense fallback={<AppLoadingFallback pageName="Performance" />}>
                      <Performance />
                    </Suspense>
                  </RouteWrapper>
                } 
              />
              
              {/* Collaboration route - Collaboration services page */}
              <Route 
                path="/collaboration" 
                element={
                  <RouteWrapper routeName="collaboration">
                    <Suspense fallback={<AppLoadingFallback pageName="Collaboration" />}>
                      <Collaboration />
                    </Suspense>
                  </RouteWrapper>
                } 
              />
              
              {/* Legacy hash-based routes for backward compatibility */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/performances" element={<Navigate to="/performance" replace />} />
              
              {/* Catch-all route - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </Router>

      {/* Analytics Debug Panel - Development Only */}
      <AnalyticsDebugPanel />
    </ErrorBoundary>
  )
}

export default App