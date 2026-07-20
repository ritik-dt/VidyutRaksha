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
 *
 * Matches the prototype's markup byte-for-byte — SVG sparkle icon, "Phase 3 —"
 * subtitle, no flex-wrap or text-align on the header.
 */
export function RoleActivityLog({
  rows,
  visibleCount,
  totalCount,
  blurb,
}: RoleActivityLogProps) {
  return (
    <div className="card mt-[14px] border-l-[3px] border-l-[var(--ai-purple)]">
      <div className="card-title flex justify-between items-center">
        <span>
          {/* Prototype's `${sparkle}` — inline SVG, 14×14, single-star path, currentColor stroke */}
          <svg
            className="inline-block align-middle mr-1"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          Role activity log (Phase 3 — scoped by role)
        </span>
        <span className="text-[10px] text-[var(--text-dim)] font-normal">
          Showing {visibleCount} of {totalCount} entries · {blurb}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="py-8 px-5 text-center text-[var(--text-dim)]">
          <div className="text-[28px] mb-2 opacity-40">📝</div>
          <div className="font-bold text-[var(--text-mid)] text-[13px]">No activity yet</div>
          <div className="text-[11px] mt-1">
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
                  <td className="text-[10.5px] text-[var(--text-mid)] whitespace-nowrap font-[var(--mono)]">
                    {formatTime(e.ts)}
                  </td>
                  <td>
                    <span
                      className="inline-block py-[2px] px-2 rounded-[10px] text-[9.5px] font-bold text-white"
                      style={{ background: roleColor(e.roleId) }}
                    >
                      {levelOf(e.roleId)}
                    </span>
                    {/* Space char matches prototype's `</span> <span>` — combined with ml-1 gives ~8px gap */}
                    {' '}
                    <span className="text-[11px] font-semibold ml-1">{e.roleLabel}</span>
                  </td>
                  <td className="text-[11px] font-semibold text-[var(--text)]">{e.action}</td>
                  <td className="text-[11px] text-[var(--text-mid)]">{e.target}</td>
                  <td className="text-[10.5px] text-[var(--text-dim)]">{e.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
