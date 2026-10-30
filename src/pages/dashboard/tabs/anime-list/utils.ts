import { TMediaListCollection, TMediaListGroup } from '@/types/t-media-list-collection'

export function sortSections(
  lists: TMediaListCollection['lists'],
  order: string[]
): TMediaListGroup[] {
  return lists.slice().sort((a, b) => {
    if (order.indexOf(a.name) > order.indexOf(b.name)) {
      return 1
    }

    if (order.indexOf(a.name) < order.indexOf(b.name)) {
      return -1
    }

    return 0
  })
}

export function sortEntries(entries: TMediaListGroup['entries']): TMediaListGroup['entries'] {
  return entries.slice().sort((a, b) => b.media.averageScore - a.media.averageScore)
}
