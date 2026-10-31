import { Link } from 'react-router'
import { SignIn } from '@phosphor-icons/react'
import { ANILIST_AUTH_URL } from '@/lib/access-token'
import { PROFILE_PATH, useDashboardNav } from './nav-items'
import logo from '@/assets/logo-short.svg'

const tooltipClass =
  'bg-darkBG pointer-events-none absolute left-[100%] w-fit scale-75 rounded-full px-4 py-2 opacity-0 duration-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 lg:block'

export function Sidebar() {
  const { user, items, isActive } = useDashboardNav()

  return (
    <div className="bg-darkTxt/5 fixed z-40 hidden h-screen w-14 flex-col items-center justify-center backdrop-blur md:flex">
      <img src={logo} alt="ov logo" className="w-10 pt-4" />

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {items.map(({ to, label, title, icon: NavIcon }) => (
          <Link
            key={to}
            to={to}
            title={title}
            data-active={isActive(to)}
            className="group data-[active=true]:text-main relative flex h-14 cursor-pointer items-center justify-center gap-1 p-2 whitespace-nowrap"
          >
            <NavIcon size={24} weight={isActive(to) ? 'fill' : 'regular'} />
            <span className={tooltipClass}>{label}</span>
          </Link>
        ))}

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
            data-active={isActive(PROFILE_PATH)}
            to={PROFILE_PATH}
            className="group data-[active=true]:ring-main data-[active=true]:text-main relative flex aspect-square h-14 cursor-pointer items-center justify-center rounded-full ring"
          >
            <img
              src={user.avatar.medium ?? undefined}
              alt="avatar image user"
              className="w-full rounded-full"
            />
            <span className={tooltipClass}>Profile</span>
          </Link>
        )}
      </div>
    </div>
  )
}
