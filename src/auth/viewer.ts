import { graphql } from '@/gql'
import type { ViewerQuery as ViewerQueryResult } from '@/gql/graphql'
import { execute } from '@/lib/graphql-client'
import { compact } from '@/utils/compact'
import { consumeTokenFromUrl, getStoredToken } from './token'

const VIEWER_KEY = 'viewer'
const VIEWER_MAX_AGE_MS = 60 * 60 * 1000

const ViewerQuery = graphql(`
  query Viewer {
    Viewer {
      id
      name
      avatar {
        medium
      }
      mediaListOptions {
        animeList {
          sectionOrder
        }
      }
    }
  }
`)

/** The shape is also what gets persisted in localStorage, so keep it backwards compatible. */
export type TViewer = {
  id: number
  name: string
  avatar: { medium: string | null }
  mediaListOptions: { animeList: { sectionOrder: string[] } }
}

type TStoredViewer = TViewer & {
  lastAccess: number /** Date.now() */
}

function toViewer(data: ViewerQueryResult): TViewer | undefined {
  const viewer = data.Viewer
  if (!viewer) return undefined

  return {
    id: viewer.id,
    name: viewer.name,
    avatar: { medium: viewer.avatar?.medium ?? null },
    mediaListOptions: {
      animeList: { sectionOrder: compact(viewer.mediaListOptions?.animeList?.sectionOrder) },
    },
  }
}

async function fetchViewer(): Promise<TStoredViewer | undefined> {
  try {
    const viewer = toViewer(await execute(ViewerQuery, undefined, { auth: true }))
    if (!viewer) return undefined

    const storedViewer = { ...viewer, lastAccess: Date.now() }
    localStorage.setItem(VIEWER_KEY, JSON.stringify(storedViewer))

    return storedViewer
  } catch (error) {
    console.error('Error on request Viewer:', error)
    return undefined
  }
}

function getStoredViewer(): TStoredViewer | null {
  const storedViewer = localStorage.getItem(VIEWER_KEY)
  return storedViewer ? JSON.parse(storedViewer) : null
}

export function clearStoredViewer() {
  localStorage.removeItem(VIEWER_KEY)
}

/**
 * Resolves the logged-in viewer: a fresh OAuth token always refetches; otherwise the
 * cached viewer is reused for up to an hour before being refreshed.
 */
export async function resolveViewer(): Promise<TStoredViewer | undefined> {
  if (consumeTokenFromUrl()) {
    return fetchViewer()
  }

  const token = getStoredToken()
  const storedViewer = getStoredViewer()

  if (!token || !storedViewer) return undefined

  if (Date.now() - storedViewer.lastAccess > VIEWER_MAX_AGE_MS) {
    return fetchViewer()
  }

  return storedViewer
}
