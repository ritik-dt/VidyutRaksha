import { deadlineToneColor } from '../logic/reportStats'
import type { ReportId, StatutoryReport } from '../types'

interface StatutoryListProps {
  reports: StatutoryReport[]
  onOpen: (id: ReportId) => void
  onChecklist: (r: StatutoryReport) => void
}

/**
 * Section A · statutory filings, already sorted by urgency in the hook.
 *
 * Layout (prototype): 3-column flex row —
 *   [days-left tile] · [name/basis/meta body] · [Open/Checklist buttons]
 * Mobile: buttons drop to their own row underneath so text can breathe.
 */
export function StatutoryList({ reports, onOpen, onChecklist }: StatutoryListProps) {
  return (
    <div className="card !p-0 mb-[18px] overflow-hidden">
      {reports.map((r, idx) => (
        <div
          key={r.id}
          className={
            'flex gap-[14px] py-[13px] px-[16px] items-start transition-[background_0.15s] hover:bg-[var(--bg-soft)] max-[640px]:flex-wrap max-[640px]:gap-[10px] max-[640px]:py-[11px] max-[640px]:px-[13px]' +
            (idx > 0 ? ' border-t border-t-[var(--border-light)]' : '')
          }
        >
          {/* days-left tile */}
          <div className="w-[54px] shrink-0 text-center max-[640px]:w-[46px]">
            <div
              className="text-[22px] font-extrabold font-['JetBrains_Mono',_ui-monospace,_monospace] leading-none max-[640px]:text-[20px]"
              style={{ color: deadlineToneColor(r.daysLeft) }}
            >
              {r.daysLeft}
            </div>
            <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.4px] mt-[1px]">days left</div>
          </div>

          {/* body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[8px] mb-[4px] flex-wrap">
              <span className="text-[12.5px] font-bold text-[var(--text)] break-words max-[480px]:text-[12px]">{r.name}</span>
              <span
                className="py-[1px] px-[7px] text-white rounded-[3px] text-[9px] font-bold tracking-[0.3px] whitespace-nowrap"
                style={{ background: r.statusColor }}
              >
                {r.status}
              </span>
              <span className="py-[1px] px-[6px] bg-[var(--bg-soft)] text-[var(--text-mid)] rounded-[3px] text-[9.5px] font-semibold whitespace-nowrap">
                {r.regulator}
              </span>
            </div>
            <div className="text-[10.5px] text-[var(--text-mid)] mb-[3px] leading-[1.45] break-words [&_strong]:text-[var(--text)]">
              {r.basis} · {r.frequency} · Owner: <strong>{r.owner}</strong>
            </div>
            <div className="text-[10px] text-[var(--text-dim)] leading-[1.45] [overflow-wrap:anywhere] [&_strong]:text-[var(--text)]">
              📅 Due <strong>{r.deadline}</strong> · Last filed: {r.lastFiled} ·{' '}
              <span className="text-[var(--red)]">⚠ Risk if missed:</span> {r.penalty}
            </div>
          </div>

          {/* actions */}
          <div className="flex flex-col gap-[5px] shrink-0 max-[640px]:flex-row max-[640px]:basis-full max-[640px]:pt-[2px]">
            <button
              type="button"
              className="py-[6px] px-[14px] [background:var(--ai-gradient)] text-white border-none rounded-[7px] text-[11px] font-bold cursor-pointer whitespace-nowrap hover:[filter:brightness(1.05)]"
              onClick={() => onOpen(r.id)}
            >
              Open →
            </button>
            <button
              type="button"
              className="py-[5px] px-[12px] bg-transparent text-[var(--text-mid)] border border-[var(--border)] rounded-[6px] text-[10px] font-semibold cursor-pointer whitespace-nowrap hover:bg-[var(--bg-soft)]"
              onClick={() => onChecklist(r)}
            >
              Checklist
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
