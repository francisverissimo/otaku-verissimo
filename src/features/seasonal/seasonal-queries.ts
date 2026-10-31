import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type { SeasonalMediaPageQuery } from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { compact } from '@/lib/compact'
import { queryKeys } from '@/lib/query-keys'
import { toQueryVariables, type SeasonalFilters } from './seasonal-filters'
import { setListEntry } from './seasonal-utils'

const SeasonalMediaPageQueryDocument = graphql(`
  query SeasonalMediaPage(
    $page: Int
    $season: MediaSeason
    $seasonYear: Int
    $sort: [MediaSort]
    $isAdult: Boolean
    $onList: Boolean
  ) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      media(
        type: ANIME
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        isAdult: $isAdult
        onList: $onList
      ) {
        id
        format
        title {
          userPreferred
        }
        coverImage {
          large
          color
        }
        genres
        averageScore
        favourites
        popularity
        studios(isMain: true) {
          nodes {
            name
          }
        }
        mediaListEntry {
          id
          status
        }
      }
    }
  }
`)

const AddToPlanningMutation = graphql(`
  mutation AddToPlanning($mediaId: Int) {
    SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
      id
      status
    }
  }
`)

type SeasonalMediaResult = NonNullable<
  NonNullable<NonNullable<SeasonalMediaPageQuery['Page']>['media']>[number]
>

export function toSeasonalMedia(media: SeasonalMediaResult) {
  return {
    id: media.id,
    format: media.format,
    title: media.title?.userPreferred ?? '',
    cover: media.coverImage?.large ?? null,
    color: media.coverImage?.color ?? null,
    genres: compact(media.genres),
    averageScore: media.averageScore,
    favourites: media.favourites ?? 0,
    popularity: media.popularity ?? 0,
    studio: compact(media.studios?.nodes).find(Boolean)?.name ?? null,
    listEntry: media.mediaListEntry
      ? { id: media.mediaListEntry.id, status: media.mediaListEntry.status }
      : null,
  }
}

export type SeasonalMedia = ReturnType<typeof toSeasonalMedia>

/** A season has around 100 to 150 anime; this cap only guards against a runaway loop. */
const MAX_PAGES = 10

/** Genres are filtered on the client, so they are not part of the key. */
const seasonalKey = (filters: SeasonalFilters, userId: number | null) =>
  [...queryKeys.seasonal, toQueryVariables(filters, userId != null), userId] as const

/**
 * Loads every anime of the season, page after page, so the list can be grouped by format and
 * filtered by genre without more requests. Logged-in requests also bring each media's list status.
 */
export function useSeasonalChart(filters: SeasonalFilters, userId: number | null) {
  return useQuery({
    queryKey: seasonalKey(filters, userId),
    queryFn: async () => {
      const variables = toQueryVariables(filters, userId != null)
      const media: SeasonalMedia[] = []

      for (let page = 1; page <= MAX_PAGES; page++) {
        const data = await execute(
          SeasonalMediaPageQueryDocument,
          { ...variables, page },
          { auth: userId != null }
        )
        media.push(...compact(data.Page?.media).map(toSeasonalMedia))
        if (!data.Page?.pageInfo?.hasNextPage) break
      }

      return media
    },
    placeholderData: (previous) => previous,
  })
}

export function useAddToPlanning(filters: SeasonalFilters, userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: number) =>
      execute(AddToPlanningMutation, { mediaId }, { auth: true }).then((data) => ({
        mediaId,
        entry: data.SaveMediaListEntry,
      })),
    onSuccess: ({ mediaId, entry }) => {
      if (!entry) return

      queryClient.setQueryData<SeasonalMedia[]>(seasonalKey(filters, userId), (media) =>
        media ? setListEntry(media, mediaId, { id: entry.id, status: entry.status }) : media
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.mediaList(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.animeListEntries })
    },
  })
}
