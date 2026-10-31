import type { TypedDocumentString } from '@/gql/graphql'
import { getStoredToken } from '@/auth/token'

const ANILIST_URL = 'https://graphql.anilist.co'

export class AniListError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'AniListError'
  }
}

type ExecuteOptions = {
  /** Send the stored access token. Only for requests that need the logged-in user. */
  auth?: boolean
}

/**
 * Runs a typed GraphQL document against AniList. Variables and result types come from
 * GraphQL Codegen (`yarn codegen`).
 */
export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
  { auth = false }: ExecuteOptions = {}
): Promise<TResult> {
  const token = auth ? getStoredToken() : null

  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query: query.toString(), variables }),
  })

  const json = await response.json().catch(() => null)

  if (!response.ok || json?.errors) {
    const message = json?.errors?.[0]?.message ?? `AniList request failed: ${response.status}`
    throw new AniListError(message, json?.errors?.[0]?.status ?? response.status)
  }

  return json.data as TResult
}
