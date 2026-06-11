import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
} from './icons'
import type { TrendDirection } from './types'

export interface MetricTrendProps extends HTMLAttributes<HTMLSpanElement> {
  value: ReactNode
  direction: TrendDirection
}

function TrendIcon({ direction }: { direction: TrendDirection }) {
  const iconClassName = 'size-3'
  if (direction === 'up') {
    return <ArrowUpIcon className={iconClassName} />
  }
  if (direction === 'down') {
    return <ArrowDownIcon className={iconClassName} />
  }
  return <MinusIcon className={iconClassName} />
}

const DIRECTION_CLASSES: Record<TrendDirection, string> = {
  up: 'text-green',
  down: 'text-red',
  neutral: 'text-text-dim',
}

export function MetricTrend({
  value,
  direction,
  className,
  ...props
}: MetricTrendProps) {
  return (
    <span
      className={cn(
        'mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold',
        DIRECTION_CLASSES[direction],
        className,
      )}
      aria-label={`Trend ${direction}: ${String(value)}`}
      {...props}
    >
      <TrendIcon direction={direction} />
      <span>{value}</span>
    </span>
  )
}
