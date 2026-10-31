import { Link, useLocation } from 'react-router'
import { HouseSimple, SignIn, Video } from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/use-auth'
import { ANILIST_AUTH_URL } from '@/lib/access-token'
import logo from '@/assets/logo-short.svg'

export function Sidebar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const active = pathname === '/list' ? 'anime-list' : pathname === '/profile' ? 'profile' : '/'

  return (
    <div className="bg-darkTxt/5 fixed z-40 hidden h-screen w-14 flex-col items-center justify-center backdrop-blur md:flex">
      <img src={logo} alt="ov logo" className="w-10 pt-4" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Link
          to="/"
          title="Home"
          data-active={active === '/'}
          className="group data-[active=true]:text-main relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2"
        >
          <HouseSimple size={24} weight={active === '/' ? 'fill' : 'regular'} />
          <span className="bg-darkBG pointer-events-none absolute left-[100%] w-fit scale-75 rounded-full px-4 py-2 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
            Home
          </span>
        </Link>

        {user && (
          <Link
            title="My Anime List"
            to="/list"
            data-active={active === 'anime-list'}
            className="group data-[active=true]:text-main relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2 whitespace-nowrap"
          >
            <Video size={24} weight={active === 'anime-list' ? 'fill' : 'regular'} />
            <span className="bg-darkBG pointer-events-none absolute left-[100%] w-fit scale-75 rounded-full px-4 py-2 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
              Anime List
            </span>
          </Link>
        )}

        {user === null && (
          <a
            href={ANILIST_AUTH_URL}
            title="Sign in with AniList"
            className="group relative flex cursor-pointer items-center justify-center px-2 whitespace-nowrap transition"
          >
            <SignIn size={32} className="text-second" />
            <span className="text-second pointer-events-none absolute left-[100%] w-fit scale-75 rounded bg-zinc-950/50 py-2 pr-2 opacity-0 backdrop-blur-3xl duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
              Log in with AniList
            </span>
          </a>
        )}

        {user && (
          <Link
            title="My profile"
            data-active={active === 'profile'}
            to="/profile"
            className="group data-[active=true]:ring-main data-[active=true]:text-main relative flex aspect-square h-14 cursor-pointer items-center justify-center rounded-full ring"
          >
            <img
              src={user.avatar.medium ?? undefined}
              alt="avatar image user"
              className="w-full rounded-full"
            />
            <span className="bg-darkBG pointer-events-none absolute left-[100%] w-fit scale-75 rounded-full px-4 py-2 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block">
              Profile
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}
