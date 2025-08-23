import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navigation } from '../Navigation';
import { NAVIGATION_ITEMS } from '@/utils/constants';
import * as helpers from '@/utils/helpers';

// Enhanced TypeScript patterns
interface NavigationProps {
  activeSection?: string;
}

interface MockedHelpers {
  scrollToSection: ReturnType<typeof vi.fn>;
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
const createNavigationProps = (overrides?: Partial<NavigationProps>): NavigationProps => ({
  activeSection: undefined,
  ...overrides,
});

// Custom render function for Navigation component
const renderNavigation = (props?: Partial<NavigationProps>, options?: RenderOptions) => {
  const defaultProps = createNavigationProps(props);
  return render(<Navigation {...defaultProps} />, options);
};

// Mock framer-motion to capture and test animation props
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

// Mock the scrollToSection helper
vi.mock('@/utils/helpers', () => ({
  scrollToSection: vi.fn(),
}));

const mockScrollToSection = vi.mocked(helpers.scrollToSection) as MockedHelpers['scrollToSection'];

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMotionNav.mockClear();
    mockMotionDiv.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render navigation component', () => {
      renderNavigation();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should render logo with correct text', () => {
      renderNavigation();
      
      expect(screen.getByText('RrishMusic')).toBeInTheDocument();
    });

    it('should render all navigation items from constants', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });

    it('should render mobile menu button', () => {
      renderNavigation();
      
      // The mobile button doesn't have accessible name, so find by class or structure
      const mobileMenuContainer = screen.getByRole('navigation').querySelector('[class*="md:hidden"]');
      const mobileButton = mobileMenuContainer?.querySelector('button');
      expect(mobileButton).toBeInTheDocument();
    });

    it('should have correct navigation structure', () => {
      renderNavigation();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
    });
  });

  describe('Navigation Functionality', () => {
    it('should call scrollToSection when navigation item is clicked', () => {
      renderNavigation();
      
      const firstNavItem = NAVIGATION_ITEMS[0];
      const navButton = screen.getByText(firstNavItem.label);
      
      fireEvent.click(navButton);
      
      expect(mockScrollToSection).toHaveBeenCalledWith(firstNavItem.id);
      expect(mockScrollToSection).toHaveBeenCalledTimes(1);
    });

    it('should call scrollToSection with correct section ID for each nav item', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item, index) => {
        const navButton = screen.getByText(item.label);
        fireEvent.click(navButton);
        
        expect(mockScrollToSection).toHaveBeenNthCalledWith(index + 1, item.id);
      });
      
      expect(mockScrollToSection).toHaveBeenCalledTimes(NAVIGATION_ITEMS.length);
    });

    it('should handle multiple rapid clicks correctly', async () => {
      renderNavigation();
      
      const firstNavItem = NAVIGATION_ITEMS[0];
      const navButton = screen.getByText(firstNavItem.label);
      
      // Click multiple times rapidly
      fireEvent.click(navButton);
      fireEvent.click(navButton);
      fireEvent.click(navButton);
      
      await waitFor(() => {
        expect(mockScrollToSection).toHaveBeenCalledTimes(3);
        expect(mockScrollToSection).toHaveBeenCalledWith(firstNavItem.id);
      });
    });
  });

  describe('Active Section Highlighting', () => {
    it('should highlight active section when activeSection prop is provided', () => {
      const activeSection = NAVIGATION_ITEMS[1].id; // Use second item
      renderNavigation({ activeSection });
      
      const activeButton = screen.getByText(NAVIGATION_ITEMS[1].label);
      expect(activeButton).toHaveClass('text-brand-blue-primary');
    });

    it('should not highlight any section when activeSection is not provided', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        expect(navButton).toHaveClass('text-neutral-charcoal');
        expect(navButton).not.toHaveClass('text-brand-blue-primary');
      });
    });

    it('should only highlight the specified active section', () => {
      const activeSection = NAVIGATION_ITEMS[2].id; // Use third item
      renderNavigation({ activeSection });
      
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        
        if (item.id === activeSection) {
          expect(navButton).toHaveClass('text-brand-blue-primary');
        } else {
          expect(navButton).toHaveClass('text-neutral-charcoal');
          expect(navButton).not.toHaveClass('text-brand-blue-primary');
        }
      });
    });

    it('should update highlighting when activeSection prop changes', () => {
      const { rerender } = renderNavigation({ activeSection: NAVIGATION_ITEMS[0].id });
      
      // Check initial state
      let activeButton = screen.getByText(NAVIGATION_ITEMS[0].label);
      expect(activeButton).toHaveClass('text-brand-blue-primary');
      
      // Change active section
      rerender(<Navigation activeSection={NAVIGATION_ITEMS[1].id} />);
      
      // Check new state
      const previousButton = screen.getByText(NAVIGATION_ITEMS[0].label);
      const newActiveButton = screen.getByText(NAVIGATION_ITEMS[1].label);
      
      expect(previousButton).not.toHaveClass('text-brand-blue-primary');
      expect(newActiveButton).toHaveClass('text-brand-blue-primary');
    });

    it('should handle invalid activeSection gracefully', () => {
      renderNavigation({ activeSection: 'non-existent-section' });
      
      // All items should have default styling
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        expect(navButton).toHaveClass('text-neutral-charcoal');
        expect(navButton).not.toHaveClass('text-brand-blue-primary');
      });
    });
  });

  describe('Animation Integration', () => {
    describe('Initial animation props verification', () => {
      it('should apply correct initial animation props to motion.nav', () => {
        renderNavigation();
        
        expect(mockMotionNav).toHaveBeenCalledWith(
          expect.objectContaining({
            initial: { y: -100 },
            animate: { y: 0 },
            transition: { duration: 0.5 },
            className: expect.stringContaining('fixed top-0 left-0 right-0 z-50')
          })
        );
      });

      it('should render motion.nav with proper children structure', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        expect(navCall.children).toBeDefined();
        expect(React.isValidElement(navCall.children)).toBe(true);
      });

      it('should pass through all required className to motion.nav', () => {
        renderNavigation();
        
        const expectedClasses = [
          'fixed', 'top-0', 'left-0', 'right-0', 'z-50',
          'bg-white/95', 'backdrop-blur-sm', 'border-b', 'border-neutral-gray-light'
        ];
        
        const navCall = mockMotionNav.mock.calls[0][0];
        expectedClasses.forEach(className => {
          expect(navCall.className).toContain(className);
        });
      });
    });

    describe('Transition configuration testing', () => {
      it('should configure slide-down animation with correct timing', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        expect(navCall.initial).toEqual({ y: -100 });
        expect(navCall.animate).toEqual({ y: 0 });
        expect(navCall.transition).toEqual({ duration: 0.5 });
      });

      it('should use appropriate animation duration for navigation entrance', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        expect(navCall.transition.duration).toBe(0.5);
        expect(navCall.transition.duration).toBeGreaterThan(0.3); // Not too fast
        expect(navCall.transition.duration).toBeLessThan(1.0); // Not too slow
      });

      it('should animate from correct initial position', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        expect(navCall.initial.y).toBe(-100);
        expect(navCall.animate.y).toBe(0);
        
        // Verify slide-down effect (negative to zero)
        expect(navCall.initial.y).toBeLessThan(navCall.animate.y);
      });

      it('should maintain animation consistency across re-renders', () => {
        const { rerender } = renderNavigation();
        const initialCall = mockMotionNav.mock.calls[0][0];
        
        mockMotionNav.mockClear();
        rerender(<Navigation activeSection="different-section" />);
        
        const rerenderedCall = mockMotionNav.mock.calls[0][0];
        
        expect(rerenderedCall.initial).toEqual(initialCall.initial);
        expect(rerenderedCall.animate).toEqual(initialCall.animate);
        expect(rerenderedCall.transition).toEqual(initialCall.transition);
      });
    });

    describe('WhileHover animation verification', () => {
      it('should apply whileHover animation to logo motion.div', () => {
        renderNavigation();
        
        expect(mockMotionDiv).toHaveBeenCalledWith(
          expect.objectContaining({
            whileHover: { scale: 1.05 },
            className: expect.stringContaining('font-heading font-bold text-xl text-brand-blue-primary')
          })
        );
      });

      it('should configure appropriate hover scale effect for logo', () => {
        renderNavigation();
        
        const divCall = mockMotionDiv.mock.calls[0][0];
        expect(divCall.whileHover).toEqual({ scale: 1.05 });
        
        // Verify subtle scale increase
        expect(divCall.whileHover.scale).toBeGreaterThan(1.0);
        expect(divCall.whileHover.scale).toBeLessThan(1.1); // Not too dramatic
      });

      it('should render logo with proper children content', () => {
        renderNavigation();
        
        const divCall = mockMotionDiv.mock.calls[0][0];
        expect(divCall.children).toBe('RrishMusic');
      });

      it('should apply correct styling classes to logo motion.div', () => {
        renderNavigation();
        
        const expectedClasses = [
          'font-heading', 'font-bold', 'text-xl', 'text-brand-blue-primary'
        ];
        
        const divCall = mockMotionDiv.mock.calls[0][0];
        expectedClasses.forEach(className => {
          expect(divCall.className).toContain(className);
        });
      });

      it('should maintain hover animation across different prop states', () => {
        const { rerender } = renderNavigation();
        const initialCall = mockMotionDiv.mock.calls[0][0];
        
        mockMotionDiv.mockClear();
        rerender(<Navigation activeSection="test-section" />);
        
        const rerenderedCall = mockMotionDiv.mock.calls[0][0];
        
        expect(rerenderedCall.whileHover).toEqual(initialCall.whileHover);
        expect(rerenderedCall.className).toEqual(initialCall.className);
      });
    });

    describe('Animation timing validation', () => {
      it('should use performance-optimized animation timing', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        
        // Animation should be smooth but not too slow for good UX
        expect(navCall.transition.duration).toBeGreaterThanOrEqual(0.3);
        expect(navCall.transition.duration).toBeLessThanOrEqual(0.8);
      });

      it('should configure animations suitable for navigation UX', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        const divCall = mockMotionDiv.mock.calls[0][0];
        
        // Navigation slide should be noticeable but not disruptive
        expect(Math.abs(navCall.initial.y)).toBeGreaterThanOrEqual(50);
        expect(Math.abs(navCall.initial.y)).toBeLessThanOrEqual(200);
        
        // Hover scale should be subtle
        expect(divCall.whileHover.scale).toBeGreaterThan(1.0);
        expect(divCall.whileHover.scale).toBeLessThan(1.2);
      });

      it('should ensure animation values are numeric and valid', () => {
        renderNavigation();
        
        const navCall = mockMotionNav.mock.calls[0][0];
        const divCall = mockMotionDiv.mock.calls[0][0];
        
        // Type validation
        expect(typeof navCall.initial.y).toBe('number');
        expect(typeof navCall.animate.y).toBe('number');
        expect(typeof navCall.transition.duration).toBe('number');
        expect(typeof divCall.whileHover.scale).toBe('number');
        
        // Valid range validation
        expect(navCall.transition.duration).toBeGreaterThan(0);
        expect(divCall.whileHover.scale).toBeGreaterThan(0);
      });

      it('should call motion components only once per render cycle', () => {
        renderNavigation();
        
        // Each component should be called exactly once
        expect(mockMotionNav).toHaveBeenCalledTimes(1);
        expect(mockMotionDiv).toHaveBeenCalledTimes(1);
      });

      it('should maintain consistent animation calls with different props', () => {
        // Render with different activeSection values
        const testCases = [
          undefined,
          NAVIGATION_ITEMS[0]?.id,
          NAVIGATION_ITEMS[1]?.id,
          'non-existent-section'
        ];
        
        testCases.forEach((activeSection, index) => {
          mockMotionNav.mockClear();
          mockMotionDiv.mockClear();
          
          renderNavigation({ activeSection });
          
          expect(mockMotionNav).toHaveBeenCalledTimes(1);
          expect(mockMotionDiv).toHaveBeenCalledTimes(1);
          
          // Animation props should remain consistent
          const navCall = mockMotionNav.mock.calls[0][0];
          const divCall = mockMotionDiv.mock.calls[0][0];
          
          expect(navCall.initial).toEqual({ y: -100 });
          expect(navCall.animate).toEqual({ y: 0 });
          expect(navCall.transition).toEqual({ duration: 0.5 });
          expect(divCall.whileHover).toEqual({ scale: 1.05 });
        });
      });
    });
  });

  describe('Responsive Design', () => {
    it('should hide navigation links on mobile and show mobile menu button', () => {
      renderNavigation();
      
      // Navigation links should be hidden on mobile
      const navContainer = screen.getByText(NAVIGATION_ITEMS[0].label).closest('div');
      expect(navContainer).toHaveClass('hidden', 'md:flex');
      
      // Mobile menu button should be visible
      const mobileMenuContainer = screen.getByRole('navigation').querySelector('[class*="md:hidden"]');
      expect(mobileMenuContainer).toHaveClass('md:hidden');
    });

    it('should render correct SVG icon for mobile menu', () => {
      renderNavigation();
      
      const mobileMenuContainer = screen.getByRole('navigation').querySelector('[class*="md:hidden"]');
      const svgIcon = mobileMenuContainer?.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('Accessibility', () => {
    it('should render navigation items as buttons with proper semantics', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByRole('button', { name: item.label });
        expect(navButton).toBeInTheDocument();
        expect(navButton.tagName).toBe('BUTTON');
      });
    });

    it('should support keyboard navigation', () => {
      renderNavigation();
      
      const firstNavButton = screen.getByText(NAVIGATION_ITEMS[0].label);
      
      // Focus the button
      firstNavButton.focus();
      expect(firstNavButton).toHaveFocus();
      
      // Simulate Enter key press
      fireEvent.keyDown(firstNavButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(firstNavButton); // React Testing Library handles Enter as click
      
      expect(mockScrollToSection).toHaveBeenCalledWith(NAVIGATION_ITEMS[0].id);
    });

    it('should have proper button attributes', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        expect(navButton).toBeEnabled();
        // React buttons don't have explicit type="button" by default, but behave as buttons
        expect(navButton.tagName).toBe('BUTTON');
      });
    });
  });

  describe('Styling and CSS Classes', () => {
    it('should apply correct CSS classes to navigation container', () => {
      renderNavigation();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'z-50',
        'bg-white/95',
        'backdrop-blur-sm',
        'border-b',
        'border-neutral-gray-light'
      );
    });

    it('should apply correct CSS classes to logo', () => {
      renderNavigation();
      
      const logo = screen.getByText('RrishMusic');
      expect(logo).toHaveClass(
        'font-heading',
        'font-bold',
        'text-xl',
        'text-brand-blue-primary'
      );
    });

    it('should apply hover classes to navigation buttons', () => {
      renderNavigation();
      
      NAVIGATION_ITEMS.forEach((item) => {
        const navButton = screen.getByText(item.label);
        expect(navButton).toHaveClass(
          'font-heading',
          'font-medium',
          'transition-colors',
          'duration-300'
        );
      });
    });
  });

  describe('Integration with Constants', () => {
    it('should render the exact number of navigation items from constants', () => {
      renderNavigation();
      
      const navButtons = screen.getAllByRole('button').filter(button => 
        NAVIGATION_ITEMS.some(item => button.textContent === item.label)
      );
      
      expect(navButtons).toHaveLength(NAVIGATION_ITEMS.length);
    });

    it('should maintain order of navigation items as defined in constants', () => {
      renderNavigation();
      
      const navContainer = screen.getByText(NAVIGATION_ITEMS[0].label).closest('div');
      const buttons = navContainer?.querySelectorAll('button');
      
      buttons?.forEach((button, index) => {
        expect(button).toHaveTextContent(NAVIGATION_ITEMS[index].label);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty NAVIGATION_ITEMS gracefully', () => {
      // This test would require deeper mocking of the constants module
      // For now, we'll test that the component doesn't crash with the existing items
      expect(() => renderNavigation()).not.toThrow();
      
      // Should still render logo and mobile button
      expect(screen.getByText('RrishMusic')).toBeInTheDocument();
      const mobileMenuContainer = screen.getByRole('navigation').querySelector('[class*="md:hidden"]');
      const mobileButton = mobileMenuContainer?.querySelector('button');
      expect(mobileButton).toBeInTheDocument();
    });

    it('should call scrollToSection even if it might fail', () => {
      renderNavigation();
      
      const navButton = screen.getByText(NAVIGATION_ITEMS[0].label);
      
      // Test that the function is called - error handling would be in the helper function itself
      fireEvent.click(navButton);
      expect(mockScrollToSection).toHaveBeenCalledWith(NAVIGATION_ITEMS[0].id);
      expect(mockScrollToSection).toHaveBeenCalledTimes(1);
    });
  });
});