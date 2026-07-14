import { EVIDENCE_ITEMS } from '../data/assessment'

/** "Evidence package — auto-attached to assessment order" card. */
export function EvidencePackageCard() {
  return (
    <div className="card mt-3.5">
      <div className="card-title">Evidence package — auto-attached to assessment order</div>
      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {EVIDENCE_ITEMS.map((e) => (
          <div
            key={e.n}
            className="rounded-md p-2.5"
            style={{
              background: 'var(--bg)',
              borderLeft: '3px solid var(--ai-purple)',
            }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <span
                className="inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: 'var(--ai-purple)' }}
              >
                {e.n}
              </span>
              <span className="text-[18px]">{e.icon}</span>
              <span className="text-[12px] font-bold">{e.title}</span>
            </div>
            <div className="ml-7 text-[11px] text-text-mid">{e.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
