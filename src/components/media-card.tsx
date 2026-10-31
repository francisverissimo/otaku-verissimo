import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Image } from './image'

type MediaCardProps = {
  /** Route to open on click. Without it the card is not a link (e.g. manga, which has no page). */
  to?: string
  onClick?: () => void
  children: ReactNode
}

/**
 * Cover card used in grids and carousels. Compose it with `MediaCardCover`, `MediaCardBadge`
 * and any text below the cover:
 *
 * <MediaCard to={`/anime/${id}`}>
 *   <MediaCardCover src={cover} alt={title}>
 *     <MediaCardBadge position="top-right">TV</MediaCardBadge>
 *   </MediaCardCover>
 *   <MediaCardTitle>{title}</MediaCardTitle>
 * </MediaCard>
 */
export function MediaCard({ to, onClick, children }: MediaCardProps) {
  const className = 'group flex flex-col gap-1'

  if (!to) return <div className={className}>{children}</div>

  return (
    <Link to={to} onClick={onClick} className={`${className} cursor-pointer`}>
      {children}
    </Link>
  )
}

type MediaCardCoverProps = {
  src: string | null
  alt: string
  /** Overlays such as `MediaCardBadge`. */
  children?: ReactNode
}

export function MediaCardCover({ src, alt, children }: MediaCardCoverProps) {
  return (
    <div className="relative mb-1 aspect-[6/9] overflow-hidden rounded-lg bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500 shadow-lg shadow-black/20">
      <Image src={src} alt={alt} className="h-full w-full object-cover object-center" />
      {children}
    </div>
  )
}

const badgePositions = {
  'top-left': 'top-0 left-0 rounded-br-lg',
  'top-right': 'top-0 right-0 rounded-bl-lg',
  'bottom-left': 'bottom-0 left-0 rounded-tr-lg',
  bottom: 'right-0 bottom-0 left-0 justify-center',
}

type MediaCardBadgeProps = {
  position: keyof typeof badgePositions
  children: ReactNode
}

export function MediaCardBadge({ position, children }: MediaCardBadgeProps) {
  return (
    <div
      className={`absolute flex items-center gap-1 bg-zinc-950/70 p-1 text-xs font-medium text-zinc-50 ${badgePositions[position]}`}
    >
      {children}
    </div>
  )
}

export function MediaCardTitle({ children }: { children: ReactNode }) {
  return <span className="line-clamp-2 text-sm font-medium md:text-base">{children}</span>
}
