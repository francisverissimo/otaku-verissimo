import { gql } from '@apollo/client'

export const GET_STAFF_QUERY = gql`
  query StaffQuery($id: Int) {
    Staff(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      gender
      age
      yearsActive
      description(asHtml: true)
      favourites
      homeTown
      bloodType
      modNotes
      dateOfBirth {
        day
        month
        year
      }
      characters(sort: FAVOURITES_DESC) {
        edges {
          id
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
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
            }
          }
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      staffMedia(sort: START_DATE_DESC) {
        edges {
          staffRole
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
            startDate {
              day
              month
              year
            }
            type
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

export const GET_STAFF_CHARACTERS_PAGINATION = gql`
  query StaffCharactersPagination($id: Int, $charactersPage: Int) {
    Staff(id: $id) {
      characters(sort: FAVOURITES_DESC, page: $charactersPage) {
        edges {
          id
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
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
            }
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

export const GET_STAFF_STAFF_MEDIA_PAGINATION = gql`
  query StaffStaffMediaPagination($id: Int, $staffMediaPage: Int) {
    Staff(id: $id) {
      staffMedia(sort: START_DATE_DESC, page: $staffMediaPage) {
        edges {
          staffRole
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
            startDate {
              day
              month
              year
            }
            type
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
