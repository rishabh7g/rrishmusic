/**
 * Unit tests for theme helper functions
 * Tests theme detection, localStorage operations, and document manipulation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getSystemTheme,
  saveThemeToStorage,
  loadThemeFromStorage,
  resolveActiveTheme,
  createSystemThemeListener,
  applyThemeToDocument,
  preventFOUC,
  toggleTheme,
  getNextThemeMode,
  isValidThemeMode,
  getThemeModeLabel,
  getThemeModeIcon,
} from '../../../utils/themeHelpers';
import { THEME_STORAGE_KEY, DEFAULT_THEME_MODE } from '../../../styles/themes';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => ({
  matches,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

describe('themeHelpers', () => {
  // Storage mocks
  let mockStorage: { [key: string]: string } = {};
  
  beforeEach(() => {
    // Clear storage
    mockStorage = {};
    
    // Reset DOM
    Object.defineProperty(global, 'window', {
      value: {
        matchMedia: vi.fn(),
        localStorage: {
          getItem: vi.fn((key: string) => mockStorage[key] || null),
          setItem: vi.fn((key: string, value: string) => {
            mockStorage[key] = value;
          }),
          removeItem: vi.fn((key: string) => {
            delete mockStorage[key];
          }),
        },
      },
      writable: true,
    });

    Object.defineProperty(global, 'document', {
      value: {
        documentElement: {
          style: { setProperty: vi.fn() },
          classList: { add: vi.fn(), remove: vi.fn() },
          setAttribute: vi.fn(),
        },
      },
      writable: true,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSystemTheme', () => {
    it('should return "dark" when system prefers dark mode', () => {
      window.matchMedia = vi.fn(() => mockMatchMedia(true));
      
      const result = getSystemTheme();
      
      expect(result).toBe('dark');
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should return "light" when system prefers light mode', () => {
      window.matchMedia = vi.fn(() => mockMatchMedia(false));
      
      const result = getSystemTheme();
      
      expect(result).toBe('light');
    });

    it('should return "light" when matchMedia is not supported', () => {
      // Remove matchMedia
      delete (window as any).matchMedia;
      
      const result = getSystemTheme();
      
      expect(result).toBe('light');
    });
  });

  describe('localStorage operations', () => {
    it('should save theme to localStorage', () => {
      saveThemeToStorage('dark');
      
      expect(mockStorage[THEME_STORAGE_KEY]).toBe('dark');
    });

    it('should load theme from localStorage', () => {
      mockStorage[THEME_STORAGE_KEY] = 'dark';
      
      const result = loadThemeFromStorage();
      
      expect(result).toBe('dark');
    });

    it('should return default theme when localStorage is empty', () => {
      const result = loadThemeFromStorage();
      
      expect(result).toBe(DEFAULT_THEME_MODE);
    });

    it('should return default theme when invalid theme in storage', () => {
      mockStorage[THEME_STORAGE_KEY] = 'invalid-theme';
      
      const result = loadThemeFromStorage();
      
      expect(result).toBe(DEFAULT_THEME_MODE);
    });

    it('should handle localStorage errors gracefully', () => {
      window.localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage error');
      });
      
      // Should not throw
      expect(() => saveThemeToStorage('dark')).not.toThrow();
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
      window.matchMedia = vi.fn(() => mockMatchMedia(true));
      
      const result = resolveActiveTheme('system');
      
      expect(result).toBe('dark');
    });
  });

  describe('createSystemThemeListener', () => {
    it('should create a working listener', () => {
      const mockMediaQuery = {
        ...mockMatchMedia(false),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      window.matchMedia = vi.fn(() => mockMediaQuery);
      
      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      
      // Test cleanup
      cleanup();
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should return no-op when matchMedia is not supported', () => {
      delete (window as any).matchMedia;
      
      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      // Should return a no-op function
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const result = toggleTheme('light');
      expect(result).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const result = toggleTheme('dark');
      expect(result).toBe('light');
    });

    it('should handle system mode by toggling opposite of system preference', () => {
      window.matchMedia = vi.fn(() => mockMatchMedia(true)); // System prefers dark
      
      const result = toggleTheme('system');
      
      expect(result).toBe('light'); // Should toggle to light (opposite of dark)
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
      expect(isValidThemeMode(null)).toBe(false);
      expect(isValidThemeMode(123)).toBe(false);
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
      Object.defineProperty(global, 'document', {
        value: {
          documentElement: {
            style: { setProperty: vi.fn() },
            classList: { add: vi.fn(), remove: vi.fn() },
            setAttribute: vi.fn(),
          },
        },
        writable: true,
      });
    });

    it('should apply theme styles to document', () => {
      applyThemeToDocument('dark');
      
      // 22 color properties + 6 transition properties = 28 total properties
      expect(document.documentElement.style.setProperty).toHaveBeenCalledTimes(28);
      expect(document.documentElement.classList.remove).toHaveBeenCalledWith('theme-light', 'theme-dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-dark');
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('preventFOUC', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'document', {
        value: {
          documentElement: {
            style: { setProperty: vi.fn() },
            classList: { add: vi.fn(), remove: vi.fn() },
            setAttribute: vi.fn(),
          },
        },
        writable: true,
      });
    });

    it('should apply theme immediately and add theme-loaded class', () => {
      mockStorage[THEME_STORAGE_KEY] = 'dark';
      
      preventFOUC();
      
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('theme-loaded');
    });

    it('should handle errors gracefully', () => {
      window.localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });
      
      // Should not throw and should apply light theme as fallback
      expect(() => preventFOUC()).not.toThrow();
    });
  });
});