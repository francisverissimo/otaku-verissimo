import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  defaultFilters,
  parseFilters,
  serializeFilters,
  toMediaSort,
  toQueryVariables,
  yearOptions,
} from './seasonal-filters'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-10-31T12:00:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('parseFilters', () => {
  it('defaults to the current season sorted by popularity', () => {
    expect(parseFilters(new URLSearchParams())).toEqual({
      year: 2026,
      season: 'FALL',
      sort: 'POPULARITY',
      order: 'desc',
      genres: [],
      onList: 'all',
      adult: false,
    })
  })

  it('reads every filter from the URL', () => {
    const params = new URLSearchParams(
      'year=2024&season=SPRING&sort=SCORE&order=asc&genres=Action,Drama&onList=hide&adult=1'
    )

    expect(parseFilters(params)).toEqual({
      year: 2024,
      season: 'SPRING',
      sort: 'SCORE',
      order: 'asc',
      genres: ['Action', 'Drama'],
      onList: 'hide',
      adult: true,
    })
  })

  it('ignores invalid values', () => {
    const params = new URLSearchParams('year=1800&season=MONSOON&sort=RANDOM&order=up&onList=maybe')

    expect(parseFilters(params)).toEqual(defaultFilters())
  })
})

describe('serializeFilters', () => {
  it('leaves defaults out of the URL', () => {
    expect(serializeFilters(defaultFilters()).toString()).toBe('')
  })

  it('round-trips through parseFilters', () => {
    const filters = {
      ...defaultFilters(),
      year: 2025,
      genres: ['Romance'],
      onList: 'only' as const,
    }

    expect(parseFilters(serializeFilters(filters))).toEqual(filters)
  })
})

describe('yearOptions', () => {
  it('goes from next year back to 1950', () => {
    const years = yearOptions()

    expect(years[0]).toBe(2027)
    expect(years[years.length - 1]).toBe(1950)
  })
})

describe('toMediaSort', () => {
  it('adds _DESC only for descending order', () => {
    expect(toMediaSort({ ...defaultFilters(), sort: 'SCORE', order: 'desc' })).toBe('SCORE_DESC')
    expect(toMediaSort({ ...defaultFilters(), sort: 'TITLE_ROMAJI', order: 'asc' })).toBe(
      'TITLE_ROMAJI'
    )
  })
})

describe('toQueryVariables', () => {
  it('hides adult content unless asked, without restricting to adult only', () => {
    expect(toQueryVariables(defaultFilters(), false).isAdult).toBe(false)
    expect(toQueryVariables({ ...defaultFilters(), adult: true }, false).isAdult).toBeUndefined()
  })

  it('only sends the list filter for logged-in users', () => {
    const filters = { ...defaultFilters(), onList: 'hide' as const }

    expect(toQueryVariables(filters, false).onList).toBeUndefined()
    expect(toQueryVariables(filters, true).onList).toBe(false)
    expect(toQueryVariables({ ...filters, onList: 'only' }, true).onList).toBe(true)
  })

  it('does not send genres, which are filtered on the client', () => {
    expect(toQueryVariables({ ...defaultFilters(), genres: ['Action'] }, false)).not.toHaveProperty(
      'genres'
    )
  })
})
