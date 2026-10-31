import { useState } from 'react'
import { CaretLeft, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useListSearch } from './use-list-search'

export function AnimeListHeader() {
  const { search, setSearch } = useListSearch()
  const [showSearchField, setShowSearchField] = useState(search !== '')

  function handleToggleInputSearch() {
    if (!showSearchField) {
      setShowSearchField(true)
      return
    }

    setShowSearchField(false)
    handleClearInput()
  }

  function handleClearInput() {
    setSearch('')
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-30 h-14 bg-zinc-950/50 backdrop-blur sm:block md:ml-14">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between">
        {showSearchField && (
          <div
            onClick={handleToggleInputSearch}
            className="group flex cursor-pointer items-center justify-center gap-2 p-4"
          >
            <CaretLeft
              size={24}
              weight="bold"
              className="group text-zinc-400 group-hover:text-zinc-200"
            />
          </div>
        )}

        {showSearchField ? (
          <div className="flex w-full flex-col gap-2 pr-4 md:mx-auto md:max-w-xs">
            <div className="border-main flex items-center gap-2 border-b-2 px-2 shadow-xl">
              <MagnifyingGlass size={24} className="text-zinc-400" weight="bold" />

              <input
                type="text"
                onChange={(event) => {
                  setSearch(event.target.value)
                }}
                value={search}
                autoFocus
                placeholder="Search"
                className="caret-main/70 w-full bg-transparent p-2 text-lg text-zinc-300 outline-none"
              />

              <button
                onClick={handleClearInput}
                disabled={search == ''}
                className="group rounded-full p-1 opacity-100 duration-300 hover:bg-black disabled:pointer-events-none disabled:opacity-0"
              >
                <X
                  size={18}
                  className="text-zinc-400 duration-200 group-hover:text-red-500"
                  weight="bold"
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 px-4">
            <span className="text-main text-xl font-medium uppercase italic">anime list</span>
          </div>
        )}

        {!showSearchField && (
          <div
            onClick={handleToggleInputSearch}
            className="group flex cursor-pointer items-center justify-center gap-2 p-4"
          >
            <MagnifyingGlass
              size={24}
              weight="bold"
              className="group text-zinc-400 group-hover:text-zinc-200"
            />
          </div>
        )}
      </div>
    </div>
  )
}
