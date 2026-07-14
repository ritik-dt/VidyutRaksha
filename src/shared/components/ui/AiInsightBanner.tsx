import type { ReactNode } from 'react'
import { cn } from './cn'

export interface AiInsightBannerProps {
  title?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
  live?: boolean
  compact?: boolean
}

/**
 * Matches the prototype's `.ai-insight` box exactly:
 * gradient background, top accent bar, sparkle icon, optional "Live" pulse badge.
 * `compact` reduces padding/typography for dense contexts (e.g. detail panels).
 */
export function AiInsightBanner({
  title = 'AI theft-triage',
  children,
  actions,
  className,
  live = true,
  compact = false,
}: AiInsightBannerProps) {
  return (
    <div className={cn('ai-insight mb-3.5', compact && 'ai-insight-compact', className)}>
      <div className="ai-insight-header">
        {title}
        {live && (
          <span className="ai-live-badge">Live</span>
        )}
      </div>
      <div className="ai-insight-body">{children}</div>
      {actions && <div className="ai-insight-actions">{actions}</div>}
    </div>
  )
}
