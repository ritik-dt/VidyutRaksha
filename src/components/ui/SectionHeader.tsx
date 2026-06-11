import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export interface SectionHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}

export function SectionHeader({
  title,
  subtitle,
  actions,
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-[18px] flex items-start justify-between gap-4 max-sm:flex-col max-sm:items-stretch',
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h2 className="m-0 font-display text-xl font-bold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 mb-0 text-xs leading-normal text-text-dim">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:w-full max-sm:justify-start">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
