import type { ReactNode } from 'react'
import { Funnel } from '@phosphor-icons/react'
import type { MediaSeason } from '@/gql/graphql'
import {
  SEASONS,
  SORT_OPTIONS,
  yearOptions,
  type SeasonalFilters,
  type SeasonalSort,
} from './seasonal-filters'

type SeasonalFilterBarProps = {
  filters: SeasonalFilters
  onChange: (changes: Partial<SeasonalFilters>) => void
  /** How many of the filters in the dialog (genres, list, adult) are active. */
  extraFiltersCount: number
  onOpenExtraFilters: () => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex shrink-0 items-center gap-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      {children}
    </label>
  )
}

const selectClass =
  'text-main cursor-pointer rounded bg-transparent py-1 font-medium outline-none focus-visible:ring-2 focus-visible:ring-main/50 [&>option]:bg-darkBG [&>option]:text-darkTxt'

/** Fixed bar at the bottom of the page with the main filters, as in AL-chan. */
export function SeasonalFilterBar({
  filters,
  onChange,
  extraFiltersCount,
  onOpenExtraFilters,
}: SeasonalFilterBarProps) {
  return (
    <div className="text-darkTxt fixed right-0 bottom-0 left-0 z-30 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center">
        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto px-4 py-3">
          <Field label="Year">
            <select
              className={selectClass}
              value={filters.year}
              onChange={(event) => onChange({ year: Number(event.target.value) })}
            >
              {yearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Season">
            <select
              className={selectClass}
              value={filters.season}
              onChange={(event) => onChange({ season: event.target.value as MediaSeason })}
            >
              {SEASONS.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sort">
            <select
              className={selectClass}
              value={filters.sort}
              onChange={(event) => onChange({ sort: event.target.value as SeasonalSort })}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Order by">
            <select
              className={selectClass}
              value={filters.order}
              onChange={(event) =>
                onChange({ order: event.target.value as SeasonalFilters['order'] })
              }
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </Field>
        </div>

        {/* Outside the scrolling area so it stays visible on small screens. */}
        <button
          type="button"
          onClick={onOpenExtraFilters}
          className="text-main hover:bg-main/10 mr-2 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
        >
          <Funnel size={18} weight={extraFiltersCount ? 'fill' : 'regular'} />
          Filters
          {extraFiltersCount > 0 && (
            <span className="bg-main rounded-full px-1.5 text-xs text-black">
              {extraFiltersCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
