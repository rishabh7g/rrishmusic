import { describe, it, expect } from 'vitest';

describe('Test Setup Validation', () => {
  it('should have globals available', () => {
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });

  it('should have DOM environment available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  it('should have jest-dom matchers available', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    expect(div).toHaveTextContent('Hello World');
  });

  it('should have mocked window functions', () => {
    expect(window.scrollTo).toBeDefined();
    expect(window.matchMedia).toBeDefined();
  });

  it('should have mocked observers', () => {
    expect(IntersectionObserver).toBeDefined();
    expect(ResizeObserver).toBeDefined();
  });
});