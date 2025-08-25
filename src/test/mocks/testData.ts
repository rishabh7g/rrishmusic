import type { 
  ServiceContent, 
  TestimonialData,
  PortfolioItem 
} from '@/types';

// Mock service data for testing calculations
export const mockServiceContent: ServiceContent = {
  teaching: {
    hero: {
      title: 'Expert Music Teaching',
      subtitle: 'Personalized instruction for all skill levels',
      description: 'Transform your musical journey with expert guidance',
      backgroundImage: '/images/teaching-hero.jpg',
      ctaText: 'Start Learning',
      secondaryCta: 'View Pricing'
    },
    features: [
      {
        title: 'Personalized Instruction',
        description: 'Tailored lessons for your unique learning style',
        icon: 'user-graduate'
      }
    ],
    pricing: {
      individual: {
        price: 80,
        duration: 60,
        description: 'One-on-one personalized instruction'
      },
      group: {
        price: 60,
        duration: 60,
        description: 'Small group lessons (2-4 students)'
      }
    },
    testimonials: [
      {
        id: '1',
        name: 'Sarah Johnson',
        rating: 5,
        text: 'Excellent teaching methods',
        service: 'teaching' as const,
        date: '2024-01-15'
      }
    ]
  },
  performance: {
    hero: {
      title: 'Live Performances',
      subtitle: 'Professional musical entertainment',
      description: 'Bringing music to life at your special events',
      backgroundImage: '/images/performance-hero.jpg',
      ctaText: 'Book Performance',
      secondaryCta: 'View Portfolio'
    },
    portfolio: [
      {
        id: '1',
        title: 'Wedding Reception',
        category: 'wedding',
        description: 'Intimate acoustic performance',
        imageUrl: '/images/wedding-performance.jpg',
        date: '2024-02-14',
        location: 'Garden Venue, California',
        tags: ['acoustic', 'wedding', 'intimate']
      }
    ]
  },
  collaboration: {
    hero: {
      title: 'Musical Collaboration',
      subtitle: 'Creative partnerships and projects',
      description: 'Bringing musical visions to life through collaboration',
      backgroundImage: '/images/collaboration-hero.jpg',
      ctaText: 'Start Collaboration',
      secondaryCta: 'View Projects'
    },
    projects: [
      {
        id: '1',
        title: 'Studio Recording Session',
        category: 'recording',
        description: 'Multi-track recording collaboration',
        imageUrl: '/images/studio-session.jpg',
        date: '2024-03-10',
        collaborators: ['Producer Jane', 'Vocalist Mike'],
        tags: ['studio', 'recording', 'collaboration']
      }
    ]
  }
};

// Mock testimonial data for statistics testing
export const mockTestimonials: TestimonialData[] = [
  {
    id: '1',
    name: 'Alice Smith',
    rating: 5,
    text: 'Amazing teacher with great patience and skill',
    service: 'teaching',
    date: '2024-01-15',
    location: 'San Francisco, CA',
    verified: true
  },
  {
    id: '2', 
    name: 'Bob Johnson',
    rating: 5,
    text: 'Outstanding performance at our wedding',
    service: 'performance',
    date: '2024-02-20',
    location: 'Los Angeles, CA',
    verified: true
  },
  {
    id: '3',
    name: 'Carol Williams',
    rating: 4,
    text: 'Great collaborative experience on our album',
    service: 'collaboration', 
    date: '2024-03-10',
    location: 'Nashville, TN',
    verified: true
  },
  {
    id: '4',
    name: 'David Brown',
    rating: 5,
    text: 'Excellent teaching methods and clear explanations',
    service: 'teaching',
    date: '2024-01-25',
    location: 'San Diego, CA',
    verified: false
  },
  {
    id: '5',
    name: 'Eva Davis',
    rating: 3,
    text: 'Good performance but could be better',
    service: 'performance',
    date: '2024-02-28',
    location: 'San Jose, CA',
    verified: true
  }
];

