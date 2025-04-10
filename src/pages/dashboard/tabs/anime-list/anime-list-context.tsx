import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'

type TAnimeListContext = {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}

export const AnimeListContext = createContext({} as TAnimeListContext)

export function AnimeListContextProvider({ children }: { children: ReactNode }) {
  const [headerSearch, setHeaderSearch] = useState('')

  return (
    <AnimeListContext.Provider
      value={{ search: headerSearch, setSearch: setHeaderSearch }}
      children={children}
    />
  )
}
