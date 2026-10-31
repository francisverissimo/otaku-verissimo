import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type {
  MediaListCollectionQuery as MediaListCollectionResult,
  MediaListStatus,
} from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { compact } from '@/utils/compact'
import { applySavedEntry, sortSections } from './utils'

const MediaListCollectionQuery = graphql(`
  query MediaListCollection($userId: Int) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        status
        entries {
          id
          status
          progress
          media {
            id
            title {
              userPreferred
            }
            coverImage {
              large
            }
            format
            episodes
            averageScore
            nextAiringEpisode {
              airingAt
              episode
            }
          }
        }
      }
    }
  }
`)

const SaveMediaListEntryMutation = graphql(`
  mutation SaveMediaListEntry($id: Int, $status: MediaListStatus, $progress: Int) {
    SaveMediaListEntry(id: $id, status: $status, progress: $progress) {
      id
      status
      progress
    }
  }
`)

function toMediaListGroups(data: MediaListCollectionResult) {
  return compact(data.MediaListCollection?.lists).map((list) => ({
    name: list.name ?? '',
    /** null for custom lists, which repeat entries that also live in a status list. */
    status: list.status,
    entries: compact(list.entries).flatMap((entry) =>
      entry.media
        ? [
            {
              id: entry.id,
              status: entry.status,
              progress: entry.progress ?? 0,
              media: {
                id: entry.media.id,
                title: entry.media.title?.userPreferred ?? '',
                cover: entry.media.coverImage?.large ?? null,
                format: entry.media.format,
                episodes: entry.media.episodes,
                averageScore: entry.media.averageScore ?? 0,
                nextAiringEpisode: entry.media.nextAiringEpisode,
              },
            },
          ]
        : []
    ),
  }))
}

export type MediaListGroup = ReturnType<typeof toMediaListGroups>[number]
export type MediaListEntry = MediaListGroup['entries'][number]

const mediaListKey = (userId: number) => ['media-list', userId]

export function useMediaListCollection(userId: number, sectionOrder: string[]) {
  return useQuery({
    queryKey: mediaListKey(userId),
    queryFn: async () =>
      toMediaListGroups(await execute(MediaListCollectionQuery, { userId }, { auth: true })),
    select: (lists) => sortSections(lists, sectionOrder),
  })
}

export function useSaveMediaListEntry(userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { id: number; status: MediaListStatus; progress: number }) =>
      execute(SaveMediaListEntryMutation, variables, { auth: true }),
    onSuccess: ({ SaveMediaListEntry: saved }) => {
      if (!saved) return

      queryClient.setQueryData<MediaListGroup[]>(mediaListKey(userId), (lists) =>
        lists ? applySavedEntry(lists, saved) : lists
      )
    },
  })
}
