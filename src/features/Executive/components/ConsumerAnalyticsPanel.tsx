import type { ConsumerAnalyticsData, DetailPanelKey } from '../types'
import { discomBarClass } from '../logic/tone'

interface ConsumerAnalyticsPanelProps {
  data: ConsumerAnalyticsData
  onOpenPanel: (key: DetailPanelKey) => void
  onToast: (msg: string) => void
}

export function ConsumerAnalyticsPanel({ data, onOpenPanel, onToast }: ConsumerAnalyticsPanelProps) {
  return (
    <section className="exec-panel exec-area-map">
      <h3 className="exec-panel-title">
        🔍 Consumer <em>Analytics</em> — Tamper &amp; Theft
        <span className="exec-panel-ptag">ACTIONABLE</span>
      </h3>

      <div className="exec-tamper-tiles">
        {data.tamperTiles.map((t) => (
          <div
            key={t.eyebrow}
            className={`exec-tamper-tile exec-tamper-${t.tone}`}
            onClick={() => onOpenPanel(t.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-tamper-eyebrow">{t.eyebrow}</div>
            <div className="exec-tamper-val">{t.value}</div>
            <div className="exec-tamper-detail">{t.detail}</div>
          </div>
        ))}
      </div>

      <div className="exec-sec-label">Tamper Cases by DISCOM — This Month</div>
      <div className="exec-dc-rows">
        {data.discoms.map((d) => (
          <div
            key={d.id}
            className="exec-dc-row"
            onClick={() => { onToast(d.toastMessage); onOpenPanel(d.panelKey) }}
            role="button"
            tabIndex={0}
          >
            <div className="exec-dc-lbl">
              <span className={`exec-dc-dot exec-dc-dot-${d.tone}`} />
              {d.name}
            </div>
            <div className="exec-dc-track">
              <div className={`exec-dc-fill ${discomBarClass(d.tone)}`} style={{ width: `${d.percent}%` }}>
                <span>{d.cases.toLocaleString()}</span>
              </div>
            </div>
            <div className="exec-dc-tgt">{d.priority}</div>
          </div>
        ))}
      </div>

      <div className="exec-pipeline">
        <div className="exec-sec-label">Investigation Pipeline</div>
        <div className="exec-pipe-rows">
          {data.pipeline.map((p) => (
            <div key={p.label} className={`exec-pipe-row exec-pipe-row-${p.tone}`}>
              <span className="exec-pipe-label">{p.emoji} {p.label}</span>
              <span className="exec-pipe-count">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="exec-action-grid">
        {data.actionButtons.map((a) => (
          <button
            key={a.label}
            type="button"
            className={`exec-action-btn exec-action-btn-${a.tone}`}
            onClick={() => onToast(a.toast)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </section>
  )
}
