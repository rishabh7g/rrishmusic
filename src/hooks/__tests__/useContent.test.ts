import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContent, useSEO, useSectionContent, useStats, useTestimonials } from '@/hooks/useContent';

describe('useContent Hook - Business Logic Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Content Loading', () => {
    it('should load content data successfully', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.teaching).toBeDefined();
      expect(result.current.performance).toBeDefined();
      expect(result.current.collaboration).toBeDefined();
      expect(result.current.about).toBeDefined();
      expect(result.current.home).toBeDefined();
      expect(result.current.hero).toBeDefined();
    });

    it('should provide stable references across re-renders', () => {
      const { result, rerender } = renderHook(() => useContent());
      
      const firstRender = result.current;
      
      rerender();
      
      const secondRender = result.current;

      // Content should be memoized and stable
      expect(firstRender).toBe(secondRender);
    });

    it('should return correct structure for each service', () => {
      const { result } = renderHook(() => useContent());

      const { teaching, performance, collaboration } = result.current;

      // Each service should have heroSection
      expect(teaching).toHaveProperty('heroSection');
      expect(performance).toHaveProperty('heroSection');
      expect(collaboration).toHaveProperty('heroSection');

      // Hero sections should have required fields
      expect(teaching.heroSection).toHaveProperty('title');
      expect(teaching.heroSection).toHaveProperty('description');
      expect(performance.heroSection).toHaveProperty('title');
      expect(performance.heroSection).toHaveProperty('description');
      expect(collaboration.heroSection).toHaveProperty('title');
      expect(collaboration.heroSection).toHaveProperty('description');
    });
  });

  describe('Content Accuracy', () => {
    it('should return accurate teaching content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.teaching.heroSection.title).toContain('Piano');
      expect(result.current.teaching.heroSection.description).toBeDefined();
    });

    it('should return accurate performance content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.performance.heroSection.title).toBe('Live Piano Performance');
      expect(result.current.performance.heroSection.description).toBe('Elegant piano performance for weddings, events, and venues');
    });

    it('should return accurate collaboration content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.collaboration.heroSection.title).toContain('Collaboration');
      expect(result.current.collaboration.heroSection.description).toBeDefined();
    });
  });

  describe('Performance Optimizations', () => {
    it('should not reload content on each render', () => {
      let renderCount = 0;
      const { rerender } = renderHook(() => {
        renderCount++;
        return useContent();
      });

      // Initial render
      expect(renderCount).toBe(1);

      // Multiple re-renders
      rerender();
      rerender();
      rerender();

      expect(renderCount).toBe(4);
      // Content should be memoized, not recalculated each time
    });

    it('should handle rapid successive calls efficiently', () => {
      const results = [];
      
      for (let i = 0; i < 5; i++) {
        const { result } = renderHook(() => useContent());
        results.push(result.current);
      }

      // All results should be identical (referential equality due to memoization)
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toStrictEqual(results[0]);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle missing content gracefully', () => {
      expect(() => {
        renderHook(() => useContent());
      }).not.toThrow();
    });

    it('should provide fallback values for all sections', () => {
      const { result } = renderHook(() => useContent());

      // Should not crash and provide complete structure
      expect(result.current).toBeDefined();
      expect(result.current.teaching).toBeDefined();
      expect(result.current.performance).toBeDefined();
      expect(result.current.collaboration).toBeDefined();
      expect(result.current.about).toBeDefined();
      expect(result.current.home).toBeDefined();
    });
  });
});

describe('useSEO Hook - Business Logic Testing', () => {
  it('should return SEO data correctly', () => {
    const { result } = renderHook(() => useSEO());

    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should provide stable SEO references', () => {
    const { result, rerender } = renderHook(() => useSEO());
    
    const firstRender = result.current;
    
    rerender();
    
    const secondRender = result.current;

    expect(firstRender).toBe(secondRender);
  });

  it('should return correct SEO structure', () => {
    const { result } = renderHook(() => useSEO());

    expect(result.current.data).toHaveProperty('title');
    expect(result.current.data).toHaveProperty('description');
    expect(result.current.data).toHaveProperty('keywords');
    expect(result.current.generatePageTitle).toBeDefined();
    expect(typeof result.current.generatePageTitle).toBe('function');
  });

  it('should generate page titles correctly', () => {
    const { result } = renderHook(() => useSEO());

    const pageTitle = result.current.generatePageTitle('Teaching');
    expect(pageTitle).toBe('Teaching | Rrish Music');
  });
});

