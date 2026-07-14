import type { DetailPanelKey, TrendChart } from '../types'
import { textToneClass } from '../logic/tone'

interface TrendsPanelProps {
  trends: TrendChart[]
  onOpenPanel: (key: DetailPanelKey) => void
}

function Sparkline({ points, color, id }: { points: number[]; color: string; id: string }) {
  // Points are y-values in 0..50 (svg viewBox 200×50). x is evenly spaced.
  const w = 200
  const h = 50
  const stepX = w / (points.length - 1)
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * stepX).toFixed(1)},${y}`).join(' ')
  const areaPath = `${path} L${w},${h} L0,${h} Z`
  const gradId = `exec-spark-${id}`

  return (
    <svg className="exec-sparkline-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
      <path d={areaPath} fill={`url(#${gradId})`} />
      <text x="0"   y="48" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="var(--exec-ink5)">D-7</text>
      <text x="175" y="48" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="var(--exec-ink5)">Today</text>
    </svg>
  )
}

export function TrendsPanel({ trends, onOpenPanel }: TrendsPanelProps) {
  return (
    <section className="exec-panel exec-area-trends">
      <h3 className="exec-panel-title">
        📈 7-Day <em>Trends</em>
      </h3>
      <div className="exec-trend-charts">
        {trends.map((t) => (
          <div
            key={t.id}
            className="exec-trend-card"
            onClick={() => onOpenPanel(t.panelKey)}
            role="button"
            tabIndex={0}
          >
            <div className="exec-trend-title">
              <span>{t.title}</span>
              <span className={`exec-trend-val ${textToneClass(t.valueTone as 'jade' | 'amber' | 'crimson' | 'brand')}`}>
                {t.valueText}
              </span>
            </div>
            <Sparkline points={t.points} color={t.color} id={t.id} />
            <div className="exec-sparkline-labels">
              {t.labels.map((l, i) => (
                <span
                  key={l + i}
                  className={i === t.labels.length - 1 ? `exec-sparkline-last ${textToneClass(t.finalTone)}` : ''}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
