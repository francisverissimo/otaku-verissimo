import { Link } from 'react-router'
import { SignIn } from '@phosphor-icons/react'
import { ANILIST_AUTH_URL } from '@/lib/access-token'
import { PROFILE_PATH, useDashboardNav } from './nav-items'

export function BottomBar() {
  const { user, items, isActive } = useDashboardNav()

  return (
    <div className="fixed right-0 bottom-0 left-0 z-30 h-14 bg-zinc-950/50 backdrop-blur duration-300 sm:block md:hidden md:h-28">
      <div className="group mx-auto flex h-full w-full max-w-5xl items-center justify-center px-4">
        {items.map(({ to, label, title, icon: NavIcon }) => (
          <Link
            key={to}
            to={to}
            title={title}
            data-active={isActive(to)}
            className="data-[active=true]:text-main flex h-14 cursor-pointer items-center justify-center gap-1 p-2"
          >
            <NavIcon size={24} weight={isActive(to) ? 'fill' : 'regular'} />
            <span className="text-sm">{label}</span>
          </Link>
        ))}

        {user === null && (
          <a
            href={ANILIST_AUTH_URL}
            title="Sign in with AniList"
            className="flex h-full cursor-pointer items-center justify-center px-2 transition"
          >
            <SignIn size={32} className="text-second" />
            <span className="text-second text-center">Log in with AniList</span>
          </a>
        )}

        {user && (
          <Link
            title="My profile"
            data-active={isActive(PROFILE_PATH)}
            to={PROFILE_PATH}
            className="data-[active=true]:text-main flex h-full cursor-pointer items-center justify-center gap-1 p-2 md:h-28 md:w-28"
          >
            <img
              src={user.avatar.medium ?? undefined}
              alt="avatar image user"
              className="w-10 rounded-full"
            />
            <span>Profile</span>
          </Link>
        )}
      </div>
    </div>
  )
}
