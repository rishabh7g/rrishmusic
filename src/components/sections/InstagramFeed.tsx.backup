/**
 * Instagram Performance Feed Component
 * 
 * Features:
 * - Displays performance-related Instagram content
 * - Responsive masonry-style grid layout
 * - Lazy loading with intersection observer
 * - Error handling with fallback content
 * - Loading states and skeleton UI
 * - Direct links to full Instagram posts
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { instagramService, InstagramPost } from '@/services/instagram';
import { fadeInUp, staggerContainer } from '@/utils/animations';

interface InstagramFeedProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * Individual Instagram Post Component
 */
const InstagramPostItem: React.FC<{
  post: InstagramPost;
  index: number;
}> = ({ post, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-AU', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  const truncateCaption = (caption: string | undefined, maxLength: number = 120): string => {
    if (!caption) return '';
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Media Content */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
            )}
            <img
              src={post.media_type === 'VIDEO' ? post.thumbnail_url || post.media_url : post.media_url}
              alt={post.caption ? `Instagram post: ${truncateCaption(post.caption, 60)}` : 'Instagram performance post'}
              className={`w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {/* Video Indicator */}
            {post.media_type === 'VIDEO' && (
              <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            )}

            {/* Carousel Indicator */}
            {post.media_type === 'CAROUSEL_ALBUM' && (
              <div className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-brand-blue-primary p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          // Error state
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-neutral-charcoal/80 leading-relaxed mb-3">
            {truncateCaption(post.caption)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-neutral-charcoal/60">
            <span>@{post.username}</span>
            <span>•</span>
            <span>{formatDate(post.timestamp)}</span>
          </div>
          
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue-primary hover:text-brand-blue-secondary transition-colors text-xs font-medium"
            aria-label="View full post on Instagram"
          >
            View Post
          </a>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Loading Skeleton Component
 */
const InstagramSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/5 animate-pulse" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-2 bg-gray-200 rounded w-16 animate-pulse" />
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
  showHeader = true
}) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load Instagram posts
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await instagramService.getPerformancePosts(limit);
        
        setPosts(result.posts);
        setFromCache(result.fromCache);
        
        if (result.error) {
          console.warn('Instagram service warning:', result.error);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Instagram content';
        setError(errorMessage);
        console.error('Instagram feed error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [limit]);

  // Render loading state
  if (loading) {
    return (
      <section className={`py-16 lg:py-24 bg-white ${className}`}>
        <div className="container-custom">
          {showHeader && (
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
            </div>
          )}
          <InstagramSkeleton count={limit} />
        </div>
      </section>
    );
  }

  // Render error state with fallback
  if (error && posts.length === 0) {
    return (
      <section className={`py-16 lg:py-24 bg-white ${className}`}>
        <div className="container-custom">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-charcoal mb-2">
              Instagram Feed Temporarily Unavailable
            </h3>
            <p className="text-neutral-charcoal/60 mb-6 max-w-md mx-auto">
              We're having trouble connecting to Instagram. Please visit our profile directly for the latest performance content.
            </p>
            <a
              href="https://instagram.com/rrishmusic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-brand-blue-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-blue-secondary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Visit @rrishmusic
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="instagram-feed"
      className={`py-16 lg:py-24 bg-white ${className}`}
      aria-labelledby="instagram-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          {showHeader && (
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
            >
              <h2 
                id="instagram-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
              >
                Live from Instagram
              </h2>
              <p className="text-lg sm:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
                Behind the scenes, live performances, and musical moments from @rrishmusic
              </p>
              
              {/* Cache indicator for development */}
              {(error || fromCache) && (
                <div className="mt-4 flex justify-center">
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {error ? 'Using fallback content' : 'Cached content'}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Instagram Posts Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-12"
            variants={staggerContainer}
          >
            {posts.map((post, index) => (
              <InstagramPostItem
                key={post.id}
                post={post}
                index={index}
              />
            ))}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            className="text-center"
            variants={fadeInUp}
          >
            <a
              href="https://instagram.com/rrishmusic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white font-heading font-semibold px-8 py-4 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-500/20 shadow-lg"
              aria-label="Follow RrishMusic on Instagram (opens in new tab)"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @rrishmusic
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;