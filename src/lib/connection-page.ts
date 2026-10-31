import { compact } from '@/utils/compact'

type PageInfo = { currentPage: number | null; hasNextPage: boolean | null } | null | undefined

type Connection<TEdge> =
  { edges?: ReadonlyArray<TEdge | null> | null; pageInfo?: PageInfo } | null | undefined

/** One page of an AniList connection, already mapped to view items. */
export type Page<T> = { items: T[]; nextPage: number | undefined }

export function toPage<TEdge, TItem>(
  connection: Connection<TEdge>,
  toItem: (edge: TEdge) => TItem | null
): Page<TItem> {
  const pageInfo = connection?.pageInfo
  return {
    items: compact(compact(connection?.edges).map(toItem)),
    nextPage: pageInfo?.hasNextPage && pageInfo.currentPage ? pageInfo.currentPage + 1 : undefined,
  }
}
