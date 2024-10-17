import { Link } from 'react-router-dom'
import { Subtitle } from '@/components/subtitle'
import { SwiperCoverCardsBellow } from './anime-section-cards'
import { SwiperSlide } from 'swiper/react'

type TAnimeRelationsProps = {
  edges: Array<{
    relationType: string
    node: {
      id: number
      title: {
        userPreferred: string
      }
      format: string
      coverImage: {
        large: string
      }
      type: string
    }
  }>
}

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

export function AnimeRelations({ edges }: TAnimeRelationsProps) {
  const sorttedEdges = edges.slice().sort((a, b) => {
    const indexA = order.indexOf(a.relationType)
    const indexB = order.indexOf(b.relationType)

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

  if (!edges.length) {
    return null
  }

  return (
    <div className="mt-4 flex flex-col">
      <Subtitle text="Relations" className="px-4" />

      <SwiperCoverCardsBellow>
        {sorttedEdges.map((edge) => {
          const { id, title, coverImage, format } = edge.node

          return (
            <SwiperSlide key={id}>
              <Link
                to={`/anime/${id}`}
                onClick={() => {
                  if (window.scrollY <= document.body.scrollHeight)
                    scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex cursor-pointer flex-col gap-1 py-1"
              >
                <div className="relative mb-2 aspect-[6/9] overflow-hidden rounded-lg shadow-md">
                  <img
                    src={coverImage.large}
                    alt={title.userPreferred}
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                    style={{
                      opacity: 0,
                      transitionDuration: '700ms',
                    }}
                    onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                  />

                  <div className="absolute right-0 top-0 rounded-bl-lg bg-zinc-950/70 p-1">
                    <span className="text-xs font-medium text-zinc-50">
                      {format ? format.replaceAll('_', ' ') : ''}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-zinc-950/70 p-1">
                    <span className="text-sm font-medium text-zinc-50">
                      {edge.relationType.replaceAll('_', ' ')}
                    </span>
                  </div>
                </div>

                <span className="line-clamp-2 text-center text-base">{title.userPreferred}</span>
              </Link>
            </SwiperSlide>
          )
        })}
      </SwiperCoverCardsBellow>
    </div>
  )
}
