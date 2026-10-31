import { describe, expect, it } from 'vitest'
import { toMediaListGroups } from './anime-list-queries'

describe('toMediaListGroups', () => {
  it('drops entries without media and defaults missing progress to 0', () => {
    const lists = toMediaListGroups({
      MediaListCollection: {
        lists: [
          null,
          {
            name: 'Watching',
            status: 'CURRENT',
            entries: [
              null,
              { id: 1, status: 'CURRENT', progress: null, media: null },
              {
                id: 2,
                status: 'CURRENT',
                progress: null,
                media: {
                  id: 20,
                  format: 'TV',
                  episodes: null,
                  averageScore: null,
                  title: null,
                  coverImage: null,
                  nextAiringEpisode: null,
                },
              },
            ],
          },
        ],
      },
    })

    expect(lists).toEqual([
      {
        name: 'Watching',
        status: 'CURRENT',
        entries: [
          {
            id: 2,
            status: 'CURRENT',
            progress: 0,
            media: {
              id: 20,
              title: '',
              cover: null,
              format: 'TV',
              episodes: null,
              averageScore: 0,
              nextAiringEpisode: null,
            },
          },
        ],
      },
    ])
  })

  it('returns no lists when the collection is missing', () => {
    expect(toMediaListGroups({ MediaListCollection: null })).toEqual([])
  })
})
