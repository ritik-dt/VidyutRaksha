import type { AdhocReport, ReportId } from '../types'

interface AdhocListProps {
  reports: AdhocReport[]
  onRun: (id: ReportId) => void
  onSave: () => void
}

/** Section C · saved NL-query reports. */
export function AdhocList({ reports, onRun, onSave }: AdhocListProps) {
  return (
    <div className="card rep-list-card">
      {reports.map((q) => (
        <div key={q.id} className="rep-adhoc-row">
          <div className="rep-adhoc-icon">🔍</div>
          <div className="rep-adhoc-body">
            <div className="rep-adhoc-q">{q.query}</div>
            <div className="rep-adhoc-meta">
              {q.author} · Last run: {q.lastRun} · {q.uses} runs
            </div>
          </div>
          <div className="rep-adhoc-actions">
            <button type="button" className="rep-btn-runsm" onClick={() => onRun(q.id)}>
              Run
            </button>
            <button type="button" className="rep-btn-savesm" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
