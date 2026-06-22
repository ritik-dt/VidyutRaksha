import type { HTMLAttributes } from 'react'
import { cn } from './cn'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag
}

export function CardTitle({
  as: Heading = 'h3',
  className,
  ...props
}: CardTitleProps) {
  return (
    <Heading
      className={cn('m-0 mb-3.5 text-sm font-bold', className)}
      {...props}
    />
  )
}
