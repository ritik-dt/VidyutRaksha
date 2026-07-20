import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface WarningDtCardProps {
  dt: DT
  onSelectDt?: (dt: DT) => void
}

/**
 * Compact 2-up grid card for near-overload DTs — matches prototype's
 * renderWarningDtCard. Amber left-border indicates warning state; card auto-
 * flows into the `.dt-warning-grid` parent (auto-fill `minmax(340px, 1fr)`
 * responsive grid, collapses to 1 col at ≤640px).
 */
export function WarningDtCard({ dt: d, onSelectDt }: WarningDtCardProps) {
  const utilPct = Math.round(ratio(d) * 100)
  const projUtil = Math.round((d.projectedLoad90 / d.capacity) * 100)
  const lossColor =
    d.loss > 15 ? 'var(--red)' : d.loss > 12 ? 'var(--amber)' : 'var(--green)'
  const phaseColor =
    d.phaseImbalance > 10
      ? 'var(--red)'
      : d.phaseImbalance > 5
        ? 'var(--amber)'
        : 'var(--text)'
  const projColor =
    projUtil > 100
      ? 'var(--red)'
      : projUtil > 90
        ? 'var(--amber)'
        : 'var(--text)'

  return (
    <div
      onClick={() => onSelectDt?.(d)}
      className={
        'bg-[var(--card)] border border-[var(--border)] border-l-[3px] border-l-[var(--amber)] ' +
        'rounded-[8px] py-[12px] px-[14px] cursor-pointer transition-all duration-150 ' +
        'hover:border-[var(--amber)] hover:border-l-[var(--amber)] hover:shadow-[0_2px_8px_rgba(230,146,30,0.08)]'
      }
    >
      <div className="flex justify-between items-start mb-[8px] gap-[8px]">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[var(--text)] break-words">
            {d.id}
          </div>
          <div className="text-[10.5px] text-[var(--text-dim)] mt-[1px] break-words">
            {d.feeder} feeder · {d.consumers} consumers
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[17px] font-bold text-[var(--amber)] leading-none">
            {utilPct}%
          </div>
          <div className="text-[9.5px] text-[var(--text-dim)] whitespace-nowrap">
            {d.currentLoad}/{d.capacity} kVA
          </div>
        </div>
      </div>
      <div className="capacity-bar mb-[8px]" style={{ height: 6 }}>
        <div
          className="capacity-fill capacity-mid"
          style={{ width: `${Math.min(100, utilPct)}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-[6px] text-[10px]">
        <div className="text-center p-[4px] bg-[var(--bg)] rounded-[4px]">
          <div className="text-[var(--text-dim)] text-[9px] uppercase tracking-[0.4px]">
            Loss
          </div>
          <div className="font-bold mt-[1px]" style={{ color: lossColor }}>
            {d.loss.toFixed(1)}%
          </div>
        </div>
        <div className="text-center p-[4px] bg-[var(--bg)] rounded-[4px]">
          <div className="text-[var(--text-dim)] text-[9px] uppercase tracking-[0.4px]">
            Phase
          </div>
          <div className="font-bold mt-[1px]" style={{ color: phaseColor }}>
            {d.phaseImbalance}%
          </div>
        </div>
        <div className="text-center p-[4px] bg-[var(--bg)] rounded-[4px]">
          <div className="text-[var(--text-dim)] text-[9px] uppercase tracking-[0.4px]">
            90d proj
          </div>
          <div className="font-bold mt-[1px]" style={{ color: projColor }}>
            {projUtil}%
          </div>
        </div>
      </div>
      <div className="mt-[8px] text-[10.5px] text-[var(--text-mid)] leading-[1.4] break-words">
        {d.note}
      </div>
    </div>
  )
}
