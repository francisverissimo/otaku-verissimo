import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import { ErrorFallback } from '@/components/error-fallback'

const RELOAD_FLAG = 'chunk-reload-at'
const RELOAD_COOLDOWN_MS = 10_000

/** Browsers word this differently; all of them mention a failed dynamic import or module fetch. */
function isStaleChunkError(error: unknown) {
  return (
    error instanceof Error &&
    /dynamically imported module|Importing a module script failed|error loading dynamically/i.test(
      error.message
    )
  )
}

/**
 * Route error boundary. After a deploy, an open tab may request a page chunk that no longer
 * exists; reloading once fetches the new build. Any other error shows the fallback.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()
  const staleChunk = isStaleChunkError(error)

  useEffect(() => {
    if (!staleChunk) return

    const lastReload = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0)
    if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) return

    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()))
    window.location.reload()
  }, [staleChunk])

  const fallbackError = error instanceof Error ? error : new Error('Something went wrong')

  return <ErrorFallback error={fallbackError} onRetry={() => window.location.reload()} />
}
