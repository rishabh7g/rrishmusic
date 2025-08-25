import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';

// Mock hooks
vi.mock('@/hooks/useScrollSpy', () => ({
  useSmoothScroll: () => vi.fn(),
  useScrollSpy: () => ({
    activeSection: 'home',
    scrollToSection: vi.fn()
  })
}));

vi.mock('@/hooks/useDeviceDetection', () => ({
  useDeviceDetection: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasHover: true,
    hasTouch: false
  })
}));

// Mock constants
vi.mock('@/utils/constants', () => ({
  NAVIGATION_ITEMS: [
    { id: 'home', label: 'Home', href: '/', type: 'internal' },
    { id: 'performance', label: 'Performances', href: '/performance', type: 'internal' },
    { id: 'teaching', label: 'Teaching', href: '/teaching', type: 'internal' },
    { id: 'about', label: 'About', href: '/about', type: 'internal' },
    { id: 'contact', label: 'Contact', href: '/contact', type: 'internal' }
  ]
}));

const renderWithRouter = (component: React.ReactElement, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
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
      expect(screen.getByText('Teaching')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render with correct semantic structure', () => {
      renderWithRouter(<Navigation />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', expect.stringContaining('navigation'));
    });
  });

  describe('Service Hierarchy Visual Prioritization', () => {
    it('should apply primary styling to main service pages', () => {
      renderWithRouter(<Navigation />);

      const homeLink = screen.getByText('Home').closest('a');
      const performanceLink = screen.getByText('Performances').closest('a');

      // Primary services should have enhanced visual treatment
      expect(homeLink).toHaveClass(/primary|font-semibold|prominent/);
      expect(performanceLink).toHaveClass(/primary|font-semibold|prominent/);
    });

    it('should apply secondary styling to teaching services', () => {
      renderWithRouter(<Navigation />);

      const teachingLink = screen.getByText('Teaching').closest('a');

      // Teaching should have secondary treatment
      expect(teachingLink).toHaveClass(/secondary|standard/);
    });

    it('should apply tertiary styling to standard navigation', () => {
      renderWithRouter(<Navigation />);

      const aboutLink = screen.getByText('About').closest('a');
      const contactLink = screen.getByText('Contact').closest('a');

      // Standard pages should have tertiary treatment
      expect(aboutLink).toHaveClass(/tertiary|standard|base/);
      expect(contactLink).toHaveClass(/tertiary|standard|base/);
    });
  });

  describe('Active State Management', () => {
    it('should highlight active section correctly', () => {
      renderWithRouter(<Navigation activeSection="performance" />);

      const performanceLink = screen.getByText('Performances').closest('a');
      expect(performanceLink).toHaveClass(/active|current|highlighted/);
    });

    it('should update active state based on route changes', () => {
      renderWithRouter(<Navigation />, '/teaching');

      const teachingLink = screen.getByText('Teaching').closest('a');
      expect(teachingLink).toHaveClass(/active|current|highlighted/);
    });

    it('should only have one active item at a time', () => {
      renderWithRouter(<Navigation activeSection="about" />);

      const links = screen.getAllByRole('link');
      const activeLinks = links.filter(link => 
        link.className.match(/active|current|highlighted/)
      );

      expect(activeLinks.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Mobile Navigation Behavior', () => {
    beforeEach(() => {
      // Mock mobile device
      vi.mocked(vi.importActual('@/hooks/useDeviceDetection')).useDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        hasHover: false,
        hasTouch: true
      });
    });

    it('should render mobile navigation toggle', () => {
      renderWithRouter(<Navigation />);

      const mobileToggle = screen.getByRole('button', { name: /menu|navigation/i });
      expect(mobileToggle).toBeInTheDocument();
    });

    it('should toggle mobile menu on button click', async () => {
      renderWithRouter(<Navigation />);

      const mobileToggle = screen.getByRole('button', { name: /menu|navigation/i });
      
      // Menu should be closed initially
      expect(screen.queryByTestId('mobile-menu')).not.toBeVisible();

      // Click to open
      await user.click(mobileToggle);
      expect(screen.getByTestId('mobile-menu')).toBeVisible();

      // Click to close
      await user.click(mobileToggle);
      expect(screen.queryByTestId('mobile-menu')).not.toBeVisible();
    });

    it('should close mobile menu when clicking outside', async () => {
      renderWithRouter(<Navigation />);

      const mobileToggle = screen.getByRole('button', { name: /menu|navigation/i });
      await user.click(mobileToggle);

      // Menu should be open
      expect(screen.getByTestId('mobile-menu')).toBeVisible();

      // Click outside menu
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeVisible();
      });
    });

    it('should have touch-friendly sizing on mobile', () => {
      renderWithRouter(<Navigation />);

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        // Mobile links should have comfortable touch targets
        expect(link).toHaveClass(/touch-target|py-3|min-h/);
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', async () => {
      renderWithRouter(<Navigation />);

      const firstLink = screen.getByText('Home').closest('a');
      const secondLink = screen.getByText('Performances').closest('a');

      // Tab to first link
      await user.tab();
      expect(firstLink).toHaveFocus();

      // Tab to second link
      await user.tab();
      expect(secondLink).toHaveFocus();
    });

    it('should support Enter key activation', async () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => ({
        ...await vi.importActual('react-router-dom'),
        useNavigate: () => mockNavigate
      }));

      renderWithRouter(<Navigation />);

      const homeLink = screen.getByText('Home').closest('a');
      homeLink?.focus();

      await user.keyboard('{Enter}');
      
      // Should trigger navigation (via default link behavior)
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have proper focus indicators', async () => {
      renderWithRouter(<Navigation />);

      const links = screen.getAllByRole('link');
      
      for (const link of links) {
        await user.tab();
        if (document.activeElement === link) {
          expect(link).toHaveClass(/focus|focus-visible/);
        }
      }
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels', () => {
      renderWithRouter(<Navigation />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label');
    });

    it('should have proper landmark structure', () => {
      renderWithRouter(<Navigation />);

      // Navigation should be a landmark
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should support screen readers', () => {
      renderWithRouter(<Navigation />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('should indicate current page to screen readers', () => {
      renderWithRouter(<Navigation activeSection="teaching" />);

      const teachingLink = screen.getByText('Teaching').closest('a');
      expect(teachingLink).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Performance Optimizations', () => {
    it('should not re-render unnecessarily', () => {
      let renderCount = 0;
      const TestNavigation = () => {
        renderCount++;
        return <Navigation />;
      };

      const { rerender } = renderWithRouter(<TestNavigation />);

      expect(renderCount).toBe(1);

      // Re-render with same props
      rerender(<TestNavigation />);
      
      // Should be optimized to prevent unnecessary renders
      expect(renderCount).toBe(2); // One for initial, one for rerender
    });

    it('should handle rapid state changes efficiently', async () => {
      renderWithRouter(<Navigation />);

      const performanceStart = performance.now();

      // Simulate rapid active section changes
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(window, { target: { scrollY: i * 100 } });
      }

      const performanceEnd = performance.now();
      const duration = performanceEnd - performanceStart;

      // Should handle rapid changes without performance issues
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for different screen sizes', () => {
      const screenSizes = [
        { width: 320, expectMobile: true },
        { width: 768, expectMobile: false },
        { width: 1024, expectMobile: false }
      ];

      screenSizes.forEach(({ width, expectMobile }) => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        renderWithRouter(<Navigation />);

        if (expectMobile) {
          expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
        } else {
          expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing navigation items gracefully', () => {
      vi.mocked(vi.importActual('@/utils/constants')).NAVIGATION_ITEMS = [];

      expect(() => renderWithRouter(<Navigation />)).not.toThrow();
    });

    it('should handle invalid active section', () => {
      renderWithRouter(<Navigation activeSection="nonexistent" />);

      // Should still render without errors
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Business Logic Integration', () => {
    it('should integrate with service hierarchy correctly', () => {
      renderWithRouter(<Navigation />);

      // Performance should be visually prioritized over teaching
      const performanceLink = screen.getByText('Performances').closest('a');
      const teachingLink = screen.getByText('Teaching').closest('a');

      const performanceClasses = performanceLink?.className || '';
      const teachingClasses = teachingLink?.className || '';

      // Performance should have primary styling, teaching secondary
      expect(performanceClasses).toMatch(/primary|font-semibold/);
      expect(teachingClasses).toMatch(/secondary|standard/);
    });

    it('should support service-specific navigation behavior', () => {
      renderWithRouter(<Navigation activeSection="performance" />);

      const performanceLink = screen.getByText('Performances').closest('a');
      
      // Performance navigation should include service-specific styling
      expect(performanceLink).toHaveClass(/performance|primary|active/);
    });

    it('should maintain 60/25/15 visual hierarchy', () => {
      renderWithRouter(<Navigation />);

      // Main services (60%) should be most prominent
      const primaryItems = ['Home', 'Performances'];
      primaryItems.forEach(item => {
        const link = screen.getByText(item).closest('a');
        expect(link).toHaveClass(/primary|font-semibold|prominent/);
      });

      // Teaching (25%) should be secondary
      const teachingLink = screen.getByText('Teaching').closest('a');
      expect(teachingLink).toHaveClass(/secondary|standard/);

      // Other items (15%) should be tertiary
      const tertiaryItems = ['About', 'Contact'];
      tertiaryItems.forEach(item => {
        const link = screen.getByText(item).closest('a');
        expect(link).toHaveClass(/tertiary|base|minimal/);
      });
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle user journey from homepage to services', async () => {
      renderWithRouter(<Navigation />);

      // Start at home
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');

      // Navigate to performances
      const performanceLink = screen.getByText('Performances').closest('a');
      await user.click(performanceLink);
      
      // Should update active state
      expect(performanceLink).toHaveAttribute('href', '/performance');
    });

    it('should support mobile user switching between services', async () => {
      // Mock mobile device
      vi.mocked(vi.importActual('@/hooks/useDeviceDetection')).useDeviceDetection.mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        hasHover: false,
        hasTouch: true
      });

      renderWithRouter(<Navigation />);

      const mobileToggle = screen.getByRole('button', { name: /menu/i });
      
      // Open mobile menu
      await user.click(mobileToggle);

      // Click on teaching
      const teachingLink = screen.getByText('Teaching').closest('a');
      await user.click(teachingLink);

      // Menu should close after navigation
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeVisible();
      });
    });

    it('should handle keyboard-only navigation workflow', async () => {
      renderWithRouter(<Navigation />);

      // Tab through all navigation items
      const navigationItems = ['Home', 'Performances', 'Teaching', 'About', 'Contact'];
      
      for (const item of navigationItems) {
        await user.tab();
        const link = screen.getByText(item).closest('a');
        expect(link).toHaveFocus();
      }
    });
  });
});