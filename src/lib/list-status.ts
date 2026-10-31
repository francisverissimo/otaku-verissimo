import type { MediaListStatus } from '@/gql/graphql'

/** Display order used in pickers, following AniList. */
export const LIST_STATUSES: MediaListStatus[] = [
  'CURRENT',
  'PLANNING',
  'COMPLETED',
  'REPEATING',
  'PAUSED',
  'DROPPED',
]

export const LIST_STATUS_LABELS: Record<MediaListStatus, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  PAUSED: 'Paused',
  REPEATING: 'Rewatching',
}

/** Text and dot color for each list status. Full class names so Tailwind can find them. */
export const LIST_STATUS_COLORS: Record<MediaListStatus, { text: string; dot: string }> = {
  CURRENT: { text: 'text-green-400', dot: 'bg-green-400' },
  REPEATING: { text: 'text-teal-300', dot: 'bg-teal-300' },
  PLANNING: { text: 'text-sky-400', dot: 'bg-sky-400' },
  COMPLETED: { text: 'text-violet-400', dot: 'bg-violet-400' },
  PAUSED: { text: 'text-amber-400', dot: 'bg-amber-400' },
  DROPPED: { text: 'text-red-400', dot: 'bg-red-400' },
}
