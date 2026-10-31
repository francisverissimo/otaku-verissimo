import type { MediaSeason } from '@/gql/graphql'

const SEASONS: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL']

class SeasonHandler {
  getCurrentSeason(): MediaSeason {
    return SEASONS[Math.floor(new Date().getMonth() / 3)]
  }

  getNextSeason(): MediaSeason {
    const index = SEASONS.indexOf(this.getCurrentSeason())
    return SEASONS[(index + 1) % SEASONS.length]
  }

  getCurrentYear(): number {
    return new Date().getFullYear()
  }

  getNextYear(): number {
    if (this.getNextSeason() === 'WINTER') return this.getCurrentYear() + 1
    return this.getCurrentYear()
  }
}

export const seasonHandler = new SeasonHandler()
