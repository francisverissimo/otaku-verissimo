import { useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleNotch, Minus, Plus, Trash, X } from '@phosphor-icons/react'
import type { MediaListStatus, ScoreFormat } from '@/gql/graphql'
import { LIST_STATUS_COLORS, LIST_STATUS_LABELS, LIST_STATUSES } from '@/lib/list-status'
import type { ListEntry } from './anime-list-entry-queries'
import {
  applyFormRules,
  clampScore,
  fromDateInput,
  newEntryForm,
  scoreConfig,
  toDateInput,
  toEntryForm,
  type EntryForm,
} from './anime-list-entry-utils'

type AnimeListEntryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  episodes: number | null
  entry: ListEntry | null
  scoreFormat: ScoreFormat
  onSave: (form: EntryForm) => void
  onDelete: (entryId: number) => void
  isSaving: boolean
  isDeleting: boolean
}

const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-main'

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-sm text-zinc-400">
        {label}
        {hint && <span className="text-xs">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export function AnimeListEntryDialog(props: AnimeListEntryDialogProps) {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="bg-darkBG text-darkTxt fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-y-auto rounded-t-2xl outline-none md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl">
          {/* Mounted only while open, so the form starts from the saved entry every time. */}
          {props.open && <EntryEditor {...props} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function EntryEditor({
  title,
  episodes,
  entry,
  scoreFormat,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: AnimeListEntryDialogProps) {
  const [form, setForm] = useState<EntryForm>(() => (entry ? toEntryForm(entry) : newEntryForm()))
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const score = scoreConfig(scoreFormat)

  function update(changes: Partial<EntryForm>) {
    setForm((previous) => applyFormRules(previous, { ...previous, ...changes }, episodes))
  }

  return (
    <form
      className="flex flex-col gap-5 p-6"
      onSubmit={(event) => {
        event.preventDefault()
        onSave(form)
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <Dialog.Title className="text-xl font-medium">
            {entry ? 'Edit list entry' : 'Add to list'}
          </Dialog.Title>
          <Dialog.Description className="line-clamp-1 text-sm text-zinc-400">
            {title}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Close"
          className="cursor-pointer rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
        >
          <X size={22} />
        </Dialog.Close>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm text-zinc-400">Status</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LIST_STATUSES.map((status: MediaListStatus) => (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={form.status === status}
              onClick={() => update({ status })}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm aria-checked:border-current aria-checked:bg-white/5 ${LIST_STATUS_COLORS[status].text}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${LIST_STATUS_COLORS[status].dot}`} />
              {LIST_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Episodes watched" hint={`of ${episodes ?? '?'}`}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="One episode less"
              onClick={() => update({ progress: form.progress - 1 })}
              className="cursor-pointer rounded-lg bg-white/5 p-2.5 hover:bg-white/10"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={episodes ?? undefined}
              value={form.progress}
              onChange={(event) => update({ progress: Number(event.target.value) || 0 })}
              className={`${inputClass} text-center`}
            />
            <button
              type="button"
              aria-label="One more episode"
              onClick={() => update({ progress: form.progress + 1 })}
              className="cursor-pointer rounded-lg bg-white/5 p-2.5 hover:bg-white/10"
            >
              <Plus size={16} />
            </button>
          </div>
        </Field>

        <Field label="Score" hint={score.label}>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={score.max}
            step={score.step}
            value={form.score}
            onChange={(event) => update({ score: Number(event.target.value) })}
            onBlur={() => update({ score: clampScore(form.score, scoreFormat) })}
            className={inputClass}
          />
        </Field>

        <Field label="Start date">
          <input
            type="date"
            value={toDateInput(form.startedAt)}
            onChange={(event) => update({ startedAt: fromDateInput(event.target.value) })}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </Field>

        <Field label="Finish date">
          <input
            type="date"
            value={toDateInput(form.completedAt)}
            onChange={(event) => update({ completedAt: fromDateInput(event.target.value) })}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </Field>

        <Field label="Total rewatches">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={form.repeat}
            onChange={(event) => update({ repeat: Math.max(0, Number(event.target.value) || 0) })}
            className={inputClass}
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 self-end pb-2">
          <input
            type="checkbox"
            checked={form.private}
            onChange={(event) => update({ private: event.target.checked })}
            className="accent-main h-4 w-4"
          />
          <span>Private</span>
        </label>
      </div>

      <Field label="Notes">
        <textarea
          rows={3}
          value={form.notes}
          onChange={(event) => update({ notes: event.target.value })}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {entry &&
          (confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-300">Remove from your list?</span>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => onDelete(entry.id)}
                className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 font-medium text-red-300 hover:bg-red-500/30 disabled:opacity-60"
              >
                {isDeleting && <CircleNotch size={16} className="animate-spin" />}
                Remove
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="cursor-pointer px-2 py-1.5 text-zinc-400 hover:text-zinc-200"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="flex cursor-pointer items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
            >
              <Trash size={18} />
              Remove from list
            </button>
          ))}

        <button
          type="submit"
          disabled={isSaving}
          className="bg-main ml-auto flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2 font-medium text-black hover:brightness-110 disabled:opacity-60"
        >
          {isSaving && <CircleNotch size={18} className="animate-spin" />}
          Save
        </button>
      </div>
    </form>
  )
}
