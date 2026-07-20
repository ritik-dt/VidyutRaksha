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

/** Status-dot background per inspector status (matches prototype's status-field/office/leave). */
const STATUS_BG: Record<TeamInspector['status'], string> = {
  field: 'var(--green)',
  office: 'var(--navy-light)',
  leave: 'var(--text-dim)',
}

/**
 * Workload distribution card. Port of prototype's renderLoadCard(insp).
 * Clicking the card body opens the inspector-cases side panel. The action row
 * varies by capacity tier (available / balanced / reduce load / on leave).
 *
 * Matches prototype spec: 14px padding, 10px radius, hover-lift with purple glow,
 * dashed border-top between avatar row and stat grid.
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

  // Base classes for all action-row buttons — prototype has .ld-card-action button.
  // All action variants layer their own colors via inline style.
  const actionBtnBase =
    'flex-1 p-[6px] border border-[var(--border)] rounded-[5px] text-[11px] cursor-pointer text-[var(--text-mid)] font-semibold transition-all duration-[120ms] enabled:hover:bg-[var(--ai-purple-light)] enabled:hover:border-[var(--ai-purple)] enabled:hover:text-[var(--ai-purple)]'

  return (
    <div
      className="bg-[var(--card)] border border-[var(--border)] rounded-[10px] p-[14px] transition-all duration-150 cursor-pointer hover:border-[var(--ai-purple-mid)] hover:shadow-[0_4px_14px_rgba(124,58,237,0.1)] hover:-translate-y-[1px]"
      onClick={() => onOpen(insp.id)}
      role="button"
      tabIndex={0}
      onKeyDown={onCardKey}
    >
      <div className="flex items-center gap-[10px] mb-[10px]">
        <div className="ld-avatar">{insp.init}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-bold text-[var(--text)] mb-[1px]">{insp.name}</div>
          <div className="text-[10.5px] text-[var(--text-dim)] flex items-center gap-[5px]">
            <span
              className="inline-block w-[7px] h-[7px] rounded-full"
              style={{ background: STATUS_BG[insp.status] }}
            />
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

      <div className="grid grid-cols-3 gap-[6px] mt-[10px] pt-[10px] border-t border-dashed border-[var(--border-light)]">
        <div className="text-center">
          <div
            className="text-[14px] font-bold text-[var(--text)]"
            style={{ color: insp.hitRate >= 60 ? 'var(--green)' : 'var(--amber)' }}
          >
            {insp.hitRate.toFixed(0)}%
          </div>
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mt-[1px]">
            Hit rate
          </div>
        </div>
        <div className="text-center">
          <div className="text-[14px] font-bold text-[var(--text)]">{insp.avgClose}d</div>
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mt-[1px]">
            Avg close
          </div>
        </div>
        <div className="text-center">
          <div className="text-[14px] font-bold text-[var(--text)]">
            ₹{(insp.recovered / 100000).toFixed(1)}L
          </div>
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mt-[1px]">
            Recovered
          </div>
        </div>
      </div>

      {/* Action row (variants per capacity tier / status) */}
      {action.kind === 'leave' && (
        <div className="mt-[10px] flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled
            className={actionBtnBase}
            style={{ background: 'var(--bg)', color: 'var(--text-dim)', cursor: 'not-allowed' }}
          >
            ⚠ On leave — redistribute
          </button>
        </div>
      )}
      {action.kind === 'available' && (
        <div className="mt-[10px] flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={actionBtnBase}
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
        <div className="mt-[10px] flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={readOnly}
            onClick={handleReduce}
            className={actionBtnBase}
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
        <div className="mt-[10px] flex gap-[6px]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={actionBtnBase}
            style={{ cursor: 'default' }}
            tabIndex={-1}
          >
            Balanced load
          </button>
        </div>
      )}
    </div>
  )
}
