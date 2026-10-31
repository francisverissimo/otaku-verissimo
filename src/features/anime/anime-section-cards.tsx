import { ReactNode } from "react";
import { Swiper } from "swiper/react";
import { Pagination } from "swiper/modules";

type SwiperCoverCardsBellowProps = {
  children: ReactNode;
};

export function SwiperCoverCardsBellow({
  children,
}: SwiperCoverCardsBellowProps) {
  return (
    <div className="w-full">
      <Swiper
        slidesPerView={3}
        spaceBetween={16}
        pagination={{ dynamicBullets: true }}
        modules={[Pagination]}
        breakpoints={{
          480: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 6,
          },
        }}
        style={{ paddingBottom: 24, paddingInline: 16 }}
      >
        {children}
      </Swiper>
    </div>
  );
}
