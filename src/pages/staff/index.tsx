import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Heart } from '@phosphor-icons/react'
import {
  GET_STAFF_QUERY,
  GET_STAFF_CHARACTERS_PAGINATION,
  GET_STAFF_STAFF_MEDIA_PAGINATION,
} from '@/lib/queries/staff-query'
import { StaffModel } from '@/types'
import { CollapseParagraph } from '@/components/collapse-paragraph'
import { Footer } from '@/components/footer'
import { staffMediaRolesUtils as staffUtils } from '@/utils/staff-media-roles'
import { formatDateToString } from '@/utils/format-date-to-string'

export function Staff() {
  const { id } = useParams() as { id: string }

  const { data, error, fetchMore } = useQuery(GET_STAFF_QUERY, {
    variables: { id },
    notifyOnNetworkStatusChange: true,
    onError(error) {
      console.error(error)
    },
  })

  const staff: StaffModel = data && data.Staff

  return (
    <div className="flex min-h-screen flex-col justify-between pt-20">
      <div className="my-auto flex flex-col gap-2">
        {error && (
          <div className="mx-auto my-4 flex flex-col rounded bg-zinc-50 p-4 shadow-xl">
            <strong>{error.name}</strong>
            <span>{error.message}</span>
          </div>
        )}

        {staff && (
          <div>
            <div className="px-4 py-4">
              <div className="mx-auto flex max-w-5xl flex-col md:flex-row">
                <div className="flex flex-col-reverse gap-2 md:flex-col">
                  <div className="mx-auto min-w-max">
                    <img
                      src={staff.image.large}
                      alt={staff.name.full}
                      loading="lazy"
                      style={{
                        opacity: 0,
                        transitionDuration: '700ms',
                      }}
                      onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                      className="w-56 rounded-2xl shadow-lg"
                    />
                  </div>

                  {staff.favourites > 0 && (
                    <div className="flex min-h-[22px] items-center gap-1 place-self-center">
                      <Heart size={22} weight="fill" className="text-red-600" />
                      <span className="text-sm font-medium">{staff.favourites}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 py-4 md:px-4">
                  <div className="mb-4 flex flex-col items-center gap-1 md:items-start">
                    <strong className="text-2xl">{staff.name.full}</strong>
                    <span>{staff.name.native}</span>
                  </div>

                  {staff.dateOfBirth && (
                    <div>
                      <span className="font-medium">Birth: </span>
                      <span>
                        {formatDateToString(
                          staff.dateOfBirth.year,
                          staff.dateOfBirth.month,
                          staff.dateOfBirth.day
                        )}
                      </span>
                    </div>
                  )}

                  {staff.age && (
                    <div>
                      <span className="font-medium">Age: </span>
                      <span>{staff.age}</span>
                    </div>
                  )}

                  {staff.gender && (
                    <div>
                      <span className="font-medium">Gender: </span>
                      <span>{staff.gender}</span>
                    </div>
                  )}

                  {staff.yearsActive && staff.yearsActive.length > 0 && (
                    <div>
                      <span className="font-medium">Years active: </span>
                      <span>
                        {staff.yearsActive.length > 1
                          ? staff.yearsActive.map((year) => <span key={year}>{year}</span>)
                          : `${staff.yearsActive[0]} - Present`}
                      </span>
                    </div>
                  )}

                  {staff.homeTown && (
                    <div>
                      <span className="font-medium">Hometown: </span>
                      <span>{staff.homeTown}</span>
                    </div>
                  )}

                  {staff.bloodType && (
                    <div>
                      <span className="font-medium">Blood Type: </span>
                      <span>{staff.bloodType}</span>
                    </div>
                  )}

                  {staff.description && (
                    <CollapseParagraph
                      description={staff.description}
                      className="[&_a]:text-main flex flex-col gap-1 text-justify"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              {staff.characters.edges.length > 0 && (
                <div className="px-4">
                  <div className="mx-auto flex max-w-5xl flex-col gap-8 py-4">
                    {staff.characters.edges.map((edge, index, array) => (
                      <div className="grid flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <div className="overflow-hidden rounded-full bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300 shadow-md shadow-black/20">
                            <Link to={`/character/${edge.node.id}`}>
                              <img
                                src={edge.node.image.large}
                                alt={edge.node.name.full}
                                className="h-24 w-24 object-cover md:h-28 md:w-28"
                                loading="lazy"
                                style={{
                                  opacity: 0,
                                  transitionDuration: '700ms',
                                }}
                                onLoad={(t) => {
                                  t.currentTarget.style.opacity = '1'
                                }}
                              />
                            </Link>
                          </div>

                          <div className="flex flex-1 flex-col">
                            <Link to={`/character/${edge.node.id}`} className="w-fit">
                              <span className="text-lg font-medium break-all">
                                {edge.node.name.full}
                              </span>
                            </Link>
                            <span className="text-main text-sm">{edge.role}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,176px)]">
                          {edge.media.map((media, index) => (
                            <Link key={index} to={`/anime/${media.id}`}>
                              <div className="rounded">
                                <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                                  <img
                                    src={media.coverImage.large}
                                    alt={media.title.userPreferred}
                                    loading="lazy"
                                    style={{
                                      opacity: 0,
                                      aspectRatio: '6/9',
                                      objectFit: 'cover',
                                      width: '100%',
                                      transitionDuration: '700ms',
                                    }}
                                    onLoad={(t) => {
                                      t.currentTarget.style.opacity = '1'
                                    }}
                                    className="rounded shadow-lg shadow-black/20"
                                  />
                                </div>

                                <div className="top-0 right-0 left-0 flex items-center pt-2">
                                  <span className="text-main text-sm">
                                    {media.format ? media.format.replace(/_/g, ' ') : ''}
                                  </span>
                                </div>

                                <div className="right-0 bottom-0 left-0 flex items-center">
                                  <span className="line-clamp-2 min-h-[20px] text-sm font-medium">
                                    {media.title.userPreferred}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* {isLoading && <StaffCharactersSkeleton />} */}
                  </div>

                  {/* {!isLoading && staff.characters.pageInfo.hasNextPage && (
                    <IntersectionObserverComponent
                      callback={() => {
                        setIsLoading(true)

                        fetchMore({
                          query: GET_STAFF_CHARACTERS_PAGINATION,
                          variables: {
                            charactersPage: staff.characters.pageInfo.currentPage + 1,
                            id: staff.id,
                          },
                          updateQuery(pv, { fetchMoreResult }) {
                            if (!fetchMoreResult) return pv
                            return {
                              Staff: {
                                ...pv.Staff,
                                characters: {
                                  ...fetchMoreResult.Staff.characters,
                                  edges: [
                                    ...pv.Staff.characters.edges,
                                    ...fetchMoreResult.Staff.characters.edges,
                                  ],
                                },
                              },
                            }
                          },
                        })
                      }}
                      page={staff.characters.pageInfo.currentPage}
                    />
                  )} */}
                </div>
              )}
            </div>

            <div>
              {staff.staffMedia.edges.length > 0 && !staff.characters.pageInfo.hasNextPage && (
                <div className="px-4 py-4">
                  <div className="mx-auto flex max-w-5xl flex-col gap-4">
                    <div className="grid flex-col gap-4 rounded">
                      <strong className="border-main/70 w-fit border-t-4 font-sans text-lg font-medium uppercase">
                        Anime Staff Roles
                      </strong>

                      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,176px)]">
                        {staffUtils
                          .sort(staffUtils.group(staff.staffMedia.edges))
                          .map((edge, index) => {
                            const { id, coverImage, startDate, title } = edge.node
                            return (
                              <Link to={`/anime/${id}`} key={index}>
                                <div className="flex flex-col gap-2">
                                  <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                                    <img
                                      src={coverImage.large}
                                      alt={title.userPreferred}
                                      loading="lazy"
                                      style={{
                                        opacity: 0,
                                        aspectRatio: '6/9',
                                        objectFit: 'cover',
                                        width: '100%',
                                        transitionDuration: '700ms',
                                      }}
                                      onLoad={(t) => {
                                        t.currentTarget.style.opacity = '1'
                                      }}
                                      className="rounded shadow-md shadow-black/20"
                                    />
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    <span className="text-md font-medium text-sky-400">
                                      {startDate.year}
                                    </span>

                                    <span className="text-main line-clamp-2 text-xs font-medium">
                                      {title.userPreferred}
                                    </span>

                                    <div className="flex flex-col gap-1">
                                      {edge.staffRoles.map((staffRole, index) => (
                                        <span
                                          key={index}
                                          className="line-clamp-1 text-xs font-medium"
                                          title={staffRole}
                                        >
                                          {staffRole}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )
                          })}

                        {/* {isLoading && <StaffAnimeStaffRolesSkeleton />} */}
                      </div>
                    </div>
                  </div>

                  {/* {!isLoading && staff.staffMedia.pageInfo.hasNextPage && (
                    <IntersectionObserverComponent
                      callback={() => {
                        setIsLoading(true)

                        fetchMore({
                          query: GET_STAFF_STAFF_MEDIA_PAGINATION,
                          variables: {
                            staffMediaPage: staff.staffMedia.pageInfo.currentPage + 1,
                            id: staff.id,
                          },
                          updateQuery(pv, { fetchMoreResult }) {
                            if (!fetchMoreResult) return pv

                            return {
                              Staff: {
                                ...pv.Staff,
                                staffMedia: {
                                  ...fetchMoreResult.Staff.staffMedia,
                                  edges: [
                                    ...pv.Staff.staffMedia.edges,
                                    ...fetchMoreResult.Staff.staffMedia.edges,
                                  ],
                                },
                              },
                            }
                          },
                        })
                      }}
                      page={staff.staffMedia.pageInfo.currentPage}
                    />
                  )} */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
