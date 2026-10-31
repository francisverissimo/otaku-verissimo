import { describe, expect, it } from 'vitest'
import type { AnimeQuery } from '@/gql/graphql'
import { toAnimeView } from './anime-queries'

type Media = NonNullable<AnimeQuery['Media']>

/** A media where every nullable field is null, as AniList returns for sparse entries. */
const emptyMedia: Media = {
  id: 1,
  bannerImage: null,
  synonyms: null,
  genres: null,
  episodes: null,
  duration: null,
  averageScore: null,
  meanScore: null,
  popularity: null,
  favourites: null,
  format: null,
  status: null,
  source: null,
  season: null,
  seasonYear: null,
  description: null,
  title: null,
  coverImage: null,
  startDate: null,
  endDate: null,
  studios: null,
  characters: null,
  staff: null,
  tags: null,
  relations: null,
  recommendations: null,
  externalLinks: null,
}

describe('toAnimeView', () => {
  it('returns null when the anime does not exist', () => {
    expect(toAnimeView({ Media: null })).toBeNull()
  })

  it('turns a media with only nulls into a usable view', () => {
    const anime = toAnimeView({ Media: emptyMedia })

    expect(anime).toMatchObject({
      id: 1,
      title: { userPreferred: '', english: null, native: null },
      genres: [],
      synonyms: [],
      studios: [],
      tags: [],
      relations: [],
      recommendations: [],
      externalLinks: [],
      characters: { items: [], nextPage: undefined },
      staff: { items: [], nextPage: undefined },
      startDate: { year: null, month: null, day: null },
      isToBeAnnounced: true,
    })
  })

  it('is not "to be announced" when only the year is known', () => {
    const anime = toAnimeView({
      Media: { ...emptyMedia, startDate: { year: 2027, month: null, day: null } },
    })

    expect(anime?.isToBeAnnounced).toBe(false)
  })

  it('drops null items inside lists', () => {
    const anime = toAnimeView({
      Media: {
        ...emptyMedia,
        genres: ['Action', null, 'Drama'],
        studios: {
          edges: [
            null,
            { isMain: true, node: null },
            { isMain: true, node: { id: 7, name: 'Sunrise' } },
          ],
        },
        recommendations: {
          edges: [
            null,
            { node: { mediaRecommendation: null } },
            {
              node: {
                mediaRecommendation: {
                  id: 2,
                  title: { userPreferred: 'Trigun' },
                  format: 'TV',
                  coverImage: { large: 'cover.jpg' },
                  averageScore: 79,
                  favourites: 100,
                },
              },
            },
          ],
        },
        externalLinks: [
          { id: 1, site: 'Official Site', url: null, color: null, icon: null },
          { id: 2, site: 'Crunchyroll', url: 'https://example.com', color: '#F88B24', icon: null },
        ],
      },
    })

    expect(anime?.genres).toEqual(['Action', 'Drama'])
    expect(anime?.studios).toEqual([{ id: 7, name: 'Sunrise', isMain: true }])
    expect(anime?.recommendations.map((r) => r.id)).toEqual([2])
    expect(anime?.externalLinks.map((link) => link.site)).toEqual(['Crunchyroll'])
  })

  it('maps characters with their voice actors and the next page', () => {
    const anime = toAnimeView({
      Media: {
        ...emptyMedia,
        characters: {
          pageInfo: { currentPage: 1, hasNextPage: true },
          edges: [
            {
              role: 'MAIN',
              node: { id: 1, name: { full: 'Spike Spiegel' }, image: { medium: 'spike.jpg' } },
              voiceActorRoles: [
                null,
                { roleNotes: null, voiceActor: null },
                {
                  roleNotes: 'young',
                  voiceActor: { id: 95011, name: { full: 'Kouichi Yamadera' }, image: null },
                },
              ],
            },
            { role: 'SUPPORTING', node: null, voiceActorRoles: null },
          ],
        },
      },
    })

    expect(anime?.characters).toEqual({
      nextPage: 2,
      items: [
        {
          id: 1,
          name: 'Spike Spiegel',
          image: 'spike.jpg',
          role: 'MAIN',
          voiceActors: [{ id: 95011, name: 'Kouichi Yamadera', image: null, roleNotes: 'young' }],
        },
      ],
    })
  })

  it('keeps one staff item per role, identified by the edge id', () => {
    const node = { id: 5, name: { full: 'Shinichirou Watanabe' }, image: null }
    const anime = toAnimeView({
      Media: {
        ...emptyMedia,
        staff: {
          pageInfo: { currentPage: 1, hasNextPage: false },
          edges: [
            { id: 10, role: 'Director', node },
            { id: 11, role: 'Storyboard', node },
          ],
        },
      },
    })

    expect(anime?.staff.items.map((member) => [member.edgeId, member.role])).toEqual([
      [10, 'Director'],
      [11, 'Storyboard'],
    ])
    expect(anime?.staff.nextPage).toBeUndefined()
  })
})
