import { useState } from 'react'
import {
  GET_MEDIA_CHARACTERS_PAGINATION,
  GET_MEDIA_STAFF_PAGINATION,
} from '@/lib/queries/media-query'
import { TMedia } from '@/types/t-media'
import { AnimeTabCharacters as TabCharacters } from './anime-tab-characters'
import { AnimeTabStaff as TabStaff } from './anime-tab-staff'

import { AnimeNavigationTabs } from './anime-navigation-tabs'
import { AnimeTabOverview } from './anime-tab-overview'

type TAnimeContentProps = {
  anime: TMedia
}

export function AnimeContent({ anime }: TAnimeContentProps) {
  const [pageContent, setPageContent] = useState<'overview' | 'characters' | 'staff'>('overview')

  return (
    <div className="divide-second/20 mx-auto w-full max-w-5xl flex-1 divide-y md:pl-14">
      <AnimeNavigationTabs activeTab={pageContent} onChangeTab={(tab) => setPageContent(tab)} />

      {pageContent == 'overview' && (
        <AnimeTabOverview anime={anime} onChangeTab={(tab) => setPageContent(tab)} />
      )}

      {pageContent == 'characters' && (
        <TabCharacters characters={anime.characters} mediaId={anime.id} />
      )}

      {pageContent == 'staff' && <TabStaff staff={anime.staff} mediaId={anime.id} />}
    </div>
  )
}
