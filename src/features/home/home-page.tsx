import { useEffect } from 'react'
import { Link } from 'react-router'
import { seasonHandler as season } from '@/lib/season'
import { DefaultLoading as Loading } from '@/components/loading'
import { MagnifyingGlass, SquaresFour } from '@phosphor-icons/react'
import { HomeListingSection } from './home-listing-section'
import { useHomeMediaPage } from './home-queries'
import shortLogo from '@/assets/logo-short.svg'

export function HomePage() {
  const trending = useHomeMediaPage({ sort: 'TRENDING_DESC' })
  const thisSeason = useHomeMediaPage({
    season: season.getCurrentSeason(),
    seasonYear: season.getCurrentYear(),
    sort: 'POPULARITY_DESC',
  })
  const nextSeason = useHomeMediaPage({
    season: season.getNextSeason(),
    seasonYear: season.getNextYear(),
    sort: 'POPULARITY_DESC',
  })

  const isLoading = trending.isPending || thisSeason.isPending || nextSeason.isPending
  const hasError = trending.isError || thisSeason.isError || nextSeason.isError
  const bannerImage = trending.data?.find((media) => media.bannerImage)?.bannerImage

  useEffect(() => {
    // #homeBgTrending only exists once every section has loaded.
    const homeElement = document.getElementById('homeBgTrending')

    if (homeElement && bannerImage) {
      homeElement.style.backgroundImage = `url(${bannerImage})`
      homeElement.style.transform = 'scale(1)'
      homeElement.style.opacity = '0.3'
    }
  }, [bannerImage, isLoading])

  if (isLoading) {
    return <Loading />
  }

  if (hasError) {
    return (
      <strong className="flex w-full items-center justify-center p-4 text-2xl font-medium text-red-300 uppercase italic">
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
          <span className="text-main text-lg uppercase">search for some anime</span>
          <MagnifyingGlass size={24} className="text-main rotate-90" />
        </Link>
      </div>

      <div className="flex px-4 pt-2">
        <Link
          to="/seasonal"
          className="border-main/40 hover:bg-main/10 flex items-center gap-3 rounded-full border bg-zinc-950/40 py-2 pr-5 pl-3 backdrop-blur transition"
        >
          <SquaresFour size={28} weight="duotone" className="text-main" />
          <span className="flex flex-col leading-tight">
            <span className="font-medium">Seasonal Chart</span>
            <span className="text-xs text-zinc-400">
              Every anime of {season.getCurrentSeason().toLowerCase()} {season.getCurrentYear()}
            </span>
          </span>
        </Link>
      </div>

      {trending.data && thisSeason.data && nextSeason.data && (
        <div className="w-full">
          <HomeListingSection title="trending now" mediasArray={trending.data} />

          <HomeListingSection title="popular this season" mediasArray={thisSeason.data} />

          <HomeListingSection title="upcoming next season" mediasArray={nextSeason.data} />
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
