import { TStoredViewer } from '@/types/t-viewer'
import { consumeTokenFromUrl, getStoredToken } from './token'

const VIEWER_KEY = 'viewer'
const VIEWER_MAX_AGE_MS = 60 * 60 * 1000

const GET_VIEWER = `
  query ViewerQuery {
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
`

async function fetchViewer(token: string): Promise<TStoredViewer | undefined> {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: GET_VIEWER }),
    })

    if (!response.ok) {
      throw new Error(`Error on request Viewer: ${response.status}`)
    }

    const data = await response.json()
    const viewer = {
      ...data.data.Viewer,
      lastAccess: Date.now(),
    } as TStoredViewer

    localStorage.setItem(VIEWER_KEY, JSON.stringify(viewer))

    return viewer
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
  const urlToken = consumeTokenFromUrl()

  if (urlToken) {
    return fetchViewer(urlToken)
  }

  const token = getStoredToken()
  const storedViewer = getStoredViewer()

  if (!token || !storedViewer) return undefined

  if (Date.now() - storedViewer.lastAccess > VIEWER_MAX_AGE_MS) {
    return fetchViewer(token)
  }

  return storedViewer
}
