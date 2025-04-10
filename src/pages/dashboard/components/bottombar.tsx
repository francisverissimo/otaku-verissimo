import { useSearchParams } from 'react-router-dom'
import { HouseSimple, SignIn, Video } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/use-auth'

export function BottomBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const active = searchParams.get('tabs') || '/'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-14 bg-zinc-950/50 backdrop-blur duration-300 sm:block md:hidden md:h-28">
      <div className="group mx-auto flex h-full w-full max-w-5xl items-center justify-center px-4">
        <button
          title="Home"
          onClick={() =>
            setSearchParams((params) => {
              params.delete('tabs')
              return params
            })
          }
          data-active={active === '/'}
          className="flex h-14 cursor-pointer items-center justify-center gap-1 p-2 data-[active=true]:text-main"
        >
          <HouseSimple size={24} weight={active === '/' ? 'fill' : 'regular'} />
          <span className="text-sm">Home</span>
        </button>

        {user && (
          <button
            title="My Anime List"
            onClick={() => setSearchParams({ tabs: 'anime-list' })}
            data-active={active === 'anime-list'}
            className="flex h-14 cursor-pointer items-center justify-center gap-1 p-2 data-[active=true]:text-main"
          >
            <Video size={24} weight={active === 'anime-list' ? 'fill' : 'regular'} />
            <span className="text-sm">Anime List</span>
          </button>
        )}

        {user === null && (
          <a
            href={`https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ID_CLIENT}&response_type=token`}
            title="Sign in with AniList"
            className="flex h-full cursor-pointer items-center justify-center px-2 transition"
          >
            <SignIn size={32} className="text-second" />
            <span className="text-center text-second">Log in with AniList</span>
          </a>
        )}

        {user && (
          <button
            title="My profile"
            data-active={active === 'profile'}
            onClick={() => setSearchParams({ tabs: 'profile' })}
            className="flex h-full cursor-pointer items-center justify-center gap-1 p-2 data-[active=true]:text-main md:h-28 md:w-28"
          >
            <img src={user.avatar.medium} alt="avatar image user" className="w-10 rounded-full" />
            <span>Profile</span>
          </button>
        )}
      </div>
    </div>
  )
}
