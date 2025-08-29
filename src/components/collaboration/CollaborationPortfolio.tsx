import React, { useState, memo } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from '../sections/ServiceSectionTemplate'
import collaborationData from '@/content/collaboration.json'

/**
 * Collaboration Portfolio Section
 * Showcases creative projects and partnerships
 */
export const CollaborationPortfolio: React.FC<ServiceSectionProps> = memo(
  ({ className = '', animate = true }) => {
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
)

CollaborationPortfolio.displayName = 'CollaborationPortfolio'

export default CollaborationPortfolio