// Mock portfolio items for performance calculations
export const mockPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Corporate Event Performance',
    category: 'corporate',
    description: 'Live performance for company annual meeting',
    imageUrl: '/images/corporate-event.jpg',
    date: '2024-01-10',
    location: 'San Francisco, CA',
    tags: ['corporate', 'live', 'professional'],
    duration: 120,
    audience: 150
  },
  {
    id: '2',
    title: 'Wedding Reception',
    category: 'wedding',
    description: 'Acoustic performance for intimate wedding',
    imageUrl: '/images/wedding-acoustic.jpg', 
    date: '2024-02-14',
    location: 'Napa Valley, CA',
    tags: ['wedding', 'acoustic', 'intimate'],
    duration: 180,
    audience: 80
  },
  {
    id: '3',
    title: 'Concert Hall Performance',
    category: 'concert',
    description: 'Solo performance at classical venue',
    imageUrl: '/images/concert-hall.jpg',
    date: '2024-03-15',
    location: 'San Francisco Symphony Hall',
    tags: ['classical', 'solo', 'concert'],
    duration: 90,
    audience: 400
  }
];

// Mock pricing data for calculations
export const mockPricingData = {
  teaching: {
    individual: {
      baseRate: 80,
      duration: 60,
      discount: {
        monthly: 0.1,  // 10% discount for monthly packages
        quarterly: 0.15, // 15% discount for quarterly packages
        yearly: 0.2    // 20% discount for yearly packages
      }
    },
    group: {
      baseRate: 60,
      duration: 60,
      maxStudents: 4,
      discount: {
        monthly: 0.08,
        quarterly: 0.12,
        yearly: 0.18
      }
    }
  },
  performance: {
    base: {
      corporate: 500,
      wedding: 800,
      private: 300,
      concert: 1200
    },
    factors: {
      duration: 1.5,    // $1.50 per minute over base 60 minutes
      audience: 0.5,    // $0.50 per person over base 50 people
      travel: 0.75,     // $0.75 per mile for travel
      equipment: 150    // $150 for full sound system
    }
  }
};

// Mock stats data for calculator testing
export const mockStatsData = {
  totalStudents: 85,
  totalPerformances: 42,
  totalCollaborations: 18,
  yearsExperience: 15,
  averageRating: 4.8,
  totalReviews: 127,
  successRate: 0.96,
  retentionRate: 0.89
};

// Mock edge case data for testing error handling
export const mockEdgeCases = {
  emptyArrays: {
    testimonials: [],
    portfolioItems: [],
    students: []
  },
  invalidData: {
    negativeRating: -1,
    zeroPrice: 0,
    invalidDate: 'invalid-date',
    nullValues: null,
    undefinedValues: undefined
  },
  extremeValues: {
    maxRating: 5,
    minRating: 1,
    largeNumbers: 999999999,
    smallDecimals: 0.000001,
    longStrings: 'A'.repeat(1000)
  }
};

// Helper functions for creating test data
export const createMockTestimonial = (overrides: Partial<TestimonialData> = {}): TestimonialData => ({
  id: '1',
  name: 'Test User',
  rating: 5,
  text: 'Test testimonial',
  service: 'teaching',
  date: '2024-01-01',
  location: 'Test Location',
  verified: true,
  ...overrides
});

export const createMockPortfolioItem = (overrides: Partial<PortfolioItem> = {}): PortfolioItem => ({
  id: '1',
  title: 'Test Performance',
  category: 'test',
  description: 'Test description',
  imageUrl: '/test-image.jpg',
  date: '2024-01-01',
  location: 'Test Location',
  tags: ['test'],
  ...overrides
});

// Performance metrics mock data
export const mockPerformanceMetrics = {
  responseTime: 150,      // milliseconds
  loadTime: 2.5,          // seconds  
  renderTime: 800,        // milliseconds
  memoryUsage: 45,        // MB
  cacheHitRate: 0.85,     // 85%
  errorRate: 0.02,        // 2%
  uptime: 0.999           // 99.9%
};