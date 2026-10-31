import type { MediaFormat, MediaListStatus } from '@/gql/graphql'
import type { SeasonalMedia } from './seasonal-queries'

/** Section order used by AL-chan. */
const FORMAT_ORDER: MediaFormat[] = ['TV', 'TV_SHORT', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC']

export const FORMAT_LABELS: Record<MediaFormat, string> = {
  TV: 'TV',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  OVA: 'OVA',
  ONA: 'ONA',
  SPECIAL: 'Special',
  MUSIC: 'Music',
  MANGA: 'Manga',
  NOVEL: 'Novel',
  ONE_SHOT: 'One Shot',
}

export const LIST_STATUS_LABELS: Record<MediaListStatus, string> = {
  CURRENT: 'Watching',
  PLANNING: 'Planning',
  COMPLETED: 'Completed',
  DROPPED: 'Dropped',
  PAUSED: 'Paused',
  REPEATING: 'Rewatching',
}

/** Groups media by format in AL-chan's order, keeping the API sort inside each group. */
export function groupByFormat(media: SeasonalMedia[]) {
  return FORMAT_ORDER.map((format) => ({
    format,
    media: media.filter((item) => item.format === format),
  })).filter((group) => group.media.length > 0)
}

/** Keeps media that have every selected genre (same behavior as AniList's own search). */
export function filterByGenres(media: SeasonalMedia[], genres: string[]) {
  if (genres.length === 0) return media
  return media.filter((item) => genres.every((genre) => item.genres.includes(genre)))
}

/** Genres present in the season, most common first, with how many media have each one. */
export function countGenres(media: SeasonalMedia[]) {
  const counts = new Map<string, number>()

  for (const item of media) {
    for (const genre of item.genres) counts.set(genre, (counts.get(genre) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre))
}

export function setListEntry(
  media: SeasonalMedia[],
  mediaId: number,
  listEntry: SeasonalMedia['listEntry']
): SeasonalMedia[] {
  return media.map((item) => (item.id === mediaId ? { ...item, listEntry } : item))
}
