import type { CompletenessRow } from '../types'

interface CompletenessTableProps {
  rows: CompletenessRow[]
}

/** Data completeness by MRI file section. */
export function CompletenessTable({ rows }: CompletenessTableProps) {
  return (
    <div className="card">
      <div className="card-title">Data completeness — MRI file sections</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr className="table-header">
              <th>Section</th>
              <th>Complete</th>
              <th>Partial</th>
              <th>Missing</th>
              <th>Completeness %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.section} className="table-row">
                <td className="dq-area">{r.section}</td>
                <td className="dq-mono">{r.complete}</td>
                <td className="dq-mono">{r.partial}</td>
                <td className="dq-mono">{r.missing}</td>
                <td className="dq-pct" style={{ color: r.pctColor }}>
                  {r.pct}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
