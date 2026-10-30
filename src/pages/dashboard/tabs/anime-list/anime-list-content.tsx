import { useMemo, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { TMediaList, TMediaListGroup } from '@/types/t-media-list-collection'
import { SAVE_MEDIA_LIST_ENTRY } from '@/lib/mutations/save-media-list-entry'
import { getStoredToken } from '@/auth/token'
import { DialogChangeStatus, TDialogChangeStatusHandle } from './dialog-change-status'
import { EntryCard } from './entry-card'
import { useAnimeListContext } from './use-anime-list-context'
import { sortEntries } from './utils'

type AnimeListContainerProps = {
  data: TMediaListGroup[]
}

type TMediaListGroupCached = Omit<TMediaListGroup, 'entries'> & {
  entries: { __ref: string }[]
}

type TPendingUpdate = { id: number; status: string; progress: number; previousStatus: string }

type TSaveMediaListEntryResult = {
  SaveMediaListEntry: { __typename: string; id: number; status: string; progress: number }
}

export function AnimeListContent({ data }: AnimeListContainerProps) {
  const { search } = useAnimeListContext()

  const dialogRef = useRef<TDialogChangeStatusHandle>(null)
  /** Holds the increment while the "move to status?" dialog waits for an answer. */
  const pendingUpdateRef = useRef<TPendingUpdate | null>(null)
  const [updatingEntryId, setUpdatingEntryId] = useState<number | null>(null)

  const [saveMediaListEntry, { loading }] = useMutation<TSaveMediaListEntryResult>(
    SAVE_MEDIA_LIST_ENTRY,
    {
      context: {
        headers: {
          authorization: `Bearer ${getStoredToken()}`,
        },
      },
    }
  )

  function handleClickIncrementEpisodeButton(entry: TMediaList) {
    const { status, progress, media } = entry
    const nextEpisode = progress + 1
    const shouldComplete = nextEpisode === media.episodes && status !== 'COMPLETED'

    pendingUpdateRef.current = {
      id: entry.id,
      status,
      progress: nextEpisode,
      previousStatus: status,
    }

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

  function handleDialogChangeStatusMove(status: string) {
    if (!pendingUpdateRef.current) return

    pendingUpdateRef.current.status = status
    executeMutation()
  }

  function handleDialogChangeStatusCancel() {
    pendingUpdateRef.current = null
  }

  function executeMutation() {
    const pending = pendingUpdateRef.current
    pendingUpdateRef.current = null

    if (loading || !pending) return

    const { previousStatus, ...variables } = pending

    setUpdatingEntryId(variables.id)

    saveMediaListEntry({
      variables,
      update(cache, { data }) {
        const saved = data?.SaveMediaListEntry
        if (!saved || saved.status === previousStatus) return

        const entryRef = `${saved.__typename}:${saved.id}`

        cache.modify({
          fields: {
            MediaListCollection(existingMediaListCollection) {
              const existingLists: TMediaListGroupCached[] = existingMediaListCollection.lists

              const lists = existingLists.map((list) => {
                if (list.status === previousStatus) {
                  return { ...list, entries: list.entries.filter((e) => e.__ref !== entryRef) }
                }

                if (list.status === saved.status) {
                  return { ...list, entries: [...list.entries, { __ref: entryRef }] }
                }

                return list
              })

              return { ...existingMediaListCollection, lists }
            },
          },
        })
      },
      onCompleted: () => setUpdatingEntryId(null),
      onError: () => setUpdatingEntryId(null),
    })
  }

  const filteredLists = useMemo(() => {
    if (search.length <= 1) return data

    const term = search.toLocaleLowerCase()

    return data.map((list) => ({
      ...list,
      entries: list.entries.filter((entry) =>
        entry.media.title.userPreferred.toLocaleLowerCase().includes(term)
      ),
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
                disabled={loading}
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
