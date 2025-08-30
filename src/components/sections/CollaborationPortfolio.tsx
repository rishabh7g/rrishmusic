/**
 * Collaboration Portfolio Section Component
 *
 * Enhanced portfolio section showcasing collaboration examples and creative projects
 * with improved Instagram content integration, responsive gallery layout, and advanced filtering.
 *
 * Features:
 * - Enhanced Instagram collaboration content integration
 * - Creative project case studies with detailed information
 * - Behind-the-scenes content and process insights
 * - Responsive gallery layout with improved UX
 * - Advanced content categorization and filtering
 * - Lazy loading and performance optimization
 * - Accessibility improvements and keyboard navigation
 */
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'
import { InstagramFeed } from '@/components/sections/InstagramFeed'

interface CollaborationPortfolioProps {
  className?: string
}

/**
 * Enhanced portfolio categories for collaboration content
 */
const portfolioCategories = [
  {
    id: 'all',
    label: 'All Projects',
    count: 15,
    description: 'Complete portfolio of collaborative work',
  },
  {
    id: 'studio',
    label: 'Studio Collaborations',
    count: 6,
    description: 'Recording and production partnerships',
  },
  {
    id: 'creative',
    label: 'Creative Projects',
    count: 5,
    description: 'Artistic collaborations and original work',
  },
  {
    id: 'partnerships',
    label: 'Business Partnerships',
    count: 4,
    description: 'Ongoing professional relationships',
  },
]

/**
 * Enhanced collaboration projects with rich content
 */
const collaborationProjects = [
  {
    id: 1,
    title: 'Blues Fusion Collective',
    category: 'studio',
    description:
      'Multi-artist studio collaboration blending traditional blues with modern electronic elements, resulting in a unique sound that bridges generations.',
    image: '/api/placeholder/600/400',
    client: 'Melbourne Blues Collective',
    year: '2024',
    duration: '3 months',
    tags: ['Blues', 'Electronic Fusion', 'Studio Recording', 'Multi-Artist'],
    details: {
      role: 'Lead Guitarist & Co-Producer',
      outcome: '5-track EP released on digital platforms',
      highlights: [
        'Featured on Melbourne Music Scene podcast',
        'Streamed 50K+ times in first month',
        'Collaboration with 6 local artists',
      ],
    },
  },
  {
    id: 2,
    title: 'Acoustic Storytelling Series',
    category: 'creative',
    description:
      'Innovative creative project combining original acoustic compositions with spoken word narratives, creating immersive musical storytelling experiences.',
    image: '/api/placeholder/600/400',
    client: 'Independent Creative Collective',
    year: '2024',
    duration: '4 months',
    tags: ['Acoustic', 'Storytelling', 'Original Composition', 'Spoken Word'],
    details: {
      role: 'Composer & Performer',
      outcome: 'Live performance series & digital content',
      highlights: [
        '8 original compositions created',
        'Performed at 4 Melbourne venues',
        'Featured in local arts publications',
      ],
    },
  },
  {
    id: 3,
    title: 'Corporate Event Partnership',
    category: 'partnerships',
    description:
      'Ongoing strategic partnership providing musical entertainment for corporate events, networking sessions, and company celebrations.',
    image: '/api/placeholder/600/400',
    client: 'Premier Event Management',
    year: '2024',
    duration: 'Ongoing',
    tags: ['Corporate', 'Events', 'Partnership', 'Networking'],
    details: {
      role: 'Exclusive Music Partner',
      outcome: '15+ successful events delivered',
      highlights: [
        'Client satisfaction rate: 98%',
        'Expanded to 3 corporate clients',
        'Regular monthly bookings secured',
      ],
    },
  },
  {
    id: 4,
    title: 'Wedding Music Collaborations',
    category: 'creative',
    description:
      'Collaborative approach to wedding music, working closely with couples to create personalized musical experiences for their special day.',
    image: '/api/placeholder/600/400',
    client: 'Various Wedding Clients',
    year: '2024',
    duration: 'Ongoing',
    tags: ['Wedding', 'Personalized', 'Acoustic', 'Collaboration'],
    details: {
      role: 'Wedding Music Specialist',
      outcome: '25+ weddings performed',
      highlights: [
        'Custom song arrangements for couples',
        '5-star reviews consistently',
        'Referral rate: 80%',
      ],
    },
  },
  {
    id: 5,
    title: 'Community Music Initiative',
    category: 'partnerships',
    description:
      'Partnership with local community centers to provide accessible music education and performance opportunities.',
    image: '/api/placeholder/600/400',
    client: 'Melbourne Community Arts',
    year: '2024',
    duration: '6 months',
    tags: ['Community', 'Education', 'Outreach', 'Performance'],
    details: {
      role: 'Community Music Ambassador',
      outcome: 'Monthly workshops & performances',
      highlights: [
        '100+ community members reached',
        'Youth music program established',
        'Local media coverage received',
      ],
    },
  },
  {
    id: 6,
    title: 'Jazz-Blues Crossover Project',
    category: 'studio',
    description:
      'Experimental collaboration exploring the intersection of jazz improvisation and traditional blues structures.',
    image: '/api/placeholder/600/400',
    client: 'Melbourne Jazz Society',
    year: '2024',
    duration: '2 months',
    tags: ['Jazz', 'Blues', 'Improvisation', 'Experimental'],
    details: {
      role: 'Featured Guitarist',
      outcome: 'Live album recording',
      highlights: [
        'Performed with renowned jazz musicians',
        'Album featured on jazz radio stations',
        'Invited to jazz festival performances',
      ],
    },
  },
]

