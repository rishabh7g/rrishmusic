/**
 * Centralized content management with JSON data files
 */
import { useMemo } from 'react'

// Import all JSON data files using the correct paths
import teachingContentRaw from '../content/teaching.json'
import contactContent from '../content/contact.json'
import navigationData from '../content/navigation.json'

// Type definitions for better TypeScript support
export interface HomeContent {
  heroSection: {
    title: string
    subtitle: string
    description: string
    primaryCTA: {
      text: string
      href: string
      variant: 'primary' | 'secondary'
    }
    secondaryCTA: {
      text: string
      href: string
      variant: 'primary' | 'secondary'
    }
  }
  servicesOverview: {
    title: string
    subtitle: string
    services: Array<{
      id: string
      title: string
      description: string
      icon: string
      href: string
      priority: 'primary' | 'secondary' | 'tertiary'
      featured: boolean
    }>
  }
  socialProof: {
    title: string
    testimonials: Array<{
      id: string
      content: string
      author: string
      role: string
      image?: string
    }>
  }
}

export interface ServiceContent {
  heroSection: {
    title: string
    subtitle: string
    description: string
    primaryCTA: {
      text: string
      href: string
    }
  }
  features?: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
  portfolio?: Array<{
    id: string
    title: string
    description: string
    image?: string
    tags: string[]
  }>
  // Allow for additional properties from JSON files
  [key: string]: unknown
}

export interface LessonPackage {
  id: string
  title: string
  description: string
  duration: string
  price: string
  features: string[]
  popular?: boolean
}

// Enhanced teaching content with heroSection
const enhancedTeachingContent: ServiceContent = {
  ...teachingContentRaw,
  heroSection: {
    title: 'Guitar Lessons & Music Theory',
    subtitle: 'Personalized instruction for all skill levels',
    description:
      'Learn guitar and music theory with expert instruction tailored to your goals and skill level.',
    primaryCTA: {
      text: 'Start Learning',
      href: '/contact?service=teaching',
    },
  },
}

// Default home content
const defaultHomeContent: HomeContent = {
  heroSection: {
    title: 'Guitar Lessons & Music Theory',
    subtitle: 'Melbourne Music Teacher',
    description:
      'Learn guitar and music theory with personalized one-on-one lessons in Melbourne. Expert instruction for all skill levels.',
    primaryCTA: {
      text: 'View Gallery',
      href: '/gallery',
      variant: 'primary',
    },
    secondaryCTA: {
      text: 'Start Learning',
      href: '#lessons',
      variant: 'secondary',
    },
  },
  servicesOverview: {
    title: 'Music Education',
    subtitle: 'Personalized instruction for all skill levels',
    services: [
      {
        id: 'teaching',
        title: 'Guitar Lessons',
        description: 'One-on-one guitar instruction for all skill levels',
        icon: '🎸',
        href: '#lessons',
        priority: 'primary',
        featured: true,
      },
    ],
  },
  socialProof: {
    title: 'What Students Say',
    testimonials: [
      {
        id: '1',
        content: 'Exceptional teacher with patience and expertise',
        author: 'Alex M.',
        role: 'Guitar Student',
      },
    ],
  },
}


// Default about content
const defaultAboutContent = {
  title: 'About Rrish',
  subtitle: 'Dedicated music educator',
  description:
    'With years of experience as a guitarist and music educator, I bring passion and expertise to every lesson.',
  credentials: [
    'Experienced Guitar Instructor',
    'Music Theory Specialist',
    'Blues & Contemporary Guitar Expert',
  ],
}

// Default SEO data
const defaultSeoData = {
  title: 'RrishMusic - Guitar Lessons & Music Theory | Melbourne',
  description:
    'Learn guitar and music theory in Melbourne with personalized one-on-one lessons. Expert instruction for all skill levels.',
  keywords:
    'guitar lessons, music teacher, Melbourne guitar instructor, music theory, blues guitar, adult guitar lessons',
  ogImage: '/images/rrish-profile.jpg',
}

// Default lesson packages
const defaultLessonPackages: LessonPackage[] = [
  {
    id: 'beginner-package',
    title: 'Beginner Package',
    description: 'Perfect for those just starting their musical journey',
    duration: '1 lesson',
    price: '$50',
    features: [
      'Basic instrument handling and posture',
      'Simple chords and fundamental techniques',
      'Introduction to reading music',
      'Basic practice routine development',
    ],
    recommended: true,
  },
  {
    id: 'foundation-package',
    title: 'Foundation Package',
    description: 'Build solid foundations with consistent weekly lessons',
    duration: '4 lessons',
    price: '$200',
    features: [
      'Comprehensive skills assessment and goal planning',
      'Structured curriculum tailored to your learning style',
      'Weekly progress tracking and adjustments',
      'Expanded practice materials and backing tracks',
    ],
    popular: true,
    recommended: true,
  },
  {
    id: 'single-lesson',
    title: 'Single Lesson',
    description:
      'Perfect for trying out my teaching style or addressing specific challenges',
    duration: '1 lesson',
    price: '$80',
    features: [
      'Personalized assessment of your current level',
      'Customized lesson plan based on your goals',
      'Technique development and theory foundations',
      'Practice materials and exercises to take home',
    ],
  },
]

