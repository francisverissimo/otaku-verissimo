import { useLocation } from 'react-router'
import { HouseSimple, Video, type Icon } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/use-auth'

type NavItem = {
  to: string
  label: string
  title: string
  icon: Icon
  requiresAuth: boolean
}

/** Dashboard destinations shared by the sidebar (desktop) and the bottom bar (mobile). */
const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', title: 'Home', icon: HouseSimple, requiresAuth: false },
  { to: '/list', label: 'Anime List', title: 'My Anime List', icon: Video, requiresAuth: true },
]

export const PROFILE_PATH = '/profile'

/** Items the current user can see, plus a helper to tell which route is active. */
export function useDashboardNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return {
    user,
    items: NAV_ITEMS.filter((item) => !item.requiresAuth || user),
    isActive: (to: string) => pathname === to,
  }
}
