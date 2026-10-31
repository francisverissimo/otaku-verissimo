import { describe, expect, it } from 'vitest'
import { getContrastRatio } from './get-contrast-safe-color'

describe('getContrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(getContrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2)
    expect(getContrastRatio('#ffffff', '#ffffff')).toBe(1)
  })

  it('does not depend on the argument order', () => {
    expect(getContrastRatio('#ff5f00', '#18181b')).toBe(getContrastRatio('#18181b', '#ff5f00'))
  })

  it('accepts the short hex form', () => {
    expect(getContrastRatio('#fff', '#000')).toBeCloseTo(21, 1)
  })
})
