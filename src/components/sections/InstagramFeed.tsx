/**
 * Simplified Instagram Feed Component
 * 
 * Uses Instagram post cards that link directly to Instagram
 * Avoids CORS issues by not trying to embed media directly
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useInstagramContent } from '@/hooks/useInstagramContent';
import { InstagramEmbed } from '@/components/InstagramEmbed';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface InstagramFeedProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
  useEnhancedHook?: boolean;
  autoRefresh?: boolean;
}

/**
 * Loading skeleton for Instagram posts
 */
const InstagramSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Main Instagram Feed Component
 */
export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  limit = 8,
  className = '',
  showHeader = true,
  useEnhancedHook = true,
  autoRefresh = false,
}) => {
  const { posts, loading, error, retry } = useInstagramContent({
    limit,
    autoRefresh,
    refreshInterval: 30 * 60 * 1000, // 30 minutes
  });

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        {showHeader && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-theme-text mb-2 transition-theme-colors">
              Latest from Instagram
            </h2>
          </div>
        )}
        <InstagramSkeleton count={limit} />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        {showHeader && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-theme-text mb-2 transition-theme-colors">
              Instagram Feed
            </h2>
          </div>
        )}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Instagram Feed Temporarily Unavailable
            </h3>
            <p className="text-gray-500 mb-4">
              We're having trouble loading Instagram content. Please visit our profile directly.
            </p>
            <div className="space-y-2">
              <button
                onClick={retry}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
              >
                Try Again
              </button>
              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Visit Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-theme-text mb-2 transition-theme-colors">
            Live from Instagram
          </h2>
          <p className="text-theme-text-secondary transition-theme-colors">
            Follow @rrishmusic for more musical content
          </p>
        </div>
      )}

      {/* Instagram Posts Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            variants={fadeInUp}
            custom={index}
          >
            <InstagramEmbed post={post} />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer CTA */}
      {posts.length > 0 && (
        <div className="text-center mt-8 pt-6 border-t border-theme-border transition-theme-colors">
          <a
            href="https://instagram.com/rrishmusic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity font-semibold"
            aria-label="Follow RrishMusic on Instagram (opens in new tab)"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow on Instagram
          </a>
        </div>
      )}
    </div>
  );
};

export default InstagramFeed;