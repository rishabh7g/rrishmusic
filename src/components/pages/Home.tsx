import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/common/SEOHead';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

/**
 * Props interface for Home page
 */
interface HomePageProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Home Page Component - Responsive 2-Column Layout
 * 
 * Features:
 * - Mobile-first responsive design with optimized touch interactions
 * - 2-column layout (50% each) on desktop, stacks vertically on mobile
 * - Left: PERFORMANCES - for session artists, band hiring, events, collaboration
 * - Right: LESSONS FOR STUDENTS - for music theory, classes, improvisation, guitar learning
 * - Enhanced mobile experience with touch-optimized buttons
 * - Performance monitoring and accessibility compliance
 * - Dynamic viewport handling for mobile browsers
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
  const device = useDeviceDetection();

  useEffect(() => {
    // Mark homepage as started for performance monitoring
    performanceMonitor.mark('homepage-render-start');
    
    return () => {
      performanceMonitor.measure('homepage-render-total');
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Melbourne Live Music Performer | Blues Guitar & Professional Performances | Rrish Music"
        description="Professional Melbourne blues guitarist specializing in live performances for venues, events, and private functions. Authentic blues expression with engaging stage presence. Guitar lessons also available."
        keywords="Melbourne live music, blues guitarist, professional performer, venue entertainment, private events, wedding music, corporate entertainment, blues guitar lessons"
        canonical="https://www.rrishmusic.com/"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          "name": "Rrish Music",
          "description": "Professional Melbourne blues guitarist specializing in live performances",
          "url": "https://www.rrishmusic.com/",
          "genre": ["Blues", "Improvisation"],
          "member": {
            "@type": "Person",
            "name": "Rrish",
            "jobTitle": "Professional Musician",
            "performerIn": {
              "@type": "MusicEvent",
              "name": "Melbourne Live Music Performances"
            }
          },
          "offers": {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Live Music Performance Services",
              "category": "Entertainment",
              "areaServed": "Melbourne, Australia"
            }
          }
        }}
      />
      
      <main 
        id="main-content" 
        className={`homepage-container no-horizontal-scroll ${className}`}
      >
        {/* 2-Column Responsive Homepage Layout */}
        <div className="homepage-columns min-h-screen-safe">
          
          {/* Left Column - PERFORMANCES (50% width desktop, full width mobile) */}
          <Link
            to="/performance"
            className="homepage-column group gpu-accelerated"
            aria-label="Explore Performance Services - Live music for venues, events, and collaboration"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-primary via-brand-blue-secondary to-brand-blue-dark"></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <div className="absolute top-12 left-12 w-24 h-24 sm:top-20 sm:left-20 sm:w-32 sm:h-32 border-4 border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-12 right-12 w-16 h-16 sm:bottom-20 sm:right-20 sm:w-24 sm:h-24 border-4 border-brand-yellow-accent rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 border-4 border-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="homepage-column-content">
              <h1 className="homepage-title text-white mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-300 text-center">
                PERFORMANCES
              </h1>
              
              <div className="text-white/90 text-responsive-base space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-lg text-center">
                <p className="font-semibold text-responsive-lg">Professional Live Music</p>
                <div className="space-y-2">
                  <p>• Session Artists</p>
                  <p>• Band Hiring</p>
                  <p>• Private Events</p>
                  <p>• Venue Entertainment</p>
                  <p>• Musical Collaboration</p>
                </div>
              </div>
              
              {/* Touch-optimized CTA Button */}
              <div className="button-mobile bg-brand-yellow-accent text-brand-blue-primary font-bold rounded-full group-hover:bg-white group-hover:text-brand-blue-primary transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105 flex items-center justify-center gap-3">
                <span className="text-responsive-base">Explore Performances</span>
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <p className="text-white/70 text-responsive-xs mt-4 sm:mt-6 italic text-center">
                {device.isMobile ? 'Tap to view events, videos & contact' : 'Click to view events, videos, images & contact'}
              </p>
            </div>
          </Link>

          {/* Right Column - LESSONS FOR STUDENTS (50% width desktop, full width mobile) */}
          <Link
            to="/teaching"
            className="homepage-column group gpu-accelerated"
            aria-label="Start Learning Guitar - Professional instruction for music theory, blues, and improvisation"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange-warm via-brand-orange-light to-brand-orange-warm"></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <div className="absolute top-10 right-10 w-20 h-20 sm:top-16 sm:right-16 sm:w-28 sm:h-28 border-4 border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-14 h-14 sm:bottom-16 sm:left-16 sm:w-20 sm:h-20 border-4 border-brand-yellow-accent rounded-full animate-bounce"></div>
              <div className="absolute top-2/3 right-1/3 w-10 h-10 sm:w-12 sm:h-12 border-4 border-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="homepage-column-content">
              <h1 className="text-responsive-2xl font-heading font-bold text-white mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-300 text-center leading-tight">
                LESSONS FOR STUDENTS
              </h1>
              
              <div className="text-white/90 text-responsive-base space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-lg text-center">
                <p className="font-semibold text-responsive-lg">Professional Guitar Instruction</p>
                <div className="space-y-2">
                  <p>• Music Theory</p>
                  <p>• Blues Techniques</p>
                  <p>• Improvisation Skills</p>
                  <p>• Guitar Fundamentals</p>
                  <p>• Personalized Learning</p>
                </div>
              </div>
              
              {/* Touch-optimized CTA Button */}
              <div className="button-mobile bg-brand-yellow-accent text-brand-orange-warm font-bold rounded-full group-hover:bg-white group-hover:text-brand-orange-warm transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105 flex items-center justify-center gap-3">
                <span className="text-responsive-base">Start Learning</span>
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <p className="text-white/70 text-responsive-xs mt-4 sm:mt-6 italic text-center">
                {device.isMobile ? 'Tap to view approach, packages & pricing' : 'Click to view approach, packages & pricing'}
              </p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;