const ACCESS_TOKEN_KEY = 'access_token'

/**
 * AniList's implicit OAuth flow redirects back with the token in the URL hash
 * (`#access_token=...`). Read it, persist it, and strip it from the address bar.
 */
export function consumeTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const token = params.get('access_token')

  if (!token) return null

  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
  return token
}

export function getStoredToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearStoredToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const ANILIST_AUTH_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${import.meta.env.VITE_ID_CLIENT}&response_type=token`
