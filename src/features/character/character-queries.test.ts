import { describe, expect, it } from 'vitest'
import { toCharacterView } from './character-queries'

const node = (id: number, type: 'ANIME' | 'MANGA') => ({
  id,
  type,
  title: { userPreferred: `Media ${id}` },
  coverImage: { large: null },
})

describe('toCharacterView', () => {
  it('returns null when the character does not exist', () => {
    expect(toCharacterView({ Character: null })).toBeNull()
  })

  it('handles a character without media', () => {
    const character = toCharacterView({
      Character: { id: 1, favourites: null, name: null, image: null, media: null },
    })

    expect(character).toMatchObject({ name: 'Unknown', voiceActors: [], media: [] })
  })

  it('takes voice actors from the most popular media and lists every media', () => {
    const character = toCharacterView({
      Character: {
        id: 1,
        favourites: 10,
        name: { full: 'Spike Spiegel', native: null },
        image: null,
        media: {
          edges: [
            {
              node: node(1, 'ANIME'),
              voiceActors: [
                { id: 7, languageV2: 'Japanese', name: { full: 'Kouichi Yamadera' }, image: null },
                null,
              ],
            },
            null,
            { node: node(2, 'MANGA'), voiceActors: [] },
          ],
        },
      },
    })

    expect(character?.voiceActors).toEqual([
      { id: 7, name: 'Kouichi Yamadera', image: null, language: 'Japanese' },
    ])
    expect(character?.media.map((media) => [media.id, media.type])).toEqual([
      [1, 'ANIME'],
      [2, 'MANGA'],
    ])
  })
})
