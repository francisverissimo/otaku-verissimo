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
      <div className="flex h-16 items-center justify-between gap-2 md:justify-center">
        <Link to="/" title="back to home">
          <img src={shortLogo} alt="otakuVERISSIMO logo" className="mx-4 w-12" />
        </Link>
      </div>

      <div className="flex max-w-5xl flex-wrap items-center justify-between gap-4 p-4">
        <InputSearch
          searchTerm={searchTerm}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />

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
      </div>

      {searchTerm && (
        <ResultsList
          query={GET_SEARCH_QUERY}
          variables={{
            perPage: 20,
            page: 1,
            search: searchTerm,
            sort: 'POPULARITY_DESC',
            isAdult: false,
          }}
        />
      )}
    </>
  )
}
