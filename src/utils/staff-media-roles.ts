type StaffMediaRoleInitialType = {
  node: {
    id: number
    title: {
      userPreferred: string
      english: string | null
      native: string
    }
    coverImage: {
      large: string
    }
    startDate: {
      day: number | null
      month: number | null
      year: number | null
    }
    type: 'ANIME' | 'MANGA'
  }
  staffRole: string
}

type StaffMediaRolesGrouped = {
  node: {
    id: number
    title: {
      userPreferred: string
      english: string | null
      native: string
    }
    coverImage: {
      large: string
    }
    startDate: {
      day: number | null
      month: number | null
      year: number | null
    }
    type: 'ANIME' | 'MANGA'
  }
  staffRoles: string[]
}

class StaffMediaRolesUtils {
  group(data: StaffMediaRoleInitialType[]): StaffMediaRolesGrouped[] {
    const grouped: { [key: number]: StaffMediaRolesGrouped } = {}

    data.forEach((item) => {
      const id = item.node.id
      const staffRole = item.staffRole

      if (!grouped[id]) {
        grouped[id] = { staffRoles: [staffRole], node: { ...item.node } }
      } else {
        grouped[id].staffRoles.push(staffRole)
      }
    })

    return Object.values(grouped)
  }

  sort(data: StaffMediaRolesGrouped[]): StaffMediaRolesGrouped[] {
    return data.sort((a, b) => {
      const aStartDate = a.node.startDate
      const bStartDate = b.node.startDate

      if (!aStartDate || !bStartDate) {
        return 0
      }

      const aYear = aStartDate.year ?? Number.MAX_VALUE
      const bYear = bStartDate.year ?? Number.MAX_VALUE

      if (aYear !== bYear) {
        return bYear - aYear
      }

      const aMonth = aStartDate.month ?? Number.MAX_VALUE
      const bMonth = bStartDate.month ?? Number.MAX_VALUE

      if (aMonth !== bMonth) {
        return bMonth - aMonth
      }

      const aDay = aStartDate.day ?? Number.MAX_VALUE
      const bDay = bStartDate.day ?? Number.MAX_VALUE

      if (aDay !== bDay) {
        return bDay - aDay
      }

      return 0
    })
  }
}

export const staffMediaRolesUtils = new StaffMediaRolesUtils()
