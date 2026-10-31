import type { MediaSeason, MediaSort } from '@/gql/graphql'
import { seasonHandler } from '@/lib/season'

export const SEASONS: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']

/** Sort options offered by AL-chan, mapped to AniList's `MediaSort` (without the `_DESC` suffix). */
export const SORT_OPTIONS = [
  { value: 'POPULARITY', label: 'Popularity' },
  { value: 'SCORE', label: 'Average score' },
  { value: 'FAVOURITES', label: 'Favorites' },
  { value: 'TRENDING', label: 'Trending' },
  { value: 'TITLE_ROMAJI', label: 'Title' },
  { value: 'START_DATE', label: 'Release date' },
] as const

export type SeasonalSort = (typeof SORT_OPTIONS)[number]['value']
export type ListFilter = 'all' | 'hide' | 'only'

export type SeasonalFilters = {
  year: number
  season: MediaSeason
  sort: SeasonalSort
  order: 'desc' | 'asc'
  /** Applied on the client: a media must have every selected genre. */
  genres: string[]
  /** Only for logged-in users: hide or keep only media already on their list. */
  onList: ListFilter
  adult: boolean
}

const FIRST_YEAR = 1950

/** From next year back to 1950, like AL-chan. */
export function yearOptions(currentYear = seasonHandler.getCurrentYear()) {
  return Array.from({ length: currentYear + 1 - FIRST_YEAR + 1 }, (_, i) => currentYear + 1 - i)
}

export function defaultFilters(): SeasonalFilters {
  return {
    year: seasonHandler.getCurrentYear(),
    season: seasonHandler.getCurrentSeason(),
    sort: 'POPULARITY',
    order: 'desc',
    genres: [],
    onList: 'all',
    adult: false,
  }
}

function oneOf<T extends string>(value: string | null, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback
}

/** Reads filters from the URL, falling back to the defaults for missing or invalid values. */
export function parseFilters(params: URLSearchParams): SeasonalFilters {
  const defaults = defaultFilters()
  const year = Number(params.get('year'))

  return {
    year: Number.isInteger(year) && yearOptions().includes(year) ? year : defaults.year,
    season: oneOf(params.get('season'), SEASONS, defaults.season),
    sort: oneOf(
      params.get('sort'),
      SORT_OPTIONS.map((option) => option.value),
      defaults.sort
    ),
    order: oneOf(params.get('order'), ['desc', 'asc'] as const, defaults.order),
    genres: params.get('genres')?.split(',').filter(Boolean) ?? [],
    onList: oneOf(params.get('onList'), ['all', 'hide', 'only'] as const, defaults.onList),
    adult: params.get('adult') === '1',
  }
}

/** Writes only the values that differ from the defaults, so the URL stays short. */
export function serializeFilters(filters: SeasonalFilters): URLSearchParams {
  const defaults = defaultFilters()
  const params = new URLSearchParams()

  if (filters.year !== defaults.year) params.set('year', String(filters.year))
  if (filters.season !== defaults.season) params.set('season', filters.season)
  if (filters.sort !== defaults.sort) params.set('sort', filters.sort)
  if (filters.order !== defaults.order) params.set('order', filters.order)
  if (filters.genres.length) params.set('genres', filters.genres.join(','))
  if (filters.onList !== defaults.onList) params.set('onList', filters.onList)
  if (filters.adult) params.set('adult', '1')

  return params
}

export function toMediaSort({ sort, order }: SeasonalFilters): MediaSort {
  return order === 'desc' ? `${sort}_DESC` : sort
}

/** Variables sent to AniList. Genres are filtered on the client and are not part of the request. */
export function toQueryVariables(filters: SeasonalFilters, isLoggedIn: boolean) {
  return {
    season: filters.season,
    seasonYear: filters.year,
    sort: [toMediaSort(filters)],
    // `isAdult: true` would return only adult media; leaving it out returns both.
    isAdult: filters.adult ? undefined : false,
    onList: isLoggedIn && filters.onList !== 'all' ? filters.onList === 'only' : undefined,
  }
}
