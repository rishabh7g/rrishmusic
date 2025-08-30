import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '@/components/common/SEOHead'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import { PortfolioHighlights } from '@/components/sections/PortfolioHighlights'
import { CollaborationProcess } from '@/components/sections/CollaborationProcess'
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

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const boxAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
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
        className="min-h-screen bg-theme-bg text-theme-text transition-theme-colors relative"
        style={{
          backgroundImage: 'url(/images/instagram/portrait/My portrait 1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 transition-theme-colors" />

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          <motion.div
            className="container mx-auto max-w-7xl p-4"
            variants={containerAnimation}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.div
              className="text-center mb-8 pt-8"
              variants={boxAnimation}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Rrish Music
              </h1>
            </motion.div>

            {/* Two Visual Service Boxes */}
            <div className="grid md:grid-cols-2 gap-8 h-auto md:h-[400px] mb-16">
              {/* Performances Box - Visual Focus */}
              <motion.div variants={boxAnimation}>
                <Link to="/performance" className="group block h-full">
                  <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 opacity-90"></div>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                      style={{
                        backgroundImage:
                          'url(/images/services/performance-bg.webp)',
                      }}
                    ></div>
                    {/* Content Overlay */}
                    <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-16 h-16 text-white drop-shadow-lg"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                        Performances
                      </h2>
                      <p className="text-lg opacity-90 mb-6 max-w-xs">
                        Live shows & studio collaborations
                      </p>
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-semibold group-hover:bg-white/30 transition-all duration-300">
                        Watch & Listen
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Lessons Box - Visual Focus */}
              <motion.div variants={boxAnimation}>
                <Link to="/lessons" className="group block h-full">
                  <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-teal-600 to-green-700 opacity-90"></div>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                      style={{
                        backgroundImage:
                          'url(/images/services/teaching-bg.webp)',
                      }}
                    ></div>
                    {/* Content Overlay */}
                    <div className="relative h-full flex flex-col justify-center items-center text-center p-8 text-white">
                      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-16 h-16 text-white drop-shadow-lg"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                        Lessons
                      </h2>
                      <p className="text-lg opacity-90 mb-6 max-w-xs">
                        Learn piano & music theory
                      </p>
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-semibold group-hover:bg-white/30 transition-all duration-300">
                        Start Learning
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 1. Behind-the-scenes section (Instagram feed) */}
      <section
        id="instagram-primary"
        className="py-16 bg-theme-bg transition-theme-colors"
      >
        <ErrorBoundary fallback={<SectionFallback sectionName="Instagram" />}>
          <LazySection
            fallback={<SectionFallback sectionName="Instagram" />}
            rootMargin="200px"
          >
            <div className="container mx-auto max-w-7xl p-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                  Behind The Scenes
                </h2>
                <p className="text-lg text-theme-text-secondary transition-theme-colors">
                  Live performances and behind-the-scenes moments
                </p>
              </div>
              <InstagramFeed
                limit={6}
                showHeader={false}
                className="mb-8"
                useEnhancedHook={true}
                showFollowButton={false}
              />
              {/* Follow on Instagram Button */}
              <div className="text-center mt-12">
                <a
                  href="https://www.instagram.com/rrishmusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Follow on Instagram
                </a>
              </div>
            </div>
          </LazySection>
        </ErrorBoundary>
      </section>

      {/* 2. Portfolio highlights section (PortfolioHighlights) */}
      <section
        id="performance-gallery"
        className="py-16 bg-theme-bg-secondary transition-theme-colors"
      >
        <ErrorBoundary
          fallback={<SectionFallback sectionName="Performance Gallery" />}
        >
          <LazySection
            fallback={<SectionFallback sectionName="Performance Gallery" />}
            rootMargin="200px"
          >
            <div className="container mx-auto max-w-7xl p-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                  Portfolio Highlights
                </h2>
              </div>
              <PortfolioHighlights />
            </div>
          </LazySection>
        </ErrorBoundary>
      </section>

      {/* 3. What clients say section (testimonials) */}
      {performanceTestimonials.length > 0 && (
        <section
          id="testimonials"
          className="py-16 bg-theme-bg transition-theme-colors"
        >
          <div className="container mx-auto max-w-7xl p-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                What Clients Say
              </h2>
            </div>
            {/* Dynamic testimonial cards from actual data */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {performanceTestimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-theme-bg-secondary rounded-xl p-6 shadow-sm transition-theme-colors"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${
                        index === 0
                          ? 'from-orange-400 to-red-500'
                          : index === 1
                            ? 'from-blue-400 to-purple-500'
                            : 'from-green-400 to-teal-500'
                      } rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-theme-text transition-theme-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-theme-text-secondary transition-theme-colors">
                        {testimonial.event || testimonial.serviceSubType}
                      </p>
                    </div>
                  </div>
                  <p className="text-theme-text-secondary transition-theme-colors">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Behind-the-scenes section (repeat) */}
      <section
        id="instagram-secondary"
        className="py-16 bg-theme-bg-secondary transition-theme-colors"
      >
        <ErrorBoundary fallback={<SectionFallback sectionName="Instagram" />}>
          <LazySection
            fallback={<SectionFallback sectionName="Instagram" />}
            rootMargin="200px"
          >
            <div className="container mx-auto max-w-7xl p-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4 transition-theme-colors">
                  Behind The Scenes
                </h2>
                <p className="text-lg text-theme-text-secondary transition-theme-colors">
                  More moments from performances and practice sessions
                </p>
              </div>
              <InstagramFeed
                limit={6}
                showHeader={false}
                className="mb-8"
                useEnhancedHook={true}
                showFollowButton={false}
                offset={6} // Show different images on repeat
              />
            </div>
          </LazySection>
        </ErrorBoundary>
      </section>

      {/* 5. Collaboration process section */}
      <section
        id="collaboration-process"
        className="py-16 bg-theme-bg transition-theme-colors"
      >
        <ErrorBoundary
          fallback={<SectionFallback sectionName="Collaboration Process" />}
        >
          <LazySection
            fallback={<SectionFallback sectionName="Collaboration Process" />}
            rootMargin="200px"
          >
            <CollaborationProcess />
          </LazySection>
        </ErrorBoundary>
      </section>

      {/* 6. Learn from a performing professional section (teaching CTA) */}
      <section className="py-16 bg-theme-bg-tertiary transition-theme-colors">
        <div className="container mx-auto max-w-7xl p-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading font-bold text-theme-text mb-4 transition-theme-colors">
              Learn From A Performing Professional
            </h3>
            <p className="text-lg text-theme-text-secondary max-w-3xl mx-auto transition-theme-colors">
              Many performance and collaboration clients also discover the value
              of learning directly from a working musician.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-theme-bg rounded-xl p-8 shadow-sm border border-theme-border transition-theme-colors">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-theme-secondary/20 rounded-full flex items-center justify-center mr-6">
                  <svg
                    className="w-8 h-8 text-theme-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-heading font-semibold text-theme-text mb-2 transition-theme-colors">
                    Music Lessons
                  </h4>
                  <p className="text-theme-text-secondary transition-theme-colors">
                    Learn piano, guitar, improvisation, and music theory
                  </p>
                </div>
              </div>
              <p className="text-theme-text-secondary mb-6 transition-theme-colors">
                "Taking lessons with Rrish after hearing him perform was the
                best decision. His real-world experience and performance
                insights make all the difference in my playing." - Alex M.
              </p>
              <Link
                to="/lessons"
                className="inline-flex items-center bg-theme-secondary text-white px-6 py-3 rounded-full hover:bg-theme-secondary-hover transition-colors duration-300 font-semibold"
              >
                Explore Music Lessons
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Ready to work together section (contact CTA) */}
      <section className="py-16 bg-gradient-to-r from-theme-primary to-theme-secondary text-white">
        <div className="container mx-auto max-w-7xl p-4 text-center">
          <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to Work Together?
          </h3>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Whether you need live performance for your event or want to
            collaborate on a creative project, let's discuss how we can create
            something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-white/90 backdrop-blur-sm text-theme-primary
              font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl 
              transform hover:-translate-y-1"
            >
              Get Started
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <Link
              to="/collaboration"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white/80 text-white
              font-bold rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300
              transform hover:-translate-y-1"
            >
              View Portfolio
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Performance Inquiry Form Modal */}
      <PerformanceInquiryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </>
  )
}

export default Home
