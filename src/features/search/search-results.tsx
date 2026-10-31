import { MediaCoverCard } from '@/components/media-cover-card'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/error-fallback'
import { LoadMoreTrigger } from '@/components/load-more-trigger'
import { useSearchMedia } from './search-queries'

type ResultsListProps = {
  search: string
}

export function ResultsList({ search }: ResultsListProps) {
  const { data, error, refetch, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSearchMedia(search)

  if (error) {
    return <ErrorFallback error={error} onRetry={refetch} />
  }

  if (isPending) {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <strong className="flex w-full items-center justify-center p-4 text-2xl font-medium text-zinc-400 uppercase italic">
        No results
      </strong>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-4 sm:grid-cols-[repeat(auto-fill,minmax(132px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {data.map((anime) => (
          <MediaCoverCard key={anime.id} anime={anime} />
        ))}
      </div>

      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
