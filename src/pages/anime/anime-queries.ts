import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type {
  AnimeCharacterEdgeFragment,
  AnimeQuery as AnimeQueryResult,
  AnimeStaffEdgeFragment,
} from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { toPage, type Page } from '@/lib/connection-page'
import { compact } from '@/utils/compact'

graphql(`
  fragment AnimeCharacterEdge on CharacterEdge {
    role
    node {
      id
      name {
        full
      }
      image {
        medium
      }
    }
    voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
      roleNotes
      voiceActor {
        id
        name {
          full
        }
        image {
          medium
        }
      }
    }
  }
`)

graphql(`
  fragment AnimeStaffEdge on StaffEdge {
    id
    role
    node {
      id
      name {
        full
      }
      image {
        medium
      }
    }
  }
`)

const AnimeQuery = graphql(`
  query Anime($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        userPreferred
        english
        native
      }
      coverImage {
        large
        color
      }
      bannerImage
      synonyms
      genres
      episodes
      duration
      averageScore
      meanScore
      popularity
      favourites
      format
      status
      source
      season
      seasonYear
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      studios {
        edges {
          isMain
          node {
            id
            name
          }
        }
      }
      characters(sort: [ROLE, ID], page: 1, perPage: 20) {
        edges {
          ...AnimeCharacterEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      staff(sort: RELEVANCE, page: 1, perPage: 20) {
        edges {
          ...AnimeStaffEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      tags {
        id
        name
        rank
        isMediaSpoiler
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              userPreferred
            }
            format
            coverImage {
              large
            }
          }
        }
      }
      recommendations(sort: RATING_DESC) {
        edges {
          node {
            mediaRecommendation {
              id
              title {
                userPreferred
              }
              format
              coverImage {
                large
              }
              averageScore
              favourites
            }
          }
        }
      }
      externalLinks {
        id
        site
        url
        color
        icon
      }
    }
  }
`)

const AnimeCharactersPageQuery = graphql(`
  query AnimeCharactersPage($id: Int, $page: Int) {
    Media(id: $id, type: ANIME) {
      characters(sort: [ROLE, ID], page: $page, perPage: 20) {
        edges {
          ...AnimeCharacterEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`)

const AnimeStaffPageQuery = graphql(`
  query AnimeStaffPage($id: Int, $page: Int) {
    Media(id: $id, type: ANIME) {
      staff(sort: RELEVANCE, page: $page, perPage: 20) {
        edges {
          ...AnimeStaffEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`)

function toCharacter(edge: AnimeCharacterEdgeFragment) {
  if (!edge.node) return null

  return {
    id: edge.node.id,
    name: edge.node.name?.full ?? 'Unknown',
    image: edge.node.image?.medium ?? null,
    role: edge.role,
    voiceActors: compact(edge.voiceActorRoles).flatMap(({ voiceActor, roleNotes }) =>
      voiceActor
        ? [
            {
              id: voiceActor.id,
              name: voiceActor.name?.full ?? 'Unknown',
              image: voiceActor.image?.medium ?? null,
              roleNotes,
            },
          ]
        : []
    ),
  }
}

function toStaffMember(edge: AnimeStaffEdgeFragment) {
  if (!edge.node) return null

  return {
    /** The same person can appear in several edges, one per role. */
    edgeId: edge.id,
    id: edge.node.id,
    name: edge.node.name?.full ?? 'Unknown',
    image: edge.node.image?.medium ?? null,
    role: edge.role,
  }
}

export type AnimeCharacter = NonNullable<ReturnType<typeof toCharacter>>
export type AnimeStaffMember = NonNullable<ReturnType<typeof toStaffMember>>

function toFuzzyDate(
  date: { year: number | null; month: number | null; day: number | null } | null
) {
  return { year: date?.year ?? null, month: date?.month ?? null, day: date?.day ?? null }
}

export type FuzzyDate = ReturnType<typeof toFuzzyDate>

function toAnimeView(data: AnimeQueryResult) {
  const media = data.Media
  if (!media) return null

  const startDate = toFuzzyDate(media.startDate)

  return {
    id: media.id,
    title: {
      userPreferred: media.title?.userPreferred ?? '',
      english: media.title?.english ?? null,
      native: media.title?.native ?? null,
    },
    cover: media.coverImage?.large ?? null,
    color: media.coverImage?.color ?? null,
    banner: media.bannerImage,
    synonyms: compact(media.synonyms),
    genres: compact(media.genres),
    episodes: media.episodes,
    duration: media.duration,
    averageScore: media.averageScore,
    meanScore: media.meanScore,
    popularity: media.popularity,
    favourites: media.favourites,
    format: media.format,
    status: media.status,
    source: media.source,
    season: media.season,
    seasonYear: media.seasonYear,
    description: media.description,
    startDate,
    endDate: toFuzzyDate(media.endDate),
    isToBeAnnounced: !startDate.year && !startDate.month && !startDate.day,
    studios: compact(media.studios?.edges).flatMap((edge) =>
      edge.node ? [{ id: edge.node.id, name: edge.node.name, isMain: edge.isMain }] : []
    ),
    characters: toPage(media.characters, toCharacter),
    staff: toPage(media.staff, toStaffMember),
    tags: compact(media.tags).map((tag) => ({
      id: tag.id,
      name: tag.name,
      rank: tag.rank,
      isMediaSpoiler: tag.isMediaSpoiler ?? false,
    })),
    relations: compact(media.relations?.edges).flatMap((edge) =>
      edge.node
        ? [
            {
              id: edge.node.id,
              relationType: edge.relationType,
              title: edge.node.title?.userPreferred ?? '',
              cover: edge.node.coverImage?.large ?? null,
              format: edge.node.format,
            },
          ]
        : []
    ),
    recommendations: compact(media.recommendations?.edges).flatMap((edge) => {
      const recommended = edge.node?.mediaRecommendation
      return recommended
        ? [
            {
              id: recommended.id,
              title: recommended.title?.userPreferred ?? '',
              cover: recommended.coverImage?.large ?? null,
              format: recommended.format,
              averageScore: recommended.averageScore,
              favourites: recommended.favourites,
            },
          ]
        : []
    }),
    externalLinks: compact(media.externalLinks).flatMap((link) =>
      link.url
        ? [{ id: link.id, url: link.url, site: link.site, color: link.color, icon: link.icon }]
        : []
    ),
  }
}

export type AnimeView = NonNullable<ReturnType<typeof toAnimeView>>

export function useAnime(id: number) {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => execute(AnimeQuery, { id }),
    select: toAnimeView,
  })
}

/** The first page comes with the anime query; later pages are fetched on scroll. */
export function useAnimeCharacters(animeId: number, firstPage: Page<AnimeCharacter>) {
  return useInfiniteQuery({
    queryKey: ['anime', animeId, 'characters'],
    queryFn: async ({ pageParam }) => {
      const data = await execute(AnimeCharactersPageQuery, { id: animeId, page: pageParam })
      return toPage(data.Media?.characters, toCharacter)
    },
    initialPageParam: 1,
    initialData: { pages: [firstPage], pageParams: [1] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.items),
  })
}

export function useAnimeStaff(animeId: number, firstPage: Page<AnimeStaffMember>) {
  return useInfiniteQuery({
    queryKey: ['anime', animeId, 'staff'],
    queryFn: async ({ pageParam }) => {
      const data = await execute(AnimeStaffPageQuery, { id: animeId, page: pageParam })
      return toPage(data.Media?.staff, toStaffMember)
    },
    initialPageParam: 1,
    initialData: { pages: [firstPage], pageParams: [1] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.items),
  })
}
