import { cardAction, capacityTier } from '../logic/teamLogic'
import type { TeamInspector } from '../types'

interface WorkloadCardProps {
  insp: TeamInspector
  readOnly: boolean
  onOpen: (id: string) => void
  onReduceLoad: () => void
}

const STATUS_TEXT: Record<TeamInspector['status'], string> = {
  field: 'In field',
  office: 'In office',
  leave: 'On leave',
}

/**
 * Workload distribution card. Port of prototype's renderLoadCard(insp).
 * Clicking the card body opens the inspector-cases side panel. The action row
 * varies by capacity tier (available / balanced / reduce load / on leave).
 */
export function WorkloadCard({ insp, readOnly, onOpen, onReduceLoad }: WorkloadCardProps) {
  const util = insp.openCases / insp.capacity
  const utilPct = Math.round(util * 100)
  const tier = capacityTier(util)
  const capClass = `capacity-${tier}`
  const capColor =
    tier === 'ok' ? 'var(--green)' : tier === 'mid' ? 'var(--amber)' : 'var(--red)'
  const action = cardAction(insp)

  const onCardKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen(insp.id)
    }
  }

  const handleReduce = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReduceLoad()
  }

  return (
    <div
      className="ld-card"
      onClick={() => onOpen(insp.id)}
      role="button"
      tabIndex={0}
      onKeyDown={onCardKey}
    >
      <div className="ld-card-top">
        <div className="ld-avatar">{insp.init}</div>
        <div className="ld-card-info">
          <div className="ld-card-name">{insp.name}</div>
          <div className="ld-card-meta">
            <span className={`status-dot status-${insp.status}`} />
            <span>{STATUS_TEXT[insp.status]}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>{insp.areas[0]}</span>
          </div>
        </div>
      </div>

      <div className="capacity-row">
        <div className="capacity-bar">
          <div className={`capacity-fill ${capClass}`} style={{ width: `${Math.min(100, utilPct)}%` }} />
        </div>
        <div className="capacity-text" style={{ minWidth: 90 }}>
          {insp.openCases}/{insp.capacity}
          {insp.pastSla > 0 && (
            <span
              style={{
                display: 'inline-block',
                padding: '1px 6px',
                background: 'rgba(220,53,69,.12)',
                color: 'var(--red)',
                borderRadius: 10,
                fontSize: 9.5,
                fontWeight: 700,
                marginLeft: 4,
              }}
            >
              {insp.pastSla} OVERDUE
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          fontSize: 10,
          color: capColor,
          fontWeight: 700,
          textAlign: 'right',
          marginTop: -4,
        }}
      >
        {utilPct}% capacity
      </div>

      <div className="ld-card-stats">
        <div className="ld-stat">
          <div
            className="ld-stat-val"
            style={{ color: insp.hitRate >= 60 ? 'var(--green)' : 'var(--amber)' }}
          >
            {insp.hitRate.toFixed(0)}%
          </div>
          <div className="ld-stat-label">Hit rate</div>
        </div>
        <div className="ld-stat">
          <div className="ld-stat-val">{insp.avgClose}d</div>
          <div className="ld-stat-label">Avg close</div>
        </div>
        <div className="ld-stat">
          <div className="ld-stat-val">₹{(insp.recovered / 100000).toFixed(1)}L</div>
          <div className="ld-stat-label">Recovered</div>
        </div>
      </div>

      {/* Action row (variants per capacity tier / status) */}
      {action.kind === 'leave' && (
        <div className="ld-card-action" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled
            style={{ background: 'var(--bg)', color: 'var(--text-dim)', cursor: 'not-allowed' }}
          >
            ⚠ On leave — redistribute
          </button>
        </div>
      )}
      {action.kind === 'available' && (
        <div className="ld-card-action" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            style={{
              background: 'var(--green-light)',
              color: 'var(--green)',
              borderColor: 'var(--green-mid)',
              cursor: 'default',
            }}
            tabIndex={-1}
          >
            ✓ Available for new cases
          </button>
        </div>
      )}
      {action.kind === 'reduce' && (
        <div className="ld-card-action" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={readOnly}
            onClick={handleReduce}
            style={{
              background: 'rgba(220,53,69,.1)',
              color: 'var(--red)',
              borderColor: 'rgba(220,53,69,.3)',
              cursor: readOnly ? 'not-allowed' : 'pointer',
              opacity: readOnly ? 0.6 : 1,
            }}
          >
            Reduce load →
          </button>
        </div>
      )}
      {action.kind === 'balanced' && (
        <div className="ld-card-action" onClick={(e) => e.stopPropagation()}>
          <button type="button" style={{ cursor: 'default' }} tabIndex={-1}>
            Balanced load
          </button>
        </div>
      )}
    </div>
  )
}
