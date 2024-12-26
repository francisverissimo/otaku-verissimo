export type MediaSort =
  | 'ID'
  | 'ID_DESC'
  | 'TITLE_ROMAJI'
  | 'TITLE_ROMAJI_DESC'
  | 'TITLE_ENGLISH'
  | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE'
  | 'TITLE_NATIVE_DESC'
  | 'TYPE'
  | 'TYPE_DESC'
  | 'FORMAT'
  | 'FORMAT_DESC'
  | 'START_DATE'
  | 'START_DATE_DESC'
  | 'END_DATE'
  | 'END_DATE_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC'
  | 'EPISODES'
  | 'EPISODES_DESC'

export type PageInfo = {
  total: number
  currentPage: number
  lastPage: number
  hasNextPage: true
  perPage: number
}

export type StaffModel = {
  id: number
  name: {
    full: string
    native: string
  }
  image: {
    large: string
  }
  description: string
  homeTown: string
  favourites: number
  bloodType: string
  age: number
  gender: string
  yearsActive: number[]
  dateOfBirth: {
    day: number
    month: number
    year: number
  }
  characters: {
    edges: {
      id: number
      role: string
      media: {
        id: number
        format: string
        title: {
          userPreferred: string
          english: string | null
          native: string
        }
        coverImage: {
          large: string
        }
      }[]
      node: {
        id: number
        name: {
          full: string
        }
        image: {
          large: string
        }
      }
    }[]
    pageInfo: {
      currentPage: number
      hasNextPage: boolean
    }
  }
  staffMedia: {
    edges: {
      node: {
        id: number
        title: {
          userPreferred: string
          english: string | null
          native: string
        }
        coverImage: {
          large: string
        }
        startDate: {
          day: number | null
          month: number | null
          year: number | null
        }
        type: 'ANIME' | 'MANGA'
      }
      staffRole: string
    }[]
    pageInfo: {
      currentPage: number
      hasNextPage: boolean
    }
  }
}

export type CharacterModel = {
  id: number
  name: {
    full: string
    native: string
  }
  image: {
    large: string
  }
  description: string
  favourites: number
  bloodType: string
  media: {
    edges: {
      node: {
        id: number
        title: {
          userPreferred: string
          english: string | null
          native: string
        }
        coverImage: {
          large: string
        }
        type: 'ANIME' | 'MANGA'
      }
      voiceActors: {
        id: number
        name: {
          full: string
        }
        image: {
          large: string
        }
        languageV2: string
      }[]
    }[]
  }
}

export type PopularThisSeasonType = {
  currentYear: number
  currentSeason: string | undefined
  perPage: number
}

export type UpcomingNextSeasonType = {
  nextSeasonYear: number
  nextSeason: string | undefined
  perPage: number
}

export type TrendingNowType = {
  perPage: number
}

export type AllTimePopularType = {
  perPage: number
}

export type ViewAllParams = 'trending' | 'this-season' | 'next-season' | 'popular'
