import type { CSSProperties } from 'react'
import type { Role } from '../types'

interface RoleDefinitionsGridProps {
  roles: Role[]
}

/** Role definitions & permissions — 5 cards, each colour-keyed by role. */
export function RoleDefinitionsGrid({ roles }: RoleDefinitionsGridProps) {
  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-title">Role definitions &amp; permissions</div>
      <div className="usr-role-grid">
        {roles.map((r) => (
          <div
            key={r.name}
            className="usr-role-card"
            style={{ '--usr-role-color': r.color } as CSSProperties}
          >
            <div className="usr-role-head">
              <div className="usr-role-name">{r.name}</div>
              <span className="usr-role-count">{r.count}</span>
            </div>
            <div className="usr-role-perms">
              {r.perms.map((p) => (
                <div key={p} className="usr-role-perm">
                  <span className="usr-role-bullet">•</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
