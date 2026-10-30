import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useAuth } from './hooks/use-auth'
import { resolveViewer } from './auth/viewer'
import { Anime } from './pages/anime'
import { Staff } from './pages/staff'
import { Search } from './pages/search'
import { Character } from './pages/character'
import { Dashboard } from './pages/dashboard'
import { NotFound } from './components/not-found'

const router = createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/search', element: <Search /> },
  { path: '/anime/:id', element: <Anime /> },
  { path: '/staff/:id', element: <Staff /> },
  { path: '/character/:id', element: <Character /> },
  { path: '*', element: <NotFound /> },
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
