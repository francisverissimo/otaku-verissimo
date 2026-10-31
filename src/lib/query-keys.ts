/**
 * Query keys used by more than one feature. A change to a list entry made in one place
 * invalidates the others, so every screen shows the same status and progress.
 */
export const queryKeys = {
  mediaList: (userId: number) => ['media-list', userId] as const,
  /** Prefix of every seasonal chart query. */
  seasonal: ['seasonal'] as const,
  /** Prefix of every list entry shown on an anime page. */
  animeListEntries: ['anime-list-entry'] as const,
  animeListEntry: (mediaId: number, userId: number) =>
    ['anime-list-entry', mediaId, userId] as const,
}
