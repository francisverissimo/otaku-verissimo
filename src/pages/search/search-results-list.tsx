import { DocumentNode, useQuery } from '@apollo/client'
import { TPageMedia } from '@/types/t-page-media'
import { MediaSort } from '@/types'
import { PageMediaCoverCard } from '@/components/page-media-cover-card'
import { DefaultLoading as Loading } from '@/components/loading'

type ResultsListProps = {
  query: DocumentNode
  variables: {
    perPage: number
    page: number
    search?: string
    currentYear?: number
    currentSeason?: string
    nextSeasonYear?: number
    nextSeason?: string
    isAdult: boolean
    sort: MediaSort
  }
}

export function ResultsList({ query, variables }: ResultsListProps) {
  const { data, loading } = useQuery(query, {
    variables,
    notifyOnNetworkStatusChange: true,
  })

  if (!loading && data && data.Page.media.length == 0) {
    return (
      <strong className="flex w-full items-center justify-center p-4 text-2xl font-medium uppercase italic text-zinc-400">
        No results
      </strong>
    )
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-4 sm:grid-cols-[repeat(auto-fill,minmax(132px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {data &&
          data.Page.media.map((anime: TPageMedia) => (
            <PageMediaCoverCard key={anime.id} anime={anime} />
          ))}
      </div>

      {loading && <Loading />}
    </div>
  )
}
