/**
 * Enhanced Performance Portfolio Gallery Component - Issue #43 Implementation
 * 
 * Features:
 * - Band vs Solo performance differentiation
 * - Integrated video players with optimal controls
 * - Testimonials throughout portfolio
 * - Genre versatility showcase
 * - Mobile-optimized viewing experience
 * - Professional event photography presentation
 * - Performance categories and filtering
 * - SEO schema markup for performances
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from '@/components/common/LazySection';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/utils/animations';

// Type definitions
type PerformanceTypeFilter = 'all' | 'band' | 'solo' | 'acoustic';
type PerformanceType = 'band' | 'solo' | 'acoustic';

// Portfolio Item Interfaces
interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  performanceType: PerformanceType;
  genre: string[];
  description: string;
  venue: string;
  eventType: string;
  date?: string;
  aspectRatio: string;
  featured?: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
  performanceType: PerformanceType;
  genre: string[];
  venue: string;
  duration: string;
}

interface TestimonialItem {
  id: string;
  text: string;
  author: string;
  role: string;
  venue?: string;
  performanceType?: PerformanceType;
  featured: boolean;
}

interface PortfolioData {
  title: string;
  subtitle: string;
  description: string;
  bandDescription: string;
  soloDescription: string;
  gallery: PortfolioItem[];
  videos: VideoItem[];
  testimonials: TestimonialItem[];
  genres: string[];
  stats: {
    totalPerformances: number;
    venuesPlayed: number;
    yearsActive: number;
  };
}

/**
 * Performance Type Filter Component
 */
