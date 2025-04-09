import { useToken } from './use-token'
import { TStoredViewer } from '@/types/t-viewer'

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

export function useViewer() {
  const { getURLToken, getStoredToken } = useToken()

  async function fetchViewerData(token: string): Promise<TStoredViewer | undefined> {
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
      const newViewer = {
        ...data.data.Viewer,
        lastAccess: Date.now(),
      } as TStoredViewer

      localStorage.setItem('viewer', JSON.stringify(newViewer))

      return newViewer
    } catch (error) {
      console.error('Error on request Viewer:', error)
      return undefined
    }
  }

  async function refreshViewerDataIfNeeded(): Promise<TStoredViewer | undefined> {
    const urlToken = getURLToken()

    if (!urlToken) {
      const accessToken = getStoredToken()
      const storedViewer = getStoredViewer()

      if (!accessToken || !storedViewer) return undefined

      const differenceLastAccess = Date.now() - storedViewer.lastAccess
      const oneHour = 60 * 60 * 1000

      if (differenceLastAccess > oneHour) {
        return await fetchViewerData(accessToken)
      }

      return storedViewer
    }

    localStorage.setItem('access_token', urlToken)
    return await fetchViewerData(urlToken)
  }

  function getStoredViewer(): TStoredViewer | null {
    const storedViewer = localStorage.getItem('viewer')
    return storedViewer ? JSON.parse(storedViewer) : null
  }

  return {
    getStoredViewer,
    refreshViewerDataIfNeeded,
  }
}
