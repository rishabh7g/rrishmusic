/**
 * Content Integration Tests
 * 
 * Integration tests for the RrishMusic content management system.
 * Tests the interaction between hooks, validation, and components.
 */

import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React, { ComponentProps } from 'react';
import { useContent, useSectionContent, useLessonPackages } from '../hooks/useContent';
import { validateSiteContent } from '../utils/validation';
import type { SiteContent, LessonPackage, ContentValidationResult } from '../types';

// Mock the JSON data imports
vi.mock('../data/site-content.json', () => ({
  default: mockSiteContentData
}));

vi.mock('../data/lessons.json', () => ({
  default: mockLessonsData
}));

// Mock validation utilities
vi.mock('../utils/validation', () => ({
  validateSiteContent: vi.fn(),
  validateLessonPackage: vi.fn(),
  validateTestimonial: vi.fn(),
}));

// Test data
const mockSiteContentData: SiteContent = {
  id: 'site-integration-test',
  lastUpdated: '2024-08-23',
  version: '1.0.0',
  hero: {
    id: 'hero-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    title: 'Rrish Music - Integration Test',
    subtitle: 'Professional Music Teacher & Blues Improviser',
    ctaText: 'Book Your Lesson',
    instagramHandle: '@rrish_music',
    instagramUrl: 'https://instagram.com/rrish_music',
    socialProof: {
      studentsCount: 200,
      yearsExperience: 15,
      successStories: 75
    }
  },
  about: {
    id: 'about-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    biography: 'Passionate music educator with over 15 years of experience in teaching guitar, piano, and blues improvisation.',
    profileImage: {
      src: '/images/rrish-profile.jpg',
      alt: 'Rrish teaching guitar',
      width: 600,
      height: 600
    },
    skills: [
      { name: 'Blues Guitar', level: 'expert', yearsExperience: 15 },
      { name: 'Jazz Piano', level: 'advanced', yearsExperience: 12 },
      { name: 'Music Theory', level: 'expert', yearsExperience: 15 }
    ],
    achievements: [
      {
        title: 'Certified Music Educator',
        year: 2020,
        organization: 'National Music Teachers Association',
        category: 'education'
      }
    ]
  },
  community: {
    id: 'community-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    testimonials: {
      featured: [
        {
          id: 'testimonial-featured',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Emma Johnson',
          content: 'Rrish transformed my understanding of blues guitar. His teaching style is both patient and inspiring.',
          rating: 5,
          date: '2024-08-15',
          featured: true,
          studentLevel: 'intermediate'
        }
      ],
      all: [
        {
          id: 'testimonial-featured',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Emma Johnson',
          content: 'Rrish transformed my understanding of blues guitar. His teaching style is both patient and inspiring.',
          rating: 5,
          date: '2024-08-15',
          featured: true,
          studentLevel: 'intermediate'
        },
        {
          id: 'testimonial-regular',
          lastUpdated: '2024-08-23',
          version: '1.0.0',
          studentName: 'Mike Chen',
          content: 'Excellent piano lessons with clear explanations and practical exercises.',
          rating: 5,
          date: '2024-08-10',
          featured: false,
          studentLevel: 'beginner'
        }
      ]
    }
  },
  contact: {
    id: 'contact-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    methods: [
      { type: 'email', value: 'rrish@rrishmusic.com', label: 'Email Me', primary: true },
      { type: 'phone', value: '+1-555-MUSIC1', label: 'Call Me' },
      { type: 'instagram', value: '@rrish_music', label: 'Instagram' }
    ]
  },
  seo: {
    id: 'seo-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    defaultTitle: 'Rrish Music - Professional Music Teacher',
    defaultDescription: 'Learn guitar, piano, and blues improvisation with Rrish',
    keywords: ['music teacher', 'blues guitar', 'piano lessons', 'improvisation'],
    canonicalUrl: 'https://www.rrishmusic.com'
  },
  navigation: {
    id: 'nav-integration',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    items: [
      { id: 'home', label: 'Home', href: '/', order: 1 },
      { id: 'about', label: 'About', href: '/about', order: 2 },
      { id: 'lessons', label: 'Lessons', href: '/lessons', order: 3 },
      { id: 'contact', label: 'Contact', href: '/contact', order: 4 }
    ]
  }
};

