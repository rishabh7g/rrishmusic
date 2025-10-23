/**
 * Hero Block Component
 * Three-image hero layout with overlaid text and CTAs
 * Combines teaching-focused content with visual photography showcase
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { HeroSchema } from '@/lib/schemas'

type HeroProps = z.infer<typeof HeroSchema>

export function Hero({ headline, subhead, cta, pricing, images }: HeroProps) {
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
      },
    },
  }

  return (
    <motion.section
      className="relative min-h-[60vh] sm:min-h-screen bg-theme-bg overflow-hidden"
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
                className={`w-full h-full object-cover sm:object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.left ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  objectPosition: 'center 25%',
                }}
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
                className={`w-full h-full object-cover sm:object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.center ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  objectPosition: 'center 20%',
                }}
                loading="eager"
                onLoad={() => handleImageLoad('center')}
              />

              {/* Text Overlay on Center Image */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

              <motion.div
                className="absolute inset-0 flex flex-col justify-center items-center px-4"
                variants={overlayAnimation}
              >
                {/* Content Card */}
                <div className="bg-black/60 max-w-4xl w-full px-8 py-12 sm:px-12 sm:py-16 rounded-lg">
                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-center">
                    {headline}
                  </h1>

                  {/* Subhead */}
                  <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-8 text-center font-medium">
                    {subhead}
                  </p>

                  {/* CTA Button */}
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <motion.a
                      href={cta.href}
                      className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-brand-yellow-accent text-brand-blue-primary font-bold text-base sm:text-lg rounded-md hover:bg-white transition-colors duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {cta.label}
                    </motion.a>
                  </div>

                  {/* Price Line */}
                  {pricing?.show && pricing.secondary && (
                    <p className="text-center text-base sm:text-lg text-white/90 mb-0">
                      Then {pricing.secondary}
                    </p>
                  )}

                  {/* Fallback for inline/badge styles */}
                  {pricing?.show && pricing.style === 'inline' && (
                    <p className="text-xs sm:text-sm text-white/70 text-center mt-4">
                      {pricing.primary} • {pricing.secondary}
                    </p>
                  )}

                  {pricing?.show && pricing.style === 'badge' && (
                    <p className="text-xs sm:text-sm text-white/70 text-center mt-4">
                      {pricing.primary}
                    </p>
                  )}
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
                className={`w-full h-full object-cover sm:object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  imagesLoaded.right ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  objectPosition: 'center 30%',
                }}
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
        <h1>{headline}</h1>
        <p>{subhead}</p>
      </div>
    </motion.section>
  )
}
