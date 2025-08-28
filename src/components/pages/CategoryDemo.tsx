import React, { useState } from 'react'
import { CategoryNavigation } from '@/components/CategoryNavigation'
import { CategoryItem } from '@/hooks/useScrollSpy'
import { SEOHead } from '@/components/common/SEOHead'
import '@/styles/categoryNavigation.css'

/**
 * Category Navigation Demo Page
 *
 * Demonstrates the sophisticated single-page category navigation system
 * with different service sections and smooth scrolling functionality.
 */
export const CategoryDemo: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('performances')

  // Define categories with corresponding sections
  const categories: CategoryItem[] = [
    {
      id: 'performances',
      label: 'Live Performances',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>',
      description:
        'Professional live music for venues, events, and private functions',
      sectionId: 'performance-section',
    },
    {
      id: 'lessons',
      label: 'Guitar Lessons',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
      description: 'Professional guitar instruction for all skill levels',
      sectionId: 'lessons-section',
    },
    {
      id: 'collaboration',
      label: 'Collaborations',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
      description: 'Creative partnerships and musical projects',
      sectionId: 'collaboration-section',
    },
    {
      id: 'about',
      label: 'About Rrish',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
      description: 'Learn about the artist and musical journey',
      sectionId: 'about-section',
    },
    {
      id: 'contact',
      label: 'Get In Touch',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      description: "Ready to work together? Let's connect",
      sectionId: 'contact-section',
    },
  ]

  return (
    <>
      <SEOHead
        title="Category Navigation Demo | Single-Page Service Navigation | Rrish Music"
        description="Experience smooth single-page navigation between different service categories with context-aware scrolling and mobile optimization."
        keywords="category navigation, single page navigation, smooth scrolling, service categories"
        canonical="https://www.rrishmusic.com/category-demo"
        ogType="website"
      />

      <div className="category-demo-page min-h-screen bg-gray-50">
        {/* Fixed Navigation Header */}
        <div className="sticky top-0 z-40 bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Single-Page Category Navigation System
              </h1>
              <p className="text-gray-600">
                Demonstration of sophisticated category switching with scroll
                position memory
              </p>
            </div>

            <CategoryNavigation
              categories={categories}
              variant="tabs"
              showDescriptions={false}
              showIndicators={true}
              showBreadcrumbs={true}
              onCategoryChange={setActiveCategory}
              className="max-w-4xl mx-auto"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4">
          {/* Performance Section */}
          <section id="performance-section" className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold">Live Performances</h2>
                </div>

                <p className="text-xl mb-8 opacity-90">
                  Professional live music performances for venues, private
                  events, and corporate functions throughout Melbourne.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Venue Entertainment
                    </h3>
                    <ul className="space-y-2 text-lg">
                      <li>• Blues & Jazz venues</li>
                      <li>• Restaurant entertainment</li>
                      <li>• Bar performances</li>
                      <li>• Festival appearances</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Private Events
                    </h3>
                    <ul className="space-y-2 text-lg">
                      <li>• Wedding ceremonies</li>
                      <li>• Corporate events</li>
                      <li>• Private parties</li>
                      <li>• Special occasions</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/10 rounded-xl">
                  <h3 className="text-2xl font-semibold mb-4">Session Work</h3>
                  <p className="text-lg mb-4">
                    Available for recording sessions, session work, and musical
                    collaborations.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white/20 px-4 py-2 rounded-full">
                      Studio Recording
                    </span>
                    <span className="bg-white/20 px-4 py-2 rounded-full">
                      Live Session Work
                    </span>
                    <span className="bg-white/20 px-4 py-2 rounded-full">
                      Musical Direction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lessons Section */}
          <section id="lessons-section" className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold">Guitar Lessons</h2>
                </div>

                <p className="text-xl mb-8 opacity-90">
                  Personalized guitar instruction focusing on blues techniques,
                  music theory, and creative expression.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-3">Beginner</h3>
                    <p className="mb-4">Fundamentals and basic techniques</p>
                    <ul className="space-y-1">
                      <li>• Chord progressions</li>
                      <li>• Basic scales</li>
                      <li>• Rhythm patterns</li>
                      <li>• Music reading</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-3">Intermediate</h3>
                    <p className="mb-4">Blues theory and improvisation</p>
                    <ul className="space-y-1">
                      <li>• Blues scales</li>
                      <li>• Lead techniques</li>
                      <li>• Song structure</li>
                      <li>• Performance skills</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-3">Advanced</h3>
                    <p className="mb-4">Professional development</p>
                    <ul className="space-y-1">
                      <li>• Advanced theory</li>
                      <li>• Style development</li>
                      <li>• Recording techniques</li>
                      <li>• Career guidance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Collaboration Section */}
          <section id="collaboration-section" className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold">
                    Creative Collaborations
                  </h2>
                </div>

                <p className="text-xl mb-8 opacity-90">
                  Partner with Rrish on creative musical projects, from
                  recording collaborations to long-term artistic partnerships.
                </p>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Recording Projects
                    </h3>
                    <p className="text-lg mb-4">
                      Collaborate on studio recordings, bringing blues guitar
                      expertise to your musical vision.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Album Recording
                      </span>
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Single Tracks
                      </span>
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Backing Tracks
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Artistic Partnerships
                    </h3>
                    <p className="text-lg mb-4">
                      Long-term creative relationships with other musicians,
                      producers, and artists.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Band Formation
                      </span>
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Songwriting
                      </span>
                      <span className="bg-white/20 px-4 py-2 rounded-full">
                        Live Projects
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about-section" className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold">About Rrish</h2>
                </div>

                <p className="text-xl mb-8 opacity-90">
                  Professional Melbourne-based guitarist with deep roots in
                  blues tradition and a passion for authentic musical
                  expression.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Musical Journey
                    </h3>
                    <p className="text-lg mb-4">
                      Years of dedication to blues guitar, studying the masters
                      while developing a unique voice.
                    </p>
                    <ul className="space-y-2">
                      <li>• Blues tradition foundation</li>
                      <li>• Melbourne music scene</li>
                      <li>• Continuous learning</li>
                      <li>• Authentic expression</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Teaching Philosophy
                    </h3>
                    <p className="text-lg mb-4">
                      Belief that every student has a unique musical voice
                      waiting to be discovered.
                    </p>
                    <ul className="space-y-2">
                      <li>• Personalized approach</li>
                      <li>• Technical excellence</li>
                      <li>• Creative expression</li>
                      <li>• Musical confidence</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact-section" className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-2xl p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold">Get In Touch</h2>
                </div>

                <p className="text-xl mb-8 opacity-90">
                  Ready to work together? Whether you need a performer, want to
                  learn guitar, or have a collaboration idea, let's connect.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Performance Booking
                    </h3>
                    <p className="text-lg mb-4">
                      Book live performances for your venue or event.
                    </p>
                    <button className="bg-brand-blue-primary text-white px-6 py-3 rounded-lg hover:bg-brand-blue-dark transition-colors">
                      Book Performance
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Guitar Lessons
                    </h3>
                    <p className="text-lg mb-4">
                      Start your guitar learning journey with professional
                      instruction.
                    </p>
                    <button className="bg-brand-orange-warm text-white px-6 py-3 rounded-lg hover:bg-brand-orange-light transition-colors">
                      Start Learning
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      Collaboration
                    </h3>
                    <p className="text-lg mb-4">
                      Discuss creative projects and artistic partnerships.
                    </p>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Collaborate
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/10 rounded-xl text-center">
                  <p className="text-lg mb-4">
                    Current active category: <strong>{activeCategory}</strong>
                  </p>
                  <p className="text-sm opacity-75">
                    This demonstration shows how the navigation system maintains
                    context and provides smooth transitions between service
                    categories.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Back to top button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-brand-blue-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <svg
              className="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default CategoryDemo
