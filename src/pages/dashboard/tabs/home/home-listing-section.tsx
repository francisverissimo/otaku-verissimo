import { SwiperSlide } from 'swiper/react'
import { Subtitle } from '@/components/subtitle'
import { PageMediaCoverCard } from '@/components/page-media-cover-card'
import { SwiperSectionHome } from '@/components/swiper-section-home'
import { TPageMedia } from '@/types/t-page-media'

type THomeListingSectionProps = {
  title: string
  mediasArray: TPageMedia[]
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

      <SwiperSectionHome>
        {mediasArray.map((media, index) => {
          return (
            <SwiperSlide key={index}>
              <PageMediaCoverCard anime={media} />
            </SwiperSlide>
          )
        })}
      </SwiperSectionHome>
    </div>
  )
}
