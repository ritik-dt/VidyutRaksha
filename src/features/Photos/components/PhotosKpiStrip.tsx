import type { PhotoFilter, PhotoStats } from '../types'

interface PhotosKpiStripProps {
  stats: PhotoStats
  onFilter: (filter: PhotoFilter) => void
}

/** 5-KPI strip — exact port (Quality rejections / Today uploaded / AI conf / Needs review / Missing). */
export function PhotosKpiStrip({ stats, onFilter }: PhotosKpiStripProps) {
  return (
    <div className="kpi-row">
      <div className="kpi-card clickable" onClick={() => onFilter({ filter: 'rejected' })}>
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Quality rejections</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{stats.qualityRejections}</div>
        <div className="kpi-sub">This week · training signal</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--green)' }} />
        <div className="kpi-label">Today uploaded</div>
        <div className="kpi-value">{stats.todayUploaded}</div>
        <div className="kpi-sub">{stats.todayCases} cases</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--teal, #17a2b8)' }} />
        <div className="kpi-label">AI avg confidence</div>
        <div className="kpi-value">{stats.aiAvgConfidence}%</div>
      </div>

      <div className="kpi-card clickable" onClick={() => onFilter({ status: 'flagged' })}>
        <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
        <div className="kpi-label">Needs review</div>
        <div className="kpi-value" style={{ color: 'var(--amber)' }}>{stats.needsReview}</div>
        <div className="kpi-sub">Low confidence</div>
      </div>

      <div className="kpi-card">
        <div className="kpi-accent" style={{ background: 'var(--red)' }} />
        <div className="kpi-label">Missing photos</div>
        <div className="kpi-value" style={{ color: 'var(--red)' }}>{stats.missingPhotos}</div>
        <div className="kpi-sub">Cases incomplete</div>
      </div>
    </div>
  )
}
