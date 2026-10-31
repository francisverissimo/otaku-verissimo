import * as Dialog from '@radix-ui/react-dialog'
import { X } from '@phosphor-icons/react'
import type { ListFilter, SeasonalFilters } from './seasonal-filters'

type SeasonalFiltersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: SeasonalFilters
  onChange: (changes: Partial<SeasonalFilters>) => void
  /** Genres present in the loaded season, with how many media have each. */
  genres: { genre: string; count: number }[]
  isLoggedIn: boolean
}

const LIST_OPTIONS: { value: ListFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hide', label: 'Not on my list' },
  { value: 'only', label: 'Only on my list' },
]

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

export function SeasonalFiltersDialog({
  open,
  onOpenChange,
  filters,
  onChange,
  genres,
  isLoggedIn,
}: SeasonalFiltersDialogProps) {
  // A selected genre stays visible even when the current season has no media with it.
  const genreOptions = [
    ...genres,
    ...filters.genres
      .filter((genre) => !genres.some((option) => option.genre === genre))
      .map((genre) => ({ genre, count: 0 })),
  ]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="bg-darkBG text-darkTxt fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-6 overflow-y-auto rounded-t-2xl p-6 outline-none md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-full md:max-w-xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-medium">Filters</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
            >
              <X size={22} />
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Filter the seasonal chart by genre, by your list and by adult content.
          </Dialog.Description>

          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">Genres</h3>
              <span className="text-xs text-zinc-400">Shows anime with every selected genre</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {genreOptions.map(({ genre, count }) => {
                const selected = filters.genres.includes(genre)
                return (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ genres: toggle(filters.genres, genre) })}
                    className="aria-pressed:bg-main aria-pressed:border-main cursor-pointer rounded-full border border-zinc-600 px-3 py-1 text-sm aria-pressed:text-black"
                  >
                    {genre}{' '}
                    <span className={selected ? 'text-black/60' : 'text-zinc-500'}>{count}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {isLoggedIn && (
            <section className="flex flex-col gap-3">
              <h3 className="font-medium">My list</h3>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="My list">
                {LIST_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={filters.onList === option.value}
                    onClick={() => onChange({ onList: option.value })}
                    className="aria-checked:bg-second aria-checked:border-second cursor-pointer rounded-full border border-zinc-600 px-3 py-1 text-sm aria-checked:text-black"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={filters.adult}
              onChange={(event) => onChange({ adult: event.target.checked })}
              className="accent-main h-4 w-4"
            />
            <span>Show adult content</span>
          </label>

          <button
            type="button"
            onClick={() => onChange({ genres: [], onList: 'all', adult: false })}
            className="self-start text-sm text-red-400 hover:text-red-300"
          >
            Clear filters
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
