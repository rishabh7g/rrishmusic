import React, { useEffect } from 'react';
import { ServicePageLayout } from '@/components/ServicePageLayout';
import { Lessons } from '@/components/sections/Lessons';
import { Approach } from '@/components/sections/Approach';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { performanceMonitor } from '@/utils/performanceMonitor';

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
 * - SEO optimization for teaching services
 * - Performance monitoring
 * - Mobile-first responsive design
 */
export const Teaching: React.FC<TeachingPageProps> = ({ className = '' }) => {
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
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
              Guitar Lessons for 
              <span className="block text-brand-yellow-accent">Every Skill Level</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional guitar instruction in Melbourne focusing on blues, music theory, 
              and improvisation. Personalized lessons that adapt to your musical goals and learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

      {/* Contact Section - Teaching focused */}
      <Contact />
    </ServicePageLayout>
  );
};

export default Teaching;