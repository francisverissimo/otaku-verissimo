import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

type InputSearchProps = {
  initialValue: string
  onSearch: (term: string) => void
}

const SEARCH_DEBOUNCE_MS = 700

export function InputSearch({ initialValue, onSearch }: InputSearchProps) {
  const [displayValue, setDisplayValue] = useState(initialValue)
  const timeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  function handleClear() {
    window.clearTimeout(timeoutRef.current)
    setDisplayValue('')
    onSearch('')
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const term = event.target.value

    if (!term) {
      handleClear()
      return
    }

    setDisplayValue(term)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => onSearch(term), SEARCH_DEBOUNCE_MS)
  }

  return (
    <div className="flex w-full flex-col gap-2 md:mx-auto md:max-w-xs">
      <div className="border-main flex items-center gap-2 border-b-2 px-2 shadow-xl">
        <MagnifyingGlass size={24} className="text-zinc-400" weight="bold" />

        <input
          type="text"
          onChange={handleChange}
          value={displayValue}
          autoFocus
          placeholder="Search anime"
          className="caret-main/70 w-full bg-transparent p-2 text-lg text-zinc-300 outline-none"
        />

        <button
          onClick={handleClear}
          disabled={displayValue.length <= 0}
          className={`group rounded-full p-1 duration-300 hover:bg-black ${
            displayValue ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X
            size={18}
            className="text-zinc-400 duration-200 group-hover:text-red-500"
            weight="bold"
          />
        </button>
      </div>
    </div>
  )
}
