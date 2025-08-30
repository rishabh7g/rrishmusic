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

import React from 'react'
import { SEOHead } from '@/components/common/SEOHead'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { CollaborationHero } from '@/components/sections/CollaborationHero'
import { CollaborationPortfolio } from '@/components/sections/CollaborationPortfolio'
import { CollaborationProcess } from '@/components/sections/CollaborationProcess'
import { CollaborationCTA } from '@/components/sections/CollaborationCTA'
// import { CrossServiceSuggestion } from '@/components/ui/CrossServiceSuggestion' // Component not implemented yet

interface CollaborationPageProps {
  className?: string
}

/**
 * Collaboration Page Component
 */
export const Collaboration: React.FC<CollaborationPageProps> = ({
  className = '',
}) => {
  return (
    <>
      <SEOHead
        title="Creative Collaboration | Professional Music Projects Melbourne | Rrish Music"
        description="Partner with Rrish on creative musical projects, recordings, and artistic collaborations. Professional guitar collaboration services in Melbourne."
        keywords="music collaboration, creative projects, recording partnerships, guitar collaboration, Melbourne musician, artistic collaboration"
        canonical="https://www.rrishmusic.com/collaboration"
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Creative Collaboration Services',
          provider: {
            '@type': 'Person',
            name: 'Rrish',
            description:
              'Professional guitarist offering creative collaboration services',
          },
          description:
            'Creative musical collaboration and project partnership services',
          areaServed: 'Melbourne, Australia',
        }}
      />

      <div
        className={`collaboration-page min-h-screen relative ${className}`}
        style={{
          backgroundImage: 'url(/images/instagram/band/XBand 3.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 transition-theme-colors" />

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          <ErrorBoundary>
            {/* Hero Section - Collaboration focus with creative messaging */}
            <CollaborationHero />

            {/* Portfolio Section - Instagram collaboration content integration */}
            <CollaborationPortfolio />

            {/* Cross-Service Suggestion - Teaching Skills (Component not implemented yet) */}

            {/* Process Section - Brief → Scope → Execution workflow */}
            <CollaborationProcess />

            {/* Cross-Service Suggestion - Performance Showcase (Component not implemented yet) */}

            {/* CTA Section - Start Creative Project with appropriate routing */}
            <CollaborationCTA />
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}

export default Collaboration
