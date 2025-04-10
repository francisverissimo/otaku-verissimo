import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SwiperSlide } from 'swiper/react'
import { Subtitle } from '@/components/subtitle'
import { SwiperHorizontal } from '@/components/swiper-horizontal'
import { CollapseParagraph } from '@/components/collapse-paragraph'
/* implementar composition patterns para os componentes abaixo  */
import { AnimeTitle as Title } from './anime-title'
import { AnimeTags as Tags } from './anime-tags'
import { AnimeRelations as Relations } from './anime-relations'
import { AnimeRecommendations as Recommendations } from './anime-recommendations'
import { AnimeStudios as Studios } from './anime-studios'
import { AnimeFuzzyDate } from './anime-fuzzy-date'
import { AnimeStats } from './anime-stats'
import { TMedia } from '@/types/t-media'
import { getContrastSafeColor } from '@/utils/get-contrast-safe-color'

interface AnimeTabOverviewProps {
  anime: TMedia
  onChangeTab(tab: 'characters' | 'staff'): void
}

export function AnimeTabOverview({ anime, onChangeTab }: AnimeTabOverviewProps) {
  const safeColor = getContrastSafeColor(anime.coverImage.color)

  useEffect(() => {
    if (window.scrollY < document.body.scrollHeight) scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="divide-second/20 mx-auto max-w-5xl divide-y">
      <ul className="flex flex-wrap justify-center gap-1 p-4 md:justify-start md:pt-4">
        {anime.genres.map((genre, index) => (
          <button
            key={index}
            style={{
              color: safeColor,
              borderColor: safeColor,
            }}
            className="pointer-events-none flex rounded-2xl border-2 px-3 text-lg font-medium"
          >
            {genre}
          </button>
        ))}
      </ul>

      {anime.description && (
        <div className="flex flex-col p-4">
          <CollapseParagraph description={anime.description} />
        </div>
      )}

      <div className="mt-4 flex flex-col">
        <div className="flex items-center justify-between px-4">
          <Subtitle className="font-raleway py-4 text-xl font-semibold uppercase underline underline-offset-4">
            characters
          </Subtitle>

          <button
            onClick={() => onChangeTab('characters')}
            className="text-second bg-second/10 h-fit cursor-pointer rounded-full px-4 py-2"
          >
            see more
          </button>
        </div>

        <div className="flex gap-4 pt-4">
          <SwiperHorizontal>
            {anime.characters.edges
              .filter((character) => character.role == 'MAIN')
              .map((character) => {
                const { id, name, image } = character.node
                return (
                  <SwiperSlide key={id}>
                    <Link className="flex flex-col gap-4" to={`/character/${id}`}>
                      <div className="overflow-hidden rounded-full">
                        <img
                          src={image.medium}
                          alt={name.full}
                          style={{
                            opacity: 0,
                            transitionDuration: '900ms',
                          }}
                          onLoad={(t) => (t.currentTarget.style.opacity = '1')}
                          className="aspect-square h-full w-full object-cover"
                        />
                      </div>

                      <span className="mx-auto line-clamp-2 w-full text-center text-sm md:text-lg">
                        {name.full}
                      </span>
                    </Link>
                  </SwiperSlide>
                )
              })}
          </SwiperHorizontal>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <span className="text-lg">Romaji title:</span>
          <Title title={anime.title.userPreferred} />
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <span className="text-lg">Native title:</span>
          <Title title={anime.title.native} />
        </div>

        {anime.title.english && (
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            <span className="text-lg">English title:</span>
            <Title title={anime.title.english} />
          </div>
        )}

        {anime.synonyms.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            <span className="text-lg">Synonyms:</span>
            <div className="flex flex-1 flex-col">
              {anime.synonyms.map((synonym, index) => (
                <span key={index} className="text-justify text-lg">
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-lg">Format:</span>
          <span className="flex-1 text-lg">{anime.format ?? '-'}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-lg">Episodes:</span>
          <span className="flex-1 text-lg">{anime.episodes ?? '?'}</span>
        </div>

        {anime.duration && (
          <div className="flex flex-wrap gap-2">
            <span className="text-lg">Episode Duration:</span>
            <span className="flex-1 text-lg">{anime.duration + ' mins'}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-lg">Source:</span>
          <span className="text-lg">{anime.source ? anime.source.replace(/_/g, ' ') : '-'}</span>
        </div>

        {anime.status && (
          <div className="flex flex-wrap gap-2">
            <span className="text-lg">Status:</span>
            <span className="flex-1 text-lg">{anime.status.replace(/_/g, ' ')}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-lg">Start Date:</span>
          <AnimeFuzzyDate fuzzyDate={anime.startDate} />
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-lg">End Date:</span>
          <AnimeFuzzyDate fuzzyDate={anime.endDate} />
        </div>

        {anime.season && anime.seasonYear && (
          <div className="flex flex-wrap gap-2">
            <span className="text-lg">Season:</span>
            <span className="text-main flex-1 text-lg">{`${anime.season} ${anime.seasonYear}`}</span>
          </div>
        )}
      </div>

      <Studios studios={anime.studios.edges} />

      <AnimeStats
        average={anime.averageScore}
        mean={anime.meanScore}
        popularity={anime.popularity}
        favourites={anime.favourites}
      />

      <Tags tags={anime.tags} />

      <Relations edges={anime.relations.edges} />

      <Recommendations edges={anime.recommendations.edges} />

      {anime.externalLinks.length > 0 && (
        <div className="flex flex-col gap-3 p-4">
          <Subtitle className="font-raleway py-4 text-xl font-semibold uppercase underline underline-offset-4">
            links
          </Subtitle>

          <div className="flex flex-wrap gap-2">
            {anime.externalLinks.map((link) => (
              <Link
                key={link.id}
                to={link.url}
                target="_blank"
                className="my-auto flex h-fit cursor-pointer items-center gap-1 rounded p-2 hover:scale-[102%]"
                style={{
                  backgroundColor: link.color ? link.color : '#52525b',
                }}
              >
                {link.icon && <img src={link.icon} alt={link.site} className="w-6" />}
                <strong className="text-sm text-white">{link.site}</strong>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
