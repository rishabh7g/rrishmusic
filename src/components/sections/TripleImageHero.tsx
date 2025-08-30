import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface TripleImageHeroProps {
  className?: string
}

export function TripleImageHero({ className = '' }: TripleImageHeroProps) {
  const [imagesLoaded, setImagesLoaded] = useState({
    left: false,
    center: false,
    right: false,
  })

  const handleImageLoad = (position: 'left' | 'center' | 'right') => {
    setImagesLoaded(prev => ({ ...prev, [position]: true }))
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const imageAnimation = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const overlayAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const images = {
    left: {
      src: '/images/instagram/portrait/Rrish_Pop up park-Point Cook 1.jpg',
      alt: 'Rrish performing at Pop Up Park in Point Cook',
    },
    center: {
      src: '/images/instagram/portrait/Rrish_Lunar day night event.jpg',
      alt: 'Rrish performing at Lunar Day Night Event',
    },
    right: {
      src: '/images/instagram/portrait/Rrish_Pop up park-Point Cook.jpg',
      alt: 'Rrish at Pop Up Park Point Cook performance',
    },
  }

  return (
    <motion.section
      className={`relative min-h-screen bg-theme-bg overflow-hidden ${className}`}
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
    >
      {/* Image Grid Container */}
      <div className="absolute inset-0">
        <div className="grid grid-cols-4 h-full">
          {/* Left Image - 25% */}
          <motion.div
            className="relative col-span-1 h-full"
            variants={imageAnimation}
          >
            <div className="relative h-full overflow-hidden group">
              {/* Loading skeleton */}
              {!imagesLoaded.left && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}

              <img
                src={images.left.src}
                alt={images.left.alt}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.left ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad('left')}
              />

              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          </motion.div>

          {/* Center Image - 50% (Prominent) */}
          <motion.div
            className="relative col-span-2 h-full"
            variants={imageAnimation}
          >
            <div className="relative h-full overflow-hidden group">
              {/* Loading skeleton */}
              {!imagesLoaded.center && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}

              <img
                src={images.center.src}
                alt={images.center.alt}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.center ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                onLoad={() => handleImageLoad('center')}
              />

              {/* Text Overlay on Center Image */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

              <motion.div
                className="absolute inset-0 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-8"
                variants={overlayAnimation}
              >
                <h1 className="text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 drop-shadow-2xl">
                  Rrish Music
                </h1>
                <p className="text-xs sm:text-sm md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-8 max-w-2xl font-medium drop-shadow-lg">
                  Live Performances • Music Lessons • Collaborations
                </p>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <motion.a
                    href="/gallery"
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Watch Performances
                  </motion.a>
                  <motion.a
                    href="/lessons"
                    className="bg-theme-primary/80 backdrop-blur-sm border border-theme-primary/50 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full font-semibold hover:bg-theme-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Learning
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image - 25% */}
          <motion.div
            className="relative col-span-1 h-full"
            variants={imageAnimation}
          >
            <div className="relative h-full overflow-hidden group">
              {/* Loading skeleton */}
              {!imagesLoaded.right && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              )}

              <img
                src={images.right.src}
                alt={images.right.alt}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.right ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => handleImageLoad('right')}
              />

              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          </motion.div>
        </div>
      </div>


      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-1 h-2 bg-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>

      {/* Accessibility: Screen reader content */}
      <div className="sr-only">
        <h1>
          Rrish Music - Live Performances, Music Lessons, and Collaborations
        </h1>
        <p>
          Professional musician offering live piano performances, personalized
          music lessons, and collaborative projects
        </p>
      </div>
    </motion.section>
  )
}

export default TripleImageHero
