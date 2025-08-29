import React, { useState } from 'react'
import {
  ServiceSectionTemplate,
  ServiceSectionProps,
} from './ServiceSectionTemplate'
import teachingData from '@/content/teaching.json'

/**
 * Teaching Package Section
 * Displays lesson packages with pricing and descriptions
 */
export const TeachingPackages: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const packages = teachingData.packages
  const [selectedPackage, setSelectedPackage] = useState<string>('foundation')

  return (
    <ServiceSectionTemplate
      serviceType="teaching"
      title="Choose Your Learning Package"
      subtitle="Select the package that best fits your learning goals and commitment level"
      sectionId="teaching-packages"
      variant="pricing"
      className={className}
      animate={animate}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {Object.entries(packages).map(([key, pkg]) => (
          <div
            key={key}
            className={`
              package-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
              border-2 p-6 cursor-pointer transform hover:scale-105
              ${
                selectedPackage === key
                  ? 'border-brand-orange-warm ring-4 ring-orange-100'
                  : 'border-gray-200 hover:border-brand-orange-warm'
              }
            `}
            onClick={() => setSelectedPackage(key)}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {pkg.name}
              </h3>

              <div className="price-section mb-4">
                <div className="text-3xl font-bold text-brand-orange-warm mb-1">
                  {pkg.price}
                </div>
                {pkg.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {pkg.originalPrice}
                  </div>
                )}
                {pkg.savings && (
                  <div className="text-sm text-green-600 font-medium">
                    Save {pkg.savings}
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

              <div className="package-features">
                <div className="text-sm text-gray-800 font-medium">
                  {pkg.sessions} Session{pkg.sessions > 1 ? 's' : ''}
                </div>
                {pkg.sessions > 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Weekly lessons recommended
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package comparison details */}
      <div className="mt-12 bg-orange-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          All packages include:
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="feature-item">
            <div className="w-12 h-12 bg-brand-orange-warm text-white rounded-full flex items-center justify-center mx-auto mb-2">
              📚
            </div>
            <h5 className="font-medium text-gray-900">
              Personalized Curriculum
            </h5>
            <p className="text-sm text-gray-600">
              Tailored to your skill level and goals
            </p>
          </div>
          <div className="feature-item">
            <div className="w-12 h-12 bg-brand-orange-warm text-white rounded-full flex items-center justify-center mx-auto mb-2">
              🎵
            </div>
            <h5 className="font-medium text-gray-900">Practice Materials</h5>
            <p className="text-sm text-gray-600">
              Custom exercises and backing tracks
            </p>
          </div>
          <div className="feature-item">
            <div className="w-12 h-12 bg-brand-orange-warm text-white rounded-full flex items-center justify-center mx-auto mb-2">
              💬
            </div>
            <h5 className="font-medium text-gray-900">Ongoing Support</h5>
            <p className="text-sm text-gray-600">
              Email support between lessons
            </p>
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Teaching Approach Section
 * Explains the teaching methodology and philosophy
 */
export const TeachingApproach: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  return (
    <ServiceSectionTemplate
      serviceType="teaching"
      title="My Teaching Approach"
      subtitle="A personalized methodology focused on musical expression and technical excellence"
      sectionId="teaching-approach"
      variant="featured"
      background="white"
      className={className}
      animate={animate}
    >
      <div className="approach-content grid lg:grid-cols-2 gap-12 items-center">
        <div className="approach-principles">
          <div className="principles-list space-y-6">
            <div className="principle-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-warm to-brand-orange-light text-white rounded-full flex items-center justify-center flex-shrink-0">
                  🎯
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Goal-Oriented Learning
                  </h4>
                  <p className="text-gray-600">
                    Every lesson is designed around your specific musical goals,
                    whether that's mastering blues solos, understanding music
                    theory, or developing your own playing style.
                  </p>
                </div>
              </div>
            </div>

            <div className="principle-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-warm to-brand-orange-light text-white rounded-full flex items-center justify-center flex-shrink-0">
                  🎼
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Theory Meets Practice
                  </h4>
                  <p className="text-gray-600">
                    I believe in combining solid theoretical knowledge with
                    practical application. You'll understand why techniques
                    work, not just how to play them.
                  </p>
                </div>
              </div>
            </div>

            <div className="principle-item">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-warm to-brand-orange-light text-white rounded-full flex items-center justify-center flex-shrink-0">
                  🚀
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Progressive Development
                  </h4>
                  <p className="text-gray-600">
                    Structured progression ensures you build skills
                    systematically while maintaining motivation through
                    achievable milestones and regular breakthroughs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="approach-visual bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-brand-orange-warm text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🎸
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4">
              Personalized Learning Path
            </h4>
            <p className="text-gray-700 mb-6">
              Each student follows a customized curriculum based on their
              musical interests, current skill level, and learning pace.
            </p>

            <div className="learning-stats grid grid-cols-3 gap-4 text-center">
              <div className="stat-item">
                <div className="text-2xl font-bold text-brand-orange-warm">
                  5+
                </div>
                <div className="text-sm text-gray-600">Years Teaching</div>
              </div>
              <div className="stat-item">
                <div className="text-2xl font-bold text-brand-orange-warm">
                  50+
                </div>
                <div className="text-sm text-gray-600">Students Taught</div>
              </div>
              <div className="stat-item">
                <div className="text-2xl font-bold text-brand-orange-warm">
                  100%
                </div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Teaching Curriculum Section
 * Details the curriculum structure and learning pathways
 */
export const TeachingCurriculum: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const [activeLevel, setActiveLevel] = useState('beginner')

  const curriculumLevels = {
    beginner: {
      title: 'Beginner (0-6 months)',
      description: 'Building fundamental skills and musical confidence',
      topics: [
        'Basic chord shapes and progressions',
        'Essential strumming patterns',
        'Introduction to music theory',
        'Simple blues progressions',
        'Basic improvisation concepts',
      ],
      color: 'green',
    },
    intermediate: {
      title: 'Intermediate (6-18 months)',
      description: 'Developing technique and musical expression',
      topics: [
        'Advanced chord voicings',
        'Blues scales and modes',
        'Lead guitar techniques',
        'Song structure and analysis',
        'Performance preparation',
      ],
      color: 'orange',
    },
    advanced: {
      title: 'Advanced (18+ months)',
      description: 'Mastering style and developing personal voice',
      topics: [
        'Advanced improvisation',
        'Jazz and fusion concepts',
        'Recording and production basics',
        'Teaching and mentoring others',
        'Professional performance skills',
      ],
      color: 'purple',
    },
  }

  return (
    <ServiceSectionTemplate
      serviceType="teaching"
      title="Structured Learning Curriculum"
      subtitle="A progressive pathway designed to take you from beginner to confident player"
      sectionId="teaching-curriculum"
      variant="default"
      background="gray"
      className={className}
      animate={animate}
    >
      <div className="curriculum-content">
        {/* Level Selector */}
        <div className="level-selector flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(curriculumLevels).map(([key, level]) => (
            <button
              key={key}
              onClick={() => setActiveLevel(key)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300
                ${
                  activeLevel === key
                    ? 'bg-brand-orange-warm text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-brand-orange-warm'
                }
              `}
            >
              {level.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Level Content */}
        <div className="active-level bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {curriculumLevels[activeLevel].title}
            </h3>
            <p className="text-lg text-gray-600">
              {curriculumLevels[activeLevel].description}
            </p>
          </div>

          <div className="topics-grid grid md:grid-cols-2 gap-4">
            {curriculumLevels[activeLevel].topics.map((topic, index) => (
              <div
                key={index}
                className="topic-item flex items-center space-x-3 p-4 bg-orange-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-brand-orange-warm text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-800 font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ServiceSectionTemplate>
  )
}

/**
 * Teaching Success Stories Section
 * Student testimonials and success stories
 */
export const TeachingSuccessStories: React.FC<ServiceSectionProps> = ({
  className = '',
  animate = true,
}) => {
  const successStories = [
    {
      id: 1,
      name: 'Sarah M.',
      level: 'Beginner to Intermediate',
      duration: '8 months',
      quote:
        'Rrish helped me go from barely knowing chords to confidently playing blues solos. His teaching style is patient and incredibly effective.',
      achievement: 'Performed at local open mic night',
      image: '/api/placeholder/100/100',
    },
    {
      id: 2,
      name: 'Michael T.',
      level: 'Intermediate to Advanced',
      duration: '12 months',
      quote:
        'The theory knowledge I gained transformed my playing. I now understand music in a way that makes improvisation feel natural.',
      achievement: 'Joined a local blues band as lead guitarist',
      image: '/api/placeholder/100/100',
    },
    {
      id: 3,
      name: 'Emma K.',
      level: 'Complete Beginner',
      duration: '6 months',
      quote:
        'I was intimidated by guitar at first, but Rrish made it accessible and fun. Now I play every day!',
      achievement: 'Completed first full song performance',
      image: '/api/placeholder/100/100',
    },
  ]

  return (
    <ServiceSectionTemplate
      serviceType="teaching"
      title="Student Success Stories"
      subtitle="Real progress from real students who've transformed their musical journey"
      sectionId="teaching-success"
      variant="testimonial"
      background="white"
      className={className}
      animate={animate}
    >
      <div className="success-stories grid md:grid-cols-3 gap-8">
        {successStories.map(story => (
          <div
            key={story.id}
            className="story-card bg-white rounded-2xl shadow-lg p-6 border-l-4 border-brand-orange-warm"
          >
            <div className="student-info flex items-center mb-4">
              <img
                src={story.image}
                alt={story.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{story.name}</h4>
                <div className="text-sm text-gray-600">{story.level}</div>
                <div className="text-xs text-brand-orange-warm">
                  {story.duration}
                </div>
              </div>
            </div>

            <blockquote className="text-gray-700 italic mb-4">
              "{story.quote}"
            </blockquote>

            <div className="achievement bg-orange-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Key Achievement:
              </div>
              <div className="text-sm text-brand-orange-warm font-medium">
                {story.achievement}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ServiceSectionTemplate>
  )
}

export default {
  TeachingPackages,
  TeachingApproach,
  TeachingCurriculum,
  TeachingSuccessStories,
}
