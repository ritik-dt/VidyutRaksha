import type { AdhocReport, ReportId } from '../types'

interface AdhocListProps {
  reports: AdhocReport[]
  onRun: (id: ReportId) => void
  onSave: () => void
}

/** Section C · saved NL-query reports. */
export function AdhocList({ reports, onRun, onSave }: AdhocListProps) {
  return (
    <div className="card !p-0 overflow-hidden">
      {reports.map((q, idx) => (
        <div
          key={q.id}
          className={
            'flex gap-[11px] py-[11px] px-[14px] items-start max-[640px]:flex-wrap max-[640px]:gap-[9px] max-[480px]:py-[10px] max-[480px]:px-[12px]' +
            (idx > 0 ? ' border-t border-t-[var(--border-light)]' : '')
          }
        >
          {/* icon */}
          <div className="w-[24px] h-[24px] rounded-[6px] bg-[rgba(23,162,184,0.1)] text-[var(--teal)] flex items-center justify-center text-[13px] shrink-0 mt-[1px]">
            🔍
          </div>
          {/* body */}
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] text-[var(--text)] leading-[1.4] [overflow-wrap:anywhere] max-[480px]:text-[11px]">
              {q.query}
            </div>
            <div className="text-[9.5px] text-[var(--text-dim)] mt-[3px] break-words">
              {q.author} · Last run: {q.lastRun} · {q.uses} runs
            </div>
          </div>
          {/* actions */}
          <div className="flex gap-[5px] shrink-0 max-[640px]:basis-full max-[640px]:pt-[2px]">
            <button
              type="button"
              className="py-[4px] px-[11px] [background:var(--ai-gradient)] text-white border-none rounded-[5px] text-[10px] font-bold cursor-pointer whitespace-nowrap hover:[filter:brightness(1.05)]"
              onClick={() => onRun(q.id)}
            >
              Run
            </button>
            <button
              type="button"
              className="py-[4px] px-[9px] bg-transparent text-[var(--text-mid)] border border-[var(--border)] rounded-[5px] text-[10px] font-semibold cursor-pointer whitespace-nowrap hover:bg-[var(--bg-soft)]"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
