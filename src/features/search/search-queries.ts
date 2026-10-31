import { useInfiniteQuery } from '@tanstack/react-query'
import { graphql } from '@/gql'
import { execute } from '@/lib/graphql-client'
import { toMediaCoverCard } from '@/components/media-cover-card-fragment'
import { compact } from '@/lib/compact'

const SearchMediaQuery = graphql(`
  query SearchMedia($page: Int, $search: String) {
    Page(page: $page, perPage: 40) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, search: $search, sort: [POPULARITY_DESC], isAdult: false) {
        ...MediaCoverCard
      }
    }
  }
`)

export function useSearchMedia(search: string) {
  return useInfiniteQuery({
    queryKey: ['search-media', search],
    queryFn: ({ pageParam }) =>
      execute(SearchMediaQuery, { page: pageParam, search: search || undefined }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.Page?.pageInfo
      return pageInfo?.hasNextPage && pageInfo.currentPage ? pageInfo.currentPage + 1 : undefined
    },
    select: (data) => {
      // Popularity can shift between page requests, so the same media may show up twice.
      const media = data.pages.flatMap((page) => compact(page.Page?.media).map(toMediaCoverCard))
      return [...new Map(media.map((item) => [item.id, item])).values()]
    },
  })
}
