import type { ReactNode } from 'react'
import { EmptyState } from '@/components/ui'
import { SparklesIcon } from '@/components/ui/icons'

export interface ChartEmptyStateProps {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
}

export function ChartEmptyState({
  title = 'No chart data available',
  description = 'This chart will render automatically once the dataset contains values.',
  action,
  icon,
}: ChartEmptyStateProps) {
  return (
    <EmptyState
      className="min-h-[220px]"
      icon={icon ?? <SparklesIcon width={28} height={28} />}
      title={title}
      description={description}
      action={action}
    />
  )
}

