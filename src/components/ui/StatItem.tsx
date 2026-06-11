import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'
import { MetricTrend } from './MetricTrend'
import type { TrendDirection } from './types'

export interface StatItemProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
  description?: ReactNode
  icon?: ReactNode
  trend?: ReactNode
  trendDirection?: TrendDirection
}

export function StatItem({
  label,
  value,
  description,
  icon,
  trend,
  trendDirection = 'neutral',
  className,
  ...props
}: StatItemProps) {
  return (
    <div
      className={cn(
        'rounded-[10px] border border-border bg-bg p-3 px-3.5',
        className,
      )}
      {...props}
    >
      <div className="mb-2 flex items-start justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <span className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-[7px] bg-ai-purple-light text-ai-purple">
              {icon}
            </span>
          ) : null}
          <div className="text-[11px] font-semibold text-text-mid">{label}</div>
        </div>
        {trend ? <MetricTrend value={trend} direction={trendDirection} /> : null}
      </div>
      <div className="font-mono text-lg font-bold text-text">{value}</div>
      {description ? (
        <div className="mt-1 text-[11px] leading-normal text-text-dim">
          {description}
        </div>
      ) : null}
    </div>
  )
}
