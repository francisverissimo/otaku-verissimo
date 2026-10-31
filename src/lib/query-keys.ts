/**
 * Query keys used by more than one feature. Invalidating `mediaList(userId)` refreshes the
 * user's anime list after a change made somewhere else (e.g. "Add to Planning").
 */
export const queryKeys = {
  mediaList: (userId: number) => ['media-list', userId] as const,
}
