import { useEffect } from 'react'
import { createBrowserRouter, Navigate, useSearchParams } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { useAuth } from '@/features/auth/use-auth'
import { resolveViewer } from '@/features/auth/viewer'
import { HomePage } from '@/features/home/home-page'
import { AnimeListPage } from '@/features/anime-list/anime-list-page'
import { ProfilePage } from '@/features/profile/profile-page'
import { SearchPage } from '@/features/search/search-page'
import { AnimePage } from '@/features/anime/anime-page'
import { AnimeOverviewTab } from '@/features/anime/anime-overview-tab'
import { AnimeCharactersTab } from '@/features/anime/anime-characters-tab'
import { AnimeStaffTab } from '@/features/anime/anime-staff-tab'
import { StaffPage } from '@/features/staff/staff-page'
import { CharacterPage } from '@/features/character/character-page'
import { DashboardLayout } from './dashboard-layout'
import { NotFoundPage } from './not-found-page'

const LEGACY_TABS: Record<string, string> = { 'anime-list': '/list', profile: '/profile' }

/** Old links used `/?tabs=anime-list` and `/?tabs=profile`; send them to the new routes. */
function HomeRoute() {
  const [searchParams] = useSearchParams()
  const legacyTarget = LEGACY_TABS[searchParams.get('tabs') ?? '']

  if (legacyTarget) return <Navigate to={legacyTarget} replace />

  return <HomePage />
}

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'list', element: <AnimeListPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  { path: 'search', element: <SearchPage /> },
  {
    path: 'anime/:id',
    element: <AnimePage />,
    children: [
      { index: true, element: <AnimeOverviewTab /> },
      { path: 'characters', element: <AnimeCharactersTab /> },
      { path: 'staff', element: <AnimeStaffTab /> },
    ],
  },
  { path: 'staff/:id', element: <StaffPage /> },
  { path: 'character/:id', element: <CharacterPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export function App() {
  const { user, signin } = useAuth()

  useEffect(() => {
    if (user !== undefined) return

    resolveViewer().then((viewer) => signin(viewer ?? null))
  }, [user, signin])

  if (user === undefined) {
    return null
  }

  return <RouterProvider router={router} />
}
