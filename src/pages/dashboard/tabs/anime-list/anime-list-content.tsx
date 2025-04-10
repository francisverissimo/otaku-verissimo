import { useMemo, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { TMediaList, TMediaListGroup } from '@/types/t-media-list-collection'
import { SAVE_MEDIA_LIST_ENTRY } from '@/lib/mutations/save-media-list-entry'
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

type TMutationVariables = { id: number; status: string; progress: number } | undefined

export function AnimeListContent({ data }: AnimeListContainerProps) {
  let mutationVariables: TMutationVariables
  let mediaListSatusBeforeMutation = ''

  const { search } = useAnimeListContext()

  const dialogRef = useRef<TDialogChangeStatusHandle>(null)

  const [saveMediaListEntryFunction, { loading }] = useMutation(SAVE_MEDIA_LIST_ENTRY, {
    context: {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    },
    update(cache, { data: { SaveMediaListEntry } }) {
      if (mediaListSatusBeforeMutation == SaveMediaListEntry.status) {
        mediaListSatusBeforeMutation = ''
        return
      }

      cache.modify({
        fields: {
          MediaListCollection(existingMediaListCollection) {
            let existingMediaLists: TMediaListGroupCached[] = existingMediaListCollection.lists
            const mappedLists = existingMediaLists.map((list) => {
              if (list.status == mediaListSatusBeforeMutation) {
                return {
                  ...list,
                  entries: list.entries.filter(
                    (entr) =>
                      entr.__ref !== `${SaveMediaListEntry.__typename}:${SaveMediaListEntry.id}`
                  ),
                }
              }

              if (list.status == SaveMediaListEntry.status) {
                return {
                  ...list,
                  entries: [
                    ...list.entries,
                    { __ref: `${SaveMediaListEntry.__typename}:${SaveMediaListEntry.id}` },
                  ],
                }
              }

              return list
            })
            return { ...existingMediaListCollection, lists: mappedLists }
          },
        },
      })

      mediaListSatusBeforeMutation = ''
    },
  })

  function handleClickIncrementEpisodeButton(data: { entry: TMediaList }) {
    const { status, progress, media } = data.entry
    const totalEpisodes = media.episodes
    const isCurrent = status == 'CURRENT'
    const isCompleted = status == 'COMPLETED'
    const nextEpisode = progress + 1
    const isLastEpisode = nextEpisode === totalEpisodes
    const shouldComplete = isLastEpisode && !isCompleted

    mutationVariables = {
      id: data.entry.id,
      status,
      progress: nextEpisode,
    }

    mediaListSatusBeforeMutation = status

    if (shouldComplete) {
      dialogRef.current?.handleDialog({ open: true, status: 'COMPLETED' })
      return
    }

    if (!isCurrent) {
      dialogRef.current?.handleDialog({ open: true, status: 'CURRENT' })
      return
    }

    executeMutation()
  }

  function handleDialogChangeStatusStay() {
    if (!mutationVariables) {
      return
    }

    executeMutation()
  }

  function handleDialogChangeStatusMove(status: string) {
    if (!mutationVariables) {
      return
    }

    mutationVariables.status = status

    executeMutation()
  }

  function handleDialogChangeStatusCancel() {
    mutationVariables = undefined
  }

  function executeMutation() {
    if (loading || !mutationVariables) {
      return
    }

    const button = document.getElementById(`increment-button-${mutationVariables.id}`)

    if (!button) {
      return
    }

    const [text, svg] = button.children

    text.classList.add('hidden')
    svg.classList.remove('hidden')

    saveMediaListEntryFunction({
      variables: mutationVariables,
      onCompleted() {
        text.classList.replace('hidden', 'block')
        svg.classList.add('hidden')
        mutationVariables = undefined
      },
      onError() {
        text.classList.replace('hidden', 'block')
        svg.classList.add('hidden')
        mutationVariables = undefined
      },
    })
  }

  const filteredLists = useMemo(() => {
    return search.length > 1
      ? data.map((list) => {
          return {
            ...list,
            entries: list.entries.filter((entry) => {
              if (
                entry.media.title.userPreferred
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase())
              ) {
                return entry
              }
            }),
          }
        })
      : data
  }, [search, data])

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center gap-4">
      {/* <select className="bg-transparent">
        {filteredLists.map((listName) => (
          <option key={listName.name} value={listName.name}>
            {listName.name}
          </option>
        ))}
      </select> */}

      {filteredLists && (
        <>
          {filteredLists.map((list) => (
            <div key={list.name} className="flex w-full flex-col">
              {list.entries.length > 0 && (
                <span className="mx-auto mt-2 inline-block text-3xl italic">{list.name}</span>
              )}

              <div className="grid divide-y divide-second/50 md:grid-cols-2 md:gap-x-4 md:divide-y-0">
                {sortEntries(list.entries).map((entry) => {
                  return (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onClickIncrementEpisode={handleClickIncrementEpisodeButton}
                      loadingMutation={loading}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          <DialogChangeStatus
            ref={dialogRef}
            onClickStay={handleDialogChangeStatusStay}
            onClickMove={handleDialogChangeStatusMove}
            onClickCancel={handleDialogChangeStatusCancel}
          />
        </>
      )}
    </div>
  )
}
