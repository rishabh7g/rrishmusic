import { describe, it, expect } from 'vitest'
import { formatCurrency, slugify, debounce } from './helpers'

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats numbers as currency correctly', () => {
      expect(formatCurrency(50)).toBe('$50')
      expect(formatCurrency(50.99)).toBe('$51')
      expect(formatCurrency(1000)).toBe('$1,000')
    })

    it('handles zero and negative values', () => {
      expect(formatCurrency(0)).toBe('$0')
      expect(formatCurrency(-50)).toBe('-$50')
    })
  })

  describe('slugify', () => {
    it('converts text to URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Guitar Lessons & Music')).toBe('guitar-lessons-music')
      expect(slugify('Test   Multiple   Spaces')).toBe('test-multiple-spaces')
    })

    it('handles special characters', () => {
      expect(slugify('café & résumé')).toBe('caf-rsum')
      expect(slugify('100% Perfect!')).toBe('100-perfect')
    })

    it('handles empty and edge cases', () => {
      expect(slugify('')).toBe('')
      expect(slugify('   ')).toBe('')
      expect(slugify('---')).toBe('')
    })
  })

  describe('debounce', () => {
    it('debounces function calls', (done) => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 50)

      // Call multiple times quickly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      // Should not have been called yet
      expect(callCount).toBe(0)

      // Wait for debounce delay
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 60)
    })
  })
})