/**
 * Social Proof Component
 *
 * Displays social media integration, testimonials, and performance metrics
 * Features: Instagram integration, performance statistics, client testimonials, and social media links
 */
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInstagramContent } from '@/hooks/useInstagramContent'
import { fadeInUp, staggerContainer } from '@/utils/animations'

interface SocialProofProps {
  variant?: 'compact' | 'full' | 'minimal'
  showInstagram?: boolean
  showStats?: boolean
  showTestimonials?: boolean
  className?: string
}

interface SocialStat {
  label: string
  value: string
  description: string
  icon: React.ReactNode
}

interface Testimonial {
  id: string
  content: string
  author: string
  role: string
  service: 'teaching' | 'performance' | 'collaboration'
  rating: number
}

/**
 * Social Statistics Data
 */
const SOCIAL_STATS: SocialStat[] = [
  {
    label: 'Instagram Followers',
    value: '2.5K+',
    description: 'Active music community',
    icon: (
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Performances',
    value: '200+',
    description: 'Live shows completed',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
  },
  {
    label: 'Students Taught',
    value: '150+',
    description: 'Successful guitar journeys',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    label: 'Years Experience',
    value: '8+',
    description: 'Professional music career',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
]

/**
 * Sample Testimonials Data
 */
const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    content:
      "Rrish's performance at our wedding was absolutely perfect. His acoustic style created such a beautiful atmosphere for our special day.",
    author: 'Sarah & Michael Chen',
    role: 'Wedding Clients',
    service: 'performance',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    content:
      'Learning guitar with Rrish has been an incredible journey. His teaching style is patient, encouraging, and really effective.',
    author: 'Emma Rodriguez',
    role: 'Guitar Student',
    service: 'teaching',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    content:
      'Working with Rrish on our album project was seamless. His musicality and collaborative spirit really enhanced our sound.',
    author: 'The Moonlight Collective',
    role: 'Band Collaboration',
    service: 'collaboration',
    rating: 5,
  },
  {
    id: 'testimonial-4',
    content:
      'The perfect choice for corporate entertainment. Professional, engaging, and created exactly the atmosphere we wanted.',
    author: 'David Kim',
    role: 'Event Coordinator',
    service: 'performance',
    rating: 5,
  },
]

/**
 * Star Rating Component
 */
