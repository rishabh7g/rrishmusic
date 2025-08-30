import React, { useMemo } from 'react'
import SEOHead from '@/components/common/SEOHead'
import { TripleImageHero } from '@/components/sections/TripleImageHero'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import { PortfolioHighlights } from '@/components/sections/PortfolioHighlights'
import { CollaborationProcess } from '@/components/sections/CollaborationProcess'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import { Lessons } from '@/components/sections/Lessons'
import { Contact } from '@/components/sections/Contact'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { LazySection } from '@/components/common/LazySection'
import useMultiServiceTestimonials from '@/hooks/useMultiServiceTestimonials'
import PerformanceInquiryForm, {
  PerformanceInquiryData,
} from '@/components/forms/PerformanceInquiryForm'

/**
 * Section fallback component
 */
const SectionFallback: React.FC<{ sectionName: string }> = ({
  sectionName,
}) => (
  <div className="min-h-[50vh] flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-brand-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading {sectionName} section...</p>
    </div>
  </div>
)

export function Home() {
  // Load testimonials with performance focus
  const { getTestimonialsByService } = useMultiServiceTestimonials()

  // Get performance testimonials to check if section should be shown
  const performanceTestimonials = useMemo(() => {
    return getTestimonialsByService('performance')
  }, [getTestimonialsByService])

  // Form state management
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const handleFormSubmit = async (data: PerformanceInquiryData) => {
    console.log('Performance inquiry submission:', data)
    // TODO: Implement actual form submission logic
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <>
      <SEOHead
        title="Rrish Music - Live Performances, Music Lessons & Studio Collaborations | Professional Guitarist Melbourne"
        description="Professional musician offering live performances, music lessons, and studio collaborations in Melbourne. Experience blues guitar performances, learn piano and music theory, or collaborate on creative projects."
        keywords="Melbourne musician, live performances, music lessons, piano teacher, guitar lessons, blues music, studio collaboration, corporate entertainment, wedding music, music theory, improvisation"
        canonical="https://www.rrishmusic.com"
        ogType="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': ['MusicGroup', 'EducationalOrganization'],
          name: 'Rrish Music',
          description:
            'Professional musician offering live performances, music lessons, and studio collaborations',
          url: 'https://www.rrishmusic.com',
          areaServed: 'Melbourne, Australia',
          performer: {
            '@type': 'Person',
            name: 'Rrish',
            jobTitle: 'Professional Musician',
          },
          offers: [
            {
              '@type': 'Offer',
              name: 'Live Music Performances',
              description:
                'Professional blues guitar performances for events and venues',
            },
            {
              '@type': 'Offer',
              name: 'Music Lessons',
              description: 'Piano, guitar, and music theory instruction',
            },
            {
              '@type': 'Offer',
              name: 'Studio Collaborations',
              description: 'Creative partnerships and recording projects',
            },
          ],
        }}
      />
      
      <main
        id="main-content"
        className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      >
        {/* Triple Image Hero Section - 25% Left, 50% Center, 25% Right */}
        <ErrorBoundary fallback={<div>Error loading hero section</div>}>
          <TripleImageHero />
        </ErrorBoundary>

        {/* 1. Behind-the-scenes section (Instagram feed) */}
        <div className="py-16 md:py-20">
          <ErrorBoundary fallback={<div>Error loading behind-the-scenes</div>}>
            <LazySection fallback={<SectionFallback sectionName="Behind the Scenes" />}>
              <InstagramFeed />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* 2. Portfolio highlights section */}
        <div className="py-16 md:py-20">
          <ErrorBoundary fallback={<div>Error loading portfolio highlights</div>}>
            <LazySection fallback={<SectionFallback sectionName="Portfolio Highlights" />}>
              <PortfolioHighlights />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* 3. What clients say section (testimonials) */}
        {performanceTestimonials && performanceTestimonials.length > 0 && (
          <div className="py-16 md:py-20">
            <ErrorBoundary fallback={<div>Error loading testimonials</div>}>
              <LazySection fallback={<SectionFallback sectionName="Testimonials" />}>
                <TestimonialsSection />
              </LazySection>
            </ErrorBoundary>
          </div>
        )}

        {/* 4. Collaboration process section */}
        <div className="py-16 md:py-20">
          <ErrorBoundary fallback={<div>Error loading collaboration process</div>}>
            <LazySection fallback={<SectionFallback sectionName="Collaboration Process" />}>
              <CollaborationProcess />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* 5. Ready to work together section (contact CTA) */}
        <div className="py-16 md:py-20">
          <ErrorBoundary fallback={<div>Error loading contact section</div>}>
            <LazySection fallback={<SectionFallback sectionName="Contact" />}>
              <Contact />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* Performance Inquiry Form Modal */}
        <PerformanceInquiryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </main>
    </>
  )
}