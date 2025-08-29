import React, { useState } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from './ServiceSectionTemplate'
import collaborationData from '@/content/collaboration.json'

/**
 * Collaboration Portfolio Section
 * Showcases creative projects and partnerships
 */
export const CollaborationPortfolioSection: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)

  const { categories, projects } = collaborationData.portfolio

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter(project => project.category === activeCategory)

  return (
    <ServiceSectionTemplate
      serviceType="collaboration"
      title="Creative Project Portfolio"
      subtitle="A showcase of collaborative works spanning studio recordings, creative partnerships, and artistic ventures"
      sectionId="collaboration-portfolio"
      variant="portfolio"
      className={className}
      animate={animate}
    >
      <div className="portfolio-content">
        {/* Category Filter */}
        <div className="category-filter flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2
                ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }
              `}
            >
              <span>{category.label}</span>
              <span className="text-sm opacity-75">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="project-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-image relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.year}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  {project.duration}
                </div>
              </div>

              <div className="project-info p-6">
                <div className="project-header mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {project.title}
                  </h3>
                  <div className="text-sm text-green-600 font-medium">
                    {project.client}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="project-tags flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="project-modal-content p-6">
                <div className="modal-header flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedProject.title}
                  </h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="project-details space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Project Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Client:</span>{' '}
                        {selectedProject.client}
                      </div>
                      <div>
                        <span className="text-gray-600">Year:</span>{' '}
                        {selectedProject.year}
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>{' '}
                        {selectedProject.duration}
                      </div>
                      <div>
                        <span className="text-gray-600">Role:</span>{' '}
                        {selectedProject.details.role}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Highlights
                    </h4>
                    <ul className="space-y-1">
                      {selectedProject.details.highlights.map(
                        (highlight, index) => (
                          <li
                            key={index}
                            className="text-gray-700 text-sm flex items-start"
                          >
                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {highlight}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Outcome
                    </h4>
                    <p className="text-gray-700">
                      {selectedProject.details.outcome}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Collaboration Process Section
 * Explains the collaborative workflow and approach
 */
export const CollaborationProcess: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const processSteps = [
    {
      id: 1,
      title: 'Initial Consultation',
      description:
        'We discuss your creative vision, project goals, and timeline to ensure perfect alignment.',
      duration: '1-2 hours',
      deliverables: [
        'Project brief',
        'Creative direction',
        'Timeline proposal',
      ],
      icon: '🤝',
    },
    {
      id: 2,
      title: 'Creative Development',
      description:
        'Collaborative ideation and development phase where we explore musical directions and arrangements.',
      duration: '1-2 weeks',
      deliverables: [
        'Demo tracks',
        'Arrangement sketches',
        'Feedback sessions',
      ],
      icon: '💡',
    },
    {
      id: 3,
      title: 'Production Phase',
      description:
        'Full production with recording, mixing, and refinement until we achieve the perfect result.',
      duration: '2-6 weeks',
      deliverables: ['Master recordings', 'Mix versions', 'Production notes'],
      icon: '🎵',
    },
    {
      id: 4,
      title: 'Delivery & Support',
      description:
        'Final delivery of all assets with ongoing support for promotion and future collaborations.',
      duration: '1 week',
      deliverables: ['Final masters', 'Promotional materials', 'Usage rights'],
      icon: '🚀',
    },
  ]

  return (
    <ServiceSectionTemplate
      serviceType="collaboration"
      title="Collaboration Process"
      subtitle="A structured approach to creative partnerships that ensures exceptional results"
      sectionId="collaboration-process"
      variant="featured"
      background="white"
      className={className}
      animate={animate}
    >
      <div className="process-steps space-y-8">
        {processSteps.map((step, index) => (
          <div
            key={step.id}
            className="process-step flex items-start space-x-6"
          >
            {/* Step Number & Icon */}
            <div className="step-indicator flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-2">
                {step.icon}
              </div>
              <div className="text-sm font-medium text-green-600">
                Step {step.id}
              </div>
              {index < processSteps.length - 1 && (
                <div className="w-px h-16 bg-green-200 mt-4"></div>
              )}
            </div>

            {/* Step Content */}
            <div className="step-content flex-1">
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="step-header mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <div className="text-sm text-green-600 font-medium">
                    {step.duration}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{step.description}</p>

                <div className="step-deliverables">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Deliverables:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((deliverable, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Collaboration Services Section
 * Different types of collaborative services offered
 */
export const CollaborationServices: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const [activeService, setActiveService] = useState('recording')

  const services = {
    recording: {
      title: 'Studio Collaborations',
      description:
        'Professional recording partnerships for albums, EPs, and single tracks',
      features: [
        'Lead and rhythm guitar parts',
        'Creative arrangement input',
        'Professional studio recording',
        'Multiple revision rounds',
        'High-quality mix contributions',
      ],
      pricing: 'From $200/day',
      duration: '1-5 days',
      ideal: 'Artists, Producers, Bands',
      icon: '🎧',
    },
    creative: {
      title: 'Creative Projects',
      description:
        'Original compositions and artistic collaborations for unique musical ventures',
      features: [
        'Original composition creation',
        'Co-writing partnerships',
        'Artistic vision development',
        'Cross-genre experimentation',
        'Innovative sound design',
      ],
      pricing: 'Project-based',
      duration: '2-12 weeks',
      ideal: 'Artists, Composers, Producers',
      icon: '🎨',
    },
    business: {
      title: 'Business Partnerships',
      description:
        'Long-term professional relationships and ongoing musical collaborations',
      features: [
        'Ongoing project partnerships',
        'Tour musician services',
        'Musical direction consulting',
        'Brand collaboration opportunities',
        'Industry networking support',
      ],
      pricing: 'Negotiable retainer',
      duration: '3+ months',
      ideal: 'Music Businesses, Labels, Artists',
      icon: '🤝',
    },
    education: {
      title: 'Educational Collaborations',
      description:
        'Workshops, masterclasses, and educational content partnerships',
      features: [
        'Workshop development',
        'Masterclass instruction',
        'Educational content creation',
        'Curriculum consultation',
        'Student mentorship programs',
      ],
      pricing: 'From $150/hour',
      duration: '1 day - 3 months',
      ideal: 'Schools, Organizations, Platforms',
      icon: '📚',
    },
  }

  return (
    <ServiceSectionTemplate
      serviceType="collaboration"
      title="Collaboration Services"
      subtitle="Diverse partnership opportunities tailored to your creative and business needs"
      sectionId="collaboration-services"
      variant="default"
      background="gray"
      className={className}
      animate={animate}
    >
      <div className="services-content">
        {/* Service Navigation */}
        <div className="service-nav grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(services).map(([key, service]) => (
            <button
              key={key}
              onClick={() => setActiveService(key)}
              className={`
                service-nav-button p-4 rounded-xl text-center transition-all duration-300
                ${
                  activeService === key
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }
              `}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="font-medium text-sm">{service.title}</div>
            </button>
          ))}
        </div>

        {/* Active Service Details */}
        <div className="active-service-details bg-white rounded-2xl shadow-lg p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="service-info">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {services[activeService].title}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {services[activeService].description}
              </p>

              <div className="service-features space-y-3">
                <h4 className="font-semibold text-gray-900 mb-3">
                  What's Included:
                </h4>
                {services[activeService].features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="service-details bg-gradient-to-br from-green-50 to-white rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-6">Service Overview</h4>

              <div className="details-grid space-y-4">
                <div className="detail-item">
                  <div className="text-sm text-gray-600 mb-1">Pricing</div>
                  <div className="text-lg font-bold text-green-600">
                    {services[activeService].pricing}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="text-sm text-gray-600 mb-1">
                    Typical Duration
                  </div>
                  <div className="font-medium text-gray-900">
                    {services[activeService].duration}
                  </div>
                </div>

                <div className="detail-item">
                  <div className="text-sm text-gray-600 mb-1">Ideal For</div>
                  <div className="font-medium text-gray-900">
                    {services[activeService].ideal}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Start Collaboration
                </button>
                <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Collaboration Success Stories Section
 * Case studies and success stories from past collaborations
 */
export const CollaborationSuccessStories: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const successStories = [
    {
      id: 1,
      title: 'Melbourne Blues Collective Album',
      type: 'Studio Collaboration',
      description:
        'Led guitar arrangements for a 10-track album featuring 6 local Melbourne blues artists.',
      client: 'Melbourne Blues Collective',
      duration: '3 months',
      outcome: 'Album reached #3 on Australian Blues Charts',
      metrics: {
        tracks: 10,
        artists: 6,
        streams: '150K+',
        awards: 'Australian Blues Music Awards Nomination',
      },
      testimonial:
        'Rrish brought exactly the creative energy and professional expertise our project needed. His guitar work elevated every track.',
      image: '/api/placeholder/400/250',
    },
    {
      id: 2,
      title: 'Corporate Brand Music Series',
      type: 'Business Partnership',
      description:
        "Created custom music content for a major brand's marketing campaign and digital presence.",
      client: 'Fortune 500 Company',
      duration: '6 months',
      outcome: 'Campaign music used across multiple platforms',
      metrics: {
        compositions: 8,
        platforms: 5,
        reach: '2M+ views',
        renewal: 'Extended for additional year',
      },
      testimonial:
        'Professional, creative, and delivered exactly what our brand needed. The music perfectly captured our company values.',
      image: '/api/placeholder/400/250',
    },
    {
      id: 3,
      title: 'Educational Workshop Series',
      type: 'Educational Collaboration',
      description:
        'Developed and delivered a comprehensive blues guitar workshop series for music schools.',
      client: 'Australian Music Schools Network',
      duration: '4 months',
      outcome: 'Workshop adopted by 12+ music schools',
      metrics: {
        schools: 12,
        students: '300+',
        satisfaction: '98%',
        expansion: 'National rollout planned',
      },
      testimonial:
        'Rrish created an engaging curriculum that students love and teachers find easy to implement. Outstanding educational partnership.',
      image: '/api/placeholder/400/250',
    },
  ]

  return (
    <ServiceSectionTemplate
      serviceType="collaboration"
      title="Success Stories"
      subtitle="Real results from creative partnerships that made a lasting impact"
      sectionId="collaboration-success"
      variant="testimonial"
      background="white"
      className={className}
      animate={animate}
    >
      <div className="success-stories space-y-12">
        {successStories.map((story, index) => (
          <div
            key={story.id}
            className={`story-card ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-8 items-center`}
          >
            <div className="story-image lg:w-1/2">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>

            <div className="story-content lg:w-1/2">
              <div className="content-header mb-6">
                <div className="text-sm text-green-600 font-medium mb-2">
                  {story.type}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {story.title}
                </h3>
                <p className="text-gray-700 text-lg">{story.description}</p>
              </div>

              <div className="story-details grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Client</div>
                  <div className="font-medium text-gray-900">
                    {story.client}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-medium text-gray-900">
                    {story.duration}
                  </div>
                </div>
              </div>

              <div className="story-metrics bg-green-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Key Metrics
                </h4>
                <div className="metrics-grid grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(story.metrics).map(([key, value]) => (
                    <div key={key} className="metric-item">
                      <div className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="font-bold text-green-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="story-outcome mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Outcome</h4>
                <p className="text-green-700 font-medium">{story.outcome}</p>
              </div>

              <blockquote className="text-gray-700 italic border-l-4 border-green-600 pl-4">
                "{story.testimonial}"
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </ServiceSectionTemplate>
  )
}

export default {
  CollaborationPortfolioSection,
  CollaborationProcess,
  CollaborationServices,
  CollaborationSuccessStories,
}
