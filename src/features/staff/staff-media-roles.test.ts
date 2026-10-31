import { describe, expect, it } from 'vitest'
import type { StaffMediaRole } from './staff-queries'
import { groupStaffMediaRoles, sortByStartDateDesc } from './staff-media-roles'

function role(
  id: number,
  staffRole: string,
  year: number | null,
  month: number | null = 1
): StaffMediaRole {
  return {
    id,
    title: `Anime ${id}`,
    cover: null,
    startDate: { year, month, day: 1 },
    staffRole,
  }
}

describe('groupStaffMediaRoles', () => {
  it('merges the roles a person has on the same media', () => {
    const grouped = groupStaffMediaRoles([
      role(1, 'Director', 1998),
      role(2, 'Storyboard', 2004),
      role(1, 'Script', 1998),
    ])

    expect(grouped.map((media) => [media.id, media.staffRoles])).toEqual([
      [1, ['Director', 'Script']],
      [2, ['Storyboard']],
    ])
  })
})

describe('sortByStartDateDesc', () => {
  it('lists the newest first and unannounced media at the top', () => {
    const sorted = sortByStartDateDesc([
      role(1, 'Director', 1998),
      role(2, 'Director', null),
      role(3, 'Director', 2021, 4),
      role(4, 'Director', 2021, 10),
    ])

    expect(sorted.map((media) => media.id)).toEqual([2, 4, 3, 1])
  })
})
