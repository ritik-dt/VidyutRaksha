import type { CSSProperties } from 'react'
import type { ActivityEntry } from '@/shared/context/ActivityLogContext'
import { ROLES } from '@/data/roles'
import { formatTime, roleColor } from '../logic/auditVisibility'

interface RoleActivityLogProps {
  rows: ActivityEntry[]
  visibleCount: number
  totalCount: number
  blurb: string
}

/** Look up a role's hierarchy level (L0-L5) for the badge. */
function levelOf(roleId: string): string {
  return ROLES.find((r) => r.id === roleId)?.level ?? '?'
}

/**
 * The LIVE activity log, scoped by role.
 *
 * Entries are produced by every module through ActivityLogContext, then filtered
 * through the active role's visibility scope: CMD/Chief/Analyst see everything,
 * an SE sees SE+EE+AEN, an EE sees EE+AEN, and an AEN sees only their own
 * actions. The header states exactly what the current role can see.
 */
export function RoleActivityLog({
  rows,
  visibleCount,
  totalCount,
  blurb,
}: RoleActivityLogProps) {
  return (
    <div className="card aud-activity-card">
      <div className="card-title aud-activity-title">
        <span>✦ Role activity log (scoped by role)</span>
        <span className="aud-activity-meta">
          Showing {visibleCount} of {totalCount} entries · {blurb}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="aud-empty">
          <div className="aud-empty-icon">📝</div>
          <div className="aud-empty-title">No activity yet</div>
          <div className="aud-empty-sub">
            Switch roles or perform actions to see entries here.
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>When</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target</th>
                <th>Scope</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="table-row">
                  <td className="aud-when">{formatTime(e.ts)}</td>
                  <td>
                    <span
                      className="aud-level"
                      style={{ '--aud-role-color': roleColor(e.roleId) } as CSSProperties}
                    >
                      {levelOf(e.roleId)}
                    </span>
                    <span className="aud-role-label">{e.roleLabel}</span>
                  </td>
                  <td className="aud-act">{e.action}</td>
                  <td className="aud-target">{e.target}</td>
                  <td className="aud-scope">{e.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
