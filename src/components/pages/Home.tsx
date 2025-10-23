import React from 'react'
import SEOHead from '@/components/common/SEOHead'
import { TripleImageHero } from '@/components/sections/TripleImageHero'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import { Lessons } from '@/components/sections/Lessons'
import { Contact } from '@/components/sections/Contact'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { LazySection } from '@/components/common/LazySection'
import siteConfig from '@/content/site-config.json'

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
  return (
    <>
      <SEOHead
        title={siteConfig.seo.title}
        description={siteConfig.seo.description}
        keywords={siteConfig.seo.keywords}
        canonical={siteConfig.branding.website}
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: siteConfig.branding.name,
          description: siteConfig.branding.description,
          url: siteConfig.branding.website,
          areaServed: 'Melbourne, Australia',
          educator: {
            '@type': 'Person',
            name: 'Rrish',
            jobTitle: 'Music Teacher',
          },
          offers: {
            '@type': 'Offer',
            name: 'Guitar Lessons & Music Theory',
            description:
              'Personalized one-on-one guitar and music theory instruction for all skill levels',
            category: 'Music Education',
          },
        }}
      />

      <main
        id="main-content"
        className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors"
      >
        {/* Hero Section */}
        <ErrorBoundary fallback={<div>Error loading hero section</div>}>
          <TripleImageHero />
        </ErrorBoundary>

        {/* Behind-the-scenes section (Instagram feed) */}
        <div className="py-12 md:py-16">
          <ErrorBoundary fallback={<div>Error loading behind-the-scenes</div>}>
            <LazySection
              fallback={<SectionFallback sectionName="Behind the Scenes" />}
            >
              <InstagramFeed />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* Lessons section */}
        <div className="py-12 md:py-16">
          <ErrorBoundary fallback={<div>Error loading lessons</div>}>
            <LazySection fallback={<SectionFallback sectionName="Lessons" />}>
              <Lessons />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* Student testimonials section */}
        <div className="py-12 md:py-16">
          <ErrorBoundary fallback={<div>Error loading testimonials</div>}>
            <LazySection
              fallback={<SectionFallback sectionName="Testimonials" />}
            >
              <TestimonialsSection />
            </LazySection>
          </ErrorBoundary>
        </div>

        {/* Contact CTA section */}
        <div className="py-12 md:py-16">
          <ErrorBoundary fallback={<div>Error loading contact section</div>}>
            <LazySection fallback={<SectionFallback sectionName="Contact" />}>
              <Contact />
            </LazySection>
          </ErrorBoundary>
        </div>
      </main>
    </>
  )
}
