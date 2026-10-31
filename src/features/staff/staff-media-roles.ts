import type { StaffMediaRole } from './staff-queries'

type StaffMediaRolesGrouped = Omit<StaffMediaRole, 'staffRole'> & { staffRoles: string[] }

/** AniList returns one edge per role; a person can hold several roles on the same media. */
export function groupStaffMediaRoles(roles: StaffMediaRole[]): StaffMediaRolesGrouped[] {
  const grouped = new Map<number, StaffMediaRolesGrouped>()

  for (const { staffRole, ...media } of roles) {
    const existing = grouped.get(media.id)

    if (existing) {
      existing.staffRoles.push(staffRole)
    } else {
      grouped.set(media.id, { ...media, staffRoles: [staffRole] })
    }
  }

  return [...grouped.values()]
}

/** Newest first; media without a date (unannounced) go to the top. */
export function sortByStartDateDesc<T extends Pick<StaffMediaRole, 'startDate'>>(items: T[]): T[] {
  return items.slice().sort((a, b) => {
    const keys = ['year', 'month', 'day'] as const

    for (const key of keys) {
      const aValue = a.startDate[key] ?? Number.MAX_VALUE
      const bValue = b.startDate[key] ?? Number.MAX_VALUE
      if (aValue !== bValue) return bValue - aValue
    }

    return 0
  })
}
