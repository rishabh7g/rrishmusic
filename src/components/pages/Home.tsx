import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '@/components/common/SEOHead'
import { InstagramFeed } from '@/components/sections/InstagramFeed'

export function Home() {
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
        title="Rrish - Piano Performances & Music Lessons"
        description="Experience live piano performances and learn music with Rrish. Choose from professional performances or personalized music lessons."
        keywords="piano, music, performance, lessons, teaching, live music, blues, improvisation"
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
            {/* Minimal Heading */}
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

            {/* Instagram Feed Preview */}
            <motion.div className="mb-12" variants={boxAnimation}>
              <InstagramFeed
                limit={6}
                showHeader={false}
                className="mb-8"
                useEnhancedHook={true}
              />
              <div className="text-center">
                <a
                  href="https://instagram.com/rrishmusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-theme-text-secondary hover:text-theme-primary transition-colors"
                >
                  <span className="mr-2">Follow for more</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

export default Home
