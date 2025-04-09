import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Heart, Star } from '@phosphor-icons/react'
import { GET_MEDIA_QUERY } from '@/lib/queries/media-query'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/ErroFallback'
import { Footer } from '@/components/footer'
import { isContrastAppropriate } from '@/utils/is-contrast-appropriate'
import { TMediaResultQuery } from '@/types/t-media'
import { AnimeHeader as Header } from './anime-header'
import { AnimeContent } from './anime-content'

export function Anime() {
  const { id } = useParams() as { id: string }

  const { data, error, loading, refetch } = useQuery<TMediaResultQuery>(GET_MEDIA_QUERY, {
    variables: { id },
  })

  if (loading || !data) {
    return <Loading />
  }

  if (error) {
    return <ErrorFallback error={error} onRetry={refetch} />
  }

  const anime = data.Media
  const accentColor = isContrastAppropriate(anime.coverImage.color)

  const isToBeAnnounced = !anime.startDate.day && !anime.startDate.month && !anime.startDate.year

  return (
    <div className="flex min-h-screen flex-col">
      <>
        <Header />

        {anime.bannerImage ? (
          <div className="relative">
            <img
              src={anime.bannerImage}
              className="h-80 w-full object-cover object-center md:h-96"
              alt="anime banner image"
              loading="lazy"
              style={{
                opacity: 0,
                transitionDuration: '1000ms',
              }}
              onLoad={(t) => (t.currentTarget.style.opacity = '1')}
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
                anime.bannerImage && '-mt-40 md:-mt-36'
              }`}
            >
              <img
                src={anime.coverImage.large}
                alt={anime.title.userPreferred}
                className="h-full w-full"
                loading="lazy"
                style={{
                  opacity: 0,
                  transitionDuration: '800ms',
                }}
                onLoad={(t) => {
                  t.currentTarget.style.opacity = '1'
                  // if (t.currentTarget.width >= t.currentTarget.height) {
                  //   const animeCoverEl = document.querySelector('#anime_cover')
                  //   // animeCoverEl?.classList.add('max-w-[320px]')
                  //   // animeCoverEl?.classList.add('w-full')
                  // }
                }}
              />
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
              style={{ color: accentColor }}
            >
              {anime.title.userPreferred}
            </h1>

            {isToBeAnnounced && <span className="peer">To Be Announced</span>}

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

        <AnimeContent anime={anime} />

        <Footer />
      </>
    </div>
  )
}