const mockLessonsData: LessonPackage[] = [
  {
    id: 'blues-guitar-mastery',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    name: 'Blues Guitar Mastery',
    description: 'Master the art of blues guitar with comprehensive lessons covering technique, theory, and improvisation.',
    duration: 60,
    price: 85,
    currency: 'USD',
    targetAudience: ['intermediate', 'advanced'],
    instruments: ['guitar'],
    features: [
      'One-on-one personalized instruction',
      'Blues scales and progressions',
      'Improvisation techniques',
      'Recording and feedback sessions',
      'Practice materials included'
    ]
  },
  {
    id: 'piano-fundamentals',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    name: 'Piano Fundamentals',
    description: 'Build a strong foundation in piano playing with focus on technique, theory, and musical expression.',
    duration: 45,
    price: 70,
    currency: 'USD',
    targetAudience: ['beginner', 'intermediate'],
    instruments: ['piano'],
    features: [
      'Proper hand positioning and technique',
      'Music theory basics',
      'Sight-reading skills',
      'Practice exercises',
      'Progress tracking'
    ]
  },
  {
    id: 'jazz-improvisation',
    lastUpdated: '2024-08-23',
    version: '1.0.0',
    name: 'Jazz Improvisation Workshop',
    description: 'Develop your jazz improvisation skills with advanced chord progressions and solo techniques.',
    duration: 75,
    price: 95,
    currency: 'USD',
    targetAudience: ['advanced'],
    instruments: ['guitar', 'piano'],
    features: [
      'Jazz theory and harmony',
      'Chord substitutions',
      'Solo development',
      'Jam session practice',
      'Performance preparation'
    ]
  }
];

// Test Components
const HeroSection: React.FC = () => {
  const { sectionData, loading, error } = useSectionContent('hero');

  if (loading) return <div data-testid="hero-loading">Loading...</div>;
  if (error) return <div data-testid="hero-error">{error}</div>;
  if (!sectionData) return <div data-testid="hero-empty">No hero data</div>;

  return (
    <section data-testid="hero-section">
      <h1 data-testid="hero-title">{sectionData.title}</h1>
      <p data-testid="hero-subtitle">{sectionData.subtitle}</p>
      {sectionData.ctaText && (
        <button data-testid="hero-cta">{sectionData.ctaText}</button>
      )}
      {sectionData.socialProof && (
        <div data-testid="hero-social-proof">
          <span data-testid="students-count">{sectionData.socialProof.studentsCount} students</span>
          <span data-testid="years-experience">{sectionData.socialProof.yearsExperience} years</span>
        </div>
      )}
    </section>
  );
};

