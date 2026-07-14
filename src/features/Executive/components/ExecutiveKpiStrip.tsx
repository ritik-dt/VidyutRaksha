import { kpiStatusClass } from '../logic/tone'
import type { DetailPanelKey, ExecutiveKpi } from '../types'

interface ExecutiveKpiStripProps {
  kpis: ExecutiveKpi[]
  onOpenPanel: (key: DetailPanelKey) => void
}

export function ExecutiveKpiStrip({ kpis, onOpenPanel }: ExecutiveKpiStripProps) {
  return (
    <div className="exec-kpi-strip">
      {kpis.map((k) => (
        <div
          key={k.id}
          className={`exec-kpi-tile ${kpiStatusClass(k.status)}`}
          onClick={() => onOpenPanel(k.panelKey)}
          role="button"
          tabIndex={0}
        >
          <div className="exec-kpi-label">{k.label}</div>
          <div className="exec-kpi-value">{k.value}</div>
          <div className="exec-kpi-target">{k.unitOrTarget}</div>
          <div className="exec-kpi-rag">{k.ragEmoji}</div>
          <div className="exec-kpi-ur">
            <span>U<strong>{k.urban}</strong></span>
            <span>R<strong>{k.rural}</strong></span>
          </div>
        </div>
      ))}
    </div>
  )
}
