import { useEffect } from 'react'
import { Image } from '@/components/image'
import { Link } from 'react-router'
import { Subtitle } from '@/components/subtitle'
import { LoadMoreTrigger } from '@/components/load-more-trigger'
import { useAnimeStaff } from './anime-queries'
import { useAnimeRoute } from './use-anime-route'

export function AnimeStaffTab() {
  const anime = useAnimeRoute()
  const {
    data: staff,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAnimeStaff(anime.id, anime.staff)

  useEffect(() => {
    const elementHeader = document.querySelector('#staff_header')
    if (elementHeader) elementHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4">
      <Subtitle
        as="h2"
        id="staff_header"
        className="text-main font-raleway block py-4 text-center text-2xl font-medium uppercase underline underline-offset-4 md:pt-4"
      >
        staff
      </Subtitle>

      <div className="grid gap-4 pb-2 md:grid-cols-2">
        {staff.map((member) => (
          <div
            key={member.edgeId}
            className="bg-darkTxt/10 flex h-36 overflow-hidden rounded-lg shadow-lg md:h-40"
          >
            <div className="flex flex-1">
              {member.image && (
                <Link to={`/staff/${member.id}`}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="h-full w-28 object-cover md:w-32"
                  />
                </Link>
              )}

              <div className="flex flex-1 gap-1 p-2">
                <div className="flex w-full flex-col gap-1">
                  <Link className="font-medium" to={`/staff/${member.id}`}>
                    {member.name}
                  </Link>

                  <span className="text-second line-clamp-3 md:line-clamp-4">{member.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
