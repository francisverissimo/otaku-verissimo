import { QueryClient } from '@tanstack/react-query'
import { AniListError } from './graphql-client'

const MAX_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        // 4xx (not found, bad request) won't succeed on retry; 429 (rate limit) and 5xx might.
        if (error instanceof AniListError && error.status < 500 && error.status !== 429) {
          return false
        }
        return failureCount < MAX_RETRIES
      },
    },
  },
})
