import type { EvidenceTile } from '../types'

interface EvidencePackCardProps {
  tiles: EvidenceTile[]
  caseLabel: string
  onVerifyChain: () => void
  onDownload: () => void
}

/** The 6-artefact evidence pack assembled for a confirmed case.
 *  Responsive: row on desktop → 3-up wrap at ≤1100px → single column at ≤640px. */
export function EvidencePackCard({
  tiles,
  caseLabel,
  onVerifyChain,
  onDownload,
}: EvidencePackCardProps) {
  return (
    <div className="card mb-[14px]">
      <div className="card-title text-[var(--ai-purple)]">
        ✦ Recent evidence pack — {caseLabel}
      </div>

      <div className="flex gap-[10px] mt-3 max-[1100px]:flex-wrap max-[640px]:flex-col">
        {tiles.map((t) => (
          <div
            key={t.title}
            className="flex-1 min-w-0 p-[10px] bg-[var(--bg)] rounded-md border-l-[3px] max-[1100px]:flex-[1_1_calc(33.333%-7px)] max-[640px]:flex-[1_1_auto]"
            style={{ borderLeftColor: t.color }}
          >
            <div className="text-[20px] mb-1">{t.icon}</div>
            <div className="text-[11px] font-bold text-[var(--text)]">{t.title}</div>
            <div className="text-[10px] text-[var(--text-dim)] mt-[2px] [overflow-wrap:anywhere]">
              {t.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end gap-[6px] flex-wrap">
        <button type="button" className="btn btn-outline btn-sm" onClick={onVerifyChain}>
          🔍 Verify chain
        </button>
        <button type="button" className="btn btn-ai btn-sm" onClick={onDownload}>
          ⬇ Download evidence pack
        </button>
      </div>
    </div>
  )
}