const LessonPackageList: React.FC<{ filters?: ComponentProps<typeof useLessonPackages>[0] }> = ({ filters }) => {
  const { packages, loading, error, stats } = useLessonPackages(filters);

  if (loading) return <div data-testid="lessons-loading">Loading lessons...</div>;
  if (error) return <div data-testid="lessons-error">{error}</div>;

  return (
    <div data-testid="lesson-packages">
      <div data-testid="lesson-stats">
        <span data-testid="total-packages">{stats.total} packages</span>
        <span data-testid="average-price">${stats.averagePrice}</span>
        <span data-testid="price-range">${stats.priceRange.min} - ${stats.priceRange.max}</span>
      </div>
      <div data-testid="package-list">
        {packages.map((pkg) => (
          <div key={pkg.id} data-testid={`package-${pkg.id}`}>
            <h3 data-testid={`package-name-${pkg.id}`}>{pkg.name}</h3>
            <p data-testid={`package-price-${pkg.id}`}>${pkg.price}</p>
            <p data-testid={`package-duration-${pkg.id}`}>{pkg.duration} minutes</p>
            <div data-testid={`package-audience-${pkg.id}`}>
              {pkg.targetAudience.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

describe('Content Management Integration Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default successful validation
    (validateSiteContent as Mock).mockReturnValue({
      valid: true,
      errors: [],
      warnings: []
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Content Loading Flow', () => {
    it('should load and display hero content successfully', async () => {
      render(<HeroSection />);

      // Should show loading initially
      expect(screen.getByTestId('hero-loading')).toBeInTheDocument();

      // Wait for content to load
      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });

      // Check hero content is displayed correctly
      expect(screen.getByTestId('hero-title')).toHaveTextContent('Rrish Music - Integration Test');
      expect(screen.getByTestId('hero-subtitle')).toHaveTextContent('Professional Music Teacher & Blues Improviser');
      expect(screen.getByTestId('hero-cta')).toHaveTextContent('Book Your Lesson');
      expect(screen.getByTestId('students-count')).toHaveTextContent('200 students');
      expect(screen.getByTestId('years-experience')).toHaveTextContent('15 years');
    });

    it('should handle content loading errors gracefully', async () => {
      // Mock validation to throw an error
      (validateSiteContent as Mock).mockImplementation(() => {
        throw new Error('Network connection failed');
      });

      render(<HeroSection />);

      await waitFor(() => {
        expect(screen.getByTestId('hero-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('hero-error')).toHaveTextContent('Network connection failed');
    });

    it('should display validation warnings in development', async () => {
      // Mock validation with warnings
      (validateSiteContent as Mock).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [
          { field: 'hero.description', message: 'Description recommended for SEO', severity: 'warning', code: 'SEO_RECOMMENDED' }
        ]
      });

      const { result } = renderHook(() => useContent());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.validationResult?.warnings).toHaveLength(1);
      expect(result.current.validationResult?.warnings[0].message).toContain('SEO');
    });
  });

  describe('Lesson Package Integration', () => {
    it('should display all lesson packages with statistics', async () => {
      render(<LessonPackageList />);

      await waitFor(() => {
        expect(screen.getByTestId('lesson-packages')).toBeInTheDocument();
      });

      // Check statistics
      expect(screen.getByTestId('total-packages')).toHaveTextContent('3 packages');
      expect(screen.getByTestId('average-price')).toHaveTextContent('$83.33'); // (85 + 70 + 95) / 3
      expect(screen.getByTestId('price-range')).toHaveTextContent('$70 - $95');

      // Check individual packages
      expect(screen.getByTestId('package-blues-guitar-mastery')).toBeInTheDocument();
      expect(screen.getByTestId('package-piano-fundamentals')).toBeInTheDocument();
      expect(screen.getByTestId('package-jazz-improvisation')).toBeInTheDocument();

      // Check package details
      expect(screen.getByTestId('package-name-blues-guitar-mastery')).toHaveTextContent('Blues Guitar Mastery');
      expect(screen.getByTestId('package-price-blues-guitar-mastery')).toHaveTextContent('$85');
      expect(screen.getByTestId('package-duration-blues-guitar-mastery')).toHaveTextContent('60 minutes');
    });

    it('should filter lesson packages by instrument', async () => {
      render(<LessonPackageList filters={{ instruments: ['guitar'] }} />);

      await waitFor(() => {
        expect(screen.getByTestId('lesson-packages')).toBeInTheDocument();
      });

      // Should show 2 packages (blues guitar and jazz improvisation support guitar)
      expect(screen.getByTestId('total-packages')).toHaveTextContent('2 packages');
      expect(screen.getByTestId('package-blues-guitar-mastery')).toBeInTheDocument();
      expect(screen.getByTestId('package-jazz-improvisation')).toBeInTheDocument();
      expect(screen.queryByTestId('package-piano-fundamentals')).not.toBeInTheDocument();
    });

    it('should filter lesson packages by target audience', async () => {
      render(<LessonPackageList filters={{ targetAudience: ['beginner'] }} />);

      await waitFor(() => {
        expect(screen.getByTestId('lesson-packages')).toBeInTheDocument();
      });

      // Should show 1 package (only piano fundamentals supports beginners)
      expect(screen.getByTestId('total-packages')).toHaveTextContent('1 packages');
      expect(screen.getByTestId('package-piano-fundamentals')).toBeInTheDocument();
      expect(screen.queryByTestId('package-blues-guitar-mastery')).not.toBeInTheDocument();
      expect(screen.queryByTestId('package-jazz-improvisation')).not.toBeInTheDocument();
    });

    it('should filter lesson packages by price range', async () => {
      render(<LessonPackageList filters={{ priceRange: { min: 75, max: 90 } }} />);

      await waitFor(() => {
        expect(screen.getByTestId('lesson-packages')).toBeInTheDocument();
      });

      // Should show 1 package (blues guitar at $85)
      expect(screen.getByTestId('total-packages')).toHaveTextContent('1 packages');
      expect(screen.getByTestId('package-blues-guitar-mastery')).toBeInTheDocument();
      expect(screen.queryByTestId('package-piano-fundamentals')).not.toBeInTheDocument(); // $70, below range
      expect(screen.queryByTestId('package-jazz-improvisation')).not.toBeInTheDocument(); // $95, above range
    });

    it('should update statistics when filters change', async () => {
      const { rerender } = render(<LessonPackageList />);

      // Initial state - all packages
      await waitFor(() => {
        expect(screen.getByTestId('total-packages')).toHaveTextContent('3 packages');
      });

      // Apply filter
      rerender(<LessonPackageList filters={{ instruments: ['piano'] }} />);

      await waitFor(() => {
        expect(screen.getByTestId('total-packages')).toHaveTextContent('2 packages'); // piano fundamentals and jazz improvisation
      });

      const priceText = screen.getByTestId('average-price').textContent;
      expect(priceText).toContain('$82.5'); // (70 + 95) / 2
    });
  });

  describe('Cross-Component Integration', () => {
    it('should maintain consistent data across multiple components', async () => {
      const MultiComponentApp: React.FC = () => {
        const { content, loading } = useContent();
        const { sectionData: heroData } = useSectionContent('hero');
        const { packages } = useLessonPackages();

        if (loading) return <div data-testid="app-loading">Loading...</div>;

        return (
          <div data-testid="multi-component-app">
            <div data-testid="content-id">{content?.id}</div>
            <div data-testid="hero-id">{heroData?.id}</div>
            <div data-testid="lesson-count">{packages.length}</div>
          </div>
        );
      };

      render(<MultiComponentApp />);

      await waitFor(() => {
        expect(screen.getByTestId('multi-component-app')).toBeInTheDocument();
      });

      // All components should receive the same base content
      expect(screen.getByTestId('content-id')).toHaveTextContent('site-integration-test');
      expect(screen.getByTestId('hero-id')).toHaveTextContent('hero-integration');
      expect(screen.getByTestId('lesson-count')).toHaveTextContent('3');
    });

    it('should handle content updates across components', async () => {
      const UpdatingApp: React.FC = () => {
        const { content, refresh, loading } = useContent();

        return (
          <div data-testid="updating-app">
            <button data-testid="refresh-button" onClick={refresh} disabled={loading}>
              Refresh
            </button>
            <div data-testid="content-version">{content?.version}</div>
            <div data-testid="loading-state">{loading ? 'Loading' : 'Ready'}</div>
          </div>
        );
      };

      render(<UpdatingApp />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('Ready');
      });

      expect(screen.getByTestId('content-version')).toHaveTextContent('1.0.0');

      // Trigger refresh
      act(() => {
        screen.getByTestId('refresh-button').click();
      });

      // Should show loading state
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');

      // Wait for refresh to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading-state')).toHaveTextContent('Ready');
      });

      // Content should still be available
      expect(screen.getByTestId('content-version')).toHaveTextContent('1.0.0');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle validation errors gracefully in components', async () => {
      // Mock validation to return errors
      (validateSiteContent as Mock).mockReturnValue({
        valid: false,
        errors: [
          { field: 'hero.title', message: 'Title is required', severity: 'error', code: 'REQUIRED_FIELD' },
          { field: 'hero.subtitle', message: 'Subtitle is required', severity: 'error', code: 'REQUIRED_FIELD' }
        ],
        warnings: []
      });

      const ErrorHandlingComponent: React.FC = () => {
        const { content, error, validationResult } = useContent();

        if (error) return <div data-testid="component-error">{error}</div>;
        if (validationResult && !validationResult.valid) {
          return (
            <div data-testid="validation-errors">
              {validationResult.errors.map((err, idx) => (
                <div key={idx} data-testid={`error-${idx}`}>{err.field}: {err.message}</div>
              ))}
            </div>
          );
        }
        
        return <div data-testid="content-loaded">{content?.id}</div>;
      };

      render(<ErrorHandlingComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
      });

      expect(screen.getByTestId('error-0')).toHaveTextContent('hero.title: Title is required');
      expect(screen.getByTestId('error-1')).toHaveTextContent('hero.subtitle: Subtitle is required');
    });

    it('should recover from temporary errors with retry mechanism', async () => {
      let callCount = 0;
      (validateSiteContent as Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          throw new Error('Temporary network error');
        }
        return { valid: true, errors: [], warnings: [] };
      });

      const RetryComponent: React.FC = () => {
        const { content, error, retry, loading } = useContent();

        return (
          <div data-testid="retry-component">
            {loading && <div data-testid="retry-loading">Loading...</div>}
            {error && (
              <div data-testid="retry-error-section">
                <div data-testid="retry-error">{error}</div>
                <button data-testid="retry-button" onClick={retry}>Retry</button>
              </div>
            )}
            {content && <div data-testid="retry-success">{content.id}</div>}
          </div>
        );
      };

      render(<RetryComponent />);

      // Wait for initial error
      await waitFor(() => {
        expect(screen.getByTestId('retry-error')).toHaveTextContent('Temporary network error');
      });

      // Click retry
      act(() => {
        screen.getByTestId('retry-button').click();
      });

      // Should show loading
      expect(screen.getByTestId('retry-loading')).toBeInTheDocument();

      // Wait for successful retry
      await waitFor(() => {
        expect(screen.getByTestId('retry-success')).toBeInTheDocument();
      });

      expect(screen.getByTestId('retry-success')).toHaveTextContent('site-integration-test');
      expect(callCount).toBe(2);
    });
  });

  describe('Performance Integration', () => {
    it('should cache content across multiple hook instances', async () => {
      let validationCallCount = 0;
      (validateSiteContent as Mock).mockImplementation((content) => {
        validationCallCount++;
        return { valid: true, errors: [], warnings: [] };
      });

      const CachedContentApp: React.FC = () => {
        const { content: content1 } = useContent();
        const { content: content2 } = useContent();
        const { sectionData } = useSectionContent('hero');

        return (
          <div data-testid="cached-app">
            <div data-testid="content1-id">{content1?.id || 'loading'}</div>
            <div data-testid="content2-id">{content2?.id || 'loading'}</div>
            <div data-testid="hero-title">{sectionData?.title || 'loading'}</div>
          </div>
        );
      };

      render(<CachedContentApp />);

      await waitFor(() => {
        expect(screen.getByTestId('content1-id')).toHaveTextContent('site-integration-test');
        expect(screen.getByTestId('content2-id')).toHaveTextContent('site-integration-test');
        expect(screen.getByTestId('hero-title')).toHaveTextContent('Rrish Music - Integration Test');
      });

      // Validation should only be called once due to caching
      expect(validationCallCount).toBe(1);
    });

    it('should handle concurrent component mounting efficiently', async () => {
      const loadTimes: number[] = [];

      const TimedComponent: React.FC<{ id: string }> = ({ id }) => {
        const startTime = React.useRef(Date.now());
        const { content, loading } = useContent();

        React.useEffect(() => {
          if (!loading && content) {
            loadTimes.push(Date.now() - startTime.current);
          }
        }, [loading, content]);

        return <div data-testid={`timed-${id}`}>{content?.id || 'loading'}</div>;
      };

      const ConcurrentApp: React.FC = () => (
        <div data-testid="concurrent-app">
          <TimedComponent id="1" />
          <TimedComponent id="2" />
          <TimedComponent id="3" />
        </div>
      );

      render(<ConcurrentApp />);

      await waitFor(() => {
        expect(screen.getByTestId('timed-1')).toHaveTextContent('site-integration-test');
        expect(screen.getByTestId('timed-2')).toHaveTextContent('site-integration-test');
        expect(screen.getByTestId('timed-3')).toHaveTextContent('site-integration-test');
      });

      // All components should load efficiently due to shared cache
      expect(loadTimes).toHaveLength(3);
      loadTimes.forEach(time => {
        expect(time).toBeLessThan(1000); // Should complete quickly
      });
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should support a complete lesson booking flow', async () => {
      const LessonBookingFlow: React.FC = () => {
        const [selectedLesson, setSelectedLesson] = React.useState<string | null>(null);
        const { packages } = useLessonPackages();
        const { content } = useContent();

        const selectedPackage = packages.find(p => p.id === selectedLesson);
        const contactInfo = content?.contact?.methods.find(m => m.primary);

        return (
          <div data-testid="booking-flow">
            <div data-testid="package-selection">
              {packages.map(pkg => (
                <button
                  key={pkg.id}
                  data-testid={`select-${pkg.id}`}
                  onClick={() => setSelectedLesson(pkg.id)}
                  className={selectedLesson === pkg.id ? 'selected' : ''}
                >
                  {pkg.name} - ${pkg.price}
                </button>
              ))}
            </div>
            
            {selectedPackage && (
              <div data-testid="lesson-details">
                <h3 data-testid="selected-name">{selectedPackage.name}</h3>
                <p data-testid="selected-price">${selectedPackage.price}</p>
                <p data-testid="selected-duration">{selectedPackage.duration} minutes</p>
                
                {contactInfo && (
                  <div data-testid="booking-contact">
                    <p>Book via: {contactInfo.label}</p>
                    <p data-testid="contact-value">{contactInfo.value}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      };

      render(<LessonBookingFlow />);

      // Wait for packages to load
      await waitFor(() => {
        expect(screen.getByTestId('select-blues-guitar-mastery')).toBeInTheDocument();
      });

      // Select a lesson
      act(() => {
        screen.getByTestId('select-blues-guitar-mastery').click();
      });

      // Check lesson details are displayed
      await waitFor(() => {
        expect(screen.getByTestId('lesson-details')).toBeInTheDocument();
      });

      expect(screen.getByTestId('selected-name')).toHaveTextContent('Blues Guitar Mastery');
      expect(screen.getByTestId('selected-price')).toHaveTextContent('$85');
      expect(screen.getByTestId('selected-duration')).toHaveTextContent('60 minutes');
      expect(screen.getByTestId('contact-value')).toHaveTextContent('rrish@rrishmusic.com');
    });

    it('should support filtering and searching lesson packages', async () => {
      const LessonSearchApp: React.FC = () => {
        const [searchTerm, setSearchTerm] = React.useState('');
        const [selectedInstrument, setSelectedInstrument] = React.useState<string>('');
        const [selectedLevel, setSelectedLevel] = React.useState<string>('');

        const filters = React.useMemo(() => ({
          ...(selectedInstrument && { instruments: [selectedInstrument] }),
          ...(selectedLevel && { targetAudience: [selectedLevel as any] })
        }), [selectedInstrument, selectedLevel]);

        const { packages } = useLessonPackages(filters);

        const filteredPackages = packages.filter(pkg =>
          searchTerm === '' || 
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div data-testid="lesson-search">
            <input
              data-testid="search-input"
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              data-testid="instrument-filter"
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value)}
            >
              <option value="">All Instruments</option>
              <option value="guitar">Guitar</option>
              <option value="piano">Piano</option>
            </select>

            <select
              data-testid="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div data-testid="search-results">
              {filteredPackages.map(pkg => (
                <div key={pkg.id} data-testid={`result-${pkg.id}`}>
                  {pkg.name}
                </div>
              ))}
            </div>
            
            <div data-testid="results-count">
              {filteredPackages.length} lessons found
            </div>
          </div>
        );
      };

      render(<LessonSearchApp />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('results-count')).toHaveTextContent('3 lessons found');
      });

      // Test text search
      act(() => {
        screen.getByTestId('search-input').setAttribute('value', 'blues');
        screen.getByTestId('search-input').dispatchEvent(new Event('input', { bubbles: true }));
      });

      // Test instrument filter
      act(() => {
        const select = screen.getByTestId('instrument-filter') as HTMLSelectElement;
        select.value = 'guitar';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      await waitFor(() => {
        // Should show guitar lessons only
        expect(screen.queryByTestId('result-piano-fundamentals')).not.toBeInTheDocument();
        expect(screen.getByTestId('result-blues-guitar-mastery')).toBeInTheDocument();
        expect(screen.getByTestId('result-jazz-improvisation')).toBeInTheDocument();
      });
    });
  });
});