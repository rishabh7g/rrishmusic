import { describe, it, expect } from 'vitest'
import { NAVIGATION_ITEMS, SITE_CONFIG } from './constants'

describe('Constants', () => {
  describe('NAVIGATION_ITEMS', () => {
    it('should have all required navigation items', () => {
      expect(NAVIGATION_ITEMS).toBeDefined()
      expect(Array.isArray(NAVIGATION_ITEMS)).toBe(true)
      expect(NAVIGATION_ITEMS.length).toBeGreaterThan(0)
    })

    it('should have proper structure for each navigation item', () => {
      NAVIGATION_ITEMS.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('label')
        expect(item).toHaveProperty('href')
        
        expect(typeof item.id).toBe('string')
        expect(typeof item.label).toBe('string')
        expect(typeof item.href).toBe('string')
        
        // href should start with #
        expect(item.href.startsWith('#')).toBe(true)
      })
    })

    it('should include main sections', () => {
      const ids = NAVIGATION_ITEMS.map(item => item.id)
      
      expect(ids).toContain('hero')
      expect(ids).toContain('about')
      expect(ids).toContain('lessons')
      expect(ids).toContain('contact')
    })
  })

  describe('SITE_CONFIG', () => {
    it('should have basic site configuration', () => {
      expect(SITE_CONFIG).toBeDefined()
      expect(typeof SITE_CONFIG).toBe('object')
    })

    it('should have required properties', () => {
      expect(SITE_CONFIG).toHaveProperty('name')
      expect(SITE_CONFIG).toHaveProperty('description')
      
      expect(typeof SITE_CONFIG.name).toBe('string')
      expect(typeof SITE_CONFIG.description).toBe('string')
    })

    it('should have non-empty values', () => {
      expect(SITE_CONFIG.name.length).toBeGreaterThan(0)
      expect(SITE_CONFIG.description.length).toBeGreaterThan(0)
    })
  })
})