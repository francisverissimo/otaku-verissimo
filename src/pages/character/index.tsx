import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Heart } from '@phosphor-icons/react'
import { GET_CHARACTER_QUERY } from '@/lib/queries/character-query'
import { Footer } from '@/components/footer'
import { CharacterModel } from '@/types'
import { SwiperHorizontal } from '@/components/swiper-horizontal'
import { SwiperSlide } from 'swiper/react'

export function Character() {
  const { id } = useParams() as { id: string }

  const { data, error } = useQuery(GET_CHARACTER_QUERY, {
    variables: { id },
    notifyOnNetworkStatusChange: true,
    onError(error) {
      console.error(error)
    },
  })

  const character: CharacterModel = data && data.Character

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
            <strong className="text-2xl">{character.name.full}</strong>
            <span>{character.name.native}</span>
          </div>

          <div className="min-h-[312px] place-self-center">
            <img
              src={character.image.large}
              alt={character.name.full}
              loading="lazy"
              style={{
                opacity: 0,
                transitionDuration: '700ms',
              }}
              onLoad={(t) => (t.currentTarget.style.opacity = '1')}
              className="w-52 rounded-lg shadow-lg"
            />
          </div>

          {character.favourites > 0 && (
            <div className="flex min-h-[22px] items-center gap-1 place-self-center">
              <Heart size={22} weight="fill" className="text-red-600" />
              <span className="font-medium">{character.favourites}</span>
            </div>
          )}

          <div className="flex flex-col gap-4 pb-4">
            <strong className="px-4 text-lg font-medium">Voices Actors</strong>

            <SwiperHorizontal>
              {character.media.edges[0].voiceActors.map((voiceActor) => (
                <SwiperSlide key={voiceActor.id}>
                  <Link to={`/staff/${voiceActor.id}`}>
                    <div className="flex w-28 flex-col">
                      <div className="h-28 w-full overflow-hidden rounded-full bg-gradient-to-t from-zinc-600 via-zinc-400 to-zinc-300">
                        <img
                          src={voiceActor.image.large}
                          alt={voiceActor.name.full}
                          className="h-28 w-full rounded-full object-cover shadow-lg shadow-black/10"
                          loading="lazy"
                          style={{
                            opacity: 0,
                            transitionDuration: '700ms',
                          }}
                          onLoad={(t) => {
                            t.currentTarget.style.opacity = '1'
                          }}
                        />
                      </div>

                      <span className="mt-2 line-clamp-2 text-center font-medium">
                        {voiceActor.name.full}
                      </span>

                      <span className="line-clamp-2 text-center font-medium text-main">
                        {voiceActor.languageV2}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </SwiperHorizontal>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <strong className="text-lg font-medium">Series</strong>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] justify-between gap-x-4 gap-y-4 lg:grid-cols-[repeat(auto-fill,160px)]">
              {character.media.edges.map((edge) =>
                edge.node.type == 'ANIME' ? (
                  <Link key={edge.node.id} to={`/anime/${edge.node.id}`}>
                    <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                      <img
                        src={edge.node.coverImage.large}
                        alt={edge.node.title.userPreferred}
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

                    <span className="mt-2 line-clamp-2 min-h-[20px] text-sm font-medium">
                      {edge.node.title.userPreferred}
                    </span>
                  </Link>
                ) : (
                  <div key={edge.node.id}>
                    <div className="rounded bg-gradient-to-t from-orange-700 via-orange-600 to-orange-500">
                      <img
                        src={edge.node.coverImage.large}
                        alt={edge.node.title.userPreferred}
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

                    <span className="mt-2 line-clamp-2 min-h-[20px] text-sm font-medium">
                      {edge.node.title.userPreferred}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
