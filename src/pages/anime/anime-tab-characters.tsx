import { useEffect } from 'react'
import { Link } from 'react-router'
import { Subtitle } from '@/components/subtitle'
import { LoadMoreTrigger } from '@/components/load-more-trigger'
import type { Page } from '@/lib/connection-page'
import { useAnimeCharacters, type AnimeCharacter } from './anime-queries'

type TAnimeTabCharactersProps = {
  animeId: number
  firstPage: Page<AnimeCharacter>
}

export function AnimeTabCharacters({ animeId, firstPage }: TAnimeTabCharactersProps) {
  const {
    data: characters,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAnimeCharacters(animeId, firstPage)

  useEffect(() => {
    const elementHeader = document.querySelector('#characters_header')
    if (elementHeader) elementHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4">
      <Subtitle
        id="characters_header"
        as="h2"
        className="text-main font-raleway block py-4 text-center text-2xl font-medium uppercase underline underline-offset-4 md:pt-4"
      >
        characters
      </Subtitle>

      <div className="grid gap-4 pb-2 md:grid-cols-2">
        {characters.map((character) => {
          if (!character.voiceActors.length) {
            return (
              <div
                key={character.id}
                className="bg-darkTxt/10 flex overflow-hidden rounded-lg shadow-lg"
              >
                <Link to={`/character/${character.id}`}>
                  <img
                    src={character.image ?? undefined}
                    alt={character.name}
                    style={{
                      opacity: 0,
                      transitionDuration: '600ms',
                    }}
                    onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                    className="h-full w-24 object-cover md:w-28"
                  />
                </Link>

                <div className="flex gap-1 p-2">
                  <div className="flex w-full flex-col gap-1">
                    <span className="font-medium">{character.name}</span>
                    <span className="text-main">{character.role}</span>
                  </div>
                </div>
              </div>
            )
          }

          return character.voiceActors.map((voiceActor) => (
            <div
              key={`${character.id}-${voiceActor.id}`}
              className="bg-darkTxt/10 flex h-36 justify-between overflow-hidden rounded-lg shadow-lg md:h-40"
            >
              <Link to={`/character/${character.id}`}>
                <img
                  src={character.image ?? undefined}
                  alt={character.name}
                  style={{
                    opacity: 0,
                    transitionDuration: '600ms',
                  }}
                  onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                  className="h-full w-24 object-cover md:w-28"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex w-full flex-col gap-1 p-2">
                  <Link
                    className="line-clamp-2 font-medium break-all"
                    to={`/character/${character.id}`}
                  >
                    {character.name}
                  </Link>
                  <span className="text-main">{character.role}</span>
                </div>

                <div className="flex w-fit flex-col place-self-end p-2">
                  {voiceActor.roleNotes && (
                    <span className="text-main text-end">{voiceActor.roleNotes}</span>
                  )}

                  <Link className="text-end font-medium" to={`/staff/${voiceActor.id}`}>
                    {voiceActor.name}
                  </Link>
                </div>
              </div>

              {voiceActor.image && (
                <Link to={`/staff/${voiceActor.id}`}>
                  <img
                    src={voiceActor.image}
                    alt={voiceActor.name}
                    style={{
                      opacity: 0,
                      transitionDuration: '600ms',
                    }}
                    onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                    className="h-full w-24 overflow-hidden object-cover md:w-28"
                  />
                </Link>
              )}
            </div>
          ))
        })}
      </div>

      <LoadMoreTrigger
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  )
}
