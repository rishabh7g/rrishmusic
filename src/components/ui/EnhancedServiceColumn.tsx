import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  serviceImages, 
  overlayConfigs, 
  generateImageCSS, 
  getOptimizedImageSrc,
  type ImageConfig,
  type OverlayConfig
} from '@/utils/imageUtils';
import { ServiceType } from '@/types/content';
import { useServiceContent } from '@/hooks/useServiceContent';
import ServiceContentDisplay from './ServiceContentDisplay';

/**
 * Enhanced Service Column Props
 */
interface EnhancedServiceColumnProps {
  service: ServiceType;
  primary?: boolean;
  className?: string;
  lazy?: boolean;
  showDetailedContent?: boolean;
}

/**
 * Loading state component
 */
const ContentLoadingPlaceholder: React.FC = () => (
  <div className="space-y-3">
    <div className="flex space-x-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-2 bg-current/20 rounded animate-pulse flex-1"></div>
      ))}
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-current/20 rounded-full animate-pulse"></div>
          <div className="h-2 bg-current/20 rounded animate-pulse flex-1"></div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Error state component
 */
const ContentErrorFallback: React.FC<{ service: ServiceType }> = ({ service }) => (
  <div className="text-center text-current/75 text-sm">
    <div className="mb-2">⚠️</div>
    <div>Unable to load {service} content</div>
  </div>
);

/**
 * Enhanced Service Column Component
 * 
 * Features:
 * - Dynamic content integration from useServiceContent hook
 * - Optimized background image loading with WebP support
 * - Lazy loading with intersection observer
 * - Service-specific statistics and testimonials
 * - Loading and error states for content
 * - Responsive design with accessibility support
 * - Smooth animations and transitions
 */
export const EnhancedServiceColumn: React.FC<EnhancedServiceColumnProps> = ({
  service,
  primary = false,
  className = '',
  lazy = true,
  showDetailedContent = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(!lazy);

  // Load service content
  const { data: serviceContent, loading: contentLoading, error: contentError } = useServiceContent(service);

  const imageConfig: ImageConfig | undefined = serviceImages[service];
  const overlayConfig: OverlayConfig | undefined = overlayConfigs[service];

  // Service icon mapping
  const serviceIcons: Record<ServiceType, string> = {
    performance: '🎸',
    teaching: '🎓',
    collaboration: '🤝'
  };

  // Handle image loading
  useEffect(() => {
    if (!imageConfig || !isIntersecting) return;

    const loadImage = async () => {
      try {
        const optimizedSrc = await getOptimizedImageSrc(imageConfig);
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
          setImageLoaded(true);
          setImageError(false);
        };
        img.onerror = () => {
          setImageError(true);
          setImageLoaded(false);
        };
        img.src = optimizedSrc;
      } catch (error) {
        console.error(`Failed to load image for ${service}:`, error);
        setImageError(true);
        setImageLoaded(false);
      }
    };

    loadImage();
  }, [imageConfig, isIntersecting, service]);

  // Handle lazy loading intersection
  useEffect(() => {
    if (!lazy || !containerRef.current) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [lazy]);

  // Generate CSS custom properties for the background
  const cssProps = imageConfig && overlayConfig ? generateImageCSS(service) : {};

  // Handle navigation
  const handleNavigation = () => {
    if (serviceContent) {
      window.location.href = serviceContent.callToAction.href;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigation();
    }
  };

  // Fallback content if service content is not loaded
  const fallbackTitle = service.charAt(0).toUpperCase() + service.slice(1);
  const fallbackDescription = `Professional ${service} services tailored to your needs.`;

  return (
    <motion.div
      ref={containerRef}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-500 transform
        ${primary 
          ? 'shadow-2xl hover:shadow-3xl hover:-translate-y-3 ring-2 ring-brand-yellow-accent/50' 
          : 'shadow-lg hover:shadow-xl hover:-translate-y-2'
        }
        group cursor-pointer min-h-[400px] md:min-h-[500px]
        ${className}
      `}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${serviceContent?.title || fallbackTitle} services`}
      style={cssProps as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0">
        {/* Loading State */}
        {!imageLoaded && !imageError && isIntersecting && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-primary/20 to-brand-blue-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50"></div>
          </div>
        )}
        
        {/* Background Image */}
        {imageLoaded && imageConfig && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${imageConfig.src}')`,
              transform: 'scale(1.02)'
            }}
            aria-hidden="true"
          />
        )}
        
        {/* Overlay for Text Contrast */}
        {overlayConfig && (
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: overlayConfig.gradient 
                ? `linear-gradient(${overlayConfig.gradient.direction}, ${overlayConfig.gradient.colors.join(', ')})`
                : overlayConfig.color
            }}
          />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-8 h-full flex flex-col text-white">
        {/* Service Icon */}
        <motion.div 
          className={`text-6xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
            primary ? 'text-brand-yellow-accent drop-shadow-lg' : 'text-white drop-shadow-md'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {serviceIcons[service]}
        </motion.div>
        
        {/* Primary Badge for Featured Service */}
        {primary && (
          <motion.div 
            className="absolute top-6 right-6 bg-brand-yellow-accent text-brand-blue-primary px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Featured
          </motion.div>
        )}
        
        {/* Service Title */}
        <motion.h3 
          className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
            primary 
              ? 'text-brand-yellow-accent drop-shadow-lg' 
              : 'text-white drop-shadow-md'
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {serviceContent?.title || fallbackTitle}
        </motion.h3>
        
        {/* Service Description */}
        <motion.p 
          className="text-lg mb-8 text-white/95 drop-shadow-sm leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {serviceContent?.description || fallbackDescription}
        </motion.p>
        
        {/* Dynamic Service Content */}
        <motion.div 
          className="flex-grow mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {contentLoading && <ContentLoadingPlaceholder />}
          {contentError && <ContentErrorFallback service={service} />}
          {serviceContent && showDetailedContent && (
            <ServiceContentDisplay
              content={serviceContent}
              compact={true}
              showStats={true}
              showTestimonials={false}
              showPricing={true}
              className={primary ? 'text-brand-yellow-accent' : 'text-white/90'}
            />
          )}
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          className={`inline-flex items-center font-semibold transition-all duration-300 ${
            primary 
              ? 'text-brand-yellow-accent group-hover:text-white drop-shadow-lg' 
              : 'text-white/90 group-hover:text-brand-yellow-accent drop-shadow-md'
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="mr-3">
            {serviceContent?.callToAction.text || `Explore ${fallbackTitle}`}
          </span>
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </div>

      {/* Loading Indicator for Lazy Loading */}
      {lazy && !isIntersecting && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedServiceColumn;