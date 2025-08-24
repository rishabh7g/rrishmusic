import React from 'react';
import { motion } from 'framer-motion';
import { useSectionContent } from '@/hooks/useContent';
import { fadeInUp, staggerContainer } from '@/utils/animations';

/**
 * Performance Hero Section Component
 * 
 * Features:
 * - Responsive hero section with performance imagery
 * - Mobile-first design approach
 * - Hero title, description, and primary CTA
 * - Background image optimization
 * - Proper contrast and accessibility
 * - Professional performance-focused content
 * - Strong call-to-action for booking inquiries
 */

interface PerformanceHeroProps {
  className?: string;
}

/**
 * Loading fallback for the Performance Hero section
 */
const PerformanceHeroLoading: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary overflow-hidden">
    <div className="container-custom text-center text-white">
      <div className="animate-pulse space-y-6">
        <div className="h-12 sm:h-16 lg:h-20 bg-white/20 rounded-lg mx-auto max-w-4xl"></div>
        <div className="h-6 sm:h-8 bg-white/20 rounded-lg mx-auto max-w-3xl"></div>
        <div className="h-6 bg-white/20 rounded-lg mx-auto max-w-2xl"></div>
        <div className="h-12 bg-white/20 rounded-full mx-auto max-w-48"></div>
      </div>
    </div>
  </section>
);

/**
 * Error fallback for the Performance Hero section
 */
const PerformanceHeroError: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-primary to-brand-blue-secondary overflow-hidden">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="container-custom text-center text-white relative z-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight"
          variants={fadeInUp}
        >
          Live Music That Moves You
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-white/90"
          variants={fadeInUp}
        >
          Professional guitar performances and blues entertainment for venues, events, and special occasions across Melbourne
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          variants={fadeInUp}
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-orange-warm text-white font-heading font-semibold rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20 shadow-xl text-lg min-w-48"
            aria-label="Navigate to contact section to book a performance"
          >
            Book Your Performance
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export const PerformanceHero: React.FC<PerformanceHeroProps> = ({ 
  className = '' 
}) => {
  const { data: performanceData, loading, error } = useSectionContent('performance');
  
  // Show loading state
  if (loading) {
    return <PerformanceHeroLoading />;
  }

  // Show error state with fallback content
  if (error || !performanceData?.hero) {
    return <PerformanceHeroError />;
  }

  const { hero } = performanceData;

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      aria-labelledby="performance-hero-title"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Gradient background as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-primary via-brand-blue-secondary to-brand-blue-primary"></div>
        
        {/* Background image - will show when image loads */}
        {hero.backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${hero.backgroundImage}')`,
            }}
            role="img"
            aria-label={hero.backgroundAlt || 'Performance background'}
          />
        )}
        
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Subtle pattern overlay for texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%23ffffff' fill-opacity='0.05'><circle cx='30' cy='30' r='1'/></g></svg>")`
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="container-custom text-center text-white relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.h1 
            id="performance-hero-title"
            className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold leading-tight drop-shadow-lg"
            variants={fadeInUp}
          >
            {hero.title}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-white/95 drop-shadow-md"
            variants={fadeInUp}
          >
            {hero.subtitle}
          </motion.p>
          
          {/* Description */}
          <motion.p 
            className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-white/85 drop-shadow-md"
            variants={fadeInUp}
          >
            {hero.description}
          </motion.p>

          {/* Feature Icons */}
          {hero.features && hero.features.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4"
              variants={fadeInUp}
            >
              {hero.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <span className="text-lg" role="img" aria-hidden="true">
                    {feature.icon}
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Call-to-Action */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            variants={fadeInUp}
          >
            <a
              href={hero.ctaLink || '#contact'}
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-orange-warm text-white font-heading font-semibold rounded-full hover:bg-brand-orange-warm/90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-orange-warm/20 shadow-xl text-lg min-w-48"
              aria-label="Navigate to contact section to book a performance"
            >
              {hero.ctaText}
            </a>
            
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-heading font-semibold rounded-full hover:bg-white hover:text-brand-blue-primary transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg min-w-48"
              aria-label="Learn more about performance services"
            >
              View Services
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="mt-12 sm:mt-16"
            variants={fadeInUp}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <a 
              href="#services" 
              className="inline-block text-white/80 hover:text-white transition-colors duration-300"
              aria-label="Scroll down to view performance services"
            >
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 mx-auto drop-shadow-lg" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Set display name for debugging
PerformanceHero.displayName = 'PerformanceHero';

// Default export
export default PerformanceHero;