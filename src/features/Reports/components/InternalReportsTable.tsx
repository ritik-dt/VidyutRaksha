import type { InternalReport, ReportId } from '../types'

interface InternalReportsTableProps {
  reports: InternalReport[]
  onRun: (id: ReportId) => void
  onEdit: (r: InternalReport) => void
}

/** Section B · scheduled internal reports. Paused rows render dimmed. */
export function InternalReportsTable({ reports, onRun, onEdit }: InternalReportsTableProps) {
  return (
    <div className="card rep-list-card" style={{ marginBottom: 18 }}>
      <div className="rep-table-scroll">
        <table className="rep-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Frequency</th>
              <th>Channel</th>
              <th>Recipients</th>
              <th>Next run</th>
              <th className="rep-c">Status</th>
              <th className="rep-r">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className={r.status === 'Paused' ? 'rep-paused' : undefined}>
                <td>
                  <div className="rep-name-row">
                    <span>{r.icon}</span>
                    <strong>{r.name}</strong>
                  </div>
                  <div className="rep-name-last">Last: {r.last}</div>
                </td>
                <td>{r.freq}</td>
                <td>{r.channel}</td>
                <td>{r.recipients}</td>
                <td className="rep-next">{r.next}</td>
                <td className="rep-c">
                  <span
                    className={`rep-pill ${r.status === 'Active' ? 'rep-pill-active' : 'rep-pill-paused'}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="rep-r">
                  <button type="button" className="rep-btn-run" onClick={() => onRun(r.id)}>
                    Run now
                  </button>
                  <button type="button" className="rep-btn-edit" onClick={() => onEdit(r)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
