import { Link } from 'react-router'
import { SignIn, HouseSimple } from '@phosphor-icons/react'
import { ANILIST_AUTH_URL } from '@/lib/access-token'
import logo from '@/assets/logo-short.svg'

export function UnauthenticatedView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-2">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Link to="/">
          <img src={logo} alt="otakuVERISSIMO" className="w-24 cursor-pointer self-center" />
        </Link>

        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-2xl">Log in with AniList to access.</span>
          <span className="text-2xl">Log in with your AniList account.</span>
        </div>

        <a
          href={ANILIST_AUTH_URL}
          title="Sign in with AniList"
          className="flex cursor-pointer items-center justify-center rounded bg-gradient-to-r from-sky-600 via-cyan-500 to-cyan-300 p-2 transition"
        >
          <SignIn size={40} className="text-black" />
          <span className="min-w-max p-1 text-center text-xl text-black">Log in with AniList</span>
        </a>

        <Link
          to="/"
          className="mx-auto mt-4 flex w-fit items-center justify-center gap-2 rounded-lg p-2 text-xl text-main transition hover:bg-main/10 hover:text-main"
        >
          <span className="text-zinc-200">or</span> back to home
          <HouseSimple weight="duotone" size={24} />
        </Link>
      </div>
    </div>
  )
}
