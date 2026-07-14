import type { CSSProperties } from 'react'
import { uptimeColor } from '../logic/integrationStats'
import type { IntegrationSystem } from '../types'

interface SystemCardProps {
  system: IntegrationSystem
  onTest: (s: IntegrationSystem) => void
  onViewLogs: (s: IntegrationSystem) => void
}

/** One connected system: coloured left border, identity, status badge,
 *  a 2-column info panel, and the two action buttons. */
export function SystemCard({ system, onTest, onViewLogs }: SystemCardProps) {
  return (
    <div
      className="card int-card"
      style={{ '--int-color': system.color } as CSSProperties}
    >
      <div className="int-head">
        <div className="int-ident">
          <div className="int-icon">{system.icon}</div>
          <div>
            <div className="int-name">{system.name}</div>
            <div className="int-meta">
              {system.type} • {system.vendor}
            </div>
          </div>
        </div>
        <span className="badge int-status">{system.status.toUpperCase()}</span>
      </div>

      <div className="int-info">
        <div>
          <span className="int-info-label">Last sync:</span>
          <div className="int-info-val">{system.lastSync}</div>
        </div>
        <div>
          <span className="int-info-label">Uptime:</span>
          <div className="int-info-val" style={{ color: uptimeColor(system.uptime) }}>
            {system.uptime}
          </div>
        </div>
        <div className="int-info-today">
          <span className="int-info-label">Today:</span>
          <div className="int-info-val">{system.recordsToday}</div>
        </div>
      </div>

      <div className="int-actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onTest(system)}
        >
          Test connection
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onViewLogs(system)}
        >
          View logs
        </button>
      </div>
    </div>
  )
}
