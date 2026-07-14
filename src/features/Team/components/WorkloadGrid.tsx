import { WorkloadCard } from './WorkloadCard'
import type { TeamFilter, TeamInspector } from '../types'

interface WorkloadGridProps {
  sorted: TeamInspector[]
  filter: TeamFilter
  readOnly: boolean
  onOpenInspector: (id: string) => void
  onReduceLoad: () => void
}

/**
 * Workload-distribution card holding the ld-grid of WorkloadCards. Title and
 * empty-state text switch based on the active filter. Port of the
 * "Workload distribution" .card block in renderTeamScreen.
 */
export function WorkloadGrid({
  sorted,
  filter,
  readOnly,
  onOpenInspector,
  onReduceLoad,
}: WorkloadGridProps) {
  let title = 'Workload distribution'
  let sub = 'Sorted by capacity utilization · Click any card to see their cases'
  if (filter === 'overloaded') {
    title = `Overloaded inspectors (${sorted.length})`
    sub = 'At ≥ 90% capacity'
  } else if (filter === 'available') {
    title = `Available inspectors (${sorted.length})`
    sub = 'Under 50% capacity'
  } else if (filter === 'onleave') {
    title = `On leave (${sorted.length})`
    sub = 'Their cases need redistribution'
  }

  const emptyHeadline =
    filter === 'overloaded' ? 'No inspectors overloaded' : 'No inspectors with low load'
  const emptyBody =
    filter === 'overloaded'
      ? 'All inspectors at or below 90%. Team is healthy.'
      : 'All inspectors at 50%+. Consider rebalancing.'
  const emptyIcon = filter === 'overloaded' ? '✓' : '⚠'

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div
        className="card-title"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 400 }}>{sub}</span>
      </div>

      {sorted.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.4 }}>{emptyIcon}</div>
          <div style={{ fontWeight: 700, color: 'var(--text-mid)', fontSize: 14 }}>
            {emptyHeadline}
          </div>
          <div style={{ fontSize: 11, marginTop: 6 }}>{emptyBody}</div>
        </div>
      ) : (
        <div className="ld-grid">
          {sorted.map((insp) => (
            <WorkloadCard
              key={insp.id}
              insp={insp}
              readOnly={readOnly}
              onOpen={onOpenInspector}
              onReduceLoad={onReduceLoad}
            />
          ))}
        </div>
      )}
    </div>
  )
}
