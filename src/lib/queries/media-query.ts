import { gql } from '@apollo/client'

export const GET_MEDIA_QUERY = gql`
  query MediaQuery($id: Int) {
    Media(id: $id, type: ANIME) {
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
      synonyms
      genres
      episodes
      duration
      averageScore
      meanScore
      popularity
      format
      studios {
        edges {
          isMain
          node {
            id
            name
            isAnimationStudio
          }
        }
      }
      season
      seasonYear
      status
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      favourites
      description(asHtml: false)
      characters(sort: [ROLE, ID], page: 1, perPage: 20) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
            voiceActor {
              id
              name {
                full
              }
              image {
                medium
              }
            }
            roleNotes
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      staff(sort: RELEVANCE, page: 1, perPage: 20) {
        edges {
          id
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          role
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      source
      startDate {
        day
        month
        year
      }
      endDate {
        day
        month
        year
      }
      tags {
        id
        name
        description
        category
        rank
        isGeneralSpoiler
        isMediaSpoiler
        isAdult
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              userPreferred
              english
              native
            }
            format
            coverImage {
              large
              color
            }
            type
          }
        }
      }
      recommendations(sort: RATING_DESC) {
        edges {
          node {
            id
            rating
            mediaRecommendation {
              id
              title {
                userPreferred
                english
                native
              }
              format
              coverImage {
                large
                color
              }
              averageScore
              favourites
            }
          }
        }
      }
      externalLinks {
        id
        site
        url
        color
        icon
      }
    }
  }
`

export const GET_MEDIA_CHARACTERS_PAGINATION = gql`
  query AnimeCharactersPagination($id: Int, $charactersPage: Int) {
    Media(id: $id, type: ANIME) {
      characters(sort: [ROLE, ID], page: $charactersPage, perPage: 20) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
            voiceActor {
              id
              name {
                full
              }
              image {
                medium
              }
            }
            roleNotes
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`

export const GET_MEDIA_STAFF_PAGINATION = gql`
  query AnimeStaffPagination($id: Int, $staffPage: Int) {
    Media(id: $id, type: ANIME) {
      staff(sort: RELEVANCE, page: $staffPage, perPage: 20) {
        edges {
          id
          node {
            id
            name {
              full
            }
            image {
              medium
            }
          }
          role
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`
