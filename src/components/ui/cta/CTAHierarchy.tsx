import React from 'react'
import { motion } from 'framer-motion'

interface CTAHierarchyProps {
  variant?: 'hero' | 'section'
  layout?: 'horizontal' | 'vertical'
  context?: 'hero' | 'services' | 'general'
  customMessages?: {
    primary?: string
    secondary?: string
    tertiary?: string
  }
  className?: string
}

export const CTAHierarchy: React.FC<CTAHierarchyProps> = ({
  variant = 'section',
  layout = 'horizontal',
  context = 'general',
  customMessages,
  className = '',
}) => {
  // Default messages based on context
  const getDefaultMessages = () => {
    switch (context) {
      case 'hero':
        return {
          primary: 'Book Performance',
          secondary: 'Learn Guitar',
          tertiary: 'Collaborate',
        }
      case 'services':
        return {
          primary: customMessages?.primary || 'Book Performance Today',
          secondary: customMessages?.secondary || 'Learn Guitar Skills',
          tertiary: customMessages?.tertiary || 'Studio Work',
        }
      default:
        return {
          primary: 'Get Started',
          secondary: 'Learn More',
          tertiary: 'Contact',
        }
    }
  }

  const messages = { ...getDefaultMessages(), ...customMessages }
  const isHorizontal = layout === 'horizontal'

  return (
    <div className={`cta-hierarchy ${isHorizontal ? 'flex flex-row gap-4' : 'flex flex-col gap-3'} ${className}`}>
      {/* Primary CTA */}
      <motion.a
        href="/contact"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {messages.primary}
      </motion.a>

      {/* Secondary CTA */}
      <motion.a
        href="/teaching"
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
      >
        {messages.secondary}
      </motion.a>

      {/* Tertiary CTA */}
      <motion.a
        href="/collaboration"
        className="border-2 border-gray-400 hover:border-gray-600 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
      >
        {messages.tertiary}
      </motion.a>
    </div>
  )
}