import { useNavigate } from 'react-router-dom'
import { CircleNotch } from '@phosphor-icons/react'
import { TMediaList } from '@/types/t-media-list-collection'

type TEntryCardProps = {
  entry: TMediaList
  onClickIncrementEpisode: (data: any) => void
  loadingMutation: boolean
}

export function EntryCard({ entry, onClickIncrementEpisode, loadingMutation }: TEntryCardProps) {
  const navigate = useNavigate()

  const { id, status, media } = entry

  return (
    <div
      id={`entry-card-${id}`}
      key={id}
      className="flex overflow-hidden rounded bg-white/5 shadow-xl"
    >
      <img
        src={media.coverImage.large}
        alt={media.title.userPreferred}
        onClick={() => navigate(`/anime/${media.id}`)}
        className="aspect-[6/9] w-24 cursor-pointer bg-cover object-cover md:w-28"
      />

      <div className="flex w-full flex-col">
        <div className="flex flex-1 flex-col gap-y-1 pl-2 pt-2">
          <span
            onClick={() => navigate(`/anime/${media.id}`)}
            className="line-clamp-2 w-fit cursor-pointer pr-2 text-sm font-medium text-main"
          >
            {media.title.userPreferred}
          </span>

          <span className="text-sm">{media.format.replaceAll('_', ' ')}</span>

          <div className="flex w-full flex-1 items-end justify-end gap-2 self-end pb-1 text-sm">
            <span className="p-2">{`${entry.progress} / ${media.episodes ?? '?'}`}</span>

            {status !== 'COMPLETED' && (
              <button
                disabled={loadingMutation}
                id={`increment-button-${entry.id}`}
                onClick={() => onClickIncrementEpisode({ entry })}
                className="flex min-h-[40px] min-w-[60px] items-center justify-center rounded-ss-lg border border-main px-3 py-2 text-main transition hover:brightness-125"
              >
                <span>+1 EP</span>
                <CircleNotch weight="thin" size={20} className="absolute hidden animate-spin" />
              </button>
            )}
          </div>
        </div>

        <div
          className="h-[0.35rem] bg-gradient-to-l from-orange-800 via-orange-600 to-orange-500"
          style={{
            ...(entry.progress <= 0
              ? { width: '0%' }
              : !media.episodes
                ? { width: `48%` }
                : { width: `${(entry.progress / media.episodes) * 100}%` }),
          }}
        />
      </div>
    </div>
  )
}
