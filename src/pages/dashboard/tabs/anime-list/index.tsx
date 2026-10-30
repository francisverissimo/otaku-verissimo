import { useAuth } from '@/hooks/use-auth'
import { TViewer } from '@/types/t-viewer'
import { AnimeListHeader } from './anime-list-header'
import { UnauthenticatedView } from '@/components/unauthenticated-view'
import { useMediaListCollection } from './use-media-list-collection'
import { AnimeListContent } from './anime-list-content'
import logo from '@/assets/logo-short.svg'

export function AnimeList() {
  const { user } = useAuth()

  if (!user) return <UnauthenticatedView />

  return <AuthenticatedAnimeList user={user} />
}

function AuthenticatedAnimeList({ user }: { user: TViewer }) {
  const { data, loading } = useMediaListCollection(user)

  if (loading) {
    return (
      <div className="my-auto items-center justify-center saturate-50">
        <img src={logo} alt="ov logo" className="w-32 animate-bounce opacity-25" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="my-auto items-center justify-center saturate-50">
        <span className="text-lg italic">Error: Unable to get the lists</span>
      </div>
    )
  }

  return (
    <div className="w-full px-4 pt-14 pb-24">
      <AnimeListHeader />

      <AnimeListContent data={data} />
    </div>
  )
}
