import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type {
  StaffCharacterEdgeFragment,
  StaffMediaEdgeFragment,
  StaffQuery as StaffQueryResult,
} from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { toPage, type Page } from '@/lib/connection-page'
import { compact } from '@/utils/compact'

graphql(`
  fragment StaffCharacterEdge on CharacterEdge {
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
      format
      title {
        userPreferred
      }
      coverImage {
        large
      }
    }
  }
`)

graphql(`
  fragment StaffMediaEdge on MediaEdge {
    staffRole
    node {
      id
      title {
        userPreferred
      }
      coverImage {
        large
      }
      startDate {
        year
        month
        day
      }
    }
  }
`)

const StaffQuery = graphql(`
  query Staff($id: Int) {
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
      dateOfBirth {
        year
        month
        day
      }
      characters(sort: FAVOURITES_DESC, page: 1) {
        edges {
          ...StaffCharacterEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
      staffMedia(type: ANIME, sort: START_DATE_DESC, page: 1) {
        edges {
          ...StaffMediaEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`)

const StaffCharactersPageQuery = graphql(`
  query StaffCharactersPage($id: Int, $page: Int) {
    Staff(id: $id) {
      characters(sort: FAVOURITES_DESC, page: $page) {
        edges {
          ...StaffCharacterEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`)

const StaffMediaPageQuery = graphql(`
  query StaffMediaPage($id: Int, $page: Int) {
    Staff(id: $id) {
      staffMedia(type: ANIME, sort: START_DATE_DESC, page: $page) {
        edges {
          ...StaffMediaEdge
        }
        pageInfo {
          currentPage
          hasNextPage
        }
      }
    }
  }
`)

function toStaffCharacter(edge: StaffCharacterEdgeFragment) {
  if (!edge.node) return null

  return {
    id: edge.node.id,
    name: edge.node.name?.full ?? 'Unknown',
    image: edge.node.image?.large ?? null,
    role: edge.role,
    media: compact(edge.media).map((media) => ({
      id: media.id,
      format: media.format,
      title: media.title?.userPreferred ?? '',
      cover: media.coverImage?.large ?? null,
    })),
  }
}

function toStaffMediaRole(edge: StaffMediaEdgeFragment) {
  if (!edge.node) return null

  return {
    id: edge.node.id,
    title: edge.node.title?.userPreferred ?? '',
    cover: edge.node.coverImage?.large ?? null,
    startDate: {
      year: edge.node.startDate?.year ?? null,
      month: edge.node.startDate?.month ?? null,
      day: edge.node.startDate?.day ?? null,
    },
    staffRole: edge.staffRole ?? '',
  }
}

export type StaffCharacter = NonNullable<ReturnType<typeof toStaffCharacter>>
export type StaffMediaRole = NonNullable<ReturnType<typeof toStaffMediaRole>>

function toStaffView(data: StaffQueryResult) {
  const staff = data.Staff
  if (!staff) return null

  const { year, month, day } = staff.dateOfBirth ?? {}

  return {
    id: staff.id,
    name: staff.name?.full ?? 'Unknown',
    nativeName: staff.name?.native ?? null,
    image: staff.image?.large ?? null,
    favourites: staff.favourites ?? 0,
    dateOfBirth: year && month && day ? { year, month, day } : null,
    age: staff.age,
    gender: staff.gender,
    yearsActive: compact(staff.yearsActive),
    homeTown: staff.homeTown,
    bloodType: staff.bloodType,
    description: staff.description,
    characters: toPage(staff.characters, toStaffCharacter),
    staffMedia: toPage(staff.staffMedia, toStaffMediaRole),
  }
}

export type StaffView = NonNullable<ReturnType<typeof toStaffView>>

export function useStaff(id: number) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => execute(StaffQuery, { id }),
    select: toStaffView,
  })
}

export function useStaffCharacters(staffId: number, firstPage: Page<StaffCharacter>) {
  return useInfiniteQuery({
    queryKey: ['staff', staffId, 'characters'],
    queryFn: async ({ pageParam }) => {
      const data = await execute(StaffCharactersPageQuery, { id: staffId, page: pageParam })
      return toPage(data.Staff?.characters, toStaffCharacter)
    },
    initialPageParam: 1,
    initialData: { pages: [firstPage], pageParams: [1] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.items),
  })
}

export function useStaffMediaRoles(staffId: number, firstPage: Page<StaffMediaRole>) {
  return useInfiniteQuery({
    queryKey: ['staff', staffId, 'staff-media'],
    queryFn: async ({ pageParam }) => {
      const data = await execute(StaffMediaPageQuery, { id: staffId, page: pageParam })
      return toPage(data.Staff?.staffMedia, toStaffMediaRole)
    },
    initialPageParam: 1,
    initialData: { pages: [firstPage], pageParams: [1] },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => data.pages.flatMap((page) => page.items),
  })
}
