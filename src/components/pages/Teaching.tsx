import React, { useEffect } from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { Lessons } from '@/components/sections/Lessons';
import { Approach } from '@/components/sections/Approach';
import { About } from '@/components/sections/About';
import { CrossServiceNavigation } from '@/components/CrossServiceNavigation';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Import universal inquiry form
import UniversalInquiryForm, { UniversalInquiryData } from '@/components/forms/UniversalInquiryForm';

/**
 * Props interface for Teaching page
 */
interface TeachingPageProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Teaching Page Component - Dedicated teaching services page
 * 
 * Features:
 * - ServicePageLayout with breadcrumb navigation
 * - Teaching-focused sections (Lessons, Approach, About, Contact)
 * - Cross-service navigation for related services
 * - SEO optimization for teaching services
 * - Performance monitoring
 * - Mobile-first responsive design
 */
export const Teaching: React.FC<TeachingPageProps> = ({ className = '' }) => {
  // Form state management
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleFormSubmit = async (data: UniversalInquiryData) => {
    console.log('Form submission:', data);
    // TODO: Implement actual form submission logic
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  useEffect(() => {
    // Mark teaching page as started for performance monitoring
    performanceMonitor.mark('teaching-page-render-start');
    
    return () => {
      performanceMonitor.measure('teaching-page-render-total');
    };
  }, []);

  return (
    <>
      <SEOHead
        title="Music Lessons & Music Theory | Professional Music Teaching | Rrish Music"
        description="Professional music lessons specializing in piano, theory, and improvisation. Personalized instruction for all skill levels with flexible packages and expert guidance."
        keywords="music lessons, piano lessons, music theory, improvisation, personalized instruction, music education"
        canonical="https://www.rrishmusic.com/lessons"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Music Teaching Services",
          "description": "Professional music lessons specializing in piano, theory, and improvisation",
          "provider": {
            "@type": "Person",
            "name": "Rrish",
            "url": "https://www.rrishmusic.com"
          },
          "url": "https://www.rrishmusic.com/lessons"
        }}
      />
      
      <main 
        className={`min-h-screen bg-theme-bg transition-theme-colors relative ${className}`}
        style={{
          backgroundImage: 'url(/images/instagram/portrait/My portrait 2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 transition-theme-colors" />
        
        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
      {/* Minimal Hero - Visual First */}
      <section className="py-12 bg-theme-bg/20 backdrop-blur-sm transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Music Lessons
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Learn piano, music theory, and improvisation
          </p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-theme-secondary text-white hover:bg-theme-secondary-hover font-semibold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
          >
            Start Learning
          </button>
        </div>
      </section>

      {/* Student Showcase - Instagram Style */}
      <section className="py-16 bg-theme-bg-secondary transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
              Student Progress
            </h2>
            <p className="text-lg text-theme-text-secondary transition-theme-colors">
              See what students are achieving in their lessons
            </p>
          </div>
          
          {/* Visual student progress grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-theme-bg rounded-xl overflow-hidden shadow-sm transition-theme-colors">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-sm">Beginner to Intermediate</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Sarah's Journey</h3>
                <p className="text-sm text-theme-text-secondary transition-theme-colors">From first keys to playing her favorite songs in 6 months</p>
              </div>
            </div>
            
            <div className="bg-theme-bg rounded-xl overflow-hidden shadow-sm transition-theme-colors">
              <div className="h-48 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <p className="text-sm">Music Theory</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Alex's Improvisation</h3>
                <p className="text-sm text-theme-text-secondary transition-theme-colors">Building confidence in jazz improvisation and composition</p>
              </div>
            </div>
            
            <div className="bg-theme-bg rounded-xl overflow-hidden shadow-sm transition-theme-colors">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                  <p className="text-sm">Advanced Techniques</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Maya's Performance</h3>
                <p className="text-sm text-theme-text-secondary transition-theme-colors">Preparing for recitals and advanced repertoire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Packages Section */}
      <Lessons />

      {/* Teaching Approach Section */}
      <Approach />

      {/* Teaching Approach - Visual */}
      <section className="py-16 bg-theme-bg transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
              Teaching Approach
            </h2>
          </div>
          
          {/* Visual teaching methods */}
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-theme-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Personalized Learning</h3>
                  <p className="text-theme-text-secondary transition-theme-colors">Every lesson adapted to your pace and musical interests</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-theme-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Practical Application</h3>
                  <p className="text-theme-text-secondary transition-theme-colors">Learn by playing songs you love from day one</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-theme-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-theme-text mb-2 transition-theme-colors">Theory & Creativity</h3>
                  <p className="text-theme-text-secondary transition-theme-colors">Build understanding while fostering musical creativity</p>
                </div>
              </div>
            </div>
            
            {/* Visual instructor profile */}
            <div className="bg-theme-bg-secondary rounded-2xl p-8 text-center transition-theme-colors">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-white text-4xl font-bold">R</div>
              </div>
              <h3 className="text-2xl font-bold text-theme-text mb-2 transition-theme-colors">Rrish</h3>
              <p className="text-theme-text-secondary mb-4 transition-theme-colors">Professional Musician & Educator</p>
              <div className="space-y-2 text-sm text-theme-text-secondary transition-theme-colors">
                <p>🎹 Piano & Theory Specialist</p>
                <p>🎸 Blues & Jazz Improvisation</p>
                <p>📚 10+ Years Teaching Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Service Navigation Section */}
      <section className="py-16 bg-theme-bg/30 backdrop-blur-sm transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 drop-shadow-lg">
                Expand Your Musical Journey
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
                Take your guitar skills to the next level by exploring our performance and collaboration opportunities.
              </p>
            </div>
            <CrossServiceNavigation 
              currentService="teaching"
              variant="card"
              maxRecommendations={2}
              showCrossServiceSuggestions={true}
            />
          </div>
        </div>
      </section>

      {/* Contact Section - Simple CTA */}
      <section className="py-16 bg-gradient-to-r from-theme-secondary to-theme-primary text-white">
        <div className="container mx-auto max-w-7xl p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Start Learning?
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the first step in your musical journey. Get in touch to discuss your goals and find the perfect lesson approach for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm text-theme-secondary
                font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl 
                transform hover:-translate-y-1"
            >
              Get Started
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="tel:+61XXX-XXX-XXX"
              className="inline-flex items-center px-8 py-4 bg-transparent border border-white text-white 
                font-semibold rounded-full hover:bg-white/90 hover:text-theme-secondary transition-all duration-300"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

        {/* Universal Inquiry Form */}
        <UniversalInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
        </div>
      </main>
    </>
  );
};

export default Teaching;