import { useQuery } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type { CharacterQuery as CharacterQueryResult } from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { compact } from '@/utils/compact'

const CharacterQuery = graphql(`
  query Character($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      favourites
      media(sort: POPULARITY_DESC) {
        edges {
          node {
            id
            type
            title {
              userPreferred
            }
            coverImage {
              large
            }
          }
          voiceActors {
            id
            name {
              full
            }
            image {
              large
            }
            languageV2
          }
        }
      }
    }
  }
`)

function toCharacterView(data: CharacterQueryResult) {
  const character = data.Character
  if (!character) return null

  const edges = compact(character.media?.edges)

  return {
    id: character.id,
    name: character.name?.full ?? 'Unknown',
    nativeName: character.name?.native ?? null,
    image: character.image?.large ?? null,
    favourites: character.favourites ?? 0,
    voiceActors: compact(edges[0]?.voiceActors).map((actor) => ({
      id: actor.id,
      name: actor.name?.full ?? 'Unknown',
      image: actor.image?.large ?? null,
      language: actor.languageV2,
    })),
    media: compact(edges.map((edge) => edge.node)).map((node) => ({
      id: node.id,
      type: node.type,
      title: node.title?.userPreferred ?? '',
      cover: node.coverImage?.large ?? null,
    })),
  }
}

export function useCharacter(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => execute(CharacterQuery, { id }),
    select: toCharacterView,
  })
}
