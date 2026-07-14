import { ROI_STATS } from '../data/baData'

/** ROI summary row — 5 stats side by side on a subtle background. */
export function RoiStatRow() {
  return (
    <div
      className="mt-3.5 flex flex-wrap gap-2.5 rounded-lg p-3"
      style={{ background: 'var(--bg)' }}
    >
      {ROI_STATS.map((m) => (
        <div key={m.label} className="min-w-0 flex-1 text-center max-sm:basis-full">
          <div className="text-[10px] uppercase tracking-wider text-text-dim">
            {m.label}
          </div>
          <div className="mt-1 text-[16px] font-bold" style={{ color: m.color }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  )
}
