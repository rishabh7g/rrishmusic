/**
 * Centralized content management with JSON data files
 */
import { useMemo } from 'react';

// Import all JSON data files using the correct paths
import teachingContent from '../data/teaching.json';
import collaborationContent from '../data/collaboration.json';
import contactContent from '../data/contact.json';
import navigationData from '../data/navigation.json';

// Type definitions for better TypeScript support
export interface HomeContent {
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: {
      text: string;
      href: string;
      variant: 'primary' | 'secondary';
    };
    secondaryCTA: {
      text: string;
      href: string;
      variant: 'primary' | 'secondary';
    };
  };
  servicesOverview: {
    title: string;
    subtitle: string;
    services: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      href: string;
      priority: 'primary' | 'secondary' | 'tertiary';
      featured: boolean;
    }>;
  };
  socialProof: {
    title: string;
    testimonials: Array<{
      id: string;
      content: string;
      author: string;
      role: string;
      image?: string;
    }>;
  };
}

export interface ServiceContent {
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    primaryCTA: {
      text: string;
      href: string;
    };
  };
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  portfolio?: Array<{
    id: string;
    title: string;
    description: string;
    image?: string;
    tags: string[];
  }>;
}

export interface LessonPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
  popular?: boolean;
}

// Default home content since the JSON doesn't exist
const defaultHomeContent: HomeContent = {
  heroSection: {
    title: "Live Piano Performance • Music Teaching • Collaboration",
    subtitle: "Professional Musician & Educator",
    description: "Bringing musical experiences to life through live performance, personalized teaching, and creative collaboration.",
    primaryCTA: {
      text: "Book Performance",
      href: "/performance",
      variant: "primary"
    },
    secondaryCTA: {
      text: "Learn Piano",
      href: "/teaching", 
      variant: "secondary"
    }
  },
  servicesOverview: {
    title: "Musical Services",
    subtitle: "Comprehensive music services for all your needs",
    services: [
      {
        id: "performance",
        title: "Live Performance",
        description: "Professional piano performance for events and venues",
        icon: "🎹",
        href: "/performance",
        priority: "primary",
        featured: true
      },
      {
        id: "teaching",
        title: "Music Teaching",
        description: "Personalized piano lessons for all skill levels",
        icon: "🎼",
        href: "/teaching",
        priority: "secondary", 
        featured: true
      },
      {
        id: "collaboration",
        title: "Collaboration",
        description: "Creative musical partnerships and projects",
        icon: "🤝",
        href: "/collaboration",
        priority: "tertiary",
        featured: false
      }
    ]
  },
  socialProof: {
    title: "What People Say",
    testimonials: [
      {
        id: "1",
        content: "Exceptional musical talent and professional service",
        author: "Sarah Johnson",
        role: "Event Coordinator"
      }
    ]
  }
};

// Default performance content since the JSON doesn't exist  
const defaultPerformanceContent: ServiceContent = {
  heroSection: {
    title: "Live Piano Performance",
    subtitle: "Professional musical entertainment",
    description: "Elegant piano performance for weddings, events, and venues",
    primaryCTA: {
      text: "Book Performance",
      href: "/contact?service=performance"
    }
  },
  features: [
    {
      id: "1",
      title: "Wedding Ceremonies",
      description: "Beautiful music for your special day",
      icon: "💒"
    },
    {
      id: "2", 
      title: "Corporate Events",
      description: "Professional entertainment for business functions",
      icon: "🏢"
    },
    {
      id: "3",
      title: "Private Parties", 
      description: "Intimate musical experiences",
      icon: "🎉"
    }
  ]
};

// Default about content
const defaultAboutContent = {
  title: "About Rrish",
  subtitle: "Passionate musician and educator",
  description: "With years of experience in performance and teaching, I bring dedication and artistry to every musical endeavor.",
  credentials: [
    "Professional Piano Performance",
    "Music Education", 
    "Live Performance Experience"
  ]
};

// Default SEO data
const defaultSeoData = {
  title: "Rrish Music - Piano Performance & Teaching",
  description: "Professional piano performance, music teaching, and collaboration services. Book live performances, learn piano, or collaborate on musical projects.",
  keywords: "piano, music, performance, teaching, collaboration, live music, piano lessons",
  ogImage: "/images/rrish-profile.jpg"
};

// Default lesson packages
const defaultLessonPackages: LessonPackage[] = [
  {
    id: "beginner",
    title: "Beginner Package",
    description: "Perfect for those starting their musical journey",
    duration: "4 lessons",
    price: "$200",
    features: [
      "Basic music theory",
      "Finger exercises", 
      "Simple songs",
      "Practice guidance"
    ]
  },
  {
    id: "intermediate", 
    title: "Intermediate Package",
    description: "For students with some musical experience",
    duration: "6 lessons",
    price: "$300",
    features: [
      "Advanced techniques",
      "Music interpretation",
      "Performance skills",
      "Repertoire building"
    ],
    popular: true
  },
  {
    id: "advanced",
    title: "Advanced Package", 
    description: "Intensive training for serious musicians",
    duration: "8 lessons",
    price: "$400",
    features: [
      "Master-level techniques",
      "Competition preparation",
      "Professional guidance",
      "Performance coaching"
    ]
  }
];

// Default hero content that matches what Hero component expects
const defaultHeroContent = {
  title: "Professional Piano Performance & Teaching",
  subtitle: "Live Music • Personalized Lessons • Creative Collaboration",
  description: "Experience the joy of music through live piano performance and personalized piano lessons. Perfect for events, learning, and creative projects.",
  primaryCTA: {
    text: "Book Performance",
    href: "/performance",
    variant: "primary" as const
  },
  secondaryCTA: {
    text: "Start Piano Lessons", 
    href: "/teaching",
    variant: "secondary" as const
  }
};

/**
 * Main content hook - provides all content with optimal performance
 */
export const useContent = () => {
  return useMemo(() => ({
    home: defaultHomeContent,
    hero: defaultHeroContent, // Add hero section for Hero component
    teaching: teachingContent as ServiceContent,
    performance: defaultPerformanceContent,
    collaboration: collaborationContent as ServiceContent,
    about: defaultAboutContent,
    contact: contactContent,
    menu: navigationData,
    metadata: {},
    seo: defaultSeoData,
  }), []);
};

/**
 * Hook for navigation menu data
 */
export const useMenuContent = () => {
  const content = useContent();
  return useMemo(() => content.menu, [content.menu]);
};

/**
 * Hook for SEO content
 */
export const useSEO = () => {
  const generatePageTitle = (title: string) => `${title} | Rrish Music`;
  
  return useMemo(() => ({
    data: defaultSeoData,
    generatePageTitle,
    loading: false,
    error: null
  }), []);
};

/**
 * Hook for lesson packages data - matches expected interface
 */
export const useLessonPackages = () => {
  return useMemo(() => ({
    packages: defaultLessonPackages,
    packageInfo: {
      title: "Choose Your Learning Path",
      description: "Select the lesson package that matches your current skill level and learning goals."
    },
    loading: false,
    error: null
  }), []);
};

// Enhanced section content access with expected interface
export const useSectionContent = (section: string) => {
  const content = useContent();
  return useMemo(() => ({
    data: content[section as keyof typeof content],
    loading: false,
    error: null
  }), [content, section]);
};

// Default export for backward compatibility
export default useContent;