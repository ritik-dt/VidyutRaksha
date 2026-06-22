import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center gap-2.5 text-center',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-2xl bg-ai-purple-light text-ai-purple">
          {icon}
        </div>
      ) : null}
      <div className="text-[15px] font-bold text-text">{title}</div>
      {description ? (
        <div className="max-w-xl text-xs leading-relaxed text-text-mid">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
