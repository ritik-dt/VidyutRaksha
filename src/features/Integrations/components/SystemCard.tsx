import { uptimeColor } from '../logic/integrationStats'
import type { IntegrationSystem } from '../types'

interface SystemCardProps {
  system: IntegrationSystem
  onTest: (s: IntegrationSystem) => void
  onViewLogs: (s: IntegrationSystem) => void
}

/** One connected system: coloured left border, identity, status badge,
 *  a 2-column info panel, and the two action buttons.
 *
 *  Matches the prototype's inline styles byte-for-byte. Responsive: header,
 *  info-grid, and action-row all stack to a single column at ≤520px. */
export function SystemCard({ system, onTest, onViewLogs }: SystemCardProps) {
  return (
    <div
      className="card"
      style={{ borderLeft: `4px solid ${system.color}` }}
    >
      <div className="flex justify-between items-start mb-[10px] max-[520px]:flex-col max-[520px]:gap-2">
        <div className="flex gap-[10px] min-w-0">
          <div className="text-[24px] shrink-0 leading-[1.2]">{system.icon}</div>
          <div className="min-w-0">
            <div className="font-bold text-[13px] [overflow-wrap:anywhere]">{system.name}</div>
            <div className="text-[10px] text-[var(--text-dim)] [overflow-wrap:anywhere]">
              {system.type} • {system.vendor}
            </div>
          </div>
        </div>
        <span
          className="badge text-[9px] shrink-0"
          style={{ background: system.color, color: '#fff' }}
        >
          {system.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2 bg-[var(--bg)] rounded-md text-[11px] max-[520px]:grid-cols-1">
        <div>
          <span className="text-[var(--text-dim)]">Last sync:</span>
          <div className="font-semibold">{system.lastSync}</div>
        </div>
        <div>
          <span className="text-[var(--text-dim)]">Uptime:</span>
          <div className="font-semibold" style={{ color: uptimeColor(system.uptime) }}>
            {system.uptime}
          </div>
        </div>
        <div className="col-span-2 max-[520px]:col-span-1">
          <span className="text-[var(--text-dim)]">Today:</span>
          <div className="font-semibold font-[var(--mono)]">{system.recordsToday}</div>
        </div>
      </div>

      <div className="mt-2 flex gap-1 max-[520px]:flex-col">
        <button
          type="button"
          className="btn btn-outline btn-sm text-[10px] flex-1"
          onClick={() => onTest(system)}
        >
          Test connection
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm text-[10px] flex-1"
          onClick={() => onViewLogs(system)}
        >
          View logs
        </button>
      </div>
    </div>
  )
}
