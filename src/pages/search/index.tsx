import { Link, useSearchParams } from 'react-router-dom'
import { GET_SEARCH_QUERY } from '@/lib/queries/search-query'
import { InputSearch } from './search-fields'
import { ResultsList } from './search-results-list'
import shortLogo from '@/assets/logo-short.svg'

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  return (
    <>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 pr-4">
        <Link to="/" title="back to home">
          <img src={shortLogo} alt="otakuVERISSIMO logo" className="w-12 mx-4" />
        </Link>

        <InputSearch
          searchTerm={searchTerm}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      </div>

      {/* <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Genres</span>
              <SelectFieldGenres />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Year</span>
              <SelectFieldGenres />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Season</span>
              <SelectFieldGenres />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Format</span>
              <SelectFieldGenres />
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium text-sm">Airing Status</span>
              <SelectFieldGenres />
            </div>

            <ButtonMoreOptions />
          </div> */}

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
