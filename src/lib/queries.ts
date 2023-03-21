import { gql } from "@apollo/client";

export const GET_ANIME_MEDIA = gql`
  query AnimeMedia($id: Int, $charactersPage: Int, $staffPage: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
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
              romaji
            }
            format
            coverImage {
              large
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
                romaji
              }
              format
              coverImage {
                large
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
`;

export const GET_SEARCH_QUERY = gql`
  query AnimeResults(
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
        total
        currentPage
        lastPage
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
          romaji
        }
        coverImage {
          large
        }
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
        season
        seasonYear
        status
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
      }
    }
  }
`;
