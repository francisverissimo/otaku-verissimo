type StudioConnection = {
  edges: {
    isMain: boolean
    node: { id: number; name: string; isAnimationStudio: boolean }
  }[]
}

type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'

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

type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS'

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

export type PageMediaResultQuery = {
  id: number
  title: {
    userPreferred: string
  }
  coverImage: {
    large: string
    color: string
  }
  format: MediaFormat
  averageScore: number
  episodes: number
  genres: string[]
  status: MediaStatus
  studios: { nodes: { id: number; name: string }[] }
  season: MediaSeason
  seasonYear: number
  startDate: {
    __typename: 'FuzzyDate'
    day: number
    month: number
    year: number
  }
}

export type AnimeMedia = {
  id: number
  title: {
    userPreferred: string
  }
  coverImage: {
    large: string
    color: string
  }
  bannerImage: string
  season: MediaSeason
  seasonYear: number
  format: MediaFormat
  averageScore: number
  meanScore: number
  genres: string[]
  description: string
  status: MediaStatus
  episodes: number
  duration: number
  studios: StudioConnection
  synonyms: string[]
  popularity: number
  favourites: number
  characters: {
    edges: {
      node: {
        id: number
        name: { full: string }
        image: { medium: string }
      }
      voiceActorRoles: {
        roleNotes: string | null
        voiceActor: {
          id: number
          name: { full: string }
          image: { medium: string }
        }
      }[]
      role: 'MAIN' | 'SUPPORTING' | 'BACKGROUND'
    }[]
    pageInfo: {
      currentPage: number
      hasNextPage: boolean
    }
  }
  staff: {
    edges: {
      id: number
      node: {
        id: number
        name: { full: string }
        image: { medium: string }
      }
      role: string
    }[]
    pageInfo: {
      currentPage: number
      hasNextPage: boolean
    }
  }
  source: string
  startDate: {
    __typename: 'FuzzyDate'
    day: number
    month: number
    year: number
  }
  endDate: {
    day: number
    month: number
    year: number
  }
  tags: {
    id: number
    name: string
    description: string
    category: string
    rank: number
    isGeneralSpoiler: boolean
    isMediaSpoiler: boolean
    isAdult: boolean
  }[]
  relations: {
    edges: {
      relationType: string
      node: {
        id: number
        title: {
          userPreferred: string
        }
        format: string
        coverImage: {
          large: string
        }
        type: string
      }
    }[]
  }
  recommendations: {
    edges: {
      node: {
        mediaRecommendation: {
          id: number
          title: {
            userPreferred: string
          }
          format: string
          coverImage: {
            large: string
          }
          averageScore: number
          favourites: number
        }
      }
    }[]
  }
  externalLinks: {
    id: number
    site: string
    url: string
    color: string
    icon: string
  }[]
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

export type GetAnimeInfoQueryResponse = {
  Page: {
    media: AnimeMedia[]
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
