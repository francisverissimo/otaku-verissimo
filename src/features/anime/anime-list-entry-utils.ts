import type { MediaListStatus, ScoreFormat } from '@/gql/graphql'
import type { ListEntry } from './anime-list-entry-queries'

type FuzzyDate = ListEntry['startedAt']

/** Values edited in the dialog. Dates are kept as AniList fuzzy dates so a partial date survives. */
export type EntryForm = Omit<ListEntry, 'id'>

export function newEntryForm(status: MediaListStatus = 'PLANNING'): EntryForm {
  const empty = { year: null, month: null, day: null }
  return {
    status,
    progress: 0,
    score: 0,
    repeat: 0,
    notes: '',
    private: false,
    startedAt: empty,
    completedAt: empty,
  }
}

export function toEntryForm(entry: ListEntry): EntryForm {
  return {
    status: entry.status,
    progress: entry.progress,
    score: entry.score,
    repeat: entry.repeat,
    notes: entry.notes,
    private: entry.private,
    startedAt: entry.startedAt,
    completedAt: entry.completedAt,
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

/** `<input type="date">` value. Partial dates (only a year, say) have no valid value and show empty. */
export function toDateInput({ year, month, day }: FuzzyDate) {
  return year && month && day ? `${year}-${pad(month)}-${pad(day)}` : ''
}

export function fromDateInput(value: string): FuzzyDate {
  const [year, month, day] = value.split('-').map(Number)
  return value ? { year, month, day } : { year: null, month: null, day: null }
}

export function today(now = new Date()): FuzzyDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
}

const isEmptyDate = (date: FuzzyDate) => !date.year && !date.month && !date.day

/** Input limits for each AniList score format. */
export function scoreConfig(format: ScoreFormat) {
  switch (format) {
    case 'POINT_100':
      return { max: 100, step: 1, label: '0–100' }
    case 'POINT_10_DECIMAL':
      return { max: 10, step: 0.1, label: '0–10' }
    case 'POINT_10':
      return { max: 10, step: 1, label: '0–10' }
    case 'POINT_5':
      return { max: 5, step: 1, label: '0–5 stars' }
    case 'POINT_3':
      return { max: 3, step: 1, label: '1 :( · 2 :| · 3 :)' }
  }
}

export function clampScore(score: number, format: ScoreFormat) {
  const { max, step } = scoreConfig(format)
  if (!Number.isFinite(score) || score < 0) return 0
  const rounded = Math.round(score / step) * step
  return Math.min(max, Number(rounded.toFixed(1)))
}

/**
 * Applies AniList's own rules when a field changes:
 * - reaching the last episode completes the entry and sets the finish date;
 * - moving to Watching sets the start date, moving to Completed fills progress and finish date.
 * Dates the user already filled are never overwritten.
 */
export function applyFormRules(
  previous: EntryForm,
  next: EntryForm,
  episodes: number | null,
  now = new Date()
): EntryForm {
  const result = { ...next }

  if (episodes && result.progress > episodes) result.progress = episodes
  if (result.progress < 0) result.progress = 0

  const finishedNow =
    episodes != null && result.progress === episodes && previous.progress !== episodes
  if (finishedNow && result.status !== 'COMPLETED') result.status = 'COMPLETED'

  if (result.status !== previous.status) {
    if (result.status === 'CURRENT' && isEmptyDate(result.startedAt)) result.startedAt = today(now)
    if (result.status === 'COMPLETED' && episodes) result.progress = episodes
  }

  if (result.status === 'COMPLETED' && previous.status !== 'COMPLETED') {
    if (isEmptyDate(result.completedAt)) result.completedAt = today(now)
    if (isEmptyDate(result.startedAt) && previous.progress === 0) result.startedAt = today(now)
  }

  return result
}

/**
 * "+1 EP" from the anime page. Planning or paused entries start being watched; reaching the
 * last episode completes them.
 */
export function incrementProgress(form: EntryForm, episodes: number | null, now = new Date()) {
  const watching = form.status === 'REPEATING' ? 'REPEATING' : 'CURRENT'
  return applyFormRules(
    form,
    { ...form, status: watching, progress: form.progress + 1 },
    episodes,
    now
  )
}

export function canIncrement(form: EntryForm, episodes: number | null) {
  return form.status !== 'COMPLETED' && (episodes == null || form.progress < episodes)
}

/** Variables for `SaveMediaListEntry`. Empty dates are sent as nulls, which clears them. */
export function toSaveVariables(form: EntryForm) {
  return {
    status: form.status,
    progress: form.progress,
    score: form.score,
    repeat: form.repeat,
    notes: form.notes,
    private: form.private,
    startedAt: form.startedAt,
    completedAt: form.completedAt,
  }
}
