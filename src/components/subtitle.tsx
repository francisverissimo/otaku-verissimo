import { ClassAttributes, ReactNode } from 'react'

type TSubtitleProps = ClassAttributes<HTMLSpanElement> & {
  className?: string
  children: ReactNode
  id?: string
  as?: keyof JSX.IntrinsicElements
}

export function Subtitle({ className, children, id, as = 'h2' }: TSubtitleProps) {
  const Tag = as
  return <Tag id={id} className={className}>{children}</Tag>
}
