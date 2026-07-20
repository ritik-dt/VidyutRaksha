import type { PermissionRow, PermValue } from '../types'

/** Render one permission cell: ✓ (full), ✗ (none), or an amber scope label. */
function PermCell({ value }: { value: PermValue }) {
  if (value === true) return <span className="text-[var(--green)] font-bold">✓</span>
  if (value === false) return <span className="text-[var(--red)]">✗</span>
  return <span className="text-[var(--amber)] font-semibold text-[10px]">{value}</span>
}

interface PermissionMatrixProps {
  rows: PermissionRow[]
  role: string
}

/** Sample permission matrix for a single role, plus the legend. */
export function PermissionMatrix({ rows, role }: PermissionMatrixProps) {
  return (
    <div className="card mt-[14px]">
      <div className="card-title">🔐 Permission matrix (sample for {role} role)</div>

      <div className="table-wrap mt-[10px]">
        <table>
          <thead>
            <tr className="table-header">
              <th>Screen / Feature</th>
              <th className="text-center">View</th>
              <th className="text-center">Create</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
              <th className="text-center">Export</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.screen} className="table-row">
                <td className="font-semibold">{r.screen}</td>
                <td className="text-center">
                  <PermCell value={r.view} />
                </td>
                <td className="text-center">
                  <PermCell value={r.create} />
                </td>
                <td className="text-center">
                  <PermCell value={r.edit} />
                </td>
                <td className="text-center">
                  <PermCell value={r.del} />
                </td>
                <td className="text-center">
                  <PermCell value={r.export} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-[10px] p-[10px] bg-[var(--bg)] rounded-md text-[11px] text-[var(--text-mid)]">
        <strong>Legend:</strong> <span className="text-[var(--green)] font-bold">✓</span> = full
        access &nbsp;·&nbsp; <span className="text-[var(--red)]">✗</span> = no access
        &nbsp;·&nbsp;
        <span className="text-[var(--amber)] font-semibold">zone/assigned/own</span> = scope-limited
      </div>
    </div>
  )
}
