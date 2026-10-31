import { useMemo, useRef, useState } from 'react'
import type { MediaListStatus } from '@/gql/graphql'
import { DialogChangeStatus, TDialogChangeStatusHandle } from './dialog-change-status'
import { EntryCard } from './entry-card'
import { useListSearch } from './use-list-search'
import {
  useSaveMediaListEntry,
  type MediaListEntry,
  type MediaListGroup,
} from './anime-list-queries'
import { sortEntries } from './anime-list-utils'

type AnimeListContainerProps = {
  data: MediaListGroup[]
  userId: number
}

type TPendingUpdate = { id: number; status: MediaListStatus; progress: number }

export function AnimeListContent({ data, userId }: AnimeListContainerProps) {
  const { search } = useListSearch()

  const dialogRef = useRef<TDialogChangeStatusHandle>(null)
  /** Holds the increment while the "move to status?" dialog waits for an answer. */
  const pendingUpdateRef = useRef<TPendingUpdate | null>(null)
  const [updatingEntryId, setUpdatingEntryId] = useState<number | null>(null)

  const saveMediaListEntry = useSaveMediaListEntry(userId)

  function handleClickIncrementEpisodeButton(entry: MediaListEntry) {
    const { status, progress, media } = entry
    if (!status) return

    const nextEpisode = progress + 1
    const shouldComplete = nextEpisode === media.episodes && status !== 'COMPLETED'

    pendingUpdateRef.current = { id: entry.id, status, progress: nextEpisode }

    if (shouldComplete) {
      dialogRef.current?.handleDialog({ open: true, status: 'COMPLETED' })
      return
    }

    if (status !== 'CURRENT') {
      dialogRef.current?.handleDialog({ open: true, status: 'CURRENT' })
      return
    }

    executeMutation()
  }

  function handleDialogChangeStatusStay() {
    executeMutation()
  }

  function handleDialogChangeStatusMove(status: MediaListStatus) {
    if (!pendingUpdateRef.current) return

    pendingUpdateRef.current.status = status
    executeMutation()
  }

  function handleDialogChangeStatusCancel() {
    pendingUpdateRef.current = null
  }

  function executeMutation() {
    const variables = pendingUpdateRef.current
    pendingUpdateRef.current = null

    if (saveMediaListEntry.isPending || !variables) return

    setUpdatingEntryId(variables.id)

    saveMediaListEntry.mutate(variables, {
      onSettled: () => setUpdatingEntryId(null),
    })
  }

  const filteredLists = useMemo(() => {
    if (search.length <= 1) return data

    const term = search.toLocaleLowerCase()

    return data.map((list) => ({
      ...list,
      entries: list.entries.filter((entry) => entry.media.title.toLocaleLowerCase().includes(term)),
    }))
  }, [search, data])

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center gap-4">
      {filteredLists.map((list) => (
        <div key={list.name} className="flex w-full flex-col">
          {list.entries.length > 0 && (
            <span className="mx-auto mt-2 inline-block text-3xl italic">{list.name}</span>
          )}

          <div className="divide-second/50 grid divide-y md:grid-cols-2 md:gap-x-4 md:divide-y-0">
            {sortEntries(list.entries).map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onClickIncrementEpisode={handleClickIncrementEpisodeButton}
                disabled={saveMediaListEntry.isPending}
                isUpdating={updatingEntryId === entry.id}
              />
            ))}
          </div>
        </div>
      ))}

      <DialogChangeStatus
        ref={dialogRef}
        onClickStay={handleDialogChangeStatusStay}
        onClickMove={handleDialogChangeStatusMove}
        onClickCancel={handleDialogChangeStatusCancel}
      />
    </div>
  )
}
