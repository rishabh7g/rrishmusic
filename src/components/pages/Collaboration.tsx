/**
 * Collaboration Page Component
 * 
 * Dedicated page for creative collaboration services including project partnerships,
 * recording collaborations, and long-term creative relationships.
 * 
 * Includes cross-service suggestions for teaching and performance services.
 * 
 * Features:
 * - Service-specific hero section
 * - Portfolio showcase with Instagram integration
 * - Clear collaboration process workflow
 * - Cross-service discovery suggestions
 * - Professional CTA for project inquiries
 */

import React from 'react';
import { SEOHead } from '@/components/common/SEOHead';
import { usePageSEO } from '@/hooks/usePageSEO';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { CollaborationHero } from '@/components/sections/CollaborationHero';
import { CollaborationPortfolio } from '@/components/sections/CollaborationPortfolio';
import { CollaborationProcess } from '@/components/sections/CollaborationProcess';
import { CollaborationCTA } from '@/components/sections/CollaborationCTA';
import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion';

interface CollaborationPageProps {
  className?: string;
}

/**
 * Collaboration Page Component
 */
export const Collaboration: React.FC<CollaborationPageProps> = ({ 
  className = '' 
}) => {
  const seo = usePageSEO('collaboration');

  return (
    <div className={`collaboration-page min-h-screen bg-white ${className}`}>
      <SEOHead
        title={seo.title || 'Creative Collaboration | Rrish Music'}
        description={seo.description || 'Partner with Rrish on creative musical projects, recordings, and artistic collaborations. Professional guitar collaboration services in Melbourne.'}
        keywords={seo.keywords || 'music collaboration, creative projects, recording partnerships, guitar collaboration, Melbourne'}
        canonical={seo.canonical || 'https://www.rrishmusic.com/collaboration'}
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Creative Collaboration Services",
          "provider": {
            "@type": "Person",
            "name": "Rrish",
            "description": "Professional guitarist offering creative collaboration services"
          },
          "description": "Creative musical collaboration and project partnership services",
          "areaServed": "Melbourne, Australia"
        }}
      />
      
      <ErrorBoundary>
        {/* Hero Section - Collaboration focus with creative messaging */}
        <CollaborationHero />
        
        {/* Portfolio Section - Instagram collaboration content integration */}
        <CollaborationPortfolio />
        
        {/* Cross-Service Suggestion - Teaching Skills */}
        <section className="py-8">
          <div className="container-custom">
            <CrossServiceSuggestion
              fromService="collaboration"
              pageSection="requirements"
              placement="inline"
              timing="after-engagement"
              minTimeOnPage={25}
              minScrollPercentage={40}
              className="mb-8"
            />
          </div>
        </section>
        
        {/* Process Section - Brief → Scope → Execution workflow */}
        <CollaborationProcess />
        
        {/* Cross-Service Suggestion - Performance Showcase */}
        <section className="py-8">
          <div className="container-custom">
            <CrossServiceSuggestion
              fromService="collaboration"
              pageSection="project-examples"
              placement="banner"
              timing="after-engagement"
              minTimeOnPage={40}
              minScrollPercentage={60}
              className="max-w-4xl mx-auto"
            />
          </div>
        </section>
        
        {/* CTA Section - Start Creative Project with appropriate routing */}
        <CollaborationCTA />
      </ErrorBoundary>
    </div>
  );
};

export default Collaboration;