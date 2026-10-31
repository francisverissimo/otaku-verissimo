import { SwiperSlide } from 'swiper/react'
import { Carousel } from '@/components/carousel'
import { Subtitle } from '@/components/subtitle'
import { MediaCoverCard } from '@/components/media-cover-card'
import type { MediaCoverCardData } from '@/components/media-cover-card-fragment'

type THomeListingSectionProps = {
  title: string
  mediasArray: MediaCoverCardData[]
}

export function HomeListingSection({ title, mediasArray }: THomeListingSectionProps) {
  return (
    <div>
      <div className="mx-auto my-2 flex items-center justify-between px-4">
        <Subtitle className="font-raleway text-main py-4 text-xl font-semibold uppercase underline underline-offset-8">
          {title}
        </Subtitle>

        {/* <button
        onClick={() => navigate(`/${/anime/?sort=TRENDING_DESC}`)}
        className="uppercase h-fit text-xs hover:text-zinc-600 font-medium duration-100"
      >
        view all
      </button> */}
      </div>

      <Carousel variant="cards">
        {mediasArray.map((media, index) => {
          return (
            <SwiperSlide key={index}>
              <MediaCoverCard anime={media} />
            </SwiperSlide>
          )
        })}
      </Carousel>
    </div>
  )
}
