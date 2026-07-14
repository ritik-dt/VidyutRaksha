import type { DemandGenerationData, DetailPanelKey } from '../types'
import { textToneClass } from '../logic/tone'

interface DemandGenerationPanelProps {
  data: DemandGenerationData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function DemandGenerationPanel({ data, onOpenPanel }: DemandGenerationPanelProps) {
  return (
    <section className="exec-panel exec-area-demand">
      <h3 className="exec-panel-title">
        🔋 Demand <em>vs Generation</em>
      </h3>

      <div className="exec-dg-wrap">
        <div className="exec-dg-title-row">
          <span className="exec-dg-chart-title">Supply–Demand Balance</span>
          <span className="exec-dg-chart-val exec-text-crimson">{data.balanceText}</span>
        </div>

        {data.rows.map((r) => (
          <div key={r.label} className="exec-dg-row" onClick={() => onOpenPanel(r.panelKey)} role="button" tabIndex={0}>
            <div className="exec-dg-label">{r.label}</div>
            <div className="exec-dg-track">
              <div
                className={`exec-dg-fill exec-dg-fill-${r.gradient}`}
                style={{ width: `${r.percent}%` }}
              >
                <span>{r.valueText}</span>
              </div>
            </div>
            <div className={`exec-dg-num ${textToneClass(r.gradient)}`}>{r.numericText}</div>
          </div>
        ))}

        <div
          className="exec-dg-deficit"
          onClick={() => onOpenPanel(data.deficitAlert.panelKey)}
          role="button"
          tabIndex={0}
        >
          <span className="exec-dg-deficit-text">{data.deficitAlert.text}</span>
          <span className="exec-dg-deficit-val">{data.deficitAlert.valueText}</span>
        </div>
      </div>

      <div className="exec-dg-summary">
        {data.summary.map((s) => (
          <div
            key={s.label}
            className="exec-dg-sum-item"
            onClick={() => onOpenPanel(s.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className={`exec-dg-sum-val ${textToneClass(s.tone)}`}>{s.valueText}</div>
            <div className="exec-dg-sum-lbl">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