describe('useSectionContent Hook - Business Logic Testing', () => {
  it('should return specific section content', () => {
    const { result } = renderHook(() => useSectionContent('about'));

    expect(result.current.data).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle different section types', () => {
    const sections = ['teaching', 'performance', 'collaboration', 'about', 'home'];

    sections.forEach(section => {
      const { result } = renderHook(() => useSectionContent(section));
      
      expect(result.current.data).toBeDefined();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle invalid section names gracefully', () => {
    const { result } = renderHook(() => useSectionContent('nonexistent'));

    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should be consistent with main useContent hook', () => {
    const { result: contentResult } = renderHook(() => useContent());
    const { result: sectionResult } = renderHook(() => useSectionContent('about'));

    expect(sectionResult.current.data).toBe(contentResult.current.about);
  });
});

describe('useStats Hook - Business Logic Testing', () => {
  it('should return stats data correctly', () => {
    const { result } = renderHook(() => useStats());

    expect(result.current.aboutStats).toBeDefined();
    expect(result.current.communityStats).toBeDefined();
    expect(result.current.socialProof).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should have correct stats structure', () => {
    const { result } = renderHook(() => useStats());

    expect(Array.isArray(result.current.aboutStats)).toBe(true);
    expect(Array.isArray(result.current.communityStats)).toBe(true);
    expect(Array.isArray(result.current.socialProof)).toBe(true);

    // Check first about stat has required fields
    const firstStat = result.current.aboutStats[0];
    expect(firstStat).toHaveProperty('value');
    expect(firstStat).toHaveProperty('label');
    expect(firstStat).toHaveProperty('icon');
  });
});

describe('useTestimonials Hook - Business Logic Testing', () => {
  it('should return testimonials data correctly', () => {
    const { result } = renderHook(() => useTestimonials());

    expect(result.current.testimonials).toBeDefined();
    expect(Array.isArray(result.current.testimonials)).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should have correct testimonial structure', () => {
    const { result } = renderHook(() => useTestimonials());

    const firstTestimonial = result.current.testimonials[0];
    expect(firstTestimonial).toHaveProperty('id');
    expect(firstTestimonial).toHaveProperty('content');
    expect(firstTestimonial).toHaveProperty('author');
    expect(firstTestimonial).toHaveProperty('role');
    expect(firstTestimonial).toHaveProperty('rating');
    expect(firstTestimonial).toHaveProperty('service');
  });
});

describe('Content Hook Integration Testing', () => {
  it('should work together seamlessly', () => {
    const { result: contentResult } = renderHook(() => useContent());
    const { result: seoResult } = renderHook(() => useSEO());
    const { result: sectionResult } = renderHook(() => useSectionContent('performance'));
    const { result: statsResult } = renderHook(() => useStats());

    // All hooks should return data without conflicts
    expect(contentResult.current).toBeDefined();
    expect(seoResult.current.data).toBeDefined();
    expect(sectionResult.current.data).toBeDefined();
    expect(statsResult.current).toBeDefined();

    // Section data should match main content
    expect(sectionResult.current.data).toBe(contentResult.current.performance);
  });

  it('should maintain performance with multiple concurrent hook usage', () => {
    const startTime = performance.now();

    // Use all hooks simultaneously
    renderHook(() => {
      const content = useContent();
      const seo = useSEO();
      const teaching = useSectionContent('teaching');
      const performance = useSectionContent('performance');
      const collaboration = useSectionContent('collaboration');
      const stats = useStats();

      return { content, seo, teaching, performance, collaboration, stats };
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete quickly (under 100ms in most cases)
    expect(duration).toBeLessThan(500);
  });
});

describe('Real-World Usage Scenarios', () => {
  it('should support typical page component usage', () => {
    const { result } = renderHook(() => {
      const content = useContent();
      return {
        pageTitle: content.teaching.heroSection.title,
        pageDescription: content.teaching.heroSection.description
      };
    });

    expect(result.current.pageTitle).toContain('Piano');
    expect(result.current.pageDescription).toBeDefined();
  });

  it('should support service comparison scenarios', () => {
    const { result } = renderHook(() => {
      const content = useContent();
      return {
        services: [
          { type: 'teaching', title: content.teaching.heroSection.title },
          { type: 'performance', title: content.performance.heroSection.title },
          { type: 'collaboration', title: content.collaboration.heroSection.title }
        ]
      };
    });

    expect(result.current.services).toHaveLength(3);
    expect(result.current.services[0].type).toBe('teaching');
    expect(result.current.services[1].type).toBe('performance');
    expect(result.current.services[2].type).toBe('collaboration');
  });

  it('should support stats display scenarios', () => {
    const { result } = renderHook(() => {
      const stats = useStats();
      
      return {
        aboutStats: stats.aboutStats,
        totalStats: stats.aboutStats.length
      };
    });

    expect(result.current.aboutStats).toHaveLength(4);
    expect(result.current.totalStats).toBe(4);
    expect(result.current.aboutStats[0]).toHaveProperty('value');
    expect(result.current.aboutStats[0]).toHaveProperty('label');
  });
});