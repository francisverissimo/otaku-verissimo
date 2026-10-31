import { describe, expect, it } from 'vitest'
import type { StaffQuery } from '@/gql/graphql'
import { toStaffView } from './staff-queries'

type Staff = NonNullable<StaffQuery['Staff']>

const emptyStaff: Staff = {
  id: 1,
  gender: null,
  age: null,
  yearsActive: null,
  description: null,
  favourites: null,
  homeTown: null,
  bloodType: null,
  name: null,
  image: null,
  dateOfBirth: null,
  characters: null,
  staffMedia: null,
}

describe('toStaffView', () => {
  it('returns null when the staff does not exist', () => {
    expect(toStaffView({ Staff: null })).toBeNull()
  })

  it('uses fallbacks for missing fields', () => {
    expect(toStaffView({ Staff: emptyStaff })).toMatchObject({
      name: 'Unknown',
      favourites: 0,
      yearsActive: [],
      dateOfBirth: null,
      characters: { items: [], nextPage: undefined },
      staffMedia: { items: [], nextPage: undefined },
    })
  })

  it('only shows the birth date when it is complete', () => {
    const partial = toStaffView({
      Staff: { ...emptyStaff, dateOfBirth: { year: 1989, month: null, day: 25 } },
    })
    const complete = toStaffView({
      Staff: { ...emptyStaff, dateOfBirth: { year: 1989, month: 2, day: 25 } },
    })

    expect(partial?.dateOfBirth).toBeNull()
    expect(complete?.dateOfBirth).toEqual({ year: 1989, month: 2, day: 25 })
  })

  it('maps staff roles with an empty role when AniList omits it', () => {
    const staff = toStaffView({
      Staff: {
        ...emptyStaff,
        staffMedia: {
          pageInfo: { currentPage: 2, hasNextPage: true },
          edges: [
            {
              staffRole: null,
              node: { id: 1, title: null, coverImage: null, startDate: null },
            },
          ],
        },
      },
    })

    expect(staff?.staffMedia).toEqual({
      nextPage: 3,
      items: [
        {
          id: 1,
          title: '',
          cover: null,
          startDate: { year: null, month: null, day: null },
          staffRole: '',
        },
      ],
    })
  })
})
