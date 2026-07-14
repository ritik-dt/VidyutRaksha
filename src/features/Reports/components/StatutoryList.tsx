import { deadlineToneColor } from '../logic/reportStats'
import type { ReportId, StatutoryReport } from '../types'

interface StatutoryListProps {
  reports: StatutoryReport[]
  onOpen: (id: ReportId) => void
  onChecklist: (r: StatutoryReport) => void
}

/** Section A · statutory filings, already sorted by urgency in the hook. */
export function StatutoryList({ reports, onOpen, onChecklist }: StatutoryListProps) {
  return (
    <div className="card rep-list-card" style={{ marginBottom: 18 }}>
      {reports.map((r) => (
        <div key={r.id} className="rep-stat-row">
          <div className="rep-stat-days">
            <div className="rep-stat-days-n" style={{ color: deadlineToneColor(r.daysLeft) }}>
              {r.daysLeft}
            </div>
            <div className="rep-stat-days-l">days left</div>
          </div>

          <div className="rep-stat-body">
            <div className="rep-stat-title-row">
              <span className="rep-stat-name">{r.name}</span>
              <span className="rep-stat-status" style={{ background: r.statusColor }}>
                {r.status}
              </span>
              <span className="rep-stat-reg">{r.regulator}</span>
            </div>
            <div className="rep-stat-basis">
              {r.basis} · {r.frequency} · Owner: <strong>{r.owner}</strong>
            </div>
            <div className="rep-stat-meta">
              📅 Due <strong>{r.deadline}</strong> · Last filed: {r.lastFiled} ·{' '}
              <span className="rep-stat-risk">⚠ Risk if missed:</span> {r.penalty}
            </div>
          </div>

          <div className="rep-stat-actions">
            <button type="button" className="rep-btn-open" onClick={() => onOpen(r.id)}>
              Open →
            </button>
            <button type="button" className="rep-btn-ghost" onClick={() => onChecklist(r)}>
              Checklist
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
