/**
 * Collaboration Portfolio Section Component
 * 
 * Portfolio section showcasing collaboration examples and creative projects
 * with Instagram content integration and responsive gallery layout.
 * 
 * Features:
 * - Instagram collaboration content integration
 * - Creative project case studies
 * - Behind-the-scenes content
 * - Responsive gallery layout
 * - Content categorization and filtering
 * - Lazy loading and performance optimization
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { InstagramFeed } from '@/components/sections/InstagramFeed';

interface CollaborationPortfolioProps {
  className?: string;
}

/**
 * Portfolio categories for collaboration content
 */
const portfolioCategories = [
  { id: 'all', label: 'All Projects', count: 12 },
  { id: 'studio', label: 'Studio Work', count: 5 },
  { id: 'creative', label: 'Creative Projects', count: 4 },
  { id: 'partnerships', label: 'Partnerships', count: 3 }
];

/**
 * Sample collaboration projects (to be replaced with actual content management)
 */
const collaborationProjects = [
  {
    id: 1,
    title: 'Blues Fusion Collaboration',
    category: 'studio',
    description: 'Studio collaboration blending traditional blues with modern elements',
    image: '/api/placeholder/400/300',
    client: 'Melbourne Blues Collective',
    year: '2024',
    tags: ['Blues', 'Studio', 'Fusion']
  },
  {
    id: 2,
    title: 'Acoustic Storytelling Project',
    category: 'creative',
    description: 'Creative project combining original compositions with narrative elements',
    image: '/api/placeholder/400/300',
    client: 'Independent Artist',
    year: '2024',
    tags: ['Acoustic', 'Storytelling', 'Original']
  },
  {
    id: 3,
    title: 'Corporate Event Collaboration',
    category: 'partnerships',
    description: 'Ongoing partnership for corporate event entertainment',
    image: '/api/placeholder/400/300',
    client: 'Event Management Company',
    year: '2024',
    tags: ['Corporate', 'Events', 'Partnership']
  }
];

/**
 * Collaboration Portfolio Section
 * 
 * Main portfolio section showcasing creative collaborations with filtering
 * and Instagram content integration.
 */
export const CollaborationPortfolio: React.FC<CollaborationPortfolioProps> = ({ 
  className = '' 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all' 
    ? collaborationProjects 
    : collaborationProjects.filter(project => project.category === activeCategory);

  return (
    <section className={`collaboration-portfolio py-20 bg-gray-50 ${className}`}>
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
              Creative <span className="text-brand-blue-primary">Portfolio</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-neutral-charcoal/80 max-w-3xl mx-auto leading-relaxed"
            >
              Explore recent collaborations, creative projects, and artistic partnerships 
              that showcase the diversity and quality of collaborative work.
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {portfolioCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                  activeCategory === category.id
                    ? 'bg-brand-blue-primary text-white shadow-lg'
                    : 'bg-white text-neutral-charcoal hover:bg-brand-blue-primary/10 hover:text-brand-blue-primary border border-gray-200'
                }`}
              >
                {category.label}
                <span className="ml-2 text-sm opacity-70">({category.count})</span>
              </button>
            ))}
          </motion.div>

          {/* Portfolio Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-neutral-charcoal">
                      {project.title}
                    </h3>
                    <span className="text-sm text-brand-blue-primary font-medium">
                      {project.year}
                    </span>
                  </div>
                  
                  <p className="text-neutral-charcoal/70 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-charcoal/60">
                      {project.client}
                    </span>
                    <button className="text-brand-blue-primary hover:text-brand-blue-secondary transition-colors duration-200 font-medium text-sm">
                      View Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Instagram Feed Integration */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-lg p-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-charcoal mb-4">
                Behind the Scenes
              </h3>
              <p className="text-lg text-neutral-charcoal/80 max-w-2xl mx-auto">
                Follow the creative process through candid moments and behind-the-scenes 
                glimpses of collaboration sessions and creative projects.
              </p>
            </div>
            
            <InstagramFeed 
              limit={6} 
              showHeader={false}
              className="collaboration-instagram-feed"
            />
            
            <div className="text-center mt-8">
              <a
                href="https://instagram.com/rrishmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollaborationPortfolio;