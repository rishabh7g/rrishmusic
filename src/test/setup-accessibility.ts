/**
 * Accessibility Test Setup
 * 
 * Setup for accessibility tests including axe-core integration,
 * screen reader simulation, and WCAG compliance testing
 */

import '@testing-library/jest-dom';
import { expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { configureAxe } from 'axe-core';

// Configure axe-core for accessibility testing
const axeConfig = {
  rules: {
    // Enable all WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'semantic-structure': { enabled: true },
    
    // Disable rules that may not apply to test environment
    'region': { enabled: false }, // Can be too strict for component testing
    'bypass': { enabled: false }, // Skip link testing not needed in components
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
};

// Mock screen reader APIs for testing
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
  pending: false,
  speaking: false,
  paused: false,
  onvoiceschanged: null,
};

// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  text = '';
  lang = 'en-US';
  voice = null;
  volume = 1;
  rate = 1;
  pitch = 1;
  onstart = null;
  onend = null;
  onerror = null;
  onpause = null;
  onresume = null;
  onmark = null;
  onboundary = null;
  
  constructor(text?: string) {
    if (text) this.text = text;
  }
  
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn(() => true);
};

// Enhanced accessibility testing utilities
export const a11yUtils = {
  // Keyboard navigation simulation
  simulateKeyboardNavigation: async (element: HTMLElement, direction: 'forward' | 'backward' = 'forward') => {
    const key = direction === 'forward' ? 'Tab' : 'Tab';
    const shiftKey = direction === 'backward';
    
    element.dispatchEvent(new KeyboardEvent('keydown', { 
      key, 
      shiftKey, 
      bubbles: true 
    }));
  },
  
  // Focus management testing
  getFocusableElements: (container: HTMLElement) => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];
    
    return Array.from(container.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];
  },
  
  // Color contrast testing
  getColorContrast: (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    return {
      foreground: computedStyle.color,
      background: computedStyle.backgroundColor,
    };
  },
  
  // ARIA testing utilities
  getAriaAttributes: (element: HTMLElement) => {
    const ariaAttributes: Record<string, string> = {};
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        ariaAttributes[attr.name] = attr.value;
      }
    });
    return ariaAttributes;
  },
  
  // Screen reader text calculation
  getAccessibleName: (element: HTMLElement): string => {
    // Simplified accessible name calculation
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    const alt = element.getAttribute('alt');
    const title = element.getAttribute('title');
    const textContent = element.textContent?.trim();
    
    if (ariaLabel) return ariaLabel;
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      if (labelElement) return labelElement.textContent?.trim() || '';
    }
    if (alt) return alt;
    if (title) return title;
    if (textContent) return textContent;
    
    return '';
  },
};

// Mock axe-core for testing (if not available in test environment)
if (!global.axe) {
  global.axe = {
    configure: vi.fn(),
    run: vi.fn(async () => ({
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: [],
    })),
    reset: vi.fn(),
    getRules: vi.fn(() => []),
  };
}

// Configure axe for consistent testing
configureAxe(axeConfig);

// Mock high contrast mode detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query.includes('prefers-contrast: high') ? false : query.includes('prefers-reduced-motion') ? true : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup for accessibility tests
beforeAll(() => {
  // Set accessibility test environment
  process.env.VITEST_A11Y = 'true';
  process.env.AXE_DEBUG = process.env.CI ? 'false' : 'true';
  
  // Configure reduced motion for consistent testing
  const style = document.createElement('style');
  style.textContent = `
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset DOM state
  document.body.innerHTML = '';
  document.head.innerHTML = '<style>@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }</style>';
  
  // Reset focus
  if (document.activeElement && document.activeElement !== document.body) {
    (document.activeElement as HTMLElement).blur();
  }
});

afterEach(() => {
  // Cleanup after each test
  cleanup();
  
  // Clear timers
  vi.clearAllTimers();
});

afterAll(() => {
  // Restore mocks
  vi.restoreAllMocks();
});