import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import { cn } from './cn'
import { LoadingState } from './LoadingState'
import { MetricTrend } from './MetricTrend'
import type { TrendDirection } from './types'

export interface KpiCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  value: ReactNode
  icon?: ReactNode
  trend?: ReactNode
  trendDirection?: TrendDirection
  subtitle?: ReactNode
  loading?: boolean
}

export const KpiCard = forwardRef<HTMLDivElement, KpiCardProps>(function KpiCard(
  {
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    subtitle,
    loading = false,
    className,
    onClick,
    onKeyDown,
    role,
    tabIndex,
    style,
    ...props
  },
  ref,
) {
  if (loading) {
    return <LoadingState variant="kpi" className={className} />
  }

  const clickable = Boolean(onClick)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || !clickable || !onClick) {
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event as unknown as ReactMouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex min-w-[140px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-[180ms]',
        clickable &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-ai-purple-mid hover:shadow-[0_8px_20px_rgba(124,58,237,0.12)] after:pointer-events-none after:absolute after:top-2.5 after:right-3 after:text-base after:text-text-dim after:opacity-0 after:transition-all after:duration-[180ms] after:content-["→"] hover:after:right-2.5 hover:after:text-ai-purple hover:after:opacity-100',
        className,
      )}
      style={style}
      role={role ?? (clickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (clickable ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        className="absolute top-0 left-0 h-full w-1 rounded-l-xl"
        style={{
          background: 'var(--kpi-accent, var(--grad-electric))',
        }}
      />
      <div className="mb-1.5 flex items-start justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-ai-purple-light text-ai-purple">
              {icon}
            </span>
          ) : null}
          <div className="mb-0 text-[11px] font-medium tracking-wide text-text-dim uppercase">
            {title}
          </div>
        </div>
        {trend ? <MetricTrend value={trend} direction={trendDirection} /> : null}
      </div>
      <div className="font-mono text-2xl leading-none font-extrabold">{value}</div>
      {subtitle ? (
        <div className="mt-1 text-[10px] text-text-mid">{subtitle}</div>
      ) : null}
    </div>
  )
})
