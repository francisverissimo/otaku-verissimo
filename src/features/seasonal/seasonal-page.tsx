import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { CaretLeft, CircleNotch } from '@phosphor-icons/react'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/error-fallback'
import { useAuth } from '@/features/auth/use-auth'
import { parseFilters, serializeFilters, type SeasonalFilters } from './seasonal-filters'
import { useAddToPlanning, useSeasonalChart } from './seasonal-queries'
import { countGenres, filterByGenres, FORMAT_LABELS, groupByFormat } from './seasonal-utils'
import { SeasonalCard } from './seasonal-card'
import { SeasonalFilterBar } from './seasonal-filter-bar'
import { SeasonalFiltersDialog } from './seasonal-filters-dialog'

export function SeasonalPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseFilters(searchParams)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const {
    data: media,
    error,
    isPending,
    isFetching,
    refetch,
  } = useSeasonalChart(filters, user?.id ?? null)

  const groups = useMemo(
    () => groupByFormat(filterByGenres(media ?? [], filters.genres)),
    [media, filters.genres]
  )
  const genres = useMemo(() => countGenres(media ?? []), [media])
  const shownCount = groups.reduce((total, group) => total + group.media.length, 0)
  const extraFiltersCount =
    filters.genres.length + (filters.onList !== 'all' ? 1 : 0) + (filters.adult ? 1 : 0)

  function updateFilters(changes: Partial<SeasonalFilters>) {
    setSearchParams(serializeFilters({ ...filters, ...changes }), { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24">
      <header className="flex items-center gap-3 py-4">
        <Link
          to="/"
          title="Back to home"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
        >
          <CaretLeft size={22} />
        </Link>

        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">Seasonal Chart</h1>
          <span className="text-sm text-zinc-400">
            {filters.season} {filters.year}
            {media && ` · ${shownCount} anime`}
          </span>
        </div>

        {isFetching && !isPending && (
          <CircleNotch size={22} className="text-main ml-auto animate-spin" aria-label="Updating" />
        )}
      </header>

      {error && <ErrorFallback error={error} onRetry={refetch} />}

      {isPending && <Loading />}

      {media && shownCount === 0 && (
        <p className="py-16 text-center text-lg text-zinc-400 italic">
          No anime found for these filters.
        </p>
      )}

      {user ? (
        <SeasonalGroups groups={groups} filters={filters} userId={user.id} />
      ) : (
        <SeasonalGroups groups={groups} />
      )}

      <SeasonalFilterBar
        filters={filters}
        onChange={updateFilters}
        extraFiltersCount={extraFiltersCount}
        onOpenExtraFilters={() => setFiltersOpen(true)}
      />

      <SeasonalFiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={updateFilters}
        genres={genres}
        isLoggedIn={user != null}
      />
    </div>
  )
}

type Groups = ReturnType<typeof groupByFormat>

/** Logged-in users get "Add to Planning"; the mutation hook only exists for them. */
function SeasonalGroups(
  props: { groups: Groups } | { groups: Groups; filters: SeasonalFilters; userId: number }
) {
  if ('userId' in props) return <SeasonalGroupsWithPlanning {...props} />
  return <SeasonalGroupList groups={props.groups} />
}

function SeasonalGroupsWithPlanning({
  groups,
  filters,
  userId,
}: {
  groups: Groups
  filters: SeasonalFilters
  userId: number
}) {
  const addToPlanning = useAddToPlanning(filters, userId)

  function handleAddToPlanning(mediaId: number) {
    addToPlanning.mutate(mediaId, {
      onSuccess: () => toast('Added to Planning', { position: 'bottom-center' }),
      onError: () => toast.error('Could not add to Planning', { position: 'bottom-center' }),
    })
  }

  return (
    <SeasonalGroupList
      groups={groups}
      onAddToPlanning={handleAddToPlanning}
      addingId={addToPlanning.isPending ? addToPlanning.variables : undefined}
    />
  )
}

function SeasonalGroupList({
  groups,
  onAddToPlanning,
  addingId,
}: {
  groups: Groups
  onAddToPlanning?: (mediaId: number) => void
  addingId?: number
}) {
  return (
    <div className="flex flex-col gap-8">
      {groups.map(({ format, media }) => (
        <section key={format} className="flex flex-col gap-4">
          <h2 className="font-raleway text-3xl">
            {FORMAT_LABELS[format]} <span className="text-base text-zinc-500">{media.length}</span>
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {media.map((item) => (
              <SeasonalCard
                key={item.id}
                media={item}
                onAddToPlanning={onAddToPlanning}
                isAdding={addingId === item.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
