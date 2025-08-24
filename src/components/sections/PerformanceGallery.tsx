/**
 * Performance Portfolio Gallery Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Responsive masonry-style grid layout
 * - Category filtering
 * - Image optimization with WebP and fallbacks
 * - Accessibility compliant with WCAG standards
 * - Mobile-first responsive design
 * - Professional portfolio presentation
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/common/LazySection';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/utils/animations';

// Portfolio Gallery Item Interface
interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
  venue: string;
  aspectRatio: string;
}

// Portfolio Category Interface
interface PortfolioCategory {
  id: string;
  label: string;
  count: number;
}

// Portfolio Data Interface
interface PortfolioData {
  title: string;
  subtitle: string;
  description: string;
  gallery: PortfolioItem[];
  categories: PortfolioCategory[];
}

/**
 * Performance Gallery Filter Component
 */
const GalleryFilter: React.FC<{
  categories: PortfolioCategory[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12" role="tablist" aria-label="Portfolio category filters">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-brand-blue-primary/20 focus:ring-offset-2
            ${activeCategory === category.id
              ? 'bg-brand-blue-primary text-white shadow-lg transform scale-105'
              : 'bg-white text-neutral-charcoal border border-neutral-light hover:border-brand-blue-primary hover:text-brand-blue-primary hover:shadow-md'
            }
          `}
          role="tab"
          aria-selected={activeCategory === category.id}
          aria-controls={`gallery-${category.id}`}
        >
          {category.label}
          <span className="ml-2 text-xs opacity-75">({category.count})</span>
        </button>
      ))}
    </div>
  );
};

/**
 * Gallery Item Component with optimized image loading
 */
const GalleryItem: React.FC<{
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}> = ({ item, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer"
      variants={fadeInUp}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item);
        }
      }}
      aria-label={`View details for ${item.title}`}
    >
      <div className="relative overflow-hidden rounded-xl bg-neutral-light shadow-md group-hover:shadow-xl transition-all duration-300">
        {/* Image Container with Aspect Ratio */}
        <div 
          className="relative w-full"
          style={{ aspectRatio: item.aspectRatio }}
        >
          <LazyImage
            src={item.src}
            alt={item.alt}
            className={`
              w-full h-full object-cover transition-all duration-500
              group-hover:scale-110 
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setIsLoaded(true)}
            wrapperClassName="absolute inset-0"
          />
          
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-light to-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-neutral-charcoal/40">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Overlay with details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h3 className="font-heading font-bold text-lg sm:text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-white/90 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                {item.description}
              </p>
              <div className="flex items-center text-xs sm:text-sm text-white/80 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {item.venue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Modal for enlarged image view
 */
const GalleryModal: React.FC<{
  item: PortfolioItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Full view of ${item.title}`}
      >
        <motion.div
          className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative">
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="font-heading font-bold text-2xl mb-2">{item.title}</h3>
              <p className="text-lg mb-2">{item.description}</p>
              <div className="flex items-center text-white/80">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {item.venue}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Main Performance Gallery Component
 */
export const PerformanceGallery: React.FC = () => {
  const { data: performanceData, loading } = useSectionContent('performance');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Extract portfolio data with fallback
  const portfolioData: PortfolioData = performanceData?.portfolio || {
    title: 'Performance Portfolio',
    subtitle: 'Capturing moments from live performances across Melbourne',
    description: 'From intimate acoustic sets in cozy venues to energetic blues performances that get crowds moving, these images showcase the variety and passion of my live musical experiences.',
    gallery: [],
    categories: []
  };

  // Filter gallery items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return portfolioData.gallery;
    }
    return portfolioData.gallery.filter(item => item.category === activeCategory);
  }, [portfolioData.gallery, activeCategory]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-200 rounded w-80 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-[600px] mx-auto"></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!portfolioData.gallery.length) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6">
            Performance Portfolio
          </h2>
          <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto">
            Portfolio gallery coming soon. Check back for performance photos and highlights from live shows.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        id="portfolio"
        className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-white"
        aria-labelledby="portfolio-title"
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              variants={fadeInUp}
            >
              <h2 
                id="portfolio-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
              >
                {portfolioData.title}
              </h2>
              <p className="text-lg sm:text-xl text-neutral-charcoal/80 mb-4 max-w-3xl mx-auto leading-relaxed">
                {portfolioData.subtitle}
              </p>
              <p className="text-base text-neutral-charcoal/70 max-w-4xl mx-auto leading-relaxed">
                {portfolioData.description}
              </p>
            </motion.div>

            {/* Category Filters */}
            <motion.div variants={fadeInUp}>
              <GalleryFilter
                categories={portfolioData.categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              variants={staggerContainer}
              id={`gallery-${activeCategory}`}
              role="tabpanel"
              aria-labelledby={`filter-${activeCategory}`}
            >
              <AnimatePresence mode="wait">
                {filteredItems.map((item) => (
                  <GalleryItem
                    key={`${activeCategory}-${item.id}`}
                    item={item}
                    onClick={setSelectedItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No items message */}
            {filteredItems.length === 0 && (
              <motion.div
                className="text-center py-12"
                variants={fadeInUp}
              >
                <p className="text-neutral-charcoal/70 text-lg">
                  No performances found in this category.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Modal for enlarged view */}
      <GalleryModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
};

export default PerformanceGallery;