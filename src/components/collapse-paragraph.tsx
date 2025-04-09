import { ClassAttributes, useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react'

type TCollapseParagraphProps = ClassAttributes<HTMLDivElement> & {
  description: string
  className?: string
}

export function CollapseParagraph({ description, className }: TCollapseParagraphProps) {
  const [collapse, setCollapse] = useState(false)

  function handleToggleCollapse() {
    setCollapse((prev) => !prev)
  }

  if (description.replace(/ /g, '').length > 256) {
    return (
      <div className="relative">
        <div>
          <p
            className={`${className} ${!collapse && 'max-h-64 overflow-hidden'}`}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />

          {!collapse && (
            <div className="from-darkBG absolute top-0 z-[5] h-full w-full bg-gradient-to-t to-transparent" />
          )}
        </div>

        <button
          data-collapse={collapse}
          onClick={handleToggleCollapse}
          className="ring-main/30 hover:bg-main/5 mx-auto mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl p-2 outline-none focus-within:ring hover:brightness-125 data-[collapse=false]:absolute data-[collapse=false]:bottom-0 data-[collapse=false]:z-[10]"
        >
          {collapse ? (
            <>
              <span className="text-sm font-medium text-zinc-400 hover:text-zinc-300">
                show less
              </span>
              <CaretUp size={18} className="text-main" weight="bold" />
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-zinc-400 hover:text-zinc-300">
                show more
              </span>
              <CaretDown size={18} className="text-main" weight="bold" />
            </>
          )}
        </button>
      </div>
    )
  }

  return <p className={className} dangerouslySetInnerHTML={{ __html: description }}></p>
}
