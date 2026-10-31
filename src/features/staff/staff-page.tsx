import { Link, useParams } from 'react-router'
import { MediaCard, MediaCardBadge, MediaCardCover, MediaCardTitle } from '@/components/media-card'
import { Image } from '@/components/image'
import { Heart } from '@phosphor-icons/react'
import { CollapseParagraph } from '@/components/collapse-paragraph'
import { DefaultLoading as Loading } from '@/components/loading'
import { ErrorFallback } from '@/components/error-fallback'
import { Footer } from '@/components/footer'
import { LoadMoreTrigger } from '@/components/load-more-trigger'
import { groupStaffMediaRoles, sortByStartDateDesc } from './staff-media-roles'
import { formatDateToString } from '@/lib/format-date-to-string'
import { useStaff, useStaffCharacters, useStaffMediaRoles, type StaffView } from './staff-queries'

export function StaffPage() {
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
                    <Image
                      src={staff.image}
                      alt={staff.name}
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
                      <Image
                        src={character.image}
                        alt={character.name}
                        className="h-24 w-24 object-cover md:h-28 md:w-28"
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
                    <MediaCard key={media.id} to={`/anime/${media.id}`}>
                      <MediaCardCover src={media.cover} alt={media.title}>
                        {media.format && (
                          <MediaCardBadge position="top-right">
                            {media.format.replace(/_/g, ' ')}
                          </MediaCardBadge>
                        )}
                      </MediaCardCover>
                      <MediaCardTitle>{media.title}</MediaCardTitle>
                    </MediaCard>
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
                <MediaCard key={id} to={`/anime/${id}`}>
                  <MediaCardCover src={cover} alt={title}>
                    {startDate.year && (
                      <MediaCardBadge position="top-left">{startDate.year}</MediaCardBadge>
                    )}
                  </MediaCardCover>

                  <MediaCardTitle>{title}</MediaCardTitle>

                  {role.staffRoles.map((staffRole, index) => (
                    <span
                      key={index}
                      className="text-main line-clamp-1 text-xs font-medium"
                      title={staffRole}
                    >
                      {staffRole}
                    </span>
                  ))}
                </MediaCard>
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
