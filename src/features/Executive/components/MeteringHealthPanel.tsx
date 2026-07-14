import type { DetailPanelKey, MeteringHealthData } from '../types'
import { progressFillClass } from '../logic/tone'

interface MeteringHealthPanelProps {
  data: MeteringHealthData
  onOpenPanel: (key: DetailPanelKey) => void
}

export function MeteringHealthPanel({ data, onOpenPanel }: MeteringHealthPanelProps) {
  return (
    <section className="exec-panel exec-area-meter">
      <h3 className="exec-panel-title">
        📟 <em>Metering</em> Health
      </h3>

      <div className="exec-meter-stats">
        {data.stats.map((s) => (
          <div
            key={s.id}
            className={`exec-meter-stat exec-meter-stat-${s.tone}`}
            onClick={() => onOpenPanel(s.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-meter-stat-head">
              <div className={`exec-meter-stat-name${s.nameStyle === 'emphasis' ? ' exec-meter-stat-name-emphasis' : ''}`}>
                {s.name}
              </div>
              <div className="exec-meter-stat-val">{s.valueText}</div>
            </div>
            <div className="exec-progress-bar">
              <div
                className={`exec-progress-fill ${progressFillClass(s.tone)}`}
                style={{ width: `${s.barPercent}%` }}
              />
            </div>
          </div>
        ))}

        <div className="exec-noncom-block">
          <div className="exec-noncom-title">
            {data.nonCom.title}
            <span className="exec-noncom-count">{data.nonCom.countText}</span>
          </div>
          <div className="exec-noncom-bars">
            {data.nonCom.buckets.map((b) => (
              <div key={b.label} className={`exec-noncom-row exec-age-${b.age}`}>
                <div className="exec-noncom-label">{b.label}</div>
                <div className="exec-noncom-track">
                  <div className={`exec-noncom-bar exec-age-${b.age}`} style={{ width: `${b.barPercent}%` }} />
                </div>
                <div className="exec-noncom-val">{b.valueText}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="exec-meter-stat exec-meter-stat-bad">
          <div className="exec-meter-stat-head">
            <div className="exec-meter-stat-name">{data.tamperToday.name}</div>
            <div className="exec-meter-stat-val">{data.tamperToday.valueText}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