// Default hero content that matches what Hero component expects
const defaultHeroContent = {
  title: 'RrishMusic',
  subtitle: 'Guitar Lessons • Music Theory',
  description:
    'Personalized one-on-one guitar lessons in Melbourne. Learn guitar and music theory with expert instruction tailored to your goals.',
  primaryCTA: {
    text: 'View Gallery',
    href: '/gallery',
    variant: 'primary' as const,
  },
  secondaryCTA: {
    text: 'Start Learning',
    href: '#lessons',
    variant: 'secondary' as const,
  },
}

/**
 * Main content hook - provides all content with optimal performance
 */
export const useContent = () => {
  return useMemo(
    () => ({
      home: defaultHomeContent,
      hero: defaultHeroContent, // Add hero section for Hero component
      teaching: enhancedTeachingContent,
      about: defaultAboutContent,
      contact: contactContent,
      menu: navigationData,
      metadata: {},
      seo: defaultSeoData,
    }),
    []
  )
}

/**
 * Hook for navigation menu data
 */
export const useMenuContent = () => {
  const content = useContent()
  return useMemo(() => content.menu, [content.menu])
}

/**
 * Hook for SEO content
 */
export const useSEO = () => {
  const generatePageTitle = (title: string) => `${title} | Rrish Music`

  return useMemo(
    () => ({
      data: defaultSeoData,
      generatePageTitle,
      loading: false,
      error: null,
    }),
    []
  )
}

/**
 * Hook for lesson packages data - matches expected interface
 */
export const useLessonPackages = () => {
  return useMemo(
    () => ({
      packages: defaultLessonPackages,
      packageInfo: {
        title: 'Choose Your Learning Path',
        description:
          'Select the lesson package that matches your current skill level and learning goals.',
        sessionLength: '60',
        instruments: ['Guitar', 'Electric Guitar', 'Acoustic Guitar'],
        location: 'Melbourne, Victoria, Australia',
        cancellationPolicy:
          '24 hours notice required for cancellations. Less than 24 hours notice may result in full session charge.',
        reschedulePolicy:
          'Free rescheduling with 24+ hours notice. Package students get flexible rescheduling throughout their package period.',
      },
      loading: false,
      error: null,
    }),
    []
  )
}

/**
 * Hook for stats data - provides statistics for components
 */
export const useStats = () => {
  return useMemo(
    () => ({
      aboutStats: [
        { value: '10+', label: 'Years Teaching', icon: 'calendar' },
        { value: '45+', label: 'Students Taught', icon: 'users' },
        { value: '500+', label: 'Lessons Given', icon: 'music' },
      ],
      communityStats: [
        { value: '45', label: 'Active Students' },
        { value: '92%', label: 'Completion Rate' },
        { value: '4.9/5', label: 'Average Rating' },
        { value: '85%', label: 'Retention Rate' },
      ],
      socialProof: [
        { value: '45+', label: 'Students' },
        { value: '4.9/5', label: 'Rating' },
        { value: '85%', label: 'Student Retention' },
      ],
      loading: false,
      error: null,
    }),
    []
  )
}

/**
 * Hook for testimonials data
 */
export const useTestimonials = () => {
  return useMemo(
    () => ({
      testimonials: [
        {
          id: '1',
          content:
            'Rrish is an exceptional guitar teacher. His patience and expertise helped me progress faster than I ever expected.',
          author: 'Alex M.',
          role: 'Guitar Student',
          rating: 5,
          service: 'teaching',
        },
        {
          id: '2',
          content:
            'As an adult learner, I was nervous about starting guitar lessons. Rrish made me feel comfortable from day one and tailored the lessons perfectly to my pace.',
          author: 'Jenny S.',
          role: 'Adult Learner',
          rating: 5,
          service: 'teaching',
        },
        {
          id: '3',
          content:
            'Rrish helped me understand blues improvisation. His patient approach and clear explanations made learning enjoyable and effective.',
          author: 'Blake F.',
          role: 'Blues Guitar Student',
          rating: 5,
          service: 'teaching',
        },
      ],
      loading: false,
      error: null,
    }),
    []
  )
}

// Enhanced section content access with expected interface
export const useSectionContent = (section: string) => {
  const content = useContent()
  return useMemo(
    () => ({
      data: content[section as keyof typeof content],
      loading: false,
      error: null,
    }),
    [content, section]
  )
}

// Default export for backward compatibility
export default useContent
