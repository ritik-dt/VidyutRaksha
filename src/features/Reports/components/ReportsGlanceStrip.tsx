import type { GlanceTile } from '../types'

interface ReportsGlanceStripProps {
  tiles: GlanceTile[]
}

/** At-a-glance strip. All 4 values are computed in logic, not hardcoded. */
export function ReportsGlanceStrip({ tiles }: ReportsGlanceStripProps) {
  return (
    <div className="rep-glance">
      {tiles.map((t) => (
        <div key={t.id} className={`rep-glance-tile rep-tone-${t.tone}`}>
          <div className="rep-glance-label">{t.label}</div>
          <div className="rep-glance-value">{t.value}</div>
          <div className="rep-glance-sub">{t.sub}</div>
        </div>
      ))}
    </div>
  )
}
