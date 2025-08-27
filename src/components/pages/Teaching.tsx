import React, { useEffect } from 'react';
import { ServicePageLayout } from '@/components/ServicePageLayout';
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
    <ServicePageLayout
      title="Guitar Lessons & Music Theory | Professional Guitar Teaching | Rrish Music"
      description="Professional guitar lessons in Melbourne specializing in blues, improvisation, and music theory. Personalized instruction for all skill levels with flexible packages and expert guidance."
      serviceName="Guitar Teaching Services"
      breadcrumbLabel="Guitar Lessons"
      className={className}
    >
      {/* Teaching Hero Section - Using Lessons component */}
      <section className="hero-section bg-gradient-to-br from-brand-orange-warm via-brand-orange-light to-brand-orange-warm text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Professional Guitar Lessons
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-orange-100">
              Master the guitar with personalized instruction tailored to your musical goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-white text-brand-orange-warm hover:bg-orange-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                Start Your Musical Journey
              </button>
              <button 
                onClick={() => document.getElementById('lessons')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white hover:bg-white hover:text-brand-orange-warm font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                View Lesson Packages
              </button>
            </div>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center space-x-2 text-lg">
                <svg className="w-6 h-6 text-brand-yellow-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>All Skill Levels</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <svg className="w-6 h-6 text-brand-yellow-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Flexible Packages</span>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <svg className="w-6 h-6 text-brand-yellow-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert Instruction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Packages Section */}
      <Lessons />

      {/* Teaching Approach Section */}
      <Approach />

      {/* About Section - Teaching focused */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-charcoal mb-4">
                About Your Instructor
              </h2>
              <div className="w-24 h-1 bg-brand-orange-warm mx-auto rounded-full"></div>
            </div>
            <About />
          </div>
        </div>
      </section>

      {/* Cross-Service Navigation Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-charcoal mb-4">
                Expand Your Musical Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Start Learning?
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Take the first step in your musical journey. Get in touch to discuss your goals and find the perfect lesson approach for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-white text-theme-secondary
                font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl 
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
                font-semibold rounded-full hover:bg-white hover:text-theme-secondary transition-all duration-300"
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
    </ServicePageLayout>
  );
};

export default Teaching;