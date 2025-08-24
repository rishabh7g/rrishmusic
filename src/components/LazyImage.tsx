/**
 * LazyImage Component
 * 
 * Optimized image loading component with:
 * - Lazy loading with intersection observer
 * - WebP format support with fallbacks
 * - Responsive image loading
 * - Progressive enhancement
 * - Performance monitoring integration
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  fallback?: string;
  webpSrc?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  quality?: 'low' | 'medium' | 'high';
  enablePerformanceTracking?: boolean;
}

interface ImageState {
  loaded: boolean;
  error: boolean;
  inView: boolean;
  loadStartTime?: number;
}

/**
 * Lazy Image Component
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder,
  fallback,
  webpSrc,
  sizes,
  srcSet,
  priority = false,
  onLoad,
  onError,
  style = {},
  loading = 'lazy',
  decoding = 'async',
  objectFit = 'cover',
  quality = 'medium',
  enablePerformanceTracking = true
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    loaded: false,
    error: false,
    inView: priority // Load immediately if priority
  });
  
  const [webpSupported, setWebpSupported] = useState<boolean | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const performanceId = useRef<string>(`image-${Date.now()}-${Math.random()}`);

  // Check WebP support on component mount
  useEffect(() => {
    const checkWebPSupport = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };
    
    checkWebPSupport().then(setWebpSupported);
  }, []);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority || imageState.inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageState(prev => ({ ...prev, inView: true }));
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [priority, imageState.inView]);

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageState(prev => ({ ...prev, loaded: true, error: false }));
    
    // Performance tracking
    if (enablePerformanceTracking && imageState.loadStartTime) {
      const loadTime = performance.now() - imageState.loadStartTime;
      if (loadTime > 1000) {
        console.warn(`[LazyImage] Slow image load: ${src} took ${loadTime.toFixed(0)}ms`);
      }
    }
    
    onLoad?.();
  }, [enablePerformanceTracking, imageState.loadStartTime, src, onLoad]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageState(prev => ({ ...prev, error: true, loaded: false }));
    onError?.(new Error(`Failed to load image: ${src}`));
  }, [src, onError]);

  // Start loading when in view
  useEffect(() => {
    if (imageState.inView && !imageState.loaded && !imageState.error) {
      setImageState(prev => ({ 
        ...prev, 
        loadStartTime: enablePerformanceTracking ? performance.now() : undefined 
      }));
      
      if (enablePerformanceTracking) {
        performanceMonitor.mark(performanceId.current);
      }
    }
  }, [imageState.inView, imageState.loaded, imageState.error, enablePerformanceTracking]);

  // Complete performance measurement when loaded
  useEffect(() => {
    if (imageState.loaded && enablePerformanceTracking) {
      performanceMonitor.measure(performanceId.current);
    }
  }, [imageState.loaded, enablePerformanceTracking]);

  // Generate optimized image URL
  const getOptimizedImageUrl = useCallback((
    imageSrc: string, 
    imageWidth?: number, 
    imageQuality: 'low' | 'medium' | 'high' = 'medium'
  ): string => {
    // This would typically integrate with an image optimization service
    // For now, return the original src with potential query parameters
    
    try {
      const url = new URL(imageSrc, window.location.origin);
      
      if (imageWidth) {
        url.searchParams.set('w', imageWidth.toString());
      }
      
      const qualityMap = {
        low: '60',
        medium: '80',
        high: '95'
      };
      
      url.searchParams.set('q', qualityMap[imageQuality]);
      
      return url.toString();
    } catch {
      return imageSrc;
    }
  }, []);

  // Determine image source based on WebP support and state
  const getImageSrc = useCallback((): string => {
    if (imageState.error && fallback) {
      return fallback;
    }
    
    if (webpSupported && webpSrc) {
      return getOptimizedImageUrl(webpSrc, width, quality);
    }
    
    return getOptimizedImageUrl(src, width, quality);
  }, [imageState.error, fallback, webpSupported, webpSrc, getOptimizedImageUrl, width, quality, src]);

  // Generate srcSet for responsive images
  const getResponsiveSrcSet = useCallback((): string | undefined => {
    if (srcSet) return srcSet;
    
    if (!width) return undefined;
    
    const baseSrc = webpSupported && webpSrc ? webpSrc : src;
    const breakpoints = [0.5, 1, 1.5, 2]; // Different density ratios
    
    return breakpoints
      .map(ratio => {
        const scaledWidth = Math.round(width * ratio);
        const scaledSrc = getOptimizedImageUrl(baseSrc, scaledWidth, quality);
        return `${scaledSrc} ${ratio}x`;
      })
      .join(', ');
  }, [srcSet, width, webpSupported, webpSrc, src, getOptimizedImageUrl, quality]);

  // Placeholder while loading
  const renderPlaceholder = () => {
    if (!imageState.inView || imageState.loaded) return null;
    
    const placeholderStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      fontSize: '0.875rem'
    };

    if (placeholder) {
      return (
        <img
          src={placeholder}
          alt=""
          style={{
            ...placeholderStyle,
            objectFit: 'cover',
            filter: 'blur(5px)',
            transform: 'scale(1.1)'
          }}
          aria-hidden="true"
        />
      );
    }

    return (
      <div style={placeholderStyle} aria-hidden="true">
        <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
      </div>
    );
  };

  // Error state
  const renderError = () => {
    if (!imageState.error) return null;
    
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 text-gray-500 text-sm"
        style={style}
        aria-label={`Failed to load image: ${alt}`}
      >
        <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        Image failed to load
      </div>
    );
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const imageStyle: React.CSSProperties = {
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: imageState.loaded ? 1 : 0
  };

  if (width) imageStyle.width = width;
  if (height) imageStyle.height = height;

  return (
    <div className={className} style={containerStyle}>
      {/* Placeholder */}
      {renderPlaceholder()}
      
      {/* Error state */}
      {renderError()}
      
      {/* Main image */}
      {imageState.inView && !imageState.error && (
        <img
          ref={imageRef}
          src={getImageSrc()}
          srcSet={getResponsiveSrcSet()}
          sizes={sizes}
          alt={alt}
          loading={loading}
          decoding={decoding}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          aria-hidden={imageState.loaded ? undefined : 'true'}
        />
      )}
      
      {/* Screen reader fallback */}
      {!imageState.loaded && !imageState.error && (
        <span className="sr-only">Loading image: {alt}</span>
      )}
    </div>
  );
};

export default LazyImage;