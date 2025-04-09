import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import { GET_PAGE_MEDIA_QUERY } from '@/lib/queries/page-media-query'
import { seasonHandler as season } from '@/utils/season-handler'
import { DefaultLoading as Loading } from '@/components/loading'
import { TPageMediaResultQuery } from '@/types/t-page-media'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { HomeListingSection } from './home-listing-section'
import shortLogo from '@/assets/logo-short.svg'

export function Home() {
  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useQuery<TPageMediaResultQuery>(GET_PAGE_MEDIA_QUERY, {
    variables: { perPage: 10, sort: 'TRENDING_DESC' },
  })

  const {
    data: thisSeasonData,
    loading: thisSeasonLoading,
    error: thisSeasonError,
  } = useQuery<TPageMediaResultQuery>(GET_PAGE_MEDIA_QUERY, {
    variables: {
      perPage: 10,
      season: season.getCurrentSeason(),
      seasonYear: season.getCurrentYear(),
      sort: 'POPULARITY_DESC',
    },
  })

  const {
    data: nextSeasonData,
    loading: nextSeasonLoading,
    error: nextSeasonError,
  } = useQuery<TPageMediaResultQuery>(GET_PAGE_MEDIA_QUERY, {
    variables: {
      perPage: 10,
      season: season.getNextSeason(),
      seasonYear: season.getNextYear(),
      sort: 'POPULARITY_DESC',
    },
  })

  const isLoading = trendingLoading || thisSeasonLoading || nextSeasonLoading
  const hasError = trendingError || thisSeasonError || nextSeasonError

  useEffect(() => {
    if (trendingData) {
      const animeTrending = trendingData.Page.media.find((media) => media.bannerImage)

      const homeElement = document.getElementById('homeBgTrending')

      if (homeElement && animeTrending) {
        homeElement.style.backgroundImage = `url(${animeTrending.bannerImage})`
        homeElement.style.transform = 'scale(1)'
        homeElement.style.opacity = '0.3'
      }
    }
  }, [trendingData, thisSeasonData, nextSeasonData])

  if (isLoading) {
    return <Loading />
  }

  if (hasError) {
    return (
      <strong className="flex w-full items-center justify-center p-4 text-2xl font-medium uppercase italic text-red-300">
        Error occurred
      </strong>
    )
  }

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

      {trendingData && thisSeasonData && nextSeasonData && (
        <div className="w-full">
          <HomeListingSection title="trending now" mediasArray={trendingData.Page.media} />

          <HomeListingSection title="popular this season" mediasArray={thisSeasonData.Page.media} />

          <HomeListingSection
            title="upcoming next season"
            mediasArray={nextSeasonData.Page.media}
          />
        </div>
      )}

      <div
        id="homeBgTrending"
        style={{ transform: 'scale(0.9)', opacity: '0' }}
        className="fixed inset-0 -z-40 flex h-[35vh] w-full flex-col justify-between bg-cover bg-center bg-no-repeat duration-300 md:h-[50vh]"
      >
        <div className="h-[7vh] w-full bg-gradient-to-b from-zinc-900 to-transparent md:h-[10vh]" />
        <div className="h-[7vh] w-full bg-gradient-to-t from-zinc-900 to-transparent md:h-[10vh]" />
      </div>
    </div>
  )
}
