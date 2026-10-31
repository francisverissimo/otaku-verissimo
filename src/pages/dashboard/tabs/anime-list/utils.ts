import type { MediaListStatus } from '@/gql/graphql'
import type { MediaListEntry, MediaListGroup } from './anime-list-queries'

export function sortSections(lists: MediaListGroup[], order: string[]): MediaListGroup[] {
  return lists.slice().sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
}

export function sortEntries(entries: MediaListEntry[]): MediaListEntry[] {
  return entries.slice().sort((a, b) => b.media.averageScore - a.media.averageScore)
}

type SavedEntry = { id: number; status: MediaListStatus | null; progress: number | null }

/**
 * Applies a saved entry to the cached lists: updates its progress everywhere it appears and,
 * if its status changed, moves it from the old status list to the new one.
 */
export function applySavedEntry(lists: MediaListGroup[], saved: SavedEntry): MediaListGroup[] {
  const current = lists.flatMap((list) => list.entries).find((entry) => entry.id === saved.id)
  if (!current) return lists

  const updated = {
    ...current,
    status: saved.status ?? current.status,
    progress: saved.progress ?? current.progress,
  }
  const statusChanged = updated.status !== current.status

  return lists.map((list) => {
    if (statusChanged && list.status === current.status) {
      return { ...list, entries: list.entries.filter((entry) => entry.id !== saved.id) }
    }

    if (statusChanged && list.status === updated.status) {
      return { ...list, entries: [...list.entries, updated] }
    }

    return {
      ...list,
      entries: list.entries.map((entry) => (entry.id === saved.id ? updated : entry)),
    }
  })
}
