export type TMediaResultQuery = {
  Media: TMedia
}

export type TMedia = {
  __typename: 'Media'
  id: number
  title: MediaTitle
  coverImage: MediaCoverImage
  bannerImage: string | null
  synonyms: string[]
  genres: string[]
  episodes: number | null
  duration: number | null
  averageScore: number | null
  meanScore: number | null
  popularity: number
  format: MediaFormat | null
  studios: StudioConnection
  season: MediaSeason | null
  seasonYear: number | null
  status: MediaStatus | null
  nextAiringEpisode: AiringSchedule | null
  favourites: number | null
  description: string | null
  characters: CharacterConnection
  staff: StaffConnection
  source: string | null
  startDate: FuzzyDate
  endDate: FuzzyDate
  tags: MediaTag[]
  relations: MediaConnection
  recommendations: RecommendationConnection
  externalLinks: MediaExternalLink[]
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

type MediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'
  | 'MANGA'
  | 'NOVEL'
  | 'ONE_SHOT'

type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'

type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'

type Studio = {
  __typename: 'Studio'
  id: number
  name: string
  isAnimationStudio: boolean
}

type StudioEdge = {
  __typename: 'StudioEdge'
  isMain: boolean
  node: Studio
}

type StudioConnection = {
  __typename: 'StudioConnection'
  edges: StudioEdge[]
}

type AiringSchedule = {
  __typename: 'AiringSchedule'
  airingAt: number
  timeUntilAiring: number
  episode: number
}

type CharacterName = {
  __typename: 'CharacterName'
  full: string
}

type CharacterImage = {
  __typename: 'CharacterImage'
  medium: string
}

type Character = {
  __typename: 'Character'
  id: number
  name: CharacterName
  image: CharacterImage
}

type StaffName = {
  __typename: 'StaffName'
  full: string
}

type StaffImage = {
  __typename: 'StaffImage'
  medium: string
}

type Staff = {
  __typename: 'Staff'
  id: number
  name: StaffName
  image: StaffImage | null
}

type StaffRoleType = {
  __typename: 'StaffRoleType'
  voiceActor: Staff
  roleNotes: string | null
}

type CharacterEdge = {
  __typename: 'CharacterEdge'
  role: string
  node: Character
  voiceActorRoles: StaffRoleType[]
}

type CharacterConnection = {
  __typename: 'CharacterConnection'
  edges: CharacterEdge[]
  pageInfo: PageInfo
}

type StaffEdge = {
  __typename: 'StaffEdge'
  id: number
  node: Staff
  role: string
}

type StaffConnection = {
  __typename: 'StaffConnection'
  edges: StaffEdge[]
  pageInfo: PageInfo
}

type FuzzyDate = {
  __typename: 'FuzzyDate'
  day: number | null
  month: number | null
  year: number | null
}

export type MediaTag = {
  __typename: 'MediaTag'
  id: number
  name: string
  description: string
  category: string
  rank: number
  isGeneralSpoiler: boolean
  isMediaSpoiler: boolean
  isAdult: boolean
}

type PageInfo = {
  __typename: 'PageInfo'
  currentPage: number
  hasNextPage: boolean
}

type MediaEdge = {
  __typename: 'MediaEdge'
  relationType: string
  node: TMedia
}

type MediaConnection = {
  __typename: 'MediaConnection'
  edges: MediaEdge[]
}

type RecommendationEdge = {
  __typename: 'RecommendationEdge'
  node: Recommendation
}

type RecommendationConnection = {
  __typename: 'RecommendationConnection'
  edges: RecommendationEdge[]
}

type Recommendation = {
  __typename: 'Recommendation'
  id: number
  rating: number
  mediaRecommendation: TMedia
}

type MediaExternalLink = {
  __typename: 'MediaExternalLink'
  id: number
  site: string
  url: string
  color: string | null
  icon: string | null
}
