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
                  <td className="aud-ts">{l.ts}</td>
                  <td className="aud-user">{l.user}</td>
                  <td>
                    <span className={`badge aud-badge ${staticRoleBadge(l.role)}`}>
                      {l.role}
                    </span>
                  </td>
                  <td className="aud-action">{l.action}</td>
                  <td className="aud-entity">{l.entity}</td>
                  <td className="aud-details">{l.details}</td>
                  <td className="aud-sig">{l.sig}</td>
                  <td className="aud-ip">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
