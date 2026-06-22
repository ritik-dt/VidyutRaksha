import type { ReactNode } from 'react'
import { cn } from './cn'

export interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('page-header mb-[18px] flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start', className)}>
      <div>
        <div className="page-title text-[20px] font-bold text-text">{title}</div>
        {subtitle && <div className="page-sub mt-[3px] text-[12px] text-text-dim">{subtitle}</div>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 max-sm:w-full">
          {actions}
        </div>
      )}
    </div>
  )
}
