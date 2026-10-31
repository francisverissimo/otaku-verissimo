import { Outlet, useParams } from 'react-router'
import { Image } from '@/components/image'
import { Heart, Star } from '@phosphor-icons/react'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/error-fallback'
import { Footer } from '@/components/footer'
import { getContrastSafeColor } from '@/lib/get-contrast-safe-color'
import { AnimeHeader as Header } from './anime-header'
import { AnimeNavigationTabs } from './anime-navigation-tabs'
import { useAnime, type AnimeView } from './anime-queries'

export function AnimePage() {
  const { id } = useParams() as { id: string }

  const { data: anime, error, isPending, refetch } = useAnime(Number(id))

  if (error) {
    return <ErrorFallback error={error} onRetry={refetch} />
  }

  if (isPending || !anime) {
    return <Loading />
  }

  const safeColor = getContrastSafeColor(anime.color)

  return (
    <div className="flex min-h-screen flex-col">
      <>
        <Header />

        {anime.banner ? (
          <div className="relative">
            <Image
              fadeMs={1000}
              src={anime.banner}
              className="h-80 w-full object-cover object-center md:h-96"
              alt="anime banner image"
            />

            <div className="absolute bottom-0 h-full w-full bg-gradient-to-r from-zinc-900 via-zinc-900/20 to-transparent md:w-[60%] md:via-zinc-800/70" />
          </div>
        ) : (
          <div className="h-20 w-full" />
        )}

        <div className="mx-auto flex w-full max-w-5xl flex-col md:flex-row md:pl-14">
          <div className="flex flex-col gap-2 px-4">
            <div
              className={`z-10 aspect-[6/9] w-48 place-self-center overflow-hidden rounded-lg shadow-lg md:w-56 ${
                anime.banner && '-mt-40 md:-mt-36'
              }`}
            >
              <Image src={anime.cover} alt={anime.title.userPreferred} className="h-full w-full" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-y-1 px-4 pt-4 md:items-start md:pl-0">
            <div className="flex gap-2">
              {anime.averageScore ? (
                <div className="flex items-center gap-1">
                  <Star size={24} weight="fill" className="text-yellow-400" />
                  <span className="text-sm">{anime.averageScore ?? 0}</span>
                </div>
              ) : null}

              {anime.favourites ? (
                <div className="flex items-center gap-1">
                  <Heart size={24} weight="fill" className="text-red-600" />
                  <span className="text-sm">{anime.favourites ?? 0}</span>
                </div>
              ) : null}
            </div>

            <h1
              className="line-clamp-2 text-center text-3xl md:text-left md:text-4xl"
              style={{ color: safeColor }}
            >
              {anime.title.userPreferred}
            </h1>

            {anime.isToBeAnnounced && <span className="peer">To Be Announced</span>}

            <div className="flex items-center gap-4">
              {anime.seasonYear && (
                <span className="text-second font-medium">{anime.seasonYear}</span>
              )}

              {anime.format && <span className="text-md">{anime.format}</span>}

              {anime.episodes && (
                <span className="text-md">{`${anime.episodes} ${
                  anime.episodes > 1 ? 'episodes' : 'episode'
                }`}</span>
              )}
            </div>
          </div>
        </div>

        <div className="divide-second/20 mx-auto w-full max-w-5xl flex-1 divide-y md:pl-14">
          <AnimeNavigationTabs />

          <Outlet context={anime satisfies AnimeView} />
        </div>

        <Footer />
      </>
    </div>
  )
}
