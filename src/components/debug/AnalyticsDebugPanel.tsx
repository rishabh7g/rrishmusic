/**
 * Analytics Debug Panel Component
 * 
 * Floating debug panel for accessing performance metrics dashboard
 * and real-time analytics insights. Only visible in development or
 * when debug mode is enabled.
 * 
 * Features:
 * - Floating toggle button for dashboard access
 * - Real-time user session insights
 * - Quick performance metrics
 * - Optimization recommendations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyticsIntegration } from '@/hooks/useAnalyticsIntegration';
import { PerformanceMetricsDashboard } from '@/components/debug/PerformanceMetricsDashboard';

/**
 * Props for the Analytics Debug Panel
 */
interface AnalyticsDebugPanelProps {
  /**
   * Whether to show the debug panel (default: only in development)
   */
  enabled?: boolean;
  
  /**
   * Position of the floating button
   */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Analytics Debug Panel Component
 */
export const AnalyticsDebugPanel: React.FC<AnalyticsDebugPanelProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className = ''
}) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(true);

  const {
    userSession,
    currentPageTracking,
    isInitialized,
    engagementLevel,
    conversionLikelihood,
    recommendations
  } = useAnalyticsIntegration({
    enableFunnelTracking: true,
    enableBehaviorAnalysis: true,
    enableABTesting: true,
    enableRealTimeOptimization: true,
    debugMode: true
  });

  // Don't render if not enabled
  if (!enabled) {
    return null;
  }

  /**
   * Get position classes
   */
  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4'
    };
    return positions[position];
  };

  /**
   * Get engagement color
   */
  const getEngagementColor = () => {
    const colors = {
      low: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-green-600 bg-green-100'
    };
    return colors[engagementLevel];
  };

  /**
   * Format time duration
   */
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <>
      {/* Floating Debug Button */}
      <div className={`fixed z-40 ${getPositionClasses()} ${className}`}>
        <AnimatePresence>
          {isPanelMinimized ? (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsPanelMinimized(false)}
              className="bg-brand-blue-primary text-white rounded-full p-3 shadow-lg hover:bg-brand-blue-secondary transition-colors"
              title="Show Analytics Debug Panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
              className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Analytics Debug</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowQuickStats(!showQuickStats)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Toggle Quick Stats"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsPanelMinimized(true)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Minimize Panel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Session Status */}
              {isInitialized && userSession ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Session:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {userSession.sessionId.slice(-8)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Engagement:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor()}`}>
                      {engagementLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Conversion:</span>
                    <span className="text-gray-900 font-medium">
                      {conversionLikelihood.toFixed(0)}%
                    </span>
                  </div>

                  {currentPageTracking && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time on Page:</span>
                      <span className="text-gray-900">
                        {formatDuration(Date.now() - userSession.startTime)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 py-2">
                  Initializing analytics...
                </div>
              )}

              {/* Quick Stats */}
              <AnimatePresence>
                {showQuickStats && currentPageTracking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-3 border-t border-gray-200"
                  >
                    <div className="text-xs text-gray-600 mb-2 font-medium">Quick Stats:</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="capitalize font-medium">{currentPageTracking.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interactions:</span>
                        <span className="font-medium">{currentPageTracking.interactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scroll Depth:</span>
                        <span className="font-medium">{currentPageTracking.scrollDepth.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600 mb-2 font-medium">Recommendations:</div>
                  <div className="space-y-1">
                    {recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => setShowDashboard(true)}
                  className="w-full bg-brand-blue-primary text-white px-3 py-2 rounded text-sm font-medium hover:bg-brand-blue-secondary transition-colors"
                >
                  📊 Open Full Dashboard
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      console.log('Analytics Debug Data:', {
                        userSession,
                        currentPageTracking,
                        recommendations
                      });
                    }}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    Log Data
                  </button>
                  <button
                    onClick={() => {
                      // Clear session storage to reset analytics
                      sessionStorage.removeItem('rrish_session_id');
                      window.location.reload();
                    }}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance Dashboard Modal */}
      <PerformanceMetricsDashboard
        isVisible={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </>
  );
};

export default AnalyticsDebugPanel;