import { useEffect } from 'react'
import { MediaCard, MediaCardCover, MediaCardTitle } from '@/components/media-card'
import { Carousel } from '@/components/carousel'
import { Image } from '@/components/image'
import { Link, useParams } from 'react-router'
import { Heart } from '@phosphor-icons/react'
import { Footer } from '@/components/footer'
import { SwiperSlide } from 'swiper/react'
import { useCharacter } from './character-queries'

export function CharacterPage() {
  const { id } = useParams() as { id: string }

  const { data: character, error } = useCharacter(Number(id))

  useEffect(() => {
    scrollTo({ top: 0 })
  }, [])

  if (error)
    return (
      <div className="m-auto flex flex-col bg-zinc-50 p-4 shadow-xl">
        <strong>{error.name}</strong>
        <span>{error.message}</span>
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col justify-between pt-20">
      {character && (
        <div className="mx-auto mb-auto flex w-full max-w-5xl flex-col gap-2 py-4">
          <div className="flex flex-col items-center">
            <strong className="text-2xl">{character.name}</strong>
            <span>{character.nativeName}</span>
          </div>

          <div className="min-h-[312px] place-self-center">
            <Image
              src={character.image}
              alt={character.name}
              className="w-52 rounded-lg shadow-lg"
            />
          </div>

          {character.favourites > 0 && (
            <div className="flex min-h-[22px] items-center gap-1 place-self-center">
              <Heart size={22} weight="fill" className="text-red-600" />
              <span className="font-medium">{character.favourites}</span>
            </div>
          )}

          {character.voiceActors.length > 0 && (
            <div className="flex flex-col gap-4 pb-4">
              <strong className="px-4 text-lg font-medium">Voices Actors</strong>

              <Carousel variant="avatars">
                {character.voiceActors.map((voiceActor) => (
                  <SwiperSlide key={voiceActor.id}>
                    <Link to={`/staff/${voiceActor.id}`}>
                      <div className="flex w-28 flex-col">
                        <div className="h-28 w-full overflow-hidden rounded-full bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300">
                          <Image
                            src={voiceActor.image}
                            alt={voiceActor.name}
                            className="h-28 w-full rounded-full object-cover shadow-lg shadow-black/10"
                          />
                        </div>

                        <span className="mt-2 line-clamp-2 text-center font-medium">
                          {voiceActor.name}
                        </span>

                        <span className="text-main line-clamp-2 text-center font-medium">
                          {voiceActor.language}
                        </span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Carousel>
            </div>
          )}

          <div className="flex flex-col gap-4 px-4">
            <strong className="text-lg font-medium">Series</strong>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-4 lg:grid-cols-[repeat(auto-fill,160px)]">
              {character.media.map((media) => (
                <MediaCard
                  key={media.id}
                  to={media.type === 'ANIME' ? `/anime/${media.id}` : undefined}
                >
                  <MediaCardCover src={media.cover} alt={media.title} />
                  <MediaCardTitle>{media.title}</MediaCardTitle>
                </MediaCard>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
