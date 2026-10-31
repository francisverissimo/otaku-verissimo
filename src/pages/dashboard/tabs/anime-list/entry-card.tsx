import { useNavigate } from 'react-router'
import { CircleNotch } from '@phosphor-icons/react'
import { TMediaList } from '@/types/t-media-list-collection'

type TEntryCardProps = {
  entry: TMediaList
  onClickIncrementEpisode: (entry: TMediaList) => void
  disabled: boolean
  isUpdating: boolean
}

function timeLeftUntilTheNextEp(
  nextAiringEpisode: TMediaList['media']['nextAiringEpisode'],
  entryProgress: number
) {
  if (!nextAiringEpisode) {
    return null
  }

  let userDelay: string | null = null

  const nextEpSubtractionLastEpWatched = nextAiringEpisode.episode - 1 - entryProgress
  /** anilist data is in seconds */
  const futureTimestamp = nextAiringEpisode.airingAt * 1000

  const formattedReleaseDate = `Ep. ${nextAiringEpisode.episode} on ${new Date(
    futureTimestamp
  ).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  })}`

  if (nextEpSubtractionLastEpWatched > 0) {
    userDelay = `You are ${nextEpSubtractionLastEpWatched} ${nextEpSubtractionLastEpWatched > 1 ? 'episodes' : 'episode'} behind.`
  }

  return { releaseDate: formattedReleaseDate, userDelay }
}

export function EntryCard({
  entry,
  onClickIncrementEpisode,
  disabled,
  isUpdating,
}: TEntryCardProps) {
  const navigate = useNavigate()

  const { id, status, media, progress } = entry

  const nextAiringEpMessages = timeLeftUntilTheNextEp(media.nextAiringEpisode, progress)

  return (
    <div id={`entry-card-${id}`} key={id} className="relative pb-8 pt-4">
      <div className="flex">
        <img
          loading="lazy"
          src={media.coverImage.large}
          alt={media.title.userPreferred}
          onClick={() => navigate(`/anime/${media.id}`)}
          className="h-full w-24 cursor-pointer self-start rounded-lg object-cover md:w-28"
          style={{
            opacity: 0,
            transitionDuration: '600ms',
          }}
          onLoad={(t) => {
            t.currentTarget.style.opacity = '1'
          }}
        />

        <div className="relative flex w-full flex-col">
          <div className="flex h-full flex-col gap-y-1 pt-2 pl-2">
            <span
              onClick={() => navigate(`/anime/${media.id}`)}
              className="text-md text-main line-clamp-2 w-fit cursor-pointer pr-2 font-medium"
            >
              {media.title.userPreferred}
            </span>

            <div className="flex flex-col gap-2">
              <span className="text-sm">{media.format.replace(/_/g, ' ')}</span>

              {nextAiringEpMessages && (
                <span className="text-second text-sm">
                  {`* ${nextAiringEpMessages.releaseDate}. ${nextAiringEpMessages.userDelay ? nextAiringEpMessages.userDelay : ''}`}
                </span>
              )}
            </div>

            <div className="flex w-full flex-1 items-end justify-end gap-2 self-end pb-1 text-sm">
              <span className="p-2">{`${entry.progress} / ${media.episodes ?? '?'}`}</span>

              {status !== 'COMPLETED' && (
                <button
                  disabled={disabled}
                  onClick={() => onClickIncrementEpisode(entry)}
                  className="bg-main relative flex min-h-[40px] min-w-[60px] cursor-pointer items-center justify-center rounded-full px-3 py-2 transition hover:brightness-125"
                >
                  {isUpdating ? (
                    <CircleNotch weight="thin" size={20} className="animate-spin" />
                  ) : (
                    <span>+1 EP</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-0 bottom-4 left-0 h-2 rounded-lg bg-gradient-to-r from-orange-800 via-orange-600 to-orange-500"
        style={{
          ...(entry.progress <= 0
            ? { width: '0%' }
            : !media.episodes
              ? { width: `48%` }
              : { width: `${(entry.progress / media.episodes) * 100}%` }),
        }}
      />

      <div className="bg-main/20 absolute right-0 bottom-4 left-0 -z-10 h-2 rounded-lg" />
    </div>
  )
}
