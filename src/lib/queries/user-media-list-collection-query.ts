import { gql } from '@apollo/client'

export const GET_USER_MEDIA_LIST_COLLECTION_QUERY = gql`
  query MediaListCollectionQuery($userId: Int) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        isCustomList
        isCompletedList: isSplitCompletedList
        status
        entries {
          ...mediaListEntry
        }
      }
    }
  }

  fragment mediaListEntry on MediaList {
    id
    mediaId
    status
    score
    progress
    progressVolumes
    repeat
    priority
    private
    hiddenFromStatusLists
    customLists
    advancedScores
    notes
    updatedAt
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    media {
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
      type
      format
      status(version: 2)
      episodes
      volumes
      chapters
      averageScore
      popularity
      isAdult
      countryOfOrigin
      genres
      bannerImage
      startDate {
        year
        month
        day
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
    }
  }
`
