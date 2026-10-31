import { useEffect } from 'react'
import { createBrowserRouter, Navigate, useSearchParams } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { DefaultLoading } from '@/components/loading'
import { useAuth } from '@/features/auth/use-auth'
import { resolveViewer } from '@/features/auth/viewer'
import { HomePage } from '@/features/home/home-page'
import { DashboardLayout } from './dashboard-layout'
import { NotFoundPage } from './not-found-page'
import { RouteErrorBoundary } from './route-error-boundary'

const LEGACY_TABS: Record<string, string> = { 'anime-list': '/list', profile: '/profile' }

/** Old links used `/?tabs=anime-list` and `/?tabs=profile`; send them to the new routes. */
function HomeRoute() {
  const [searchParams] = useSearchParams()
  const legacyTarget = LEGACY_TABS[searchParams.get('tabs') ?? '']

  if (legacyTarget) return <Navigate to={legacyTarget} replace />

  return <HomePage />
}

// Home and the dashboard shell load with the app; every other page is downloaded when first opened.
const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    // Shown while the chunk of a lazy route opened directly by URL is downloading.
    hydrateFallbackElement: <DefaultLoading />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <HomeRoute /> },
          {
            path: 'list',
            lazy: async () => ({
              Component: (await import('@/features/anime-list/anime-list-page')).AnimeListPage,
            }),
          },
          {
            path: 'profile',
            lazy: async () => ({
              Component: (await import('@/features/profile/profile-page')).ProfilePage,
            }),
          },
        ],
      },
      {
        path: 'search',
        lazy: async () => ({
          Component: (await import('@/features/search/search-page')).SearchPage,
        }),
      },
      {
        path: 'anime/:id',
        lazy: async () => ({ Component: (await import('@/features/anime/anime-page')).AnimePage }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('@/features/anime/anime-overview-tab')).AnimeOverviewTab,
            }),
          },
          {
            path: 'characters',
            lazy: async () => ({
              Component: (await import('@/features/anime/anime-characters-tab')).AnimeCharactersTab,
            }),
          },
          {
            path: 'staff',
            lazy: async () => ({
              Component: (await import('@/features/anime/anime-staff-tab')).AnimeStaffTab,
            }),
          },
        ],
      },
      {
        path: 'staff/:id',
        lazy: async () => ({ Component: (await import('@/features/staff/staff-page')).StaffPage }),
      },
      {
        path: 'character/:id',
        lazy: async () => ({
          Component: (await import('@/features/character/character-page')).CharacterPage,
        }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
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
