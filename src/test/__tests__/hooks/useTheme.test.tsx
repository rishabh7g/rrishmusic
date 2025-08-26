/**
 * Theme Hook Integration Tests
 * 
 * Tests for ThemeProvider and useTheme hook integration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { useTheme, useThemeColors, useThemeMode, useThemeState } from '../../../hooks/useTheme';

// Test component that uses theme
const TestComponent: React.FC = () => {
  const {
    mode,
    activeTheme,
    colors,
    isDark,
    isLight,
    modeLabel,
    toggleTheme,
    setTheme,
  } = useTheme();

  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="active-theme">{activeTheme}</span>
      <span data-testid="mode-label">{modeLabel}</span>
      <span data-testid="is-dark">{isDark.toString()}</span>
      <span data-testid="is-light">{isLight.toString()}</span>
      <span data-testid="bg-color">{colors.background}</span>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Dark
      </button>
    </div>
  );
};

describe('useTheme hook', () => {
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

    // Mock document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        style: { setProperty: vi.fn() },
        classList: { add: vi.fn(), remove: vi.fn() },
        setAttribute: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ThemeProvider integration', () => {
    it('should provide default theme state', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('system');
      expect(screen.getByTestId('active-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('mode-label')).toHaveTextContent('System');
      expect(screen.getByTestId('is-light')).toHaveTextContent('true');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
    });

    it('should load saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
      expect(screen.getByTestId('is-light')).toHaveTextContent('false');
    });

    it('should toggle theme correctly', async () => {
      mockLocalStorage.getItem.mockReturnValue('light');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const toggleButton = screen.getByTestId('toggle');
      
      await act(async () => {
        toggleButton.click();
      });

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'dark');
    });

    it('should set specific theme correctly', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');
      
      await act(async () => {
        setDarkButton.click();
      });

      expect(screen.getByTestId('mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rrishmusic-theme-mode', 'dark');
    });

    it('should provide correct colors for each theme', async () => {
      // Test light theme colors
      mockLocalStorage.getItem.mockReturnValue('light');
      
      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('bg-color')).toHaveTextContent('#FFFFFF');

      // Unmount and remount with dark theme
      unmount();
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('bg-color')).toHaveTextContent('#111827');
    });
  });

  describe('hook error handling', () => {
    it('should throw error when used outside provider', () => {
      const TestComponentWithoutProvider = () => {
        useTheme();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow('useThemeContext must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('specialized hooks', () => {
    it('should provide colors only with useThemeColors', () => {
      const { result } = renderHook(() => useThemeColors(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toHaveProperty('background');
      expect(result.current).toHaveProperty('text');
      expect(result.current).toHaveProperty('primary');
    });

    it('should provide mode info with useThemeMode', () => {
      const { result } = renderHook(() => useThemeMode(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toHaveProperty('mode');
      expect(result.current).toHaveProperty('activeTheme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('toggleTheme');
    });

    it('should provide state info with useThemeState', () => {
      const { result } = renderHook(() => useThemeState(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).toHaveProperty('activeTheme');
      expect(result.current).toHaveProperty('isDark');
      expect(result.current).toHaveProperty('isLight');
      expect(result.current).toHaveProperty('isInitialized');
    });
  });

  describe('system theme handling', () => {
    it('should respond to system theme changes', () => {
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
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('mode')).toHaveTextContent('system');
      expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
    });
  });

  describe('theme validation', () => {
    it('should validate theme modes with setThemeSafe', () => {
      const TestValidation: React.FC = () => {
        const { setThemeSafe } = useTheme();
        
        return (
          <div>
            <button 
              data-testid="set-valid"
              onClick={() => setThemeSafe('dark')}
            >
              Set Valid
            </button>
            <button 
              data-testid="set-invalid"
              onClick={() => setThemeSafe('invalid')}
            >
              Set Invalid
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestValidation />
          <TestComponent />
        </ThemeProvider>
      );

      // Valid theme should work
      act(() => {
        screen.getByTestId('set-valid').click();
      });
      expect(screen.getByTestId('mode')).toHaveTextContent('dark');

      // Invalid theme should not change state
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      act(() => {
        screen.getByTestId('set-invalid').click();
      });
      expect(screen.getByTestId('mode')).toHaveTextContent('dark'); // Should remain unchanged
      expect(consoleSpy).toHaveBeenCalledWith('Invalid theme mode provided:', 'invalid');
      consoleSpy.mockRestore();
    });
  });
});