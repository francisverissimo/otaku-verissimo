import { Link } from 'react-router-dom'
import * as HoverCard from '@radix-ui/react-hover-card'
import { Smiley, SmileyMeh, SmileySad } from '@phosphor-icons/react'
import { PageMediaResultQuery } from '@/types'
import { isContrastAppropriate } from '@/utils/is-contrast-appropriate'

type TCoverCardProps = {
  anime: PageMediaResultQuery
}

type TCoverCardPopoverProps = {
  anime: PageMediaResultQuery
}

const primaryThemeColor = '#fdba74' /** tailwind colors > orange[300] */

export function CoverCard({ anime }: TCoverCardProps) {
  const { id, title, coverImage } = anime

  const isAnimeColorAppropriate = isContrastAppropriate(anime.coverImage.color)

  return (
    <HoverCard.Root key={id} openDelay={0} closeDelay={0}>
      <HoverCard.Trigger className="relative" asChild>
        <Link to={`/anime/${id}`}>
          <div className="group flex h-full cursor-pointer flex-col">
            <div className="relative mb-3 overflow-hidden rounded-lg shadow-md">
              <img
                src={coverImage.large}
                alt={title.userPreferred}
                className="aspect-[6/9] h-full w-full object-cover object-center"
                loading="lazy"
                style={{
                  opacity: 0,
                  transitionDuration: '600ms',
                }}
                onLoad={(t) => (t.currentTarget.style.opacity = '1')}
              />
            </div>

            <span
              className="line-clamp-2 min-h-[28px] text-[14px] font-medium"
              style={{ color: isAnimeColorAppropriate ? coverImage.color : primaryThemeColor }}
            >
              {title.userPreferred}
            </span>
          </div>
        </Link>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="pointer-events-none z-10 hidden md:block"
          side="right"
          align="start"
          sideOffset={14}
        >
          <CoverCardPopover anime={anime} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}

function CoverCardPopover({ anime }: TCoverCardPopoverProps) {
  const { episodes, studios, averageScore, season, seasonYear, format, startDate } = anime
  const genres = anime.genres.length > 3 ? anime.genres.slice(0, 3) : anime.genres
  const { __typename, ...restStartDate } = startDate
  const isTBA = !Object.values(restStartDate).some((item) => item)
  const isAnimeColorAppropriate = isContrastAppropriate(anime.coverImage.color)

  return (
    <div className="-mt-1 flex w-72 flex-col gap-1 rounded-lg bg-zinc-950 p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        {!isTBA && (
          <div className="flex items-center justify-center">
            {season && <span className="peer text-sm font-medium">{season}</span>}

            <span className="text-sm font-medium text-second peer-[]:ml-2">
              {seasonYear || startDate.year}
            </span>
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

      {studios.nodes.length > 0 && (
        <div>
          {studios.nodes.map((studio, index, array) => (
            <span
              key={index}
              className="text-sm font-medium"
              style={{
                color: isAnimeColorAppropriate ? anime.coverImage.color : primaryThemeColor,
              }}
            >
              {studio.name}
              {index != array.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      <div className="flex">
        {format && <span>{format.replaceAll('_', ' ')}</span>}

        {episodes && (
          <div className="flex items-center">
            <div className="mx-2 h-2 w-2 rounded-full bg-white/60" />
            <span className="">{episodes + `${episodes > 1 ? ' episodes' : ' episode'}`}</span>
          </div>
        )}
      </div>

      <div className="flex w-fit flex-wrap items-center">
        {genres.map((genre, index, array) => (
          <div key={genre} className="flex items-center">
            <span
              className="peer py-1 text-sm font-medium"
              style={{
                color: isAnimeColorAppropriate ? anime.coverImage.color : primaryThemeColor,
              }}
            >
              {genre}
            </span>

            {index != array.length - 1 && <div className="mx-2 h-2 w-2 rounded-full bg-white/60" />}
          </div>
        ))}
      </div>
    </div>
  )
}
