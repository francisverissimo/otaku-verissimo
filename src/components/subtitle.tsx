import { ReactNode } from 'react'

type TSubtitleProps = {
  className?: string
  children: ReactNode
  id?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
}

export function Subtitle({ className, children, id, as: Tag = 'h2' }: TSubtitleProps) {
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}
