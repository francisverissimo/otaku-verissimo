import { useSearchParams } from 'react-router-dom'
import { HouseSimple, RocketLaunch, SignIn, Video } from '@phosphor-icons/react'
import { useAuth } from '@/hooks/use-auth'
import logo from '@/assets/logo-short.svg'

export function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const active = searchParams.get('tabs') || '/'

  return (
    <div className="fixed z-40 hidden h-screen w-14 flex-col items-center justify-center gap-4 bg-zinc-950/50 md:flex">
      <img src={logo} alt="ov logo" className="w-10 pt-4" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <button
          title="Home"
          onClick={() =>
            setSearchParams((params) => {
              params.delete('tabs')
              return params
            })
          }
          data-active={active === '/'}
          className="group relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2 data-[active=true]:text-main"
        >
          <HouseSimple size={24} weight={active === '/' ? 'fill' : 'regular'} />
          <span className="pointer-events-none absolute left-[100%] w-fit scale-75 rounded bg-zinc-950/50 py-2 pr-2 opacity-0 backdrop-blur duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
            Home
          </span>
        </button>

        {user && (
          <button
            title="My Anime List"
            onClick={() => setSearchParams({ tabs: 'anime-list' })}
            data-active={active === 'anime-list'}
            className="group relative flex h-14 cursor-pointer items-center justify-center gap-1 whitespace-nowrap p-2 data-[active=true]:text-main"
          >
            <Video size={24} weight={active === 'anime-list' ? 'fill' : 'regular'} />
            <span className="pointer-events-none absolute left-[100%] w-fit scale-75 rounded bg-zinc-950/50 py-2 pr-2 opacity-0 backdrop-blur duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
              Anime List
            </span>
          </button>
        )}

        {user === null && (
          <a
            href={`https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ID_CLIENT}&response_type=token`}
            title="Sign in with AniList"
            className="group relative flex cursor-pointer items-center justify-center whitespace-nowrap px-2 transition"
          >
            <SignIn size={32} className="text-second" />
            <span className="pointer-events-none absolute left-[100%] w-fit scale-75 rounded bg-zinc-950/50 py-2 pr-2 text-second opacity-0 backdrop-blur-3xl duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
              Log in with AniList
            </span>
          </a>
        )}

        {user && (
          <button
            title="My profile"
            data-active={active === 'profile'}
            onClick={() => setSearchParams({ tabs: 'profile' })}
            className="group relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2 data-[active=true]:text-main"
          >
            <img src={user.avatar.medium} alt="avatar image user" className="w-8" />
            <span className="absolute left-[100%] w-fit scale-75 rounded bg-zinc-950/50 py-2 pr-2 opacity-0 backdrop-blur-3xl duration-100 group-hover:scale-100 group-hover:opacity-100 lg:block">
              Profile
            </span>
          </button>
        )}
      </div>

      <div className="hidden min-h-14 py-4">
        {location.hostname === 'localhost' && (
          <button
            title="force localhost oauth"
            className="flex flex-col text-zinc-400 hover:text-main"
            onClick={() => {
              window.location.href = `/#access_token=${import.meta.env.VITE_TOKEN}`
              window.location.reload()
            }}
          >
            <RocketLaunch size={32} />
          </button>
        )}
      </div>
    </div>
  )
}
