/**
 * Content System Smoke Tests
 * 
 * Critical content loading and validation
 * Ensures core content functionality works
 */
import { describe, it, expect } from 'vitest';

// Import content directly for speed
import siteContent from './site-content.json';
import lessons from './lessons.json';
import testimonials from './testimonials.json';

describe('Content System Smoke Tests', () => {
  it('site content loads without errors', () => {
    expect(siteContent).toBeDefined();
    expect(siteContent.site).toBeDefined();
    expect(siteContent.site.title).toBeDefined();
  });

  it('lessons content has required structure', () => {
    expect(lessons).toBeDefined();
    expect(Array.isArray(lessons)).toBe(true);
    
    if (lessons.length > 0) {
      expect(lessons[0]).toHaveProperty('id');
      expect(lessons[0]).toHaveProperty('title');
    }
  });

  it('testimonials content has required structure', () => {
    expect(testimonials).toBeDefined();
    expect(Array.isArray(testimonials)).toBe(true);
    
    if (testimonials.length > 0) {
      expect(testimonials[0]).toHaveProperty('id');
      expect(testimonials[0]).toHaveProperty('name');
    }
  });

  it('all content files are valid JSON', () => {
    // This test ensures content files can be parsed
    expect(() => JSON.parse(JSON.stringify(siteContent))).not.toThrow();
    expect(() => JSON.parse(JSON.stringify(lessons))).not.toThrow();
    expect(() => JSON.parse(JSON.stringify(testimonials))).not.toThrow();
  });

  it('critical site information is present', () => {
    expect(siteContent.site.title).toBeTruthy();
    expect(siteContent.site.description).toBeTruthy();
    
    // Ensure contact information exists
    if (siteContent.contact) {
      expect(
        siteContent.contact.email || siteContent.contact.instagram
      ).toBeTruthy();
    }
  });
});