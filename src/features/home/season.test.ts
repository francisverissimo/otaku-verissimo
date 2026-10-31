import { afterEach, describe, expect, it, vi } from 'vitest'
import { seasonHandler } from './season'

afterEach(() => {
  vi.useRealTimers()
})

function at(date: string) {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(date))
}

describe('seasonHandler', () => {
  it.each([
    ['2026-01-15', 'WINTER', 'SPRING'],
    ['2026-04-15', 'SPRING', 'SUMMER'],
    ['2026-07-15', 'SUMMER', 'FALL'],
    ['2026-10-31', 'FALL', 'WINTER'],
  ])('on %s the season is %s and the next one is %s', (date, current, next) => {
    at(`${date}T12:00:00`)

    expect(seasonHandler.getCurrentSeason()).toBe(current)
    expect(seasonHandler.getNextSeason()).toBe(next)
  })

  it('moves to the next year when the next season is winter', () => {
    at('2026-11-01T12:00:00')

    expect(seasonHandler.getNextYear()).toBe(2027)
  })

  it('stays in the same year otherwise', () => {
    at('2026-05-01T12:00:00')

    expect(seasonHandler.getNextYear()).toBe(2026)
  })
})
