import { useOutletContext } from 'react-router'
import type { AnimeView } from './anime-queries'

/** The anime loaded by `AnimePage`, shared with its tab routes through the outlet context. */
export function useAnimeRoute() {
  return useOutletContext<AnimeView>()
}
