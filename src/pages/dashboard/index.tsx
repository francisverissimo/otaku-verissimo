import { useSearchParams } from 'react-router'
import { Home, AnimeList, Profile } from './tabs'
import { Sidebar, BottomBar } from './components'

function DashboardTab({ tab }: { tab: string | null }) {
  switch (tab) {
    case 'anime-list':
      return <AnimeList />
    case 'profile':
      return <Profile />
    default:
      return <Home />
  }
}

export function Dashboard() {
  const [searchParams] = useSearchParams()

  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen justify-center md:pl-14">
        <DashboardTab tab={searchParams.get('tabs')} />
      </div>
      <BottomBar />
    </>
  )
}
