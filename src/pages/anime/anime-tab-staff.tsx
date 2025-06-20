import { Link } from 'react-router-dom'
import { TMedia } from '@/types/t-media'
import { useEffect } from 'react'
import { Subtitle } from '@/components/subtitle'
// import { IntersectionObserverComponent } from "@/components/intersection-observer-component";

type TAnimeTabStaffProps = {
  staff: TMedia['staff']
  mediaId: TMedia['id']
}

export function AnimeTabStaff({ staff, mediaId }: TAnimeTabStaffProps) {
  const { edges, pageInfo } = staff

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
        {edges.map((edge) => (
          <div
            key={edge.id}
            className="bg-darkTxt/10 flex h-36 overflow-hidden rounded-lg shadow-lg md:h-40"
          >
            <div className="flex flex-1">
              {edge.node.image && (
                <Link to={`/staff/${edge.node.id}`}>
                  <img
                    src={edge.node.image.medium}
                    alt={edge.node.name.full}
                    style={{
                      opacity: 0,
                      transitionDuration: '700ms',
                    }}
                    onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                    className="h-full w-28 object-cover md:w-32"
                  />
                </Link>
              )}

              <div className="flex flex-1 gap-1 p-2">
                <div className="flex w-full flex-col gap-1">
                  <Link className="font-medium" to={`/staff/${edge.node.id}`}>
                    {edge.node.name.full}
                  </Link>

                  <span className="text-second line-clamp-3 md:line-clamp-4">{edge.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* {isLoading && <HorizontalCardSkeleton />} */}
      </div>

      {/* {!isLoading && pageInfo.hasNextPage && (
          <IntersectionObserverComponent
            page={pageInfo.currentPage}
            callback={() => pagingFunction()}
          />
        )} */}
    </div>
  )
}
/** antigo fetchMore. Agora, trascreva-o para um useLazyQuery e atualize o cache */
// callback={() => {
//   fetchMore({
//     query: GET_MEDIA_STAFF_PAGINATION,
//     variables: {
//       staffPage: anime.staff.pageInfo.currentPage + 1,
//       id: anime.id,
//     },
//     updateQuery(pv, { fetchMoreResult }) {
//       if (!fetchMoreResult) return pv

//       return {
//         Media: {
//           ...pv.Media,
//           staff: {
//             ...fetchMoreResult.Media.staff,
//             edges: [...pv.Media.staff.edges, ...fetchMoreResult.Media.staff.edges],
//           },
//         },
//       }
//     },
//   })
// }}
