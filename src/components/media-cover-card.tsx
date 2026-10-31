import { Link } from 'react-router'
import { Image } from '@/components/image'
import { Smiley, SmileyMeh, SmileySad } from '@phosphor-icons/react'
import * as HoverCard from '@radix-ui/react-hover-card'
import type { MediaCoverCardData } from './media-cover-card-fragment'
import { getContrastSafeColor } from '@/lib/get-contrast-safe-color'

type TCoverCardProps = {
  anime: MediaCoverCardData
}

export function MediaCoverCard({ anime }: TCoverCardProps) {
  const { id, title, cover, color } = anime

  const safeColor = getContrastSafeColor(color)

  return (
    <HoverCard.Root key={id} openDelay={0} closeDelay={0}>
      <HoverCard.Trigger className="relative" asChild>
        <Link to={`/anime/${id}`}>
          <div className="group flex h-full cursor-pointer flex-col">
            <div className="relative overflow-hidden rounded-t-lg shadow-md">
              <Image
                src={cover}
                alt={title}
                className="aspect-[6/9] h-full w-full object-cover object-center"
              />
            </div>

            <span
              className="line-clamp-2 rounded-b-lg px-2 font-medium backdrop-blur-sm backdrop-brightness-50"
              style={{ color: safeColor }}
            >
              {title}
            </span>
          </div>
        </Link>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out pointer-events-none z-10 hidden md:block"
          side="right"
          align="start"
          sideOffset={10}
        >
          <CoverCardPopover anime={anime} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

function CoverCardPopover({ anime }: TCoverCardProps) {
  const { episodes, studios, averageScore, season, year, format, isTBA, color } = anime
  const genres = anime.genres.slice(0, 3)
  const safeColor = getContrastSafeColor(color)

  return (
    <div className="bg-darkBG/80 flex w-72 flex-col gap-2 rounded-lg p-4 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between">
        {!isTBA && (
          <div className="flex items-center justify-center gap-2">
            {season && <span className="peer text-sm font-medium">{season}</span>}
            <span className="text-second text-sm font-medium">{year}</span>
          </div>
        )}

        {averageScore && (
          <div className="flex items-center justify-center">
            {averageScore >= 72 ? (
              <Smiley className="text-[26px] text-green-600" />
            ) : averageScore < 72 && averageScore >= 60 ? (
              <SmileyMeh className="text-[26px] text-amber-500" />
            ) : (
              <SmileySad className="text-[26px] text-red-500" />
            )}

            <span className="text-base">{averageScore + '%'}</span>
          </div>
        )}
      </div>

      {isTBA && <span className="font-medium text-rose-600">TBA</span>}

      {studios.length > 0 && (
        <span className="text-sm font-medium" style={{ color: safeColor }}>
          {studios.join(', ')}
        </span>
      )}

      <div className="flex">
        {format && <span>{format.replace(/_/g, ' ')}</span>}

        {episodes && (
          <div className="flex items-center">
            <div className="bg-second mx-2 h-1 w-1 rounded-full" />
            <span className="">{episodes + `${episodes > 1 ? ' episodes' : ' episode'}`}</span>
          </div>
        )}
      </div>

      <div className="flex w-fit flex-wrap items-center gap-2">
        {genres.map((genre, idx) => (
          <div key={idx} className="flex items-center">
            <span className="rounded-2xl px-2 py-1 text-sm ring" style={{ color: safeColor }}>
              {genre}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
