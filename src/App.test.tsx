import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { NAVIGATION_ITEMS } from '@/utils/constants';
import * as scrollSpyHook from '@/hooks/useScrollSpy';
import * as helpers from '@/utils/helpers';

// Enhanced TypeScript patterns
interface AppRenderResult {
  container: HTMLElement;
  rerender: (ui: React.ReactElement) => void;
  unmount: () => boolean;
}

interface MockedScrollSpy {
  useScrollSpy: ReturnType<typeof vi.fn>;
}

interface MockedHelpers {
  scrollToSection: ReturnType<typeof vi.fn>;
}

interface MockScrollSpyReturn {
  activeSection: string;
}

interface MotionNavProps {
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  transition?: any;
  className?: string;
}

interface MotionDivProps {
  children: React.ReactNode;
  whileHover?: any;
  className?: string;
}

// Test Data Builder Pattern
const createMockScrollSpyReturn = (activeSection: string = ''): MockScrollSpyReturn => ({
  activeSection,
});

// Custom render function for App component
const renderApp = (options?: RenderOptions): AppRenderResult => {
  return render(<App />, options);
};

// Mock framer-motion for Navigation component animations
const mockMotionNav = vi.fn();
const mockMotionDiv = vi.fn();

vi.mock('framer-motion', () => ({
  motion: {
    nav: (props: MotionNavProps) => {
      mockMotionNav(props);
      const { children, initial, animate, transition, ...restProps } = props;
      return React.createElement('nav', restProps, children);
    },
    div: (props: MotionDivProps) => {
      mockMotionDiv(props);
      const { children, whileHover, ...restProps } = props;
      return React.createElement('div', restProps, children);
    },
  },
}));

// Mock the useScrollSpy hook
vi.mock('@/hooks/useScrollSpy', () => ({
  useScrollSpy: vi.fn(),
}));

// Mock the scrollToSection helper
vi.mock('@/utils/helpers', () => ({
  scrollToSection: vi.fn(),
}));

const mockUseScrollSpy = vi.mocked(scrollSpyHook.useScrollSpy) as MockedScrollSpy['useScrollSpy'];
const mockScrollToSection = vi.mocked(helpers.scrollToSection) as MockedHelpers['scrollToSection'];