const StarRating: React.FC<{ rating: number; className?: string }> = ({
  rating,
  className = '',
}) => (
  <div className={`flex items-center space-x-1 ${className}`}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

/**
 * Individual Testimonial Component
 */
const TestimonialCard: React.FC<{
  testimonial: Testimonial
  index: number
}> = ({ testimonial, index }) => (
  <motion.div
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full"
    variants={fadeInUp}
    custom={index}
  >
    <StarRating rating={testimonial.rating} className="mb-4" />
    <blockquote className="text-neutral-charcoal/80 leading-relaxed mb-4">
      "{testimonial.content}"
    </blockquote>
    <div className="flex items-center justify-between">
      <div>
        <cite className="text-sm font-medium text-neutral-charcoal not-italic">
          {testimonial.author}
        </cite>
        <p className="text-xs text-neutral-charcoal/60 mt-1">
          {testimonial.role}
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            testimonial.service === 'teaching'
              ? 'bg-green-100 text-green-700'
              : testimonial.service === 'performance'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
          }`}
        >
          {testimonial.service}
        </span>
      </div>
    </div>
  </motion.div>
)

/**
 * Social Stats Component
 */
const SocialStats: React.FC = () => (
  <motion.div
    className="grid grid-cols-2 md:grid-cols-4 gap-6"
    variants={staggerContainer}
  >
    {SOCIAL_STATS.map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center group"
        variants={fadeInUp}
        custom={index}
      >
        <div className="w-12 h-12 bg-brand-blue-primary/10 text-brand-blue-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-blue-primary group-hover:text-white transition-all duration-300">
          {stat.icon}
        </div>
        <div className="text-2xl md:text-3xl font-heading font-bold text-neutral-charcoal mb-1">
          {stat.value}
        </div>
        <div className="text-sm font-medium text-neutral-charcoal/80 mb-1">
          {stat.label}
        </div>
        <div className="text-xs text-neutral-charcoal/60">
          {stat.description}
        </div>
      </motion.div>
    ))}
  </motion.div>
)

/**
 * Instagram Mini Feed Component
 */
const InstagramMiniSocial: React.FC = () => {
  const { posts, loading, error } = useInstagramContent({ limit: 3 })

  if (loading || error || posts.length === 0) {
    return null
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-neutral-charcoal">
          Latest from Instagram
        </h3>
        <a
          href="https://instagram.com/rrishmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand-blue-primary hover:text-brand-blue-secondary font-medium"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {posts.slice(0, 3).map(post => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={
                post.media_type === 'VIDEO'
                  ? post.thumbnail_url || post.media_url
                  : post.media_url
              }
              alt={
                post.caption
                  ? `Instagram post: ${post.caption.substring(0, 50)}...`
                  : 'Instagram post'
              }
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </a>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href="https://instagram.com/rrishmusic"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Follow
        </a>
      </div>
    </motion.div>
  )
}

/**
 * Main Social Proof Component
 */
export const SocialProof: React.FC<SocialProofProps> = ({
  variant = 'full',
  showInstagram = true,
  showStats = true,
  showTestimonials = true,
  className = '',
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Auto-rotate testimonials for compact variant
  useEffect(() => {
    if (variant === 'compact' && showTestimonials) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [variant, showTestimonials])

  if (variant === 'minimal') {
    return (
      <div className={`py-8 ${className}`}>
        <motion.div
          className="flex items-center justify-center space-x-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center" variants={fadeInUp}>
            <div className="text-2xl font-heading font-bold text-neutral-charcoal mb-1">
              200+
            </div>
            <div className="text-sm text-neutral-charcoal/60">Performances</div>
          </motion.div>

          <motion.div className="text-center" variants={fadeInUp}>
            <div className="text-2xl font-heading font-bold text-neutral-charcoal mb-1">
              150+
            </div>
            <div className="text-sm text-neutral-charcoal/60">Students</div>
          </motion.div>

          <motion.div className="text-center" variants={fadeInUp}>
            <div className="text-2xl font-heading font-bold text-neutral-charcoal mb-1">
              2.5K+
            </div>
            <div className="text-sm text-neutral-charcoal/60">Followers</div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`py-12 ${className}`}>
        <div className="container-custom">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Stats */}
            {showStats && (
              <motion.div variants={fadeInUp}>
                <SocialStats />
              </motion.div>
            )}

            {/* Instagram or Testimonial */}
            {showInstagram && showTestimonials ? (
              <motion.div variants={fadeInUp}>
                <InstagramMiniSocial />
              </motion.div>
            ) : showTestimonials ? (
              <motion.div variants={fadeInUp}>
                <TestimonialCard
                  testimonial={TESTIMONIALS[activeTestimonial]}
                  index={activeTestimonial}
                />
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`py-16 lg:py-24 bg-gray-50 ${className}`}
      aria-labelledby="social-proof-title"
    >
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2
              id="social-proof-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-neutral-charcoal mb-6"
            >
              Trusted by Music Lovers
            </h2>
            <p className="text-lg sm:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              Join a community that values authentic musical experiences,
              quality education, and collaborative creativity.
            </p>
          </motion.div>

          {/* Stats Section */}
          {showStats && (
            <motion.div className="mb-16" variants={fadeInUp}>
              <SocialStats />
            </motion.div>
          )}

          {/* Testimonials Section */}
          {showTestimonials && (
            <motion.div className="mb-16" variants={fadeInUp}>
              <h3 className="text-2xl font-heading font-bold text-neutral-charcoal text-center mb-12">
                What People Are Saying
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {TESTIMONIALS.slice(0, 4).map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Instagram Section */}
          {showInstagram && (
            <motion.div variants={fadeInUp}>
              <InstagramMiniSocial />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default SocialProof
