import { describe, expect, it } from 'vitest'
import { LIST_STATUS_COLORS, LIST_STATUS_LABELS, LIST_STATUSES } from './list-status'

describe('list status', () => {
  it('gives every list status its own color', () => {
    const colors = Object.values(LIST_STATUS_COLORS).map((color) => color.text)

    expect(new Set(colors).size).toBe(colors.length)
  })

  it('has a label and a color for every status in the picker', () => {
    for (const status of LIST_STATUSES) {
      expect(LIST_STATUS_LABELS[status]).toBeTruthy()
      expect(LIST_STATUS_COLORS[status]).toBeTruthy()
    }
  })
})
