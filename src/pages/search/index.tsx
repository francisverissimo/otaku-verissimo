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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <Link to="/" title="back to home">
          <img src={shortLogo} alt="otakuVERISSIMO logo" className="mx-4 w-12" />
        </Link>

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
