import { Link } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import { Subtitle } from '@/components/subtitle'
import { Heart, Star } from '@phosphor-icons/react'
import { SwiperCoverCardsBellow } from './anime-section-cards'
import { TMedia } from '@/types/t-media'

type TAnimeRecommendationsProps = { edges: TMedia['recommendations']['edges'] }

export function AnimeRecommendations({ edges }: TAnimeRecommendationsProps) {
  if (!edges.length) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Subtitle className="font-raleway p-4 text-xl font-semibold uppercase underline underline-offset-4">
        recommendations
      </Subtitle>

      <SwiperCoverCardsBellow>
        {edges.map((edge) => {
          if (!edge.node.mediaRecommendation) {
            return null
          }

          const { id, title, coverImage, averageScore, favourites, format } =
            edge.node.mediaRecommendation

          if (edge.node.mediaRecommendation != null) {
            return (
              <SwiperSlide key={id}>
                <Link
                  to={`/anime/${id}`}
                  onClick={() => {
                    if (window.scrollY <= document.body.scrollHeight)
                      scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="group flex cursor-pointer flex-col gap-1"
                >
                  <div className="relative mb-2 aspect-[6/9] overflow-hidden rounded-lg bg-gradient-to-t shadow-lg">
                    <img
                      alt={title.userPreferred}
                      src={coverImage.large}
                      className="group-hover:border-main h-full w-full object-cover object-center"
                      loading="lazy"
                      style={{
                        opacity: 0,
                        transitionDuration: '700ms',
                      }}
                      onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                    />

                    {averageScore != null && (
                      <div className="absolute top-0 flex items-center gap-1 rounded-br-lg bg-zinc-950/60 p-1">
                        <Star size={18} weight="fill" className="text-yellow-400" />
                        <span className="text-sm font-medium text-zinc-50">
                          {averageScore > 0 ? averageScore : 0}
                        </span>
                      </div>
                    )}

                    {favourites && (
                      <div className="absolute bottom-0 flex items-center gap-1 rounded-tr-lg bg-zinc-950/60 p-1">
                        <Heart size={18} weight="fill" className="text-red-500" />
                        <span className="text-sm font-medium text-zinc-50">
                          {favourites > 0 ? favourites : 0}
                        </span>
                      </div>
                    )}

                    {format && (
                      <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg bg-zinc-950/60 p-1">
                        <span className="text-xs font-medium text-zinc-50">
                          {format.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="line-clamp-2 text-center text-sm md:text-base">
                    {title.userPreferred}
                  </span>
                </Link>
              </SwiperSlide>
            )
          }
        })}
      </SwiperCoverCardsBellow>
    </div>
  )
}
