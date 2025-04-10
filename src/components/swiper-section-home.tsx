import { ReactNode } from 'react'
import { Swiper } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

type TSwiperSectionHomeProps = {
  children: ReactNode[]
}

export function SwiperSectionHome({ children }: TSwiperSectionHomeProps) {
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={12}
      pagination={{ dynamicBullets: true }}
      modules={[Pagination]}
      breakpoints={{
        360: {
          slidesPerView: 3,
        },
        480: {
          slidesPerView: 4,
        },
        768: {
          slidesPerView: 5,
        },
      }}
      style={{ paddingBottom: 24, paddingInline: 8 }}
    >
      {children}
    </Swiper>
  )
}
