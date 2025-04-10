import { useLazyQuery } from '@apollo/client'
import { GET_MEDIA_CHARACTERS_PAGINATION } from '@/lib/queries/media-query'
import { TMedia } from '@/types/t-media'
import { Link } from 'react-router-dom'
import { Subtitle } from '@/components/subtitle'
import { useEffect } from 'react'
// import { HorizontalCardSkeleton } from '../../components/loading'
// import { IntersectionObserverComponent } from '../../components/intersection-observer-component'

type TAnimeTabCharactersProps = {
  characters: TMedia['characters']
  mediaId: TMedia['id']
}

export function AnimeTabCharacters({ characters, mediaId }: TAnimeTabCharactersProps) {
  const { edges, pageInfo } = characters

  // console.log(edges)

  // const [paginate, { data, loading, client }] = useLazyQuery(GET_MEDIA_CHARACTERS_PAGINATION, {
  //   variables: {
  //     charactersPage: characters.pageInfo.currentPage + 1,
  //     id: mediaId,
  //   },
  //   onCompleted(data) {
  //     client.cache.modify({ fields: {
  //       Media(existingMedia) {

  //       }
  //     }})
  //   },
  // })

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
        {edges.map((character) => {
          if (!character.voiceActorRoles.length) {
            return (
              <div
                key={character.node.id}
                className="bg-darkTxt/10 flex overflow-hidden rounded-lg shadow-lg"
              >
                <Link to={`/character/${character.node.id}`}>
                  <img
                    src={character.node.image.medium}
                    alt={character.node.name.full}
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
                    <span className="font-medium">{character.node.name.full}</span>
                    <span className="text-main">{character.role}</span>
                  </div>
                </div>
              </div>
            )
          }

          return character.voiceActorRoles.map((voiceActorRole, index) => {
            return (
              <div
                key={index}
                className="bg-darkTxt/10 flex h-36 justify-between overflow-hidden rounded-lg shadow-lg md:h-40"
              >
                <Link to={`/character/${character.node.id}`}>
                  <img
                    src={character.node.image.medium}
                    alt={character.node.name.full}
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
                      to={`/character/${character.node.id}`}
                    >
                      {character.node.name.full}
                    </Link>
                    <span className="text-main">{character.role}</span>
                  </div>

                  {voiceActorRole && (
                    <div className="flex w-fit flex-col place-self-end p-2">
                      {voiceActorRole.roleNotes && (
                        <span className="text-main text-end">{voiceActorRole.roleNotes}</span>
                      )}

                      <Link
                        className="text-end font-medium"
                        to={`/staff/${voiceActorRole.voiceActor.id}`}
                      >
                        {voiceActorRole.voiceActor.name.full}
                      </Link>
                    </div>
                  )}
                </div>

                {voiceActorRole && voiceActorRole.voiceActor.image && (
                  <Link to={`/staff/${voiceActorRole.voiceActor.id}`}>
                    <img
                      src={voiceActorRole.voiceActor.image.medium}
                      alt={voiceActorRole.voiceActor.name.full}
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
            )
          })
        })}

        {/* {isLoading && <HorizontalCardSkeleton />} */}
      </div>

      {/* {!isLoading && pageInfo.hasNextPage && (
        <IntersectionObserverComponent page={pageInfo.currentPage} callback={callback} />
      )} */}
    </div>
  )
}

/** antigo fetchMore. Agora, trasncreva-o para um useLazyQuery e atualize o cache */
// callback={() => {
//   fetchMore({
//     query: GET_MEDIA_CHARACTERS_PAGINATION,
//     variables: {
//       charactersPage: anime.characters.pageInfo.currentPage + 1,
//       id: anime.id,
//     },
//     updateQuery(pv, { fetchMoreResult }) {
//       if (!fetchMoreResult) return pv

//       return {
//         Media: {
//           ...pv.Media,
//           characters: {
//             ...fetchMoreResult.Media.characters,
//             edges: [
//               ...pv.Media.characters.edges,
//               ...fetchMoreResult.Media.characters.edges,
//             ],
//           },
//         },
//       }
//     },
//   })
// }}
