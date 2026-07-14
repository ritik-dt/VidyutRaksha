import type { CriticalAlert, DetailPanelKey } from '../types'

interface CriticalAlertsProps {
  alerts: CriticalAlert[]
  onOpenPanel: (key: DetailPanelKey) => void
  onToast: (msg: string) => void
}

export function CriticalAlerts({ alerts, onOpenPanel, onToast }: CriticalAlertsProps) {
  const p1Count = alerts.length
  return (
    <div className="exec-critical-alerts">
      <div className="exec-critical-alerts-header">
        <div className="exec-critical-alerts-title">
          🚨 Critical Alerts — Action Required
          <span className="exec-critical-count">{p1Count} P1 · 4 P2</span>
        </div>
        <button
          type="button"
          className="exec-critical-goto"
          onClick={() => onOpenPanel('alert1')}
        >
          View All Exceptions →
        </button>
      </div>
      <div className="exec-critical-cards">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="exec-critical-card"
            onClick={() => { onToast(a.cardToast); onOpenPanel(a.panelKey) }}
            role="button"
            tabIndex={0}
          >
            <div className="exec-critical-eyebrow">{a.eyebrow}</div>
            <div className="exec-critical-card-title">{a.title}</div>
            <div className="exec-critical-detail">{a.detail}</div>
            <div className="exec-critical-footer">
              <span className="exec-critical-impact">{a.impact}</span>
              <button
                type="button"
                className="exec-critical-action"
                onClick={(e) => { e.stopPropagation(); onToast(a.actionToast) }}
              >
                {a.actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
