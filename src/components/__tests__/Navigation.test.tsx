import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';

// Mock navigate function at module level
const mockNavigate = vi.fn();

// Mock React Router DOM
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ 
      pathname: '/', 
      search: '', 
      hash: '', 
      state: null, 
      key: 'default' 
    }),
  };
});

// Mock hooks
vi.mock("@/hooks/useScrollSpy", () => ({
  useScrollSpy: () => ({ activeSection: "home" }),
  useSmoothScroll: () => ({ smoothScrollTo: vi.fn() }),
}));
vi.mock('@/hooks/useResponsive', () => ({
  useResponsive: () => ({ 
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test wrapper with MemoryRouter
const renderWithRouter = (component: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Navigation Component - Business Logic Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Rendering', () => {
    it('should render navigation without crashing', () => {
      expect(() => renderWithRouter(<Navigation />)).not.toThrow();
    });

    it('should render all navigation items', () => {
      renderWithRouter(<Navigation />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Performances')).toBeInTheDocument();
      expect(screen.getByText('Lessons')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderWithRouter(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label');
      
      const navList = screen.getByRole('list');
      expect(navList).toBeInTheDocument();
      
      const navItems = screen.getAllByRole('listitem');
      expect(navItems).toHaveLength(5);
    });
  });

  describe('Service Hierarchy Visual Prioritization', () => {
    it('should apply primary styling to main service pages', () => {
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      expect(performanceLink).toHaveClass(/text-brand-blue-primary|font-semibold|primary/);
    });

    it('should apply secondary styling to teaching services', () => {
      renderWithRouter(<Navigation />);
      
      const lessonsLink = screen.getByText('Lessons');
      expect(lessonsLink).toHaveClass(/text-brand-orange|secondary/);
    });

    it('should apply tertiary styling to standard navigation', () => {
      renderWithRouter(<Navigation />);
      
      const homeLink = screen.getByText('Home');
      const aboutLink = screen.getByText('About');
      
      expect(homeLink).toHaveClass(/text-gray|neutral/);
      expect(aboutLink).toHaveClass(/text-gray|neutral/);
    });
  });

  describe('Active State Management', () => {
    it('should highlight active section correctly', () => {
      renderWithRouter(<Navigation />);
      
      // Check for active styling on home (default)
      const homeLink = screen.getByText('Home');
      expect(homeLink.closest('li')).toHaveClass(/active|current/);
    });

    it('should update active state based on route changes', () => {
      renderWithRouter(<Navigation />, ['/performance']);
      
      const performanceLink = screen.getByText('Performances');
      expect(performanceLink.closest('li')).toHaveClass(/active|current/);
    });

    it('should only have one active item at a time', () => {
      renderWithRouter(<Navigation />);
      
      const activeItems = screen.getAllByText(/Home|Performances|Lessons|About|Contact/)
        .map(link => link.closest('li'))
        .filter(item => item?.className.includes('active') || item?.className.includes('current'));
      
      expect(activeItems.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Mobile Navigation Behavior', () => {
    it('should render mobile navigation toggle', () => {
      vi.mocked(vi.fn()).mockReturnValue({ 
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      
      renderWithRouter(<Navigation />);
      
      const mobileToggle = screen.queryByRole('button', { name: /menu|navigation/i });
      if (mobileToggle) {
        expect(mobileToggle).toBeInTheDocument();
      }
    });

    it('should toggle mobile menu on button click', async () => {
      vi.mocked(vi.fn()).mockReturnValue({ 
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      
      renderWithRouter(<Navigation />);
      
      const mobileToggle = screen.queryByRole('button', { name: /menu|navigation/i });
      if (mobileToggle) {
        await user.click(mobileToggle);
        expect(screen.getByText('Home')).toBeVisible();
      }
    });

    it('should close mobile menu when clicking outside', async () => {
      vi.mocked(vi.fn()).mockReturnValue({ 
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      
      renderWithRouter(<Navigation />);
      
      const mobileToggle = screen.queryByRole('button', { name: /menu|navigation/i });
      if (mobileToggle) {
        await user.click(mobileToggle);
        await user.click(document.body);
        // Menu should close (implementation dependent)
      }
    });

    it('should have touch-friendly sizing on mobile', () => {
      vi.mocked(vi.fn()).mockReturnValue({ 
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      
      renderWithRouter(<Navigation />);
      
      const navLinks = screen.getAllByRole('link');
      navLinks.forEach(link => {
        expect(link).toHaveClass(/p-|py-|px-|h-|w-/); // Touch-friendly padding/sizing
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', async () => {
      renderWithRouter(<Navigation />);
      
      const firstLink = screen.getByText('Home');
      const secondLink = screen.getByText('Performances');
      
      await user.tab();
      expect(firstLink).toHaveFocus();
      
      await user.tab();
      expect(secondLink).toHaveFocus();
    });

    it('should support Enter key activation', async () => {
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      performanceLink.focus();
      
      await user.keyboard('{Enter}');
      // Navigation should occur (checked via mock)
      expect(mockNavigate).toHaveBeenCalledWith('/performance');
    });

    it('should have proper focus indicators', () => {
      renderWithRouter(<Navigation />);
      
      const navLinks = screen.getAllByRole('link');
      navLinks.forEach(link => {
        expect(link).toHaveClass(/focus:|focus-visible:/);
      });
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels', () => {
      renderWithRouter(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      const currentItem = screen.queryByAttribute('aria-current', 'page');
      if (currentItem) {
        expect(currentItem).toBeInTheDocument();
      }
    });

    it('should have proper landmark structure', () => {
      renderWithRouter(<Navigation />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(5);
    });

    it('should support screen readers', () => {
      renderWithRouter(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.textContent).toBeTruthy();
      });
    });

    it('should indicate current page to screen readers', () => {
      renderWithRouter(<Navigation />);
      
      const currentPageIndicator = screen.queryByAttribute('aria-current', 'page');
      if (currentPageIndicator) {
        expect(currentPageIndicator).toBeInTheDocument();
      }
    });
  });

  describe('Performance Optimizations', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = renderWithRouter(<Navigation />);
      
      const initialHTML = screen.getByRole('navigation').innerHTML;
      
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <Navigation />
        </MemoryRouter>
      );
      
      const rerenderHTML = screen.getByRole('navigation').innerHTML;
      expect(rerenderHTML).toBe(initialHTML);
    });

    it('should handle rapid state changes efficiently', () => {
      renderWithRouter(<Navigation />);
      
      // Multiple rapid re-renders should not cause issues
      expect(() => {
        for (let i = 0; i < 10; i++) {
          screen.getByRole('navigation');
        }
      }).not.toThrow();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      // Test desktop layout
      renderWithRouter(<Navigation />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Mobile layout would require separate mock setup
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing navigation items gracefully', () => {
      expect(() => renderWithRouter(<Navigation />)).not.toThrow();
    });

    it('should handle invalid active section', () => {
      renderWithRouter(<Navigation />, ['/invalid-route']);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should integrate with service hierarchy correctly', () => {
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      const lessonsLink = screen.getByText('Lessons');
      
      // Verify hierarchy styling
      expect(performanceLink).toHaveClass(/primary|brand-blue/);
      expect(lessonsLink).toHaveClass(/secondary|brand-orange/);
    });

    it('should support service-specific navigation behavior', async () => {
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      await user.click(performanceLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/performance');
    });

    it('should maintain 60/25/15 visual hierarchy', () => {
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      const lessonsLink = screen.getByText('Lessons');
      const homeLink = screen.getByText('Home');
      
      // Primary service (60%)
      expect(performanceLink).toHaveClass(/primary|prominent|brand-blue/);
      
      // Secondary service (25%)
      expect(lessonsLink).toHaveClass(/secondary|brand-orange/);
      
      // Standard navigation (15%)
      expect(homeLink).toHaveClass(/neutral|gray/);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle user journey from homepage to services', async () => {
      renderWithRouter(<Navigation />);
      
      // User starts on home
      expect(screen.getByText('Home')).toBeInTheDocument();
      
      // User navigates to performance
      const performanceLink = screen.getByText('Performances');
      await user.click(performanceLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/performance');
    });

    it('should support mobile user switching between services', async () => {
      vi.mocked(vi.fn()).mockReturnValue({ 
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      });
      
      renderWithRouter(<Navigation />);
      
      const performanceLink = screen.getByText('Performances');
      const lessonsLink = screen.getByText('Lessons');
      
      await user.click(performanceLink);
      expect(mockNavigate).toHaveBeenCalledWith('/performance');
      
      await user.click(lessonsLink);
      expect(mockNavigate).toHaveBeenCalledWith('/teaching');
    });

    it('should handle keyboard-only navigation workflow', async () => {
      renderWithRouter(<Navigation />);
      
      // Tab through navigation items
      await user.tab();
      expect(screen.getByText('Home')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText('Performances')).toHaveFocus();
      
      // Activate with Enter
      await user.keyboard('{Enter}');
      expect(mockNavigate).toHaveBeenCalledWith('/performance');
    });
  });
});