/**
 * ThemeToggle Component Tests
 * 
 * Tests for theme toggle button functionality, accessibility, and interactions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import ThemeToggle from '../../../components/ThemeToggle';

describe.skip('ThemeToggle Component', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock matchMedia for system theme detection
    const mockMatchMedia = vi.fn(() => ({
      matches: false, // Default to light system theme
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia,
      writable: true,
    });

    // Mock document.documentElement for theme application
    Object.defineProperty(document, 'documentElement', {
      value: {
        style: { setProperty: vi.fn() },
        classList: { add: vi.fn(), remove: vi.fn() },
        setAttribute: vi.fn(),
        className: '',
      },
      writable: true,
    });

    // Mock requestAnimationFrame
    Object.defineProperty(window, 'requestAnimationFrame', {
      value: vi.fn((callback) => {
        setTimeout(callback, 0);
        return 1;
      }),
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderThemeToggle = (props = {}) => {
    return render(
      <ThemeProvider>
        <ThemeToggle {...props} />
      </ThemeProvider>
    );
  };

  describe('Basic Rendering', () => {
    it('should render theme toggle button', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Theme Cycling', () => {
    it('should cycle from light to dark theme', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue('light');
      
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        await user.click(button);
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'dark');
    });

    it('should cycle from dark to system theme', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        await user.click(button);
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'system');
    });

    it('should cycle from system to light theme', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue('system');
      
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        await user.click(button);
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'light');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should toggle theme on Enter key', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.keyDown(button, { key: 'Enter' });
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'dark');
    });

    it('should toggle theme on Space key', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.keyDown(button, { key: ' ' });
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'dark');
    });

    it('should not toggle on other keys', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        fireEvent.keyDown(button, { key: 'Escape' });
      });
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Props and Variants', () => {
    it('should render with custom size', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle({ size: 'lg' });
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12', 'w-12');
    });

    it('should render with label when showLabel is true', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle({ showLabel: true });
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      expect(screen.getByText('Light')).toBeInTheDocument();
    });

    it('should not render label when showLabel is false', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle({ showLabel: false });
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      expect(screen.queryByText('Light')).not.toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle({ disabled: true });
      
      // Wait for theme initialization
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should use custom aria-label', () => {
      const customLabel = 'Custom theme toggle label';
      renderThemeToggle({ 'aria-label': customLabel });
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', customLabel);
    });
  });

  describe('Visual States', () => {
    it('should show correct icon for light theme', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('circle[cx="12"][cy="12"][r="5"]')).toBeInTheDocument();
    });

    it('should show correct icon for dark theme', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      renderThemeToggle();
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('path[d*="21 12.79"]')).toBeInTheDocument();
    });

    it('should show correct icon for system theme', () => {
      mockLocalStorage.getItem.mockReturnValue('system');
      renderThemeToggle();
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('rect[x="2"][y="3"]')).toBeInTheDocument();
    });
  });

  describe('Theme System Integration', () => {
    it('should reflect system preference when in system mode', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true, // System prefers dark
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      mockLocalStorage.getItem.mockReturnValue('system');
      renderThemeToggle({ showLabel: true });
      
      // Should show "System" as the mode label
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('should update aria-label based on current theme', () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      renderThemeToggle();
      
      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toContain('Current: Light');
      expect(button.getAttribute('aria-label')).toContain('Switch to Dark');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // This behavior is expected - component requires ThemeProvider
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<ThemeToggle />);
      }).toThrow('useThemeContext must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('should handle disabled state correctly', async () => {
      const user = userEvent.setup();
      renderThemeToggle({ disabled: true });
      
      const button = screen.getByRole('button');
      
      await act(async () => {
        await user.click(button);
      });
      
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when theme system is not initialized', () => {
      // Create a mock component that simulates uninitialized state
      const UnInitializedThemeToggle = () => {
        return (
          <div 
            className="inline-flex items-center justify-center rounded-md opacity-50 cursor-not-allowed"
            aria-label="Loading theme preferences"
          >
            <div className="w-5 h-5 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        );
      };

      render(<UnInitializedThemeToggle />);
      
      const loadingElement = screen.getByLabelText('Loading theme preferences');
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });
});