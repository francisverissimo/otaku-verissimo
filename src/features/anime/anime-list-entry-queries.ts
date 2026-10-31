import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphql } from '@/gql'
import type {
  AnimeListEntryQuery,
  MediaListStatus,
  SaveAnimeListEntryMutationVariables,
  ScoreFormat,
} from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { queryKeys } from '@/lib/query-keys'

graphql(`
  fragment AnimeListEntryFields on MediaList {
    id
    status
    progress
    score
    repeat
    notes
    private
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
  }
`)

const AnimeListEntryQueryDocument = graphql(`
  query AnimeListEntry($mediaId: Int) {
    Viewer {
      mediaListOptions {
        scoreFormat
      }
    }
    Media(id: $mediaId, type: ANIME) {
      mediaListEntry {
        ...AnimeListEntryFields
      }
    }
  }
`)

const SaveAnimeListEntryMutation = graphql(`
  mutation SaveAnimeListEntry(
    $mediaId: Int
    $status: MediaListStatus
    $progress: Int
    $score: Float
    $repeat: Int
    $notes: String
    $private: Boolean
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry(
      mediaId: $mediaId
      status: $status
      progress: $progress
      score: $score
      repeat: $repeat
      notes: $notes
      private: $private
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      ...AnimeListEntryFields
    }
  }
`)

const DeleteAnimeListEntryMutation = graphql(`
  mutation DeleteAnimeListEntry($id: Int) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`)

type FuzzyDate = { year: number | null; month: number | null; day: number | null }

export type ListEntry = {
  id: number
  status: MediaListStatus
  progress: number
  score: number
  repeat: number
  notes: string
  private: boolean
  startedAt: FuzzyDate
  completedAt: FuzzyDate
}

type EntryResult = NonNullable<NonNullable<AnimeListEntryQuery['Media']>['mediaListEntry']>

function toFuzzyDate(date: Partial<FuzzyDate> | null | undefined): FuzzyDate {
  return { year: date?.year ?? null, month: date?.month ?? null, day: date?.day ?? null }
}

export function toListEntry(entry: EntryResult | null | undefined): ListEntry | null {
  if (!entry) return null

  return {
    id: entry.id,
    status: entry.status ?? 'PLANNING',
    progress: entry.progress ?? 0,
    score: entry.score ?? 0,
    repeat: entry.repeat ?? 0,
    notes: entry.notes ?? '',
    private: entry.private ?? false,
    startedAt: toFuzzyDate(entry.startedAt),
    completedAt: toFuzzyDate(entry.completedAt),
  }
}

export type ListEntryState = { entry: ListEntry | null; scoreFormat: ScoreFormat }

/** The logged-in user's entry for this anime, plus the score format they use on AniList. */
export function useAnimeListEntry(mediaId: number, userId: number) {
  return useQuery({
    queryKey: queryKeys.animeListEntry(mediaId, userId),
    queryFn: async (): Promise<ListEntryState> => {
      const data = await execute(AnimeListEntryQueryDocument, { mediaId }, { auth: true })
      return {
        entry: toListEntry(data.Media?.mediaListEntry),
        scoreFormat: data.Viewer?.mediaListOptions?.scoreFormat ?? 'POINT_10_DECIMAL',
      }
    },
  })
}

function useRefreshOtherScreens(userId: number) {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.mediaList(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.seasonal })
  }
}

export function useSaveAnimeListEntry(mediaId: number, userId: number) {
  const queryClient = useQueryClient()
  const refreshOtherScreens = useRefreshOtherScreens(userId)

  return useMutation({
    mutationFn: (variables: Omit<SaveAnimeListEntryMutationVariables, 'mediaId'>) =>
      execute(SaveAnimeListEntryMutation, { ...variables, mediaId }, { auth: true }),
    onSuccess: ({ SaveMediaListEntry }) => {
      queryClient.setQueryData<ListEntryState>(
        queryKeys.animeListEntry(mediaId, userId),
        (state) => (state ? { ...state, entry: toListEntry(SaveMediaListEntry) } : state)
      )
      refreshOtherScreens()
    },
  })
}

export function useDeleteAnimeListEntry(mediaId: number, userId: number) {
  const queryClient = useQueryClient()
  const refreshOtherScreens = useRefreshOtherScreens(userId)

  return useMutation({
    mutationFn: (entryId: number) =>
      execute(DeleteAnimeListEntryMutation, { id: entryId }, { auth: true }),
    onSuccess: () => {
      queryClient.setQueryData<ListEntryState>(
        queryKeys.animeListEntry(mediaId, userId),
        (state) => (state ? { ...state, entry: null } : state)
      )
      refreshOtherScreens()
    },
  })
}