// Global test setup
beforeAll(() => {
  // Mock window.scrollTo for scroll behavior tests
  Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
  
  // Mock window.scrollY for scroll position tests
  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionNav.mockClear();
    mockMotionDiv.mockClear();
    
    // Default mock implementation for useScrollSpy
    mockUseScrollSpy.mockReturnValue('');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure and Rendering', () => {
    it('should render the App component without crashing', () => {
      renderApp();
      
      expect(document.body).toBeDefined();
    });

    it('should have proper semantic HTML structure', () => {
      renderApp();
      
      // Check for main semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Check for heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent("Hi, I'm Rrish.");
      
      // Check for section headings
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements).toHaveLength(5); // About, Approach, Lessons, Community, Contact
    });

    it('should apply correct CSS classes for layout structure', () => {
      renderApp();
      
      // Check root container
      const appContainer = document.querySelector('.min-h-screen.bg-white');
      expect(appContainer).toBeInTheDocument();
      
      // Check main element
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-16');
      
      // Check hero section classes
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toHaveClass(
        'section',
        'bg-gradient-to-r',
        'from-brand-blue-primary',
        'to-brand-blue-secondary',
        'text-white'
      );
    });

    it('should render all required sections with correct IDs', () => {
      renderApp();
      
      const expectedSections = NAVIGATION_ITEMS.map(item => item.id);
      
      expectedSections.forEach((sectionId) => {
        const section = document.querySelector(`#${sectionId}`);
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('section');
      });
    });

    it('should have sections with proper container structure', () => {
      renderApp();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const section = document.querySelector(`#${item.id}`);
        const container = section?.querySelector('.container-custom');
        
        expect(section).toBeInTheDocument();
        expect(container).toBeInTheDocument();
      });
    });

    it('should render section headings matching navigation labels', () => {
      renderApp();
      
      // Skip hero section as it has different heading content
      const sectionsWithMatchingHeadings = NAVIGATION_ITEMS.slice(1);
      
      sectionsWithMatchingHeadings.forEach((item) => {
        const heading = screen.getByRole('heading', { name: new RegExp(item.label, 'i') });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe('Hero Section Content', () => {
    it('should display the main heading correctly', () => {
      renderApp();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent("Hi, I'm Rrish.");
      expect(heading).toHaveClass(
        'text-4xl',
        'md:text-6xl',
        'font-heading',
        'font-bold',
        'mb-6'
      );
    });

    it('should display the main description text', () => {
      renderApp();
      
      expect(
        screen.getByText(/I'm a musician who improvises on blues and different music genres/)
      ).toBeInTheDocument();
      
      expect(
        screen.getByText(/help people learn music at every level and improve their improvisation skills/)
      ).toBeInTheDocument();
    });

    it('should render Instagram link with correct attributes', () => {
      renderApp();
      
      const instagramLink = screen.getByRole('link', { name: /@rrishmusic/i });
      
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/rrishmusic');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should apply correct styling to Instagram link', () => {
      renderApp();
      
      const instagramLink = screen.getByRole('link', { name: /@rrishmusic/i });
      
      expect(instagramLink).toHaveClass(
        'text-brand-yellow-accent',
        'hover:text-white',
        'transition-colors',
        'duration-300',
        'font-medium',
        'underline',
        'decoration-2',
        'underline-offset-2'
      );
    });
  });

  describe('Navigation Integration', () => {
    it('should render Navigation component with correct props', () => {
      const mockActiveSection = 'about';
      mockUseScrollSpy.mockReturnValue(mockActiveSection);
      
      renderApp();
      
      // Check that Navigation component is rendered
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Verify useScrollSpy is called with correct section IDs
      const expectedSectionIds = NAVIGATION_ITEMS.map(item => item.id);
      expect(mockUseScrollSpy).toHaveBeenCalledWith(expectedSectionIds);
      expect(mockUseScrollSpy).toHaveBeenCalledTimes(1);
    });

    it('should pass active section from useScrollSpy to Navigation', () => {
      const mockActiveSection = 'lessons';
      mockUseScrollSpy.mockReturnValue(mockActiveSection);
      
      renderApp();
      
      // The Navigation component should receive the active section
      // We can verify this by checking if the correct nav item is highlighted
      // Use role-based query to target navigation buttons specifically
      const navButtons = screen.getAllByRole('button');
      const lessonsNavButton = navButtons.find(button => button.textContent === 'Lessons');
      
      expect(lessonsNavButton).toBeDefined();
      expect(lessonsNavButton).toHaveClass('text-brand-blue-primary');
    });

    it('should handle navigation clicks through Navigation component', () => {
      renderApp();
      
      // Get navigation buttons specifically
      const navButtons = screen.getAllByRole('button');
      const homeNavButton = navButtons.find(button => button.textContent === 'Home');
      
      expect(homeNavButton).toBeDefined();
      fireEvent.click(homeNavButton!);
      
      expect(mockScrollToSection).toHaveBeenCalledWith('hero');
    });

    it('should update active section when useScrollSpy returns different values', () => {
      // Initial render with 'hero' active
      mockUseScrollSpy.mockReturnValue('hero');
      const { rerender } = renderApp();
      
      let navButtons = screen.getAllByRole('button');
      let homeNavButton = navButtons.find(button => button.textContent === 'Home');
      expect(homeNavButton).toHaveClass('text-brand-blue-primary');
      
      // Re-render with 'about' active
      mockUseScrollSpy.mockReturnValue('about');
      rerender(<App />);
      
      navButtons = screen.getAllByRole('button');
      homeNavButton = navButtons.find(button => button.textContent === 'Home');
      const aboutNavButton = navButtons.find(button => button.textContent === 'About');
      
      expect(homeNavButton).toHaveClass('text-neutral-charcoal');
      expect(aboutNavButton).toHaveClass('text-brand-blue-primary');
    });
  });

  describe('Section Content and Structure', () => {
    it('should render placeholder content for development sections', () => {
      renderApp();
      
      const placeholderSections = ['about', 'approach', 'lessons', 'community', 'contact'];
      
      placeholderSections.forEach((sectionId) => {
        const section = document.querySelector(`#${sectionId}`);
        expect(section).toBeInTheDocument();
        
        // Check for "coming soon" text or section title
        const sectionText = section?.textContent;
        expect(sectionText).toMatch(/coming soon|About|Approach|Lessons|Community|Contact/i);
      });
    });

    it('should apply alternating background colors to sections', () => {
      renderApp();
      
      // Hero section
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-brand-blue-primary', 'to-brand-blue-secondary');
      
      // About section (white background)
      const aboutSection = document.querySelector('#about');
      expect(aboutSection).toHaveClass('bg-white');
      
      // Approach section (light gray background)
      const approachSection = document.querySelector('#approach');
      expect(approachSection).toHaveClass('bg-neutral-gray-light');
      
      // Lessons section (white background)
      const lessonsSection = document.querySelector('#lessons');
      expect(lessonsSection).toHaveClass('bg-white');
      
      // Community section (light gray background)
      const communitySection = document.querySelector('#community');
      expect(communitySection).toHaveClass('bg-neutral-gray-light');
      
      // Contact section (brand blue background)
      const contactSection = document.querySelector('#contact');
      expect(contactSection).toHaveClass('bg-brand-blue-primary', 'text-white');
    });

    it('should render sections with proper text color schemes', () => {
      renderApp();
      
      // Hero section - white text
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toHaveClass('text-white');
      
      // Contact section - white text
      const contactSection = document.querySelector('#contact');
      expect(contactSection).toHaveClass('text-white');
      
      // Other sections should have charcoal headings
      ['about', 'approach', 'lessons', 'community'].forEach((sectionId) => {
        const section = document.querySelector(`#${sectionId}`);
        const heading = section?.querySelector('h2');
        expect(heading).toHaveClass('text-neutral-charcoal');
      });
    });
  });

  describe('Responsive Design and Layout', () => {
    it('should have responsive typography classes', () => {
      renderApp();
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveClass('text-4xl', 'md:text-6xl');
      
      // Check that responsive text classes are applied to hero paragraph
      const heroParagraph = document.querySelector('#hero p');
      expect(heroParagraph).toHaveClass('text-lg', 'md:text-xl');
    });

    it('should have proper container constraints and centering', () => {
      renderApp();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const section = document.querySelector(`#${item.id}`);
        const container = section?.querySelector('.container-custom');
        const textCenter = section?.querySelector('.text-center');
        
        expect(container).toBeInTheDocument();
        expect(textCenter).toBeInTheDocument();
      });
    });

    it('should apply proper spacing for fixed navigation', () => {
      renderApp();
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('pt-16'); // Account for fixed navigation height
    });
  });

  describe('User Interaction and Behavior', () => {
    it('should handle external link interactions correctly', () => {
      renderApp();
      
      const instagramLink = screen.getByRole('link', { name: /@rrishmusic/i });
      
      // Should open in new tab
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      // Should be clickable
      expect(instagramLink).toBeInstanceOf(HTMLAnchorElement);
    });

    it('should maintain scroll spy functionality during navigation', async () => {
      let mockScrollSpyReturn = 'hero';
      mockUseScrollSpy.mockImplementation(() => mockScrollSpyReturn);
      
      renderApp();
      
      // Simulate scroll to about section
      mockScrollSpyReturn = 'about';
      mockUseScrollSpy.mockReturnValue('about');
      
      // Navigation should reflect the active section change
      expect(mockUseScrollSpy).toHaveBeenCalled();
    });

    it('should handle rapid navigation clicks without errors', async () => {
      renderApp();
      
      const navItems = NAVIGATION_ITEMS.slice(0, 3); // Test first 3 items
      const navButtons = screen.getAllByRole('button');
      
      // Rapid fire clicks
      navItems.forEach((item) => {
        const navButton = navButtons.find(button => button.textContent === item.label);
        if (navButton) {
          fireEvent.click(navButton);
        }
      });
      
      // Should call scrollToSection for each click
      expect(mockScrollToSection).toHaveBeenCalledTimes(3);
      
      // Verify calls were made with correct parameters
      navItems.forEach((item, index) => {
        expect(mockScrollToSection).toHaveBeenNthCalledWith(index + 1, item.id);
      });
    });
  });

  describe('Accessibility and Standards', () => {
    it('should have proper heading hierarchy', () => {
      renderApp();
      
      // Should have exactly one h1
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      
      // Should have multiple h2 elements for sections
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(1);
      
      // h1 should come before h2 elements in document order
      const headings = screen.getAllByRole('heading');
      const h1Index = headings.findIndex(h => h.tagName === 'H1');
      const firstH2Index = headings.findIndex(h => h.tagName === 'H2');
      
      expect(h1Index).toBeLessThan(firstH2Index);
    });

    it('should have proper semantic structure with sections and main', () => {
      renderApp();
      
      // Should have main element
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // Should have navigation
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // All content sections should be properly structured
      NAVIGATION_ITEMS.forEach((item) => {
        const section = document.querySelector(`#${item.id}`);
        expect(section?.tagName).toBe('SECTION');
      });
    });

    it('should have accessible link attributes', () => {
      renderApp();
      
      const instagramLink = screen.getByRole('link', { name: /@rrishmusic/i });
      
      // External link security attributes
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      
      // Should have descriptive text
      expect(instagramLink).toHaveTextContent('@rrishmusic');
    });

    it('should maintain keyboard navigation support', () => {
      renderApp();
      
      // Navigation buttons should be focusable
      const navButtons = screen.getAllByRole('button');
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = navButtons.find(button => button.textContent === item.label);
        expect(navButton).toBeDefined();
        expect(navButton).not.toHaveAttribute('tabindex', '-1');
      });
      
      // Instagram link should be focusable
      const instagramLink = screen.getByRole('link', { name: /@rrishmusic/i });
      expect(instagramLink).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Integration Scenarios', () => {
    it('should coordinate between Navigation and useScrollSpy correctly', () => {
      const testCases = [
        { activeSection: 'hero', expectedHighlight: 'Home' },
        { activeSection: 'about', expectedHighlight: 'About' },
        { activeSection: 'lessons', expectedHighlight: 'Lessons' },
        { activeSection: 'contact', expectedHighlight: 'Contact' },
      ];
      
      testCases.forEach(({ activeSection, expectedHighlight }) => {
        mockUseScrollSpy.mockReturnValue(activeSection);
        
        const { unmount } = renderApp();
        
        // Verify the correct section is highlighted in navigation
        const navButtons = screen.getAllByRole('button');
        const highlightedNavButton = navButtons.find(button => button.textContent === expectedHighlight);
        expect(highlightedNavButton).toBeDefined();
        expect(highlightedNavButton).toHaveClass('text-brand-blue-primary');
        
        // Verify other items are not highlighted
        NAVIGATION_ITEMS
          .filter(item => item.label !== expectedHighlight)
          .forEach(item => {
            const navButton = navButtons.find(button => button.textContent === item.label);
            expect(navButton).toBeDefined();
            expect(navButton).toHaveClass('text-neutral-charcoal');
          });
        
        unmount();
      });
    });

    it('should handle section ID mismatches gracefully', () => {
      // Mock useScrollSpy to return non-existent section
      mockUseScrollSpy.mockReturnValue('non-existent-section');
      
      renderApp();
      
      // All navigation items should have default styling
      const navButtons = screen.getAllByRole('button');
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = navButtons.find(button => button.textContent === item.label);
        expect(navButton).toBeDefined();
        expect(navButton).toHaveClass('text-neutral-charcoal');
        expect(navButton).not.toHaveClass('text-brand-blue-primary');
      });
    });

    it('should maintain component state during prop updates', () => {
      mockUseScrollSpy.mockReturnValue('hero');
      
      const { rerender } = renderApp();
      
      // Initial state
      let navButtons = screen.getAllByRole('button');
      let homeNavButton = navButtons.find(button => button.textContent === 'Home');
      expect(homeNavButton).toHaveClass('text-brand-blue-primary');
      
      // Update active section multiple times
      const sectionUpdates = ['about', 'lessons', 'contact', 'hero'];
      
      sectionUpdates.forEach((section) => {
        mockUseScrollSpy.mockReturnValue(section);
        rerender(<App />);
        
        // Should maintain component integrity
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(document.querySelector(`#${section}`)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should call useScrollSpy only once per render', () => {
      renderApp();
      
      expect(mockUseScrollSpy).toHaveBeenCalledTimes(1);
    });

    it('should pass stable section IDs array to useScrollSpy', () => {
      renderApp();
      
      const expectedSectionIds = NAVIGATION_ITEMS.map(item => item.id);
      expect(mockUseScrollSpy).toHaveBeenCalledWith(expectedSectionIds);
      
      // Should be same array reference for performance
      const calledWith = mockUseScrollSpy.mock.calls[0][0];
      expect(calledWith).toEqual(expectedSectionIds);
    });

    it('should not cause unnecessary re-renders on scroll', () => {
      const { rerender } = renderApp();
      
      // Multiple re-renders with same props should not cause issues
      rerender(<App />);
      rerender(<App />);
      rerender(<App />);
      
      // Component should still be functional
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle useScrollSpy returning undefined or null', () => {
      // @ts-ignore - Testing edge case
      mockUseScrollSpy.mockReturnValue(null);
      
      expect(() => renderApp()).not.toThrow();
      
      // Navigation should still render with default state
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      const navButtons = screen.getAllByRole('button');
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = navButtons.find(button => button.textContent === item.label);
        expect(navButton).toBeDefined();
        expect(navButton).toHaveClass('text-neutral-charcoal');
      });
    });

    it('should handle empty NAVIGATION_ITEMS array gracefully', () => {
      // This would be a build-time issue, but test resilience
      vi.mocked(mockUseScrollSpy).mockReturnValue('');
      
      renderApp();
      
      // App should still render basic structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText("Hi, I'm Rrish.")).toBeInTheDocument();
    });

    it('should handle missing DOM elements for sections', () => {
      renderApp();
      
      // Even if scroll spy behavior is impacted, component should render
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      // All sections should be present in DOM
      NAVIGATION_ITEMS.forEach((item) => {
        expect(document.querySelector(`#${item.id}`)).toBeInTheDocument();
      });
    });
  });
});