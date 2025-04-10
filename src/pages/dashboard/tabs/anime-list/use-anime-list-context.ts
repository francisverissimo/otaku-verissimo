import { useContext } from 'react'
import { AnimeListContext } from './anime-list-context'

export function useAnimeListContext() {
  return useContext(AnimeListContext)
}