/**
 * Project Detail Modal Component
 */
const ProjectModal: React.FC<{
  project: (typeof collaborationProjects)[0] | null
  isOpen: boolean
  onClose: () => void
}> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-brand-blue-primary/10 text-brand-blue-primary rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl font-bold text-neutral-charcoal mb-2">
                  {project.title}
                </h3>

                <div className="flex items-center gap-4 mb-6 text-neutral-charcoal/70">
                  <span>{project.client}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                  <span>•</span>
                  <span>{project.duration}</span>
                </div>

                <p className="text-lg text-neutral-charcoal/80 mb-8 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-neutral-charcoal mb-4">
                      Project Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-neutral-charcoal">
                          Role:
                        </span>
                        <span className="ml-2 text-neutral-charcoal/80">
                          {project.details.role}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-neutral-charcoal">
                          Outcome:
                        </span>
                        <span className="ml-2 text-neutral-charcoal/80">
                          {project.details.outcome}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-neutral-charcoal mb-4">
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {project.details.highlights.map((highlight, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-neutral-charcoal/80"
                        >
                          <svg
                            className="w-5 h-5 text-brand-blue-primary mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Collaboration Portfolio Section
 *
 * Main portfolio section showcasing creative collaborations with enhanced filtering,
 * detailed project information, and improved Instagram content integration.
 */
export const CollaborationPortfolio: React.FC<CollaborationPortfolioProps> = ({
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<
    (typeof collaborationProjects)[0] | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProjects =
    activeCategory === 'all'
      ? collaborationProjects
      : collaborationProjects.filter(
          project => project.category === activeCategory
        )

  const openModal = (project: (typeof collaborationProjects)[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <section
      className={`collaboration-portfolio py-20 bg-gray-50 ${className}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-charcoal mb-6"
            >
              Creative{' '}
              <span className="text-brand-blue-primary">Portfolio</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed"
            >
              Explore recent collaborations, creative projects, and artistic
              partnerships that showcase the diversity and quality of
              collaborative work across various musical genres and contexts.
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div variants={fadeInUp} className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {portfolioCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                    activeCategory === category.id
                      ? 'bg-brand-blue-primary text-white shadow-lg'
                      : 'bg-white text-neutral-charcoal hover:bg-brand-blue-primary/10 hover:text-brand-blue-primary border border-gray-200'
                  }`}
                  aria-label={`Filter by ${category.label}`}
                >
                  {category.label}
                  <span className="ml-2 text-sm opacity-70">
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Active category description */}
            <div className="text-center">
              <p className="text-neutral-charcoal/60 text-sm">
                {
                  portfolioCategories.find(cat => cat.id === activeCategory)
                    ?.description
                }
              </p>
            </div>
          </motion.div>

          {/* Portfolio Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openModal(project)
                    }
                  }}
                  aria-label={`View details for ${project.title}`}
                >
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-xs">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-neutral-charcoal group-hover:text-brand-blue-primary transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-sm text-brand-blue-primary font-medium">
                        {project.year}
                      </span>
                    </div>

                    <p
                      className="text-neutral-charcoal/70 mb-4 leading-relaxed overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.5rem',
                        maxHeight: '4.5rem',
                      }}
                    >
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-charcoal/60">
                        {project.client}
                      </span>
                      <span className="text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200 font-medium text-sm flex items-center gap-1">
                        View Details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Instagram Feed Integration */}
          <motion.div variants={fadeInUp} className="bg-white rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-charcoal mb-4">
                Behind the Scenes
              </h3>
              <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto">
                Follow the creative process through candid moments and
                behind-the-scenes glimpses of collaboration sessions, creative
                projects, and artistic partnerships.
              </p>
            </div>

            <InstagramFeed
              limit={6}
              showHeader={false}
              showFollowButton={false}
              className="collaboration-instagram-feed"
            />

            <div className="text-center mt-8">
              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                aria-label="Follow RrishMusic on Instagram (opens in new tab)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow on Instagram
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}

export default CollaborationPortfolio