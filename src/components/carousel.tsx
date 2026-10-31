import { ReactNode } from 'react'
import { Swiper } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { SwiperOptions } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/pagination'

const presets = {
  /** Large cover cards (home sections). */
  cards: {
    slidesPerView: 2,
    spaceBetween: 12,
    paddingInline: 8,
    breakpoints: {
      360: { slidesPerView: 3 },
      480: { slidesPerView: 4 },
      768: { slidesPerView: 5 },
    },
  },
  /** Medium covers with a caption (relations, recommendations). */
  covers: {
    slidesPerView: 3,
    spaceBetween: 16,
    paddingInline: 16,
    breakpoints: {
      480: { slidesPerView: 4 },
      768: { slidesPerView: 5 },
      1024: { slidesPerView: 6 },
    },
  },
  /** Small round portraits (characters, voice actors). */
  avatars: {
    slidesPerView: 3,
    spaceBetween: 16,
    paddingInline: 16,
    breakpoints: {
      360: { slidesPerView: 4 },
      480: { slidesPerView: 5 },
      768: { slidesPerView: 6 },
      1024: { slidesPerView: 8 },
    },
  },
} satisfies Record<
  string,
  Pick<SwiperOptions, 'slidesPerView' | 'spaceBetween' | 'breakpoints'> & { paddingInline: number }
>

type CarouselProps = {
  variant: keyof typeof presets
  children: ReactNode
}

/** Horizontal carousel with pagination bullets. Wrap each item in `<SwiperSlide>`. */
export function Carousel({ variant, children }: CarouselProps) {
  const { paddingInline, ...options } = presets[variant]

  return (
    <div className="w-full">
      <Swiper
        {...options}
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        style={{ paddingBottom: 24, paddingInline }}
      >
        {children}
      </Swiper>
    </div>
  )
}
