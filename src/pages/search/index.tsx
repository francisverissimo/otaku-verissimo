import { Link, useSearchParams } from 'react-router-dom'
import { GET_SEARCH_QUERY } from '@/lib/queries/search-query'
import { InputSearch } from './search-fields'
import { ResultsList } from './search-results-list'
import shortLogo from '@/assets/logo-short.svg'

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  function handleSearch(term: string) {
    setSearchParams((params) => {
      if (term) params.set('search', term)
      else params.delete('search')
      return params
    })
  }

  return (
    <>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 pr-4">
        <Link to="/" title="back to home">
          <img src={shortLogo} alt="otakuVERISSIMO logo" className="mx-4 w-12" />
        </Link>

        <InputSearch initialValue={searchTerm} onSearch={handleSearch} />
      </div>

      <ResultsList
        query={GET_SEARCH_QUERY}
        variables={{
          perPage: 40,
          page: 1,
          ...(searchTerm && { search: searchTerm }),
          sort: 'POPULARITY_DESC',
          isAdult: false,
        }}
      />
    </>
  )
}
