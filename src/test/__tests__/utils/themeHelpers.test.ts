/**
 * Theme Helpers Unit Tests
 * 
 * Tests for theme detection, storage, and utility functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSystemTheme,
  saveThemeToStorage,
  loadThemeFromStorage,
  resolveActiveTheme,
  createSystemThemeListener,
  applyThemeToDocument,
  toggleTheme,
  getNextThemeMode,
  isValidThemeMode,
  getThemeModeLabel,
  getThemeModeIcon,
  preventFOUC,
} from '../../../utils/themeHelpers';
import { THEME_STORAGE_KEY } from '../../../styles/themes';

describe('themeHelpers', () => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSystemTheme', () => {
    it('should return "dark" when system prefers dark mode', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const result = getSystemTheme();
      expect(result).toBe('dark');
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should return "light" when system prefers light mode', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const result = getSystemTheme();
      expect(result).toBe('light');
    });

    it('should return "light" when matchMedia is not supported', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });

      const result = getSystemTheme();
      expect(result).toBe('light');
    });
  });

  describe('localStorage operations', () => {
    it('should save theme to localStorage', () => {
      saveThemeToStorage('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    });

    it('should load theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      const result = loadThemeFromStorage();
      expect(result).toBe('dark');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    });

    it('should return default theme when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const result = loadThemeFromStorage();
      expect(result).toBe('system');
    });

    it('should return default theme when invalid theme in storage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid');
      const result = loadThemeFromStorage();
      expect(result).toBe('system');
    });

    it('should handle localStorage errors gracefully', () => {
      // Suppress console warnings for this test
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      // Should not throw error
      expect(() => saveThemeToStorage('dark')).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });

  describe('resolveActiveTheme', () => {
    it('should return "light" for light mode', () => {
      const result = resolveActiveTheme('light');
      expect(result).toBe('light');
    });

    it('should return "dark" for dark mode', () => {
      const result = resolveActiveTheme('dark');
      expect(result).toBe('dark');
    });

    it('should return system preference for system mode', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true, // System prefers dark
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const result = resolveActiveTheme('system');
      expect(result).toBe('dark');
    });
  });

  describe('createSystemThemeListener', () => {
    it('should create a working listener', () => {
      const callback = vi.fn();
      const mockAddEventListener = vi.fn();
      const mockRemoveEventListener = vi.fn();
      
      const mockMatchMedia = vi.fn(() => ({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      }));
      
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const cleanup = createSystemThemeListener(callback);
      expect(mockAddEventListener).toHaveBeenCalled();
      
      cleanup();
      expect(mockRemoveEventListener).toHaveBeenCalled();
    });

    it('should return no-op when matchMedia is not supported', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });

      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      // Should not throw and return a function
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      expect(toggleTheme('light')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      expect(toggleTheme('dark')).toBe('light');
    });

    it('should handle system mode by toggling opposite of system preference', () => {
      const mockMatchMedia = vi.fn(() => ({
        matches: true, // System prefers dark
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      expect(toggleTheme('system')).toBe('light'); // Opposite of dark system
    });
  });

  describe('getNextThemeMode', () => {
    it('should cycle through modes correctly', () => {
      expect(getNextThemeMode('light')).toBe('dark');
      expect(getNextThemeMode('dark')).toBe('system');
      expect(getNextThemeMode('system')).toBe('light');
    });
  });

  describe('validation and labels', () => {
    it('should validate theme modes correctly', () => {
      expect(isValidThemeMode('light')).toBe(true);
      expect(isValidThemeMode('dark')).toBe(true);
      expect(isValidThemeMode('system')).toBe(true);
      expect(isValidThemeMode('invalid')).toBe(false);
      expect(isValidThemeMode(123)).toBe(false);
      expect(isValidThemeMode(null)).toBe(false);
    });

    it('should return correct labels', () => {
      expect(getThemeModeLabel('light')).toBe('Light');
      expect(getThemeModeLabel('dark')).toBe('Dark');
      expect(getThemeModeLabel('system')).toBe('System');
    });

    it('should return correct icons', () => {
      expect(getThemeModeIcon('light')).toBe('☀️');
      expect(getThemeModeIcon('dark')).toBe('🌙');
      expect(getThemeModeIcon('system')).toBe('🖥️');
    });
  });

  describe('applyThemeToDocument', () => {
    beforeEach(() => {
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

    it('should apply theme styles to document', () => {
      applyThemeToDocument('dark');
      
      expect(document.documentElement.style.setProperty).toHaveBeenCalledTimes(22); // Number of CSS properties
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-light', 'theme-dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('preventFOUC', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'documentElement', {
        value: {
          style: { setProperty: vi.fn() },
          classList: { add: vi.fn(), remove: vi.fn() },
          setAttribute: vi.fn(),
        },
        writable: true,
      });
    });

    it('should apply theme immediately and add theme-loaded class', () => {
      mockLocalStorage.getItem.mockReturnValue('dark');
      
      preventFOUC();
      
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-loaded');
    });

    it('should handle errors gracefully', () => {
      // Suppress console warnings for this test
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      expect(() => preventFOUC()).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
});