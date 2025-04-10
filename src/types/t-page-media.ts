export type TPageMediaResultQuery = {
  Page: {
    __typename: 'Page'
    pageInfo: {
      __typename: 'PageInfo'
      currentPage: number
      hasNextPage: boolean
      perPage: number
    }
    media: TPageMedia[]
  }
}

export type TPageMedia = {
  __typename: 'Media'
  id: number
  title: MediaTitle
  coverImage: MediaCoverImage
  bannerImage: string | null
  genres: string[]
  episodes: number | null
  averageScore: number | null
  format: string | null
  studios: StudioConnection
  description: string | null
  season: string | null
  seasonYear: number | null
  status: string | null
  startDate: FuzzyDate
  nextAiringEpisode: AiringSchedule | null
}

type MediaTitle = {
  __typename: 'MediaTitle'
  userPreferred: string
  english: string | null
  native: string
}

type MediaCoverImage = {
  __typename: 'MediaCoverImage'
  large: string
  color: string | null
}

type StudioConnection = {
  __typename: 'StudioConnection'
  nodes: Studio[]
}

type Studio = {
  __typename: 'Studio'
  id: number
  name: string
}

type FuzzyDate = {
  __typename: 'FuzzyDate'
  day: number | null
  month: number | null
  year: number | null
}

type AiringSchedule = {
  __typename: 'AiringSchedule'
  airingAt: number
  timeUntilAiring: number
  episode: number
}
