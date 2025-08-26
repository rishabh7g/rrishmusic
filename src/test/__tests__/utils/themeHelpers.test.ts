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
  getThemeModeLabel,
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
      // Remove matchMedia using interface definition
      const windowWithoutMatchMedia = window as Omit<Window, 'matchMedia'>;
      Object.defineProperty(windowWithoutMatchMedia, 'matchMedia', {
        value: undefined,
        configurable: true,
      });
      
      const result = getSystemTheme();
      
      expect(result).toBe('light');
    });

    it('should return "light" when matchMedia throws an error', () => {
      window.matchMedia = vi.fn(() => {
        throw new Error('matchMedia error');
      });
      
      const result = getSystemTheme();
      
      expect(result).toBe('light');
    });
  });

  describe('saveThemeToStorage', () => {
    it('should save theme to localStorage', () => {
      saveThemeToStorage('dark');
      
      expect(window.localStorage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
      expect(mockStorage[THEME_STORAGE_KEY]).toBe('dark');
    });

    it('should handle localStorage errors gracefully', () => {
      window.localStorage.setItem = vi.fn(() => {
        throw new Error('localStorage error');
      });
      
      expect(() => saveThemeToStorage('dark')).not.toThrow();
    });
  });

  describe('loadThemeFromStorage', () => {
    it('should load valid theme from localStorage', () => {
      mockStorage[THEME_STORAGE_KEY] = 'dark';
      
      const result = loadThemeFromStorage();
      
      expect(result).toBe('dark');
      expect(window.localStorage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    });

    it('should return default theme for invalid stored value', () => {
      mockStorage[THEME_STORAGE_KEY] = 'invalid-theme';
      
      const result = loadThemeFromStorage();
      
      expect(result).toBe(DEFAULT_THEME_MODE);
    });

    it('should return default theme when localStorage is empty', () => {
      const result = loadThemeFromStorage();
      
      expect(result).toBe(DEFAULT_THEME_MODE);
    });

    it('should handle localStorage errors gracefully', () => {
      window.localStorage.getItem = vi.fn(() => {
        throw new Error('localStorage error');
      });
      
      const result = loadThemeFromStorage();
      
      expect(result).toBe(DEFAULT_THEME_MODE);
    });
  });

  describe('resolveActiveTheme', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn(() => mockMatchMedia(false));
    });

    it('should return system theme when mode is "system"', () => {
      const result = resolveActiveTheme('system');
      
      expect(result).toBe('light'); // mockMatchMedia returns false
    });

    it('should return mode directly when mode is not "system"', () => {
      expect(resolveActiveTheme('light')).toBe('light');
      expect(resolveActiveTheme('dark')).toBe('dark');
    });
  });

  describe('createSystemThemeListener', () => {
    let mockMediaQuery: ReturnType<typeof mockMatchMedia>;

    beforeEach(() => {
      mockMediaQuery = mockMatchMedia(false);
      window.matchMedia = vi.fn(() => mockMediaQuery);
    });

    it('should create listener and return cleanup function', () => {
      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      
      // Test cleanup
      cleanup();
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should return no-op when matchMedia is not supported', () => {
      // Remove matchMedia using proper type assertion
      const windowWithoutMatchMedia = window as Omit<Window, 'matchMedia'>;
      Object.defineProperty(windowWithoutMatchMedia, 'matchMedia', {
        value: undefined,
        configurable: true,
      });
      
      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      expect(cleanup).toBeInstanceOf(Function);
      expect(() => cleanup()).not.toThrow();
    });

    it('should handle matchMedia errors gracefully', () => {
      window.matchMedia = vi.fn(() => {
        throw new Error('matchMedia error');
      });
      
      const callback = vi.fn();
      const cleanup = createSystemThemeListener(callback);
      
      expect(cleanup).toBeInstanceOf(Function);
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('applyThemeToDocument', () => {
    beforeEach(() => {
      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
        setTimeout(callback, 0);
        return 0;
      });
    });

    it('should apply light theme styles to document', () => {
      applyThemeToDocument('light');
      
      const setPropertyCalls = (document.documentElement.style.setProperty as ReturnType<typeof vi.fn>).mock.calls;
      
      // Check that CSS custom properties are set
      expect(setPropertyCalls.length).toBeGreaterThan(0);
      
      // Should set primary color for light theme
      const primaryColorCall = setPropertyCalls.find((call: string[]) => 
        call[0] === '--color-primary'
      );
      expect(primaryColorCall).toBeDefined();
      expect(primaryColorCall?.[1]).toBe('#3b82f6'); // Light theme primary color
    });

    it('should apply dark theme styles to document', () => {
      applyThemeToDocument('dark');
      
      const setPropertyCalls = (document.documentElement.style.setProperty as ReturnType<typeof vi.fn>).mock.calls;
      
      // Check that CSS custom properties are set
      expect(setPropertyCalls.length).toBeGreaterThan(0);
      
      // Should set primary color for dark theme
      const primaryColorCall = setPropertyCalls.find((call: string[]) => 
        call[0] === '--color-primary'
      );
      expect(primaryColorCall).toBeDefined();
      expect(primaryColorCall?.[1]).toBe('#60a5fa'); // Dark theme primary color
    });

    it('should set correct number of CSS custom properties', () => {
      applyThemeToDocument('light');
      
      const setPropertyCalls = (document.documentElement.style.setProperty as ReturnType<typeof vi.fn>).mock.calls;
      
      // Should set all color properties plus transition properties
      // 22 color properties + 6 transition properties = 28 total properties
      expect(setPropertyCalls.length).toBeGreaterThanOrEqual(22);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      expect(toggleTheme('light')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      expect(toggleTheme('dark')).toBe('light');
    });

    it('should toggle system mode based on system preference', () => {
      window.matchMedia = vi.fn(() => mockMatchMedia(true)); // System is dark
      expect(toggleTheme('system')).toBe('light');
      
      window.matchMedia = vi.fn(() => mockMatchMedia(false)); // System is light
      expect(toggleTheme('system')).toBe('dark');
    });
  });

  describe('getNextThemeMode', () => {
    it('should cycle through theme modes correctly', () => {
      expect(getNextThemeMode('light')).toBe('dark');
      expect(getNextThemeMode('dark')).toBe('system');
      expect(getNextThemeMode('system')).toBe('light');
    });
  });

  describe('preventFOUC', () => {
    beforeEach(() => {
      // Mock requestAnimationFrame
      global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
        setTimeout(callback, 0);
        return 0;
      });
      
      window.matchMedia = vi.fn(() => mockMatchMedia(false));
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should apply theme immediately to prevent FOUC', () => {
      preventFOUC();
      
      // Should add classes to document
      expect(document.documentElement.classList.add).toHaveBeenCalledWith(
        'theme-no-transition',
        'theme-loading'
      );
    });

    it('should handle errors gracefully', () => {
      expect(() => preventFOUC()).not.toThrow();
    });
  });

  describe('getThemeModeLabel', () => {
    it('should return correct labels for each theme mode', () => {
      expect(getThemeModeLabel('light')).toBe('Light');
      expect(getThemeModeLabel('dark')).toBe('Dark');
      expect(getThemeModeLabel('system')).toBe('System');
    });
  });
});