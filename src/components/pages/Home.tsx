import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/common/SEOHead';
import { performanceMonitor } from '@/utils/performanceMonitor';

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
 * Home Page Component - Simple 2-Column Layout
 * 
 * Features:
 * - 2-column layout with 50% screen coverage each
 * - Left: PERFORMANCES - for session artists, band hiring, events, collaboration
 * - Right: LESSONS FOR STUDENTS - for music theory, classes, improvisation, guitar learning
 * - Mobile-first responsive design (stacks vertically on mobile)
 * - Clear navigation to respective service pages
 * - Professional appearance with visual hierarchy
 */
export const Home: React.FC<HomePageProps> = ({ className = '' }) => {
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
      
      <main id="main-content" className={`min-h-screen ${className}`}>
        {/* 2-Column Homepage Layout */}
        <div className="min-h-screen flex flex-col lg:flex-row">
          
          {/* Left Box - PERFORMANCES (50% width) */}
          <Link
            to="/performance"
            className="flex-1 lg:w-1/2 relative group cursor-pointer overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-primary via-brand-blue-secondary to-brand-blue-dark"></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-brand-yellow-accent rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 lg:p-16">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 group-hover:scale-105 transition-transform duration-300">
                PERFORMANCES
              </h1>
              
              <div className="text-white/90 text-lg md:text-xl lg:text-2xl space-y-4 mb-8 max-w-lg">
                <p className="font-medium">Professional Live Music</p>
                <p>• Session Artists</p>
                <p>• Band Hiring</p>
                <p>• Private Events</p>
                <p>• Venue Entertainment</p>
                <p>• Musical Collaboration</p>
              </div>
              
              <div className="inline-flex items-center px-8 py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold rounded-full group-hover:bg-white group-hover:text-brand-blue-primary transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                <span>Explore Performances</span>
                <svg 
                  className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <p className="text-white/70 text-sm mt-6 italic">
                Click to view events, videos, images & contact
              </p>
            </div>
          </Link>

          {/* Right Box - LESSONS FOR STUDENTS (50% width) */}
          <Link
            to="/lessons"
            className="flex-1 lg:w-1/2 relative group cursor-pointer overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange-warm via-brand-orange-light to-brand-orange-warm"></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500"></div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-16 right-16 w-28 h-28 border-4 border-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 left-16 w-20 h-20 border-4 border-brand-yellow-accent rounded-full animate-bounce"></div>
              <div className="absolute top-2/3 right-1/3 w-12 h-12 border-4 border-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 lg:p-16">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8 group-hover:scale-105 transition-transform duration-300">
                LESSONS FOR STUDENTS
              </h1>
              
              <div className="text-white/90 text-lg md:text-xl lg:text-2xl space-y-4 mb-8 max-w-lg">
                <p className="font-medium">Professional Guitar Instruction</p>
                <p>• Music Theory</p>
                <p>• Blues Techniques</p>
                <p>• Improvisation Skills</p>
                <p>• Guitar Fundamentals</p>
                <p>• Personalized Learning</p>
              </div>
              
              <div className="inline-flex items-center px-8 py-4 bg-brand-yellow-accent text-brand-orange-warm font-bold rounded-full group-hover:bg-white group-hover:text-brand-orange-warm transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                <span>Start Learning</span>
                <svg 
                  className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              
              <p className="text-white/70 text-sm mt-6 italic">
                Click to view approach, packages & pricing
              </p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;