import type { DetailPanelKey, P2Warning } from '../types'

interface P2WarningsPanelProps {
  warnings: P2Warning[]
  onOpenPanel: (key: DetailPanelKey) => void
}

export function P2WarningsPanel({ warnings, onOpenPanel }: P2WarningsPanelProps) {
  return (
    <section className="exec-panel exec-area-excep">
      <h3 className="exec-panel-title">
        ⚠️ P2 Warnings — <em>Follow-up Required</em>
        <span className="exec-panel-ptag">{warnings.length} OPEN</span>
      </h3>
      <div className="exec-p2-list">
        {warnings.map((w) => (
          <div
            key={w.id}
            className="exec-p2-item"
            onClick={() => onOpenPanel(w.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-p2-type">{w.eyebrow}</div>
            <div className="exec-p2-title">{w.title}</div>
            <div className="exec-p2-detail">{w.detail}</div>
            <div className="exec-p2-badge">{w.badge}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
