import { useQuery } from '@apollo/client'
import { TMediaListCollection } from '@/types/t-media-list-collection'
import { TViewer } from '@/types/t-viewer'
import { GET_USER_MEDIA_LIST_COLLECTION_QUERY } from '@/lib/queries/user-media-list-collection-query'
import { sortSections } from './utils'

type TMediaListCollectionResponse = { MediaListCollection: TMediaListCollection }

export function useMediaListCollection(user: TViewer) {
  const { data, loading, error } = useQuery<TMediaListCollectionResponse>(
    GET_USER_MEDIA_LIST_COLLECTION_QUERY,
    { variables: { userId: user.id } }
  )

  if (!data) return { data: undefined, loading, error }

  const lists = data.MediaListCollection.lists
  const sectionOrder = user.mediaListOptions.animeList.sectionOrder

  return { data: sortSections(lists, sectionOrder), loading, error }
}
