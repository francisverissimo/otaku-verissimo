import { useSearchParams } from 'react-router'

/** The list filter lives in the URL (`/list?q=...`), so it survives reloads and back navigation. */
export function useListSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  function setSearch(term: string) {
    setSearchParams(
      (params) => {
        if (term) params.set('q', term)
        else params.delete('q')
        return params
      },
      { replace: true }
    )
  }

  return { search, setSearch }
}
