import { VIJAYA_MEMBERS, VIJAYA_REASONS, memberCardStyle } from '../data/clusters'

interface ClusterCaseDetailProps {
  onBatchRaid: () => void
}

/** Featured case detail for CL-2026-042 (Vijaya Complex) — matches the prototype. */
export function ClusterCaseDetail({ onBatchRaid }: ClusterCaseDetailProps) {
  return (
    <div className="card mt-3.5">
      <div className="card-title text-ai-purple">
        ✦ Case detail — CL-2026-042 (Vijaya Complex)
      </div>

      <div className="grid-2 mt-3 gap-3.5">
        {/* Group members */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-text-dim">
            Group members (5 consumers)
          </div>
          <div className="flex flex-col gap-1.5">
            {VIJAYA_MEMBERS.map((m) => {
              const s = memberCardStyle(m.status)
              return (
                <div
                  key={m.name}
                  className="rounded-md p-2.5"
                  style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[12px] font-bold">{m.name}</div>
                    <span
                      className="shrink-0 rounded-lg px-1.5 py-px text-[9px] font-bold"
                      style={{ background: s.badgeBg, color: s.badgeColor }}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-text-mid">
                    Meter {m.meter} · {m.detail}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Why linked */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-text-dim">
            Why these 5 are linked
          </div>
          <div className="mb-3.5 flex flex-col gap-2">
            {VIJAYA_REASONS.map((r) => (
              <div key={r.title} className="rounded-md p-2.5" style={{ background: 'var(--bg)' }}>
                <strong className="text-[11px] text-ai-purple">
                  {r.icon} {r.title}
                </strong>
                <div
                  className="mt-0.5 text-[11px] text-text-mid"
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ai btn-sm w-full"
            style={{ fontSize: '12px' }}
            onClick={onBatchRaid}
          >
            ✦ Create batch raid for all 5 (with police coordination)
          </button>
        </div>
      </div>
    </div>
  )
}
