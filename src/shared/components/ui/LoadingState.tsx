import type { HTMLAttributes } from 'react'
import { cn } from './cn'

export type LoadingStateVariant = 'card' | 'table' | 'kpi'

export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: LoadingStateVariant
  rows?: number
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-border-light after:absolute after:inset-0 after:-translate-x-full after:animate-ui-skeleton after:bg-gradient-to-r after:from-transparent after:via-white/45 after:to-transparent',
        className,
      )}
      aria-hidden="true"
    />
  )
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-[52%]" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-[72%]" />
      <Skeleton className="h-3 w-[88%]" />
    </div>
  )
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 gap-2.5 border-b border-border-light bg-bg-soft p-3 px-3.5">
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            className="grid grid-cols-4 gap-2.5 border-b border-border-light p-3 px-3.5"
            key={index}
          >
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
            <Skeleton className="h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div className="relative min-w-[140px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div
        className="absolute top-0 left-0 h-full w-1 rounded-l-xl"
        style={{ background: 'var(--grad-electric)' }}
      />
      <div className="mb-2.5 flex justify-between gap-3">
        <Skeleton className="size-7 rounded-[10px]" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="mb-1.5 h-2.5 w-[44%]" />
      <Skeleton className="mb-2 h-7 w-[68%]" />
      <Skeleton className="h-3 w-[72%]" />
    </div>
  )
}

export function LoadingState({
  variant = 'card',
  rows,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {variant === 'table' ? (
        <TableSkeleton rows={rows} />
      ) : variant === 'kpi' ? (
        <KpiSkeleton />
      ) : (
        <CardSkeleton />
      )}
    </div>
  )
}
