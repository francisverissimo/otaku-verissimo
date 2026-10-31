import { useQuery } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type { HomeMediaPageQueryVariables } from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { toMediaCoverCard } from '@/components/media-cover-card-fragment'
import { compact } from '@/lib/compact'

const HomeMediaPageQuery = graphql(`
  query HomeMediaPage($sort: [MediaSort], $season: MediaSeason, $seasonYear: Int) {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: $sort, season: $season, seasonYear: $seasonYear) {
        bannerImage
        ...MediaCoverCard
      }
    }
  }
`)

export function useHomeMediaPage(variables: HomeMediaPageQueryVariables) {
  return useQuery({
    queryKey: ['home-media-page', variables],
    queryFn: () => execute(HomeMediaPageQuery, variables),
    select: (data) =>
      compact(data.Page?.media).map((media) => ({
        ...toMediaCoverCard(media),
        bannerImage: media.bannerImage,
      })),
  })
}
