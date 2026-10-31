import { describe, expect, it } from 'vitest'
import type { MediaListGroup } from './anime-list-queries'
import { applySavedEntry, sortEntries, sortSections } from './anime-list-utils'

function entry(
  id: number,
  status: MediaListGroup['entries'][number]['status'],
  progress: number,
  averageScore = 80
) {
  return {
    id,
    status,
    progress,
    media: {
      id: id * 10,
      title: `Anime ${id}`,
      cover: null,
      format: 'TV' as const,
      episodes: 12,
      averageScore,
      nextAiringEpisode: null,
    },
  }
}

function buildLists(): MediaListGroup[] {
  return [
    {
      name: 'Watching',
      status: 'CURRENT',
      entries: [entry(1, 'CURRENT', 3), entry(2, 'CURRENT', 5)],
    },
    { name: 'Planning', status: 'PLANNING', entries: [entry(3, 'PLANNING', 0)] },
    { name: 'Completed', status: 'COMPLETED', entries: [] },
    // Custom lists have no status and repeat entries from the status lists.
    { name: 'Favorites', status: null, entries: [entry(1, 'CURRENT', 3)] },
  ]
}

const ids = (list: MediaListGroup) => list.entries.map((e) => e.id)

describe('applySavedEntry', () => {
  it('updates progress in place when the status does not change', () => {
    const lists = applySavedEntry(buildLists(), { id: 1, status: 'CURRENT', progress: 4 })

    expect(ids(lists[0])).toEqual([1, 2])
    expect(lists[0].entries[0].progress).toBe(4)
  })

  it('updates the copy of the entry in custom lists', () => {
    const lists = applySavedEntry(buildLists(), { id: 1, status: 'CURRENT', progress: 4 })

    expect(lists[3].entries[0].progress).toBe(4)
  })

  it('moves the entry to the list of its new status', () => {
    const lists = applySavedEntry(buildLists(), { id: 3, status: 'CURRENT', progress: 1 })

    expect(ids(lists[1])).toEqual([])
    expect(ids(lists[0])).toEqual([1, 2, 3])
    expect(lists[0].entries[2]).toMatchObject({ status: 'CURRENT', progress: 1 })
  })

  it('keeps custom list copies when the entry moves to completed', () => {
    const lists = applySavedEntry(buildLists(), { id: 1, status: 'COMPLETED', progress: 12 })

    expect(ids(lists[0])).toEqual([2])
    expect(lists[2].entries).toEqual([
      expect.objectContaining({ id: 1, status: 'COMPLETED', progress: 12 }),
    ])
    expect(lists[3].entries[0].status).toBe('COMPLETED')
  })

  it('keeps the current values when the API returns null fields', () => {
    const lists = applySavedEntry(buildLists(), { id: 2, status: null, progress: null })

    expect(lists[0].entries[1]).toMatchObject({ status: 'CURRENT', progress: 5 })
  })

  it('returns the same lists when the entry is unknown', () => {
    const lists = buildLists()

    expect(applySavedEntry(lists, { id: 99, status: 'CURRENT', progress: 1 })).toBe(lists)
  })

  it('does not mutate the input', () => {
    const lists = buildLists()
    applySavedEntry(lists, { id: 1, status: 'COMPLETED', progress: 12 })

    expect(lists).toEqual(buildLists())
  })
})

describe('sortSections', () => {
  it('follows the order chosen by the user on AniList', () => {
    const sorted = sortSections(buildLists(), ['Planning', 'Watching', 'Favorites', 'Completed'])

    expect(sorted.map((list) => list.name)).toEqual([
      'Planning',
      'Watching',
      'Favorites',
      'Completed',
    ])
  })
})

describe('sortEntries', () => {
  it('puts the highest average score first', () => {
    const sorted = sortEntries([
      entry(1, 'CURRENT', 0, 60),
      entry(2, 'CURRENT', 0, 90),
      entry(3, 'CURRENT', 0, 75),
    ])

    expect(sorted.map((e) => e.id)).toEqual([2, 3, 1])
  })
})
