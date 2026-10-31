import { describe, expect, it } from 'vitest'
import { toSeasonalMedia, type SeasonalMedia } from './seasonal-queries'
import { countGenres, filterByGenres, groupByFormat, setListEntry } from './seasonal-utils'

function media(id: number, format: SeasonalMedia['format'], genres: string[]): SeasonalMedia {
  return {
    id,
    format,
    title: `Anime ${id}`,
    cover: null,
    color: null,
    genres,
    averageScore: null,
    favourites: 0,
    popularity: 0,
    studio: null,
    listEntry: null,
  }
}

const season = [
  media(1, 'ONA', ['Action']),
  media(2, 'TV', ['Action', 'Drama']),
  media(3, 'MOVIE', ['Drama']),
  media(4, 'TV', ['Comedy']),
  media(5, null, ['Action']),
]

describe('groupByFormat', () => {
  it('follows AL-chan section order and keeps the API order inside each group', () => {
    expect(
      groupByFormat(season).map((group) => [group.format, group.media.map((m) => m.id)])
    ).toEqual([
      ['TV', [2, 4]],
      ['MOVIE', [3]],
      ['ONA', [1]],
    ])
  })
})

describe('filterByGenres', () => {
  it('returns everything when no genre is selected', () => {
    expect(filterByGenres(season, [])).toBe(season)
  })

  it('keeps media that have every selected genre', () => {
    expect(filterByGenres(season, ['Action', 'Drama']).map((m) => m.id)).toEqual([2])
  })
})

describe('countGenres', () => {
  it('lists genres by how many media have them, then alphabetically', () => {
    expect(countGenres(season)).toEqual([
      { genre: 'Action', count: 3 },
      { genre: 'Drama', count: 2 },
      { genre: 'Comedy', count: 1 },
    ])
  })
})

describe('setListEntry', () => {
  it('marks one media as being on the list without touching the others', () => {
    const updated = setListEntry(season, 2, { id: 99, status: 'PLANNING' })

    expect(updated[1].listEntry).toEqual({ id: 99, status: 'PLANNING' })
    expect(updated.filter((m) => m.listEntry).length).toBe(1)
    expect(season[1].listEntry).toBeNull()
  })
})

describe('toSeasonalMedia', () => {
  it('handles a media where every nullable field is null', () => {
    expect(
      toSeasonalMedia({
        id: 1,
        format: null,
        title: null,
        coverImage: null,
        genres: [null, 'Action'],
        averageScore: null,
        favourites: null,
        popularity: null,
        studios: { nodes: [null, { name: 'MAPPA' }] },
        mediaListEntry: null,
      })
    ).toEqual({ ...media(1, null, ['Action']), title: '', studio: 'MAPPA' })
  })
})
