import { Link, useSearchParams } from 'react-router'
import { InputSearch } from './search-input'
import { ResultsList } from './search-results'
import shortLogo from '@/assets/logo-short.svg'

export function SearchPage() {
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

      <ResultsList search={searchTerm} />
    </>
  )
}
