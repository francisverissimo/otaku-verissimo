import { Link, useParams } from 'react-router'
import { Heart } from '@phosphor-icons/react'
import { CollapseParagraph } from '@/components/collapse-paragraph'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/error-fallback'
import { Footer } from '@/components/footer'
import { LoadMoreTrigger } from '@/components/load-more-trigger'
import { groupStaffMediaRoles, sortByStartDateDesc } from '@/utils/staff-media-roles'
import { formatDateToString } from '@/utils/format-date-to-string'
import { useStaff, useStaffCharacters, useStaffMediaRoles, type StaffView } from './staff-queries'

export function Staff() {
  const { id } = useParams() as { id: string }

  const { data: staff, error, isPending, refetch } = useStaff(Number(id))

  return (
    <div className="flex min-h-screen flex-col justify-between pt-20">
      <div className="my-auto flex flex-col gap-2">
        {error && <ErrorFallback error={error} onRetry={refetch} />}

        {isPending && <Loading />}

        {staff && (
          <div>
            <div className="px-4 py-4">
              <div className="mx-auto flex max-w-5xl flex-col md:flex-row">
                <div className="flex flex-col-reverse gap-2 md:flex-col">
                  <div className="mx-auto min-w-max">
                    <img
                      src={staff.image ?? undefined}
                      alt={staff.name}
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
                    <strong className="text-2xl">{staff.name}</strong>
                    <span>{staff.nativeName}</span>
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

                  {staff.age != null && (
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

                  {staff.yearsActive.length > 0 && (
                    <div>
                      <span className="font-medium">Years active: </span>
                      <span>
                        {`${staff.yearsActive[0]} - ${staff.yearsActive[1] ?? 'Present'}`}
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

            <StaffCharacters staff={staff} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function StaffCharacters({ staff }: { staff: StaffView }) {
  const {
    data: characters,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useStaffCharacters(staff.id, staff.characters)

  return (
    <>
      {characters.length > 0 && (
        <div className="px-4">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 py-4">
            {characters.map((character, index) => (
              <div key={`${character.id}-${index}`} className="grid flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="overflow-hidden rounded-full bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300 shadow-md shadow-black/20">
                    <Link to={`/character/${character.id}`}>
                      <img
                        src={character.image ?? undefined}
                        alt={character.name}
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
                    <Link to={`/character/${character.id}`} className="w-fit">
                      <span className="text-lg font-medium break-all">{character.name}</span>
                    </Link>
                    <span className="text-main text-sm">{character.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,176px)]">
                  {character.media.map((media) => (
                    <Link key={media.id} to={`/anime/${media.id}`}>
                      <div className="rounded">
                        <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                          <img
                            src={media.cover ?? undefined}
                            alt={media.title}
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
                            {media.title}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
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
      )}

      {/* Roles sit below the characters, so they only load once every character is shown. */}
      {!hasNextPage && <StaffMediaRoles staff={staff} />}
    </>
  )
}

function StaffMediaRoles({ staff }: { staff: StaffView }) {
  const {
    data: roles,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useStaffMediaRoles(staff.id, staff.staffMedia)

  if (roles.length === 0) return null

  return (
    <div className="px-4 py-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <div className="grid flex-col gap-4 rounded">
          <strong className="border-main/70 w-fit border-t-4 font-sans text-lg font-medium uppercase">
            Anime Staff Roles
          </strong>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-8 md:grid-cols-[repeat(auto-fill,176px)]">
            {sortByStartDateDesc(groupStaffMediaRoles(roles)).map((role) => {
              const { id, cover, startDate, title } = role
              return (
                <Link to={`/anime/${id}`} key={id}>
                  <div className="flex flex-col gap-2">
                    <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                      <img
                        src={cover ?? undefined}
                        alt={title}
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
                      <span className="text-md font-medium text-sky-400">{startDate.year}</span>

                      <span className="text-main line-clamp-2 text-xs font-medium">{title}</span>

                      <div className="flex flex-col gap-1">
                        {role.staffRoles.map((staffRole, index) => (
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
          </div>
        </div>
      </div>

      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