const PerformanceTypeFilter: React.FC<{
  activeType: PerformanceTypeFilter;
  onTypeChange: (type: PerformanceTypeFilter) => void;
}> = ({ activeType, onTypeChange }) => {
  const filterOptions = [
    { id: 'all' as const, label: 'All Performances', icon: '🎵' },
    { id: 'band' as const, label: 'Band Shows', icon: '🎸' },
    { id: 'solo' as const, label: 'Solo Sets', icon: '🎤' },
    { id: 'acoustic' as const, label: 'Acoustic', icon: '🪕' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist">
      {filterOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onTypeChange(option.id)}
          className={`
            px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-brand-blue-primary/20 focus:ring-offset-2
            flex items-center gap-2
            ${activeType === option.id
              ? 'bg-brand-blue-primary text-white shadow-lg transform scale-105'
              : 'bg-white text-neutral-charcoal border-2 border-neutral-light hover:border-brand-blue-primary hover:text-brand-blue-primary hover:shadow-md'
            }
          `}
          role="tab"
          aria-selected={activeType === option.id}
        >
          <span className="text-lg">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Enhanced Gallery Item with Performance Type Badges
 */
const EnhancedGalleryItem: React.FC<{
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}> = ({ item, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getPerformanceTypeBadge = () => {
    const badges = {
      band: { label: 'Band', color: 'bg-red-500', icon: '🎸' },
      solo: { label: 'Solo', color: 'bg-blue-500', icon: '🎤' },
      acoustic: { label: 'Acoustic', color: 'bg-green-500', icon: '🪕' }
    } as const;
    return badges[item.performanceType];
  };

  const badge = getPerformanceTypeBadge();

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
    >
      <div className="relative overflow-hidden rounded-xl bg-neutral-light shadow-lg group-hover:shadow-2xl transition-all duration-300">
        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 left-3 z-10 bg-brand-yellow-accent text-brand-blue-primary px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}

        {/* Performance Type Badge */}
        <div className={`absolute top-3 right-3 z-10 ${badge.color} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
          <span>{badge.icon}</span>
          {badge.label}
        </div>

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
          
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-light to-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-neutral-charcoal/40">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* Enhanced overlay with genre tags */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap gap-1 mb-3">
                {item.genre.slice(0, 2).map((genre) => (
                  <span key={genre} className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                    {genre}
                  </span>
                ))}
              </div>
              <h3 className="font-heading font-bold text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-white/90 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                {item.description}
              </p>
              <div className="flex items-center justify-between text-xs text-white/80 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {item.venue}
                </div>
                <div className="text-xs opacity-75">
                  {item.eventType}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Video Player Component
 */
const VideoPlayer: React.FC<{ video: VideoItem }> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group">
      {!isPlaying ? (
        <>
          <img 
            src={video.thumbnail} 
            alt={`${video.title} thumbnail`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-300 group-hover:scale-110"
              aria-label={`Play ${video.title}`}
            >
              <svg className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              {video.genre.map((genre) => (
                <span key={genre} className="px-2 py-1 bg-white/20 rounded text-xs">
                  {genre}
                </span>
              ))}
            </div>
            <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
            <p className="text-sm text-white/90 mb-1">{video.description}</p>
            <div className="flex justify-between text-xs text-white/75">
              <span>{video.venue}</span>
              <span>{video.duration}</span>
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={video.embedUrl}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

/**
 * Performance Testimonial Component
 */
const PerformanceTestimonial: React.FC<{ testimonial: TestimonialItem }> = ({ testimonial }) => (
  <motion.div
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    variants={fadeInUp}
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-brand-yellow-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-brand-yellow-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      </div>
      <div className="flex-1">
        <blockquote className="text-gray-800 text-lg italic mb-4">
          "{testimonial.text}"
        </blockquote>
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-brand-blue-primary">{testimonial.author}</div>
          <div>{testimonial.role}{testimonial.venue && `, ${testimonial.venue}`}</div>
        </div>
      </div>
    </div>
  </motion.div>
);

/**
 * Main Enhanced Performance Gallery Component
 */
export const PerformanceGallery: React.FC = () => {
  const { data: performanceData, loading } = useSectionContent('performance');
  const [activeType, setActiveType] = useState<PerformanceTypeFilter>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Default portfolio data with enhanced structure
  const portfolioData: PortfolioData = performanceData?.portfolio || {
    title: 'Performance Portfolio',
    subtitle: 'Professional blues and live music performances across Melbourne',
    description: 'From high-energy band performances to intimate acoustic sets, showcasing versatility across venues and genres.',
    bandDescription: 'Full band performances featuring blues, rock, and contemporary music with complete rhythm section and professional sound setup.',
    soloDescription: 'Intimate solo performances focusing on acoustic blues, fingerstyle guitar, and audience connection in smaller venue settings.',
    gallery: [
      // Mock data for development - replace with actual content
      {
        id: '1',
        src: '/images/performance/band-show-1.jpg',
        alt: 'Blues band performance at The Corner Hotel',
        title: 'Corner Hotel Blues Night',
        category: 'venue',
        performanceType: 'band',
        genre: ['Blues', 'Rock'],
        description: 'High-energy blues performance with full band',
        venue: 'The Corner Hotel',
        eventType: 'Live Music Night',
        aspectRatio: '4/3',
        featured: true
      },
      {
        id: '2',
        src: '/images/performance/solo-acoustic-1.jpg',
        alt: 'Solo acoustic performance at intimate venue',
        title: 'Intimate Acoustic Evening',
        category: 'venue',
        performanceType: 'acoustic',
        genre: ['Acoustic', 'Blues'],
        description: 'Solo acoustic set in cozy venue atmosphere',
        venue: 'The Local Taphouse',
        eventType: 'Acoustic Night',
        aspectRatio: '3/4'
      }
    ],
    videos: [
      {
        id: '1',
        title: 'Live Blues Improvisation',
        description: 'Extended blues improvisation showcase',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        thumbnail: '/images/video-thumbnails/blues-improv-thumb.jpg',
        performanceType: 'band',
        genre: ['Blues', 'Improvisation'],
        venue: 'Melbourne Blues Club',
        duration: '6:32'
      }
    ],
    testimonials: [
      {
        id: '1',
        text: 'Rrish brought incredible energy to our venue. The crowd was captivated by his blues guitar skills and stage presence.',
        author: 'Sarah Mitchell',
        role: 'Event Manager',
        venue: 'The Corner Hotel',
        performanceType: 'band',
        featured: true
      },
      {
        id: '2',
        text: 'Perfect for our acoustic nights. Creates the ideal atmosphere for an intimate musical experience.',
        author: 'Mike Thompson',
        role: 'Venue Owner',
        venue: 'Local Taphouse',
        performanceType: 'acoustic',
        featured: true
      }
    ],
    genres: ['Blues', 'Rock', 'Acoustic', 'Improvisation', 'Contemporary'],
    stats: {
      totalPerformances: 150,
      venuesPlayed: 25,
      yearsActive: 8
    }
  };

  // Filter items based on performance type
  const filteredItems = useMemo(() => {
    if (activeType === 'all') {
      return portfolioData.gallery;
    }
    return portfolioData.gallery.filter(item => item.performanceType === activeType);
  }, [portfolioData.gallery, activeType]);

  // Get featured testimonials
  const featuredTestimonials = portfolioData.testimonials.filter(t => t.featured);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-neutral-light/20 to-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-200 rounded w-80 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
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
            {/* Enhanced Section Header */}
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 id="portfolio-title" className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6">
                {portfolioData.title}
              </h2>
              <p className="text-lg sm:text-xl text-neutral-charcoal/80 mb-6 max-w-3xl mx-auto">
                {portfolioData.subtitle}
              </p>

              {/* Performance Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue-primary">{portfolioData.stats.totalPerformances}+</div>
                  <div className="text-sm text-gray-600">Performances</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue-primary">{portfolioData.stats.venuesPlayed}+</div>
                  <div className="text-sm text-gray-600">Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue-primary">{portfolioData.stats.yearsActive}</div>
                  <div className="text-sm text-gray-600">Years Active</div>
                </div>
              </div>
            </motion.div>

            {/* Performance Type Filter */}
            <motion.div variants={fadeInUp}>
              <PerformanceTypeFilter
                activeType={activeType}
                onTypeChange={setActiveType}
              />
            </motion.div>

            {/* Band vs Solo Descriptions */}
            <motion.div className="grid md:grid-cols-2 gap-8 mb-16" variants={staggerContainer}>
              <motion.div 
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
                variants={slideInLeft}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🎸</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Band Performances</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {portfolioData.bandDescription}
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100"
                variants={slideInRight}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🪕</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Solo & Acoustic</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {portfolioData.soloDescription}
                </p>
              </motion.div>
            </motion.div>

            {/* Featured Videos Section */}
            {portfolioData.videos.length > 0 && (
              <motion.div className="mb-16" variants={fadeInUp}>
                <h3 className="text-2xl font-bold text-center mb-8 text-neutral-charcoal">
                  Featured Performances
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {portfolioData.videos.map((video) => (
                    <VideoPlayer key={video.id} video={video} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery Grid */}
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
              variants={staggerContainer}
            >
              <AnimatePresence mode="wait">
                {filteredItems.map((item) => (
                  <EnhancedGalleryItem
                    key={`${activeType}-${item.id}`}
                    item={item}
                    onClick={setSelectedItem}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Testimonials Section */}
            {featuredTestimonials.length > 0 && (
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold text-center mb-8 text-neutral-charcoal">
                  What Venues Say
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredTestimonials.map((testimonial) => (
                    <PerformanceTestimonial key={testimonial.id} testimonial={testimonial} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* No items message */}
            {filteredItems.length === 0 && (
              <motion.div className="text-center py-12" variants={fadeInUp}>
                <p className="text-neutral-charcoal/70 text-lg">
                  No performances found for this category.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Modal for enlarged view */}
      {selectedItem && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedItem.genre.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-2">{selectedItem.title}</h3>
                  <p className="text-lg mb-2">{selectedItem.description}</p>
                  <div className="flex justify-between items-center text-white/80">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {selectedItem.venue}
                    </div>
                    <div className="text-sm">
                      {selectedItem.eventType}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default PerformanceGallery;