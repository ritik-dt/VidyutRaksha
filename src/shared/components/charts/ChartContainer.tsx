import type { ReactNode } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@/shared/components/ui'
import { ChartEmptyState } from './ChartEmptyState'
import { ChartLoadingState, type ChartLoadingSize } from './ChartLoadingState'

export interface ChartContainerProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  loading?: boolean
  loadingSize?: ChartLoadingSize
  error?: ReactNode
  empty?: boolean
  emptyTitle?: ReactNode
  emptyDescription?: ReactNode
  emptyAction?: ReactNode
  className?: string
  contentClassName?: string
  fullHeight?: boolean
  fullscreenReady?: boolean
  onToggleFullscreen?: () => void
}

export function ChartContainer({
  title,
  subtitle,
  actions,
  children,
  loading = false,
  loadingSize = 'medium',
  error,
  empty = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
  contentClassName,
  fullHeight = false,
  fullscreenReady = false,
  onToggleFullscreen,
}: ChartContainerProps) {
  const headerActions = (
    <>
      {actions}
      {fullscreenReady ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleFullscreen}
          aria-label="Toggle fullscreen"
          disabled={!onToggleFullscreen}
        >
          Fullscreen
        </Button>
      ) : null}
    </>
  )

  return (
    <Card
      className={cn(
        'flex min-h-full flex-col',
        fullHeight && 'min-h-[420px]',
        className,
      )}
    >
      <CardHeader actions={headerActions}>
        <CardTitle>{title}</CardTitle>
        {subtitle ? (
          <div className="mt-1 text-xs leading-normal text-text-dim">
            {subtitle}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className={cn('flex flex-1 flex-col gap-3', contentClassName)}>
        {loading ? (
          <ChartLoadingState size={loadingSize} />
        ) : error ? (
          <ChartEmptyState
            title="Unable to render chart"
            description={error}
            action={emptyAction}
          />
        ) : empty ? (
          <ChartEmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
