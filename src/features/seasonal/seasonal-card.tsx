import { Link } from 'react-router'
import { CircleNotch, Heart, ListPlus, Star, UsersThree } from '@phosphor-icons/react'
import { Image } from '@/components/image'
import { getContrastSafeColor } from '@/lib/get-contrast-safe-color'
import type { SeasonalMedia } from './seasonal-queries'
import { LIST_STATUS_LABELS } from './seasonal-utils'

type SeasonalCardProps = {
  media: SeasonalMedia
  /** Undefined for logged-out users, who cannot add media to a list. */
  onAddToPlanning?: (mediaId: number) => void
  isAdding: boolean
}

const numberFormat = new Intl.NumberFormat('en-US')

export function SeasonalCard({ media, onAddToPlanning, isAdding }: SeasonalCardProps) {
  const accent = getContrastSafeColor(media.color)

  return (
    <article className="bg-darkTxt/5 flex overflow-hidden rounded-lg shadow-lg">
      <Link to={`/anime/${media.id}`} className="w-28 shrink-0 md:w-32">
        <Image
          src={media.cover}
          alt={media.title}
          className="aspect-[6/9] h-full w-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <Link to={`/anime/${media.id}`} className="line-clamp-2 font-medium hover:underline">
          {media.title}
        </Link>

        {media.studio && <span className="text-sm text-zinc-400">{media.studio}</span>}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {media.averageScore != null && (
            <span className="flex items-center gap-1" title="Average score">
              <Star size={18} weight="fill" className="text-yellow-400" />
              {media.averageScore}
            </span>
          )}
          <span className="flex items-center gap-1" title="Favorites">
            <Heart size={18} weight="fill" className="text-red-500" />
            {numberFormat.format(media.favourites)}
          </span>
          <span className="flex items-center gap-1" title="Users with this anime on their list">
            <UsersThree size={18} weight="fill" className="text-green-500" />
            {numberFormat.format(media.popularity)}
          </span>
        </div>

        {media.genres.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Genres">
            {media.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full border px-2 py-0.5 text-xs font-medium"
                style={{ color: accent, borderColor: accent }}
              >
                {genre}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-1">
          {media.listEntry?.status ? (
            <span className="text-second flex items-center gap-2 text-sm font-medium uppercase">
              <span className="bg-second h-3 w-3 rounded-full" />
              {LIST_STATUS_LABELS[media.listEntry.status]}
            </span>
          ) : (
            onAddToPlanning && (
              <button
                type="button"
                disabled={isAdding}
                onClick={() => onAddToPlanning(media.id)}
                className="text-second flex cursor-pointer items-center gap-1.5 text-sm font-medium hover:brightness-125 disabled:cursor-wait disabled:opacity-60"
              >
                {isAdding ? (
                  <CircleNotch size={20} className="animate-spin" />
                ) : (
                  <ListPlus size={20} />
                )}
                Add to Planning
              </button>
            )
          )}
        </div>
      </div>
    </article>
  )
}
