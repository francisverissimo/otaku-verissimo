import { Link } from 'react-router-dom'
import { GET_ANIME_PAGE_QUERY } from '@/lib/queries/anime-page-query'
import { seasonHandler as season } from '@/utils/season-handler'
import { HomeListingSection } from './home-listing-section'
import { MagnifyingGlass } from '@phosphor-icons/react'
import shortLogo from '@/assets/logo-short.svg'

export function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col pb-14">
      <div className="flex h-16 items-center justify-between gap-2 md:justify-end">
        <img src={shortLogo} alt="otakuVERISSIMO logo" className="mx-4 w-12 md:hidden" />

        <Link
          title="go to search page"
          className="flex h-full cursor-pointer items-center justify-center gap-1 p-4 transition hover:brightness-125"
          to="/search"
        >
          <span className="text-lg uppercase text-main">search for some anime</span>
          <MagnifyingGlass size={24} className="rotate-90 text-main" />
        </Link>
      </div>

      {/* {isLocalHost && (
        <>
          <button
            onClick={() => window.parent.postMessage("uma mensagem para você", "*")}
            className="my-4"
          >
            WindowParentPostMessage
          </button>

          <button
            onClick={handleLoginWithAniList}
            className="my-4 text-yellow-300"
          >
            windowAddEventListenerMessage
          </button>
        </>
      )} */}

      <div className="w-full">
        <HomeListingSection
          title="trending now"
          query={GET_ANIME_PAGE_QUERY}
          variables={{ perPage: 10, sort: 'TRENDING_DESC' }}
        />

        <HomeListingSection
          title="popular this season"
          query={GET_ANIME_PAGE_QUERY}
          variables={{
            perPage: 10,
            season: season.getCurrentSeason(),
            seasonYear: season.getCurrentYear(),
            sort: 'POPULARITY_DESC',
          }}
        />

        <HomeListingSection
          title="upcoming next season"
          query={GET_ANIME_PAGE_QUERY}
          variables={{
            perPage: 10,
            season: season.getNextSeason(),
            seasonYear: season.getNextYear(),
            sort: 'POPULARITY_DESC',
          }}
        />
      </div>
    </div>
  )
}
