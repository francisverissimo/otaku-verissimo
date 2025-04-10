import toast from 'react-hot-toast'
import { CopySimple } from '@phosphor-icons/react'

type TAnimeTitleProps = {
  title: string
}

export function AnimeTitle({ title }: TAnimeTitleProps) {
  function handleClick() {
    navigator.clipboard.writeText(title)
    toast('Text copied', {
      duration: 3000,
      position: 'bottom-center',
      style: {
        borderRadius: '32px',
      },
    })
  }

  return (
    <div className="flex flex-1 items-center gap-1">
      <span
        onClick={handleClick}
        className="relative cursor-pointer pr-4 text-justify font-raleway text-lg text-second"
        title="click to copy"
      >
        {title}

        <CopySimple className="absolute -right-3 -top-1 h-6 w-6 cursor-pointer rounded-full bg-main/80 p-1 text-[20px] text-zinc-50 duration-500" />
      </span>
    </div>
  )
}
