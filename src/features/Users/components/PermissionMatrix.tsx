import type { PermissionRow, PermValue } from '../types'

/** Render one permission cell: ✓ (full), ✗ (none), or an amber scope label. */
function PermCell({ value }: { value: PermValue }) {
  if (value === true) return <span className="usr-perm-yes">✓</span>
  if (value === false) return <span className="usr-perm-no">✗</span>
  return <span className="usr-perm-scope">{value}</span>
}

interface PermissionMatrixProps {
  rows: PermissionRow[]
  role: string
}

/** Sample permission matrix for a single role, plus the legend. */
export function PermissionMatrix({ rows, role }: PermissionMatrixProps) {
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-title">🔐 Permission matrix (sample for {role} role)</div>

      <div className="table-wrap" style={{ marginTop: 10 }}>
        <table>
          <thead>
            <tr className="table-header">
              <th>Screen / Feature</th>
              <th style={{ textAlign: 'center' }}>View</th>
              <th style={{ textAlign: 'center' }}>Create</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
              <th style={{ textAlign: 'center' }}>Export</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.screen} className="table-row">
                <td className="usr-perm-screen">{r.screen}</td>
                <td className="usr-perm-cell">
                  <PermCell value={r.view} />
                </td>
                <td className="usr-perm-cell">
                  <PermCell value={r.create} />
                </td>
                <td className="usr-perm-cell">
                  <PermCell value={r.edit} />
                </td>
                <td className="usr-perm-cell">
                  <PermCell value={r.del} />
                </td>
                <td className="usr-perm-cell">
                  <PermCell value={r.export} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="usr-legend">
        <strong>Legend:</strong> <span className="usr-legend-yes">✓</span> = full access
        &nbsp;·&nbsp; <span className="usr-legend-no">✗</span> = no access &nbsp;·&nbsp;
        <span className="usr-legend-scope">zone/assigned/own</span> = scope-limited
      </div>
    </div>
  )
}
