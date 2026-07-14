import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useRole } from '@/shared/context/RoleContext'
import { getRoleAwareInsight } from '@/features/Dashboard/adapter'
import type { InsightModel } from '../logic/teamLogic'

interface TeamAiInsightProps {
  insight: InsightModel
}

/**
 * AI insight banner for the Team screen. Renders the correct branch of the
 * prototype's three-way `insight` logic and falls back to a role-aware
 * override when the shared adapter provides one.
 */
export function TeamAiInsight({ insight }: TeamAiInsightProps) {
  const { currentRole } = useRole()
  const override = getRoleAwareInsight('team', currentRole.id)
  const title = `AI workload analysis — ${currentRole.label}`

  if (override) {
    return <AiInsightBanner title={title} live={false}>{override}</AiInsightBanner>
  }

  if (insight.kind === 'rebalance' && insight.overloaded && insight.underutil) {
    const o = insight.overloaded
    const u = insight.underutil
    const plural = insight.suggestionsCount === 1 ? '' : 's'
    return (
      <AiInsightBanner title={title} live={false}>
        <strong>{o.name}</strong> is at{' '}
        <strong style={{ color: 'var(--red)' }}>{insight.overloadedPct}% capacity</strong>
        {o.pastSla > 0 && <> with {o.pastSla} overdue</>}.{' '}
        <strong>{u.name}</strong> has{' '}
        <strong style={{ color: 'var(--green)' }}>{u.openCases} open cases</strong>{' '}
        ({insight.underutilPct}% capacity){insight.sameArea && <> and covers the same area</>}.
        I recommend moving <strong>{insight.suggestionsCount}</strong> case{plural} to balance the team.
      </AiInsightBanner>
    )
  }

  if (insight.kind === 'sla') {
    return (
      <AiInsightBanner title={title} live={false}>
        Team is balanced overall but{' '}
        <strong style={{ color: 'var(--red)' }}>{insight.totalPastSla} cases are past SLA</strong>{' '}
        across the team. Reassigning these to inspectors with capacity will reduce overdue exposure.
      </AiInsightBanner>
    )
  }

  return (
    <AiInsightBanner title={title} live={false}>
      Team load is well-distributed at <strong>{insight.utilPct}% capacity</strong>. No immediate
      rebalancing needed.
    </AiInsightBanner>
  )
}
