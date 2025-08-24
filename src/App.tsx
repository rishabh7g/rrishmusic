import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from '@/components/layout/Navigation'
import { Home, Performance, Collaboration } from '@/components/pages'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import '@/index.css'

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

/**
 * Global loading fallback component
 */
const AppLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-primary mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

/**
 * Global error fallback component
 */
const AppErrorFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-6">
        We're sorry, but something went wrong. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
)

/**
 * Performance monitoring component for development
 */
const PerformanceMonitor: React.FC = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime)
          }
          if (entry.entryType === 'first-input') {
            console.log('FID:', (entry as PerformanceEventTiming).processingStart - entry.startTime)
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as LayoutShiftEntry
            if (!layoutShiftEntry.hadRecentInput) {
              console.log('CLS:', layoutShiftEntry.value)
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
        console.warn('Performance observer not supported:', error)
      }

      return () => observer.disconnect()
    }
  }, [])

  return null
}

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
 * Main App component with React Router configuration
 * 
 * Routes:
 * - / : Home page with all teaching-focused sections
 * - /performance : Performance services page
 * - /collaboration : Collaboration services page
 * - /* : Redirects to home
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary fallback={<AppErrorFallback />}>
      <PerformanceMonitor />
      
      <Router>
        <AppLayout>
          <Suspense fallback={<AppLoadingFallback />}>
            <Routes>
              {/* Home route - All existing sections */}
              <Route 
                path="/" 
                element={
                  <ErrorBoundary fallback={<AppErrorFallback />}>
                    <Home />
                  </ErrorBoundary>
                } 
              />
              
              {/* Performance route - Performance services page */}
              <Route 
                path="/performance" 
                element={
                  <ErrorBoundary fallback={<AppErrorFallback />}>
                    <Performance />
                  </ErrorBoundary>
                } 
              />
              
              {/* Collaboration route - Collaboration services page */}
              <Route 
                path="/collaboration" 
                element={
                  <ErrorBoundary fallback={<AppErrorFallback />}>
                    <Collaboration />
                  </ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App