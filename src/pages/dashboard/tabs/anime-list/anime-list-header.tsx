import { useRef, useState } from 'react'
import { CaretLeft, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useAnimeListContext } from './use-anime-list-context'

export function AnimeListHeader() {
  const { search, setSearch } = useAnimeListContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSearchField, setShowSearchField] = useState(() => {
    if (search !== '') {
      return true
    }

    return false
  })

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
    <div className="fixed left-0 right-0 top-0 z-30 h-14 bg-zinc-950/50 backdrop-blur sm:block md:ml-14">
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
            <div className="flex items-center gap-2 border-b-2 border-main px-2 shadow-xl">
              <MagnifyingGlass size={24} className="text-zinc-400" weight="bold" />

              <input
                type="text"
                onChange={(event) => {
                  setSearch(event.target.value)
                }}
                value={search}
                autoFocus
                placeholder="Search"
                className="w-full bg-transparent p-2 text-lg text-zinc-300 caret-main/70 outline-none"
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
            <span className="text-xl font-medium uppercase text-main italic">anime list</span>
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
