import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  scrollToSection,
  formatCurrency,
  calculateDiscountPrice,
  validateEmail,
  generateId,
  debounce,
  isInViewport,
} from '../helpers';

// Mock DOM methods
const mockScrollTo = vi.fn();
const mockGetElementById = vi.fn();

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
});

describe('scrollToSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scroll to element when found', () => {
    const mockElement = {
      offsetTop: 500,
    } as HTMLElement;

    mockGetElementById.mockReturnValue(mockElement);

    scrollToSection('test-section');

    expect(mockGetElementById).toHaveBeenCalledWith('test-section');
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 420, // 500 - 80 (offset)
      behavior: 'smooth',
    });
  });

  it('should not scroll when element is not found', () => {
    mockGetElementById.mockReturnValue(null);

    scrollToSection('non-existent-section');

    expect(mockGetElementById).toHaveBeenCalledWith('non-existent-section');
    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe('formatCurrency', () => {
  it('should format whole numbers without decimals', () => {
    expect(formatCurrency(100)).toBe('$100');
    expect(formatCurrency(1000)).toBe('$1,000');
  });

  it('should format decimal numbers by rounding to whole numbers', () => {
    expect(formatCurrency(99.99)).toBe('$100');
    expect(formatCurrency(123.45)).toBe('$123');
    expect(formatCurrency(99.49)).toBe('$99');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-50)).toBe('-$50');
  });
});

describe('calculateDiscountPrice', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscountPrice(100, 10)).toBe(90);
    expect(calculateDiscountPrice(100, 25)).toBe(75);
    expect(calculateDiscountPrice(200, 50)).toBe(100);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscountPrice(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscountPrice(100, 100)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(calculateDiscountPrice(99, 10)).toBe(89); // 99 * 0.9 = 89.1 -> 89
  });

  it('should handle decimal prices', () => {
    expect(calculateDiscountPrice(99.99, 10)).toBe(90); // 99.99 * 0.9 = 89.991 -> 90
  });
});

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('test+tag@example.org')).toBe(true);
    expect(validateEmail('user123@test-domain.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('test.domain.com')).toBe(false);
    expect(validateEmail('test @domain.com')).toBe(false); // space
    expect(validateEmail('')).toBe(false);
  });
});

describe('generateId', () => {
  it('should generate a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  it('should generate different IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs of expected length', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
    expect(id.length).toBeLessThanOrEqual(13); // substring(2, 15) = max 13 chars
  });

  it('should generate alphanumeric IDs', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should cancel previous calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('should handle multiple arguments', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2', 123);

    vi.advanceTimersByTime(100);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('should reset timer on subsequent calls', () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('test');

    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    debouncedFn('test2');

    vi.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledWith('test2');
  });
});

describe('isInViewport', () => {
  const createMockRect = (top: number, left: number, bottom: number, right: number): DOMRect => ({
    top,
    left,
    bottom,
    right,
    height: bottom - top,
    width: right - left,
    x: left,
    y: top,
    toJSON: () => ({ top, left, bottom, right, height: bottom - top, width: right - left, x: left, y: top }),
  });

  const mockElement = {
    getBoundingClientRect: vi.fn(),
  } as unknown as HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    // Mock document dimensions as fallback
    Object.defineProperty(document.documentElement, 'clientHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  it('should return true when element is fully in viewport', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(100, 100, 200, 200));
    expect(isInViewport(mockElement)).toBe(true);
  });

  it('should return false when element is above viewport', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(-100, 100, -50, 200));
    expect(isInViewport(mockElement)).toBe(false);
  });

  it('should return false when element is below viewport', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(900, 100, 1000, 200));
    expect(isInViewport(mockElement)).toBe(false);
  });

  it('should return false when element is left of viewport', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(100, -100, 200, -50));
    expect(isInViewport(mockElement)).toBe(false);
  });

  it('should return false when element is right of viewport', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(100, 1300, 200, 1400));
    expect(isInViewport(mockElement)).toBe(false);
  });

  it('should handle edge case at viewport boundaries', () => {
    mockElement.getBoundingClientRect = vi.fn(() => createMockRect(0, 0, 800, 1200));
    expect(isInViewport(mockElement)).toBe(true);
  });
});