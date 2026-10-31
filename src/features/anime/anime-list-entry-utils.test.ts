import { describe, expect, it } from 'vitest'
import {
  applyFormRules,
  canIncrement,
  clampScore,
  fromDateInput,
  incrementProgress,
  newEntryForm,
  toDateInput,
  type EntryForm,
} from './anime-list-entry-utils'

const now = new Date('2026-10-31T12:00:00')
const halloween = { year: 2026, month: 10, day: 31 }
const empty = { year: null, month: null, day: null }

function form(changes: Partial<EntryForm> = {}): EntryForm {
  return { ...newEntryForm('CURRENT'), ...changes }
}

describe('date input', () => {
  it('converts complete dates both ways', () => {
    expect(toDateInput({ year: 2026, month: 3, day: 7 })).toBe('2026-03-07')
    expect(fromDateInput('2026-03-07')).toEqual({ year: 2026, month: 3, day: 7 })
  })

  it('shows partial dates as empty and clears with an empty value', () => {
    expect(toDateInput({ year: 2026, month: null, day: null })).toBe('')
    expect(fromDateInput('')).toEqual(empty)
  })
})

describe('clampScore', () => {
  it('rounds to the step of each format and stays within its range', () => {
    expect(clampScore(7.46, 'POINT_10_DECIMAL')).toBe(7.5)
    expect(clampScore(7.46, 'POINT_10')).toBe(7)
    expect(clampScore(120, 'POINT_100')).toBe(100)
    expect(clampScore(-3, 'POINT_5')).toBe(0)
    expect(clampScore(Number.NaN, 'POINT_3')).toBe(0)
  })
})

describe('applyFormRules', () => {
  it('completes the entry and sets the finish date on the last episode', () => {
    const result = applyFormRules(form({ progress: 11 }), form({ progress: 12 }), 12, now)

    expect(result).toMatchObject({ status: 'COMPLETED', progress: 12, completedAt: halloween })
  })

  it('fills progress when the status changes to completed', () => {
    const result = applyFormRules(
      form({ progress: 3 }),
      form({ progress: 3, status: 'COMPLETED' }),
      24,
      now
    )

    expect(result).toMatchObject({ progress: 24, completedAt: halloween })
  })

  it('sets the start date when the user starts watching', () => {
    const planning = form({ status: 'PLANNING' })
    const result = applyFormRules(planning, { ...planning, status: 'CURRENT' }, 12, now)

    expect(result.startedAt).toEqual(halloween)
  })

  it('never overwrites dates the user already filled', () => {
    const started = { year: 2026, month: 1, day: 2 }
    const finished = { year: 2026, month: 2, day: 3 }
    const previous = form({ progress: 11, startedAt: started, completedAt: finished })
    const result = applyFormRules(previous, { ...previous, progress: 12 }, 12, now)

    expect(result).toMatchObject({ startedAt: started, completedAt: finished })
  })

  it('keeps progress between 0 and the episode count', () => {
    expect(applyFormRules(form(), form({ progress: 30 }), 12, now).progress).toBe(12)
    expect(applyFormRules(form(), form({ progress: -1 }), 12, now).progress).toBe(0)
  })

  it('does not limit progress when the episode count is unknown', () => {
    expect(applyFormRules(form(), form({ progress: 500 }), null, now)).toMatchObject({
      progress: 500,
      status: 'CURRENT',
    })
  })
})

describe('incrementProgress', () => {
  it('moves a planned anime to watching', () => {
    expect(incrementProgress(form({ status: 'PLANNING' }), 12, now)).toMatchObject({
      status: 'CURRENT',
      progress: 1,
      startedAt: halloween,
    })
  })

  it('keeps a rewatch as rewatching', () => {
    expect(incrementProgress(form({ status: 'REPEATING', progress: 2 }), 12, now).status).toBe(
      'REPEATING'
    )
  })

  it('completes the anime on the last episode', () => {
    expect(incrementProgress(form({ progress: 11 }), 12, now)).toMatchObject({
      status: 'COMPLETED',
      progress: 12,
    })
  })
})

describe('canIncrement', () => {
  it('is false for completed entries or when every episode was watched', () => {
    expect(canIncrement(form({ status: 'COMPLETED' }), 12)).toBe(false)
    expect(canIncrement(form({ progress: 12 }), 12)).toBe(false)
    expect(canIncrement(form({ progress: 3 }), null)).toBe(true)
  })
})
