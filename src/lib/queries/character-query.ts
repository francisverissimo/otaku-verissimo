import { gql } from '@apollo/client'

export const GET_CHARACTER_QUERY = gql`
  query CharacterQuery($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: false)
      favourites
      bloodType
      media(sort: POPULARITY_DESC) {
        edges {
          id
          node {
            id
            title {
              userPreferred
              english
              native
            }
            coverImage {
              large
            }
            type
          }
          voiceActors {
            id
            name {
              full
            }
            image {
              large
            }
            languageV2
          }
        }
      }
    }
  }
`
