import { EmptyState } from '@/shared/components/ui/EmptyState'
import { staticRoleBadge } from '../logic/auditVisibility'
import type { AuditLogEntry } from '../types'

interface StaticAuditTableProps {
  rows: AuditLogEntry[]
}

/** The compliance audit log — every action SHA-256 signed for admissibility. */
export function StaticAuditTable({ rows }: StaticAuditTableProps) {
  return (
    <div className="card">
      <div className="card-title">Audit log (last 50 actions)</div>

      {rows.length === 0 ? (
        <EmptyState
          title="No matching log entries"
          description="Try a different search term."
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th>Signature</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.ts + l.action} className="table-row">
                  <td className="font-[var(--mono)] text-[10px] text-[var(--text-mid)] whitespace-nowrap">
                    {l.ts}
                  </td>
                  <td className="font-semibold text-[11px]">{l.user}</td>
                  <td>
                    <span className={`badge text-[9px] ${staticRoleBadge(l.role)}`}>
                      {l.role}
                    </span>
                  </td>
                  <td className="font-[var(--mono)] text-[10px] text-[var(--id-text)] font-semibold">
                    {l.action}
                  </td>
                  <td className="text-[11px]">{l.entity}</td>
                  <td className="text-[11px] text-[var(--text-mid)]">{l.details}</td>
                  <td className="font-[var(--mono)] text-[10px] text-[var(--ai-purple)]">
                    {l.sig}
                  </td>
                  <td className="font-[var(--mono)] text-[10px] text-[var(--text-dim)]">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
