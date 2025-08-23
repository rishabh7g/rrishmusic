import { describe, it, expect } from 'vitest'

describe('Basic Tests', () => {
  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4)
  })

  it('should handle string operations', () => {
    const str = 'RrishMusic'
    expect(str.toLowerCase()).toBe('rrishmusic')
    expect(str.length).toBe(10)
  })

  it('should handle array operations', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
    expect(arr.includes(2)).toBe(true)
  })

  it('should handle object operations', () => {
    const obj = { name: 'Rrish', instrument: 'guitar' }
    expect(obj.name).toBe('Rrish')
    expect(Object.keys(obj)).toEqual(['name', 'instrument'])
  })

  it('should handle boolean logic', () => {
    expect(true && true).toBe(true)
    expect(true || false).toBe(true)
    expect(!false).toBe(true)
  })
})