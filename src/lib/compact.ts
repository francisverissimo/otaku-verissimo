/** AniList lists are typed as `Array<T | null> | null`. Returns only the present items. */
export function compact<T>(items: ReadonlyArray<T | null | undefined> | null | undefined): T[] {
  return (items ?? []).filter((item): item is T => item != null)
}
