import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('flex flex-col gap-3', className)} {...props} />
}
