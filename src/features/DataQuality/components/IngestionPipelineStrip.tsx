import type { PipelineStat } from '../types'

interface IngestionPipelineStripProps {
  stats: PipelineStat[]
}

/** Today's ingestion pipeline — 5 tiles with a coloured left border.
 *  Responsive: row → 3-up wrap at ≤1024px → column at ≤640px. */
export function IngestionPipelineStrip({ stats }: IngestionPipelineStripProps) {
  return (
    <div className="card mb-[14px]">
      <div className="card-title">Today&apos;s ingestion pipeline status</div>
      <div className="flex gap-[10px] my-3 max-[1024px]:flex-wrap max-[640px]:flex-col">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 min-w-0 p-3 bg-[var(--bg)] rounded-lg max-[1024px]:flex-[1_1_calc(33.333%-7px)] max-[640px]:flex-[1_1_auto]"
            style={{ borderLeft: `4px solid ${s.color}` }}
          >
            <div className="text-[18px] mb-1">{s.icon}</div>
            <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.5px] [overflow-wrap:anywhere]">
              {s.label}
            </div>
            <div className="text-[18px] font-bold mt-1" style={{ color: s.color }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
