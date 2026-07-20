import type { Role } from '../types'

interface RoleDefinitionsGridProps {
  roles: Role[]
}

/** Role definitions & permissions — 5 cards, each colour-keyed by role.
 *  Responsive columns: 5 (default) → 3 (≤1200px) → 2 (≤820px) → 1 (≤560px). */
export function RoleDefinitionsGrid({ roles }: RoleDefinitionsGridProps) {
  return (
    <div className="card mb-[14px]">
      <div className="card-title">Role definitions &amp; permissions</div>
      <div className="grid grid-cols-5 gap-[10px] mt-3 max-[1200px]:grid-cols-3 max-[820px]:grid-cols-2 max-[560px]:grid-cols-1">
        {roles.map((r) => (
          <div
            key={r.name}
            className="p-3 bg-[var(--bg)] rounded-lg border-t-4 min-w-0"
            style={{ borderTopColor: r.color }}
          >
            <div className="flex justify-between items-center mb-2 gap-[6px]">
              <div
                className="font-bold text-[13px] min-w-0 [overflow-wrap:anywhere]"
                style={{ color: r.color }}
              >
                {r.name}
              </div>
              <span
                className="text-white py-[2px] px-2 rounded-xl text-[10px] font-bold shrink-0"
                style={{ background: r.color }}
              >
                {r.count}
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-mid)] leading-[1.7]">
              {r.perms.map((p) => (
                <div key={p} className="flex gap-1 items-start">
                  <span className="shrink-0" style={{ color: r.color }}>
                    •
                  </span>
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
