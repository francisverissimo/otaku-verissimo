import { gql } from '@apollo/client'

export const GET_PAGE_MEDIA_QUERY = gql`
  query PageMediaQuery(
    $perPage: Int
    $page: Int
    $search: String
    $sort: [MediaSort]
    $isAdult: Boolean
    $season: MediaSeason
    $seasonYear: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
      }
      media(
        type: ANIME
        sort: $sort
        search: $search
        isAdult: $isAdult
        season: $season
        seasonYear: $seasonYear
      ) {
        id
        title {
        userPreferred
        english
        native
      }
        coverImage {
          large
          color
        }
        bannerImage
        genres
        episodes
        averageScore
        format
        studios(isMain: true) {
          nodes {
            id
            name
          }
        }
        description(asHtml: false)
        season
        seasonYear
        status
        startDate {
          day
          month
          year
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`
