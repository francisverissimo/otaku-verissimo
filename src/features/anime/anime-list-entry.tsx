import { useState } from 'react'
import toast from 'react-hot-toast'
import { CircleNotch, PencilSimple, Plus } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/use-auth'
import { LIST_STATUS_COLORS, LIST_STATUS_LABELS } from '@/lib/list-status'
import {
  useAnimeListEntry,
  useDeleteAnimeListEntry,
  useSaveAnimeListEntry,
} from './anime-list-entry-queries'
import {
  canIncrement,
  incrementProgress,
  toEntryForm,
  toSaveVariables,
  type EntryForm,
} from './anime-list-entry-utils'
import { AnimeListEntryDialog } from './anime-list-entry-dialog'

type AnimeListEntryProps = {
  mediaId: number
  title: string
  episodes: number | null
}

/** Status, progress and the list editor on the anime page. Only rendered for logged-in users. */
export function AnimeListEntry(props: AnimeListEntryProps) {
  const { user } = useAuth()
  if (!user) return null

  return <AnimeListEntryControls {...props} userId={user.id} />
}

const toastOptions = { position: 'bottom-center' } as const

function AnimeListEntryControls({
  mediaId,
  title,
  episodes,
  userId,
}: AnimeListEntryProps & { userId: number }) {
  const [editorOpen, setEditorOpen] = useState(false)
  const { data, isPending, isError } = useAnimeListEntry(mediaId, userId)
  const save = useSaveAnimeListEntry(mediaId, userId)
  const remove = useDeleteAnimeListEntry(mediaId, userId)

  if (isPending) {
    return <div className="h-11 w-48 animate-pulse rounded-full bg-white/10" />
  }

  if (isError || !data) return null

  const { entry, scoreFormat } = data

  function saveForm(form: EntryForm, message: string) {
    save.mutate(toSaveVariables(form), {
      onSuccess: () => {
        setEditorOpen(false)
        toast(message, toastOptions)
      },
      onError: () => toast.error('Could not save the entry', toastOptions),
    })
  }

  function handleIncrement() {
    if (!entry) return
    const next = incrementProgress(toEntryForm(entry), episodes)
    saveForm(next, next.status === 'COMPLETED' ? 'Completed!' : `Episode ${next.progress} watched`)
  }

  function handleDelete(entryId: number) {
    remove.mutate(entryId, {
      onSuccess: () => {
        setEditorOpen(false)
        toast('Removed from your list', toastOptions)
      },
      onError: () => toast.error('Could not remove the entry', toastOptions),
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 md:justify-start">
      {entry ? (
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className={`flex cursor-pointer items-center gap-2 rounded-full border border-current px-4 py-2 font-medium hover:bg-white/5 ${LIST_STATUS_COLORS[entry.status].text}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${LIST_STATUS_COLORS[entry.status].dot}`} />
          {LIST_STATUS_LABELS[entry.status]}
          <span className="text-zinc-300">
            {entry.progress} / {episodes ?? '?'}
          </span>
          <PencilSimple size={16} className="text-zinc-400" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className="bg-main flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 font-medium text-black hover:brightness-110"
        >
          <Plus size={18} weight="bold" />
          Add to list
        </button>
      )}

      {entry && canIncrement(toEntryForm(entry), episodes) && (
        <button
          type="button"
          disabled={save.isPending}
          onClick={handleIncrement}
          className="bg-main flex min-w-20 cursor-pointer items-center justify-center rounded-full px-4 py-2 font-medium text-black hover:brightness-110 disabled:opacity-60"
        >
          {save.isPending && !editorOpen ? (
            <CircleNotch size={18} className="animate-spin" />
          ) : (
            '+1 EP'
          )}
        </button>
      )}

      <AnimeListEntryDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        title={title}
        episodes={episodes}
        entry={entry}
        scoreFormat={scoreFormat}
        onSave={(form) => saveForm(form, entry ? 'Entry updated' : 'Added to your list')}
        onDelete={handleDelete}
        isSaving={save.isPending}
        isDeleting={remove.isPending}
      />
    </div>
  )
}
