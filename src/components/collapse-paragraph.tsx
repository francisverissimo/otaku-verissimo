import { ClassAttributes, useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react'

type TCollapseParagraphProps = ClassAttributes<HTMLDivElement> & {
  description: string
  className?: string
}

export function CollapseParagraph({ description, className }: TCollapseParagraphProps) {
  const [collapse, setCollapse] = useState(false)

  if (description.replace(/ /g, '').length >= 256) {
    return (
      <div className="relative">
        {!collapse && (
          <div className="absolute bottom-0 right-0 flex gap-1">
            <div className="h-2 w-2 rounded-full bg-main/90" />
            <div className="h-2 w-2 rounded-full bg-main/70" />
            <div className="h-2 w-2 rounded-full bg-main/60" />
          </div>
        )}

        <div>
          <p
            className={`${className} ${!collapse && 'max-h-64 overflow-hidden'}`}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />

          {!collapse && <div className='absolute z-[5] top-0 bg-gradient-to-t from-darkBG to-transparent h-full w-full' />}
        </div>


        <button
          onClick={() => setCollapse((prev) => !prev)}  
          className={`${!collapse && 'absolute bottom-0 z-[10]'} mx-auto mt-2 flex w-full items-center p-2 h-20 justify-center outline-main/50`}
        >
          {collapse ? (
            <>
              <span className="text-sm font-medium text-zinc-400 hover:text-zinc-300">
                SHOW LESS
              </span>
              <CaretUp size={18} className="text-main" weight="bold" />
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-zinc-400 hover:text-zinc-300">
                SHOW MORE
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
