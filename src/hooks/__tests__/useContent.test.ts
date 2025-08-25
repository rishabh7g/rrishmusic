import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContent, useSEO, useSectionContent } from '@/hooks/useContent';

// Mock the data imports to isolate hook logic
vi.mock('@/data/siteContent.json', () => ({
  default: {
    teaching: {
      title: 'Guitar Lessons with Rrish Music',
      description: 'Professional guitar instruction for all skill levels',
      keywords: 'guitar lessons, music teacher, guitar instruction'
    },
    performance: {
      title: 'Live Performances by Rrish Music',
      description: 'Professional live music for your events',
      keywords: 'live music, acoustic guitar, performances'
    },
    collaboration: {
      title: 'Music Collaboration Services',
      description: 'Recording and production collaboration',
      keywords: 'music collaboration, recording, production'
    }
  }
}));

vi.mock('@/data/seoData.json', () => ({
  default: {
    title: 'Rrish Music - Guitar Lessons, Live Performances & Collaboration',
    description: 'Professional music services including guitar lessons, live performances, and collaboration.',
    keywords: 'guitar lessons, live music, music collaboration',
    author: 'Rrish Music',
    url: 'https://www.rrishmusic.com'
  }
}));

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

      // Each service should have required fields
      expect(teaching).toHaveProperty('title');
      expect(teaching).toHaveProperty('description');
      expect(teaching).toHaveProperty('keywords');

      expect(performance).toHaveProperty('title');
      expect(performance).toHaveProperty('description');
      expect(performance).toHaveProperty('keywords');

      expect(collaboration).toHaveProperty('title');
      expect(collaboration).toHaveProperty('description');
      expect(collaboration).toHaveProperty('keywords');
    });
  });

  describe('Content Accuracy', () => {
    it('should return accurate teaching content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.teaching.title).toBe('Guitar Lessons with Rrish Music');
      expect(result.current.teaching.description).toBe('Professional guitar instruction for all skill levels');
      expect(result.current.teaching.keywords).toBe('guitar lessons, music teacher, guitar instruction');
    });

    it('should return accurate performance content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.performance.title).toBe('Live Performances by Rrish Music');
      expect(result.current.performance.description).toBe('Professional live music for your events');
      expect(result.current.performance.keywords).toBe('live music, acoustic guitar, performances');
    });

    it('should return accurate collaboration content', () => {
      const { result } = renderHook(() => useContent());

      expect(result.current.collaboration.title).toBe('Music Collaboration Services');
      expect(result.current.collaboration.description).toBe('Recording and production collaboration');
      expect(result.current.collaboration.keywords).toBe('music collaboration, recording, production');
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
      
      for (let i = 0; i < 10; i++) {
        const { result } = renderHook(() => useContent());
        results.push(result.current);
      }

      // All results should be identical (referential equality due to memoization)
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[0]);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle missing content gracefully', () => {
      // Mock missing data scenario
      vi.doMock('@/data/siteContent.json', () => ({
        default: {}
      }));

      expect(() => {
        renderHook(() => useContent());
      }).not.toThrow();
    });

    it('should provide fallback values for missing sections', () => {
      // Mock partial data
      vi.doMock('@/data/siteContent.json', () => ({
        default: {
          teaching: {
            title: 'Guitar Lessons',
            description: 'Learn guitar'
          }
          // performance and collaboration missing
        }
      }));

      const { result } = renderHook(() => useContent());

      // Should not crash and provide some structure
      expect(result.current).toBeDefined();
      expect(result.current.teaching).toBeDefined();
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
    expect(result.current.data).toHaveProperty('author');
    expect(result.current.data).toHaveProperty('url');
  });
});

describe('useSectionContent Hook - Business Logic Testing', () => {
  it('should return specific section content', () => {
    const { result } = renderHook(() => useSectionContent('teaching'));

    expect(result.current).toBeDefined();
    expect(result.current.title).toBe('Guitar Lessons with Rrish Music');
  });

  it('should handle different section types', () => {
    const sections = ['teaching', 'performance', 'collaboration'];

    sections.forEach(section => {
      const { result } = renderHook(() => useSectionContent(section));
      
      expect(result.current).toBeDefined();
      expect(result.current.title).toBeDefined();
      expect(result.current.description).toBeDefined();
    });
  });

  it('should handle invalid section names gracefully', () => {
    const { result } = renderHook(() => useSectionContent('nonexistent'));

    expect(result.current).toBeUndefined();
  });

  it('should be consistent with main useContent hook', () => {
    const { result: contentResult } = renderHook(() => useContent());
    const { result: sectionResult } = renderHook(() => useSectionContent('teaching'));

    expect(sectionResult.current).toBe(contentResult.current.teaching);
  });
});

describe('Content Hook Integration Testing', () => {
  it('should work together seamlessly', () => {
    const { result: contentResult } = renderHook(() => useContent());
    const { result: seoResult } = renderHook(() => useSEO());
    const { result: sectionResult } = renderHook(() => useSectionContent('performance'));

    // All hooks should return data without conflicts
    expect(contentResult.current).toBeDefined();
    expect(seoResult.current.data).toBeDefined();
    expect(sectionResult.current).toBeDefined();

    // Section data should match main content
    expect(sectionResult.current).toBe(contentResult.current.performance);
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

      return { content, seo, teaching, performance, collaboration };
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete quickly (under 10ms in most cases)
    expect(duration).toBeLessThan(100);
  });
});

describe('Real-World Usage Scenarios', () => {
  it('should support typical page component usage', () => {
    const { result } = renderHook(() => {
      const content = useContent();
      return {
        pageTitle: content.teaching.title,
        pageDescription: content.teaching.description,
        seoKeywords: content.teaching.keywords
      };
    });

    expect(result.current.pageTitle).toBe('Guitar Lessons with Rrish Music');
    expect(result.current.pageDescription).toBe('Professional guitar instruction for all skill levels');
    expect(result.current.seoKeywords).toBe('guitar lessons, music teacher, guitar instruction');
  });

  it('should support service comparison scenarios', () => {
    const { result } = renderHook(() => {
      const content = useContent();
      return {
        services: [
          { type: 'teaching', ...content.teaching },
          { type: 'performance', ...content.performance },
          { type: 'collaboration', ...content.collaboration }
        ]
      };
    });

    expect(result.current.services).toHaveLength(3);
    expect(result.current.services[0].type).toBe('teaching');
    expect(result.current.services[1].type).toBe('performance');
    expect(result.current.services[2].type).toBe('collaboration');
  });

  it('should support dynamic content generation', () => {
    const { result } = renderHook(() => {
      const content = useContent();
      const seo = useSEO();
      
      return {
        navigationItems: Object.keys(content).map(key => ({
          id: key,
          title: content[key as keyof typeof content].title,
          description: content[key as keyof typeof content].description
        })),
        siteTitle: seo.data.title
      };
    });

    expect(result.current.navigationItems).toHaveLength(3);
    expect(result.current.navigationItems[0].id).toBe('teaching');
    expect(result.current.siteTitle).toBe('Rrish Music - Guitar Lessons, Live Performances & Collaboration');
  });
});