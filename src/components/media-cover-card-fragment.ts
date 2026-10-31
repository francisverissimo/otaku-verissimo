import { graphql } from '@/gql'
import type { MediaCoverCardFragment } from '@/gql/graphql'
import { compact } from '@/utils/compact'

graphql(`
  fragment MediaCoverCard on Media {
    id
    title {
      userPreferred
    }
    coverImage {
      large
      color
    }
    genres
    episodes
    averageScore
    format
    studios(isMain: true) {
      nodes {
        id
        name
      }
    }
    season
    seasonYear
    startDate {
      year
      month
      day
    }
  }
`)

export function toMediaCoverCard(media: MediaCoverCardFragment) {
  const { startDate } = media

  return {
    id: media.id,
    title: media.title?.userPreferred ?? '',
    cover: media.coverImage?.large ?? null,
    color: media.coverImage?.color ?? null,
    genres: compact(media.genres),
    episodes: media.episodes,
    averageScore: media.averageScore,
    format: media.format,
    studios: compact(media.studios?.nodes).map((studio) => studio.name),
    season: media.season,
    year: media.seasonYear ?? startDate?.year ?? null,
    isTBA: !startDate?.year && !startDate?.month && !startDate?.day,
  }
}

export type MediaCoverCardData = ReturnType<typeof toMediaCoverCard>
