import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode
}

export function CardHeader({
  children,
  actions,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'mb-3.5 flex items-start justify-between gap-3 max-sm:flex-col max-sm:items-stretch',
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
