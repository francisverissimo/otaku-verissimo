import { Carousel } from '@/components/carousel'
import { MediaCard, MediaCardBadge, MediaCardCover, MediaCardTitle } from '@/components/media-card'
import { SwiperSlide } from 'swiper/react'
import { Subtitle } from '@/components/subtitle'
import { Heart, Star } from '@phosphor-icons/react'
import type { AnimeView } from './anime-queries'

type TAnimeRecommendationsProps = { recommendations: AnimeView['recommendations'] }

export function AnimeRecommendations({ recommendations }: TAnimeRecommendationsProps) {
  if (!recommendations.length) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Subtitle className="font-raleway p-4 text-xl font-semibold uppercase underline underline-offset-4">
        recommendations
      </Subtitle>

      <Carousel variant="covers">
        {recommendations.map(({ id, title, cover, averageScore, favourites, format }) => {
          return (
            <SwiperSlide key={id}>
              <MediaCard
                to={`/anime/${id}`}
                onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <MediaCardCover src={cover} alt={title}>
                  {averageScore != null && (
                    <MediaCardBadge position="top-left">
                      <Star size={16} weight="fill" className="text-yellow-400" />
                      {averageScore}
                    </MediaCardBadge>
                  )}
                  {format && (
                    <MediaCardBadge position="top-right">
                      {format.replace(/_/g, ' ')}
                    </MediaCardBadge>
                  )}
                  {favourites != null && favourites > 0 && (
                    <MediaCardBadge position="bottom-left">
                      <Heart size={16} weight="fill" className="text-red-500" />
                      {favourites}
                    </MediaCardBadge>
                  )}
                </MediaCardCover>

                <MediaCardTitle>{title}</MediaCardTitle>
              </MediaCard>
            </SwiperSlide>
          )
        })}
      </Carousel>
    </div>
  )
}
