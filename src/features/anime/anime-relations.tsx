import { SwiperSlide } from 'swiper/react'
import { MediaCard, MediaCardBadge, MediaCardCover, MediaCardTitle } from '@/components/media-card'
import { Carousel } from '@/components/carousel'
import type { AnimeView } from './anime-queries'
import { Subtitle } from '@/components/subtitle'

type TAnimeRelationsProps = { relations: AnimeView['relations'] }

const order = [
  'ADAPTATION',
  'PREQUEL',
  'SEQUEL',
  'PARENT',
  'SIDE_STORY',
  'CHARACTER',
  'SUMMARY',
  'ALTERNATIVE',
  'SPIN_OFF',
  'OTHER',
]

export function AnimeRelations({ relations }: TAnimeRelationsProps) {
  const sortedRelations = relations.slice().sort((a, b) => {
    const indexA = order.indexOf(a.relationType ?? '')
    const indexB = order.indexOf(b.relationType ?? '')

    if (indexA === -1 && indexB === -1) {
      return 0 // Se ambos os tipos de relação não estiverem presentes na ordem, mantenha a ordem original
    } else if (indexA === -1) {
      return 1 // Se o tipo de relação de 'a' não estiver presente na ordem, mova 'a' para o final
    } else if (indexB === -1) {
      return -1 // Se o tipo de relação de 'b' não estiver presente na ordem, mova 'b' para o final
    } else {
      return indexA - indexB // Ordena com base nos índices na ordem
    }
  })

  if (!relations.length) {
    return null
  }

  return (
    <div className="flex flex-col">
      <Subtitle className="font-raleway p-4 text-xl font-semibold uppercase underline underline-offset-4">
        relations
      </Subtitle>

      <Carousel variant="covers">
        {sortedRelations.map(({ id, title, cover, format, relationType }) => {
          return (
            <SwiperSlide key={id}>
              <MediaCard to={`/anime/${id}`}>
                <MediaCardCover src={cover} alt={title}>
                  {format && (
                    <MediaCardBadge position="top-right">
                      {format.replace(/_/g, ' ')}
                    </MediaCardBadge>
                  )}
                  {relationType && (
                    <MediaCardBadge position="bottom">
                      {relationType.replace(/_/g, ' ')}
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
