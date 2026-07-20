import type { DT } from '../types'
import { ratio } from '../logic/dtLogic'

interface DtHealthBarProps {
  allDts: DT[]
  sortedAll: DT[]
  bucketCounts: {
    overloaded: number
    nearOverload: number
    optimal: number
    underUtilised: number
  }
  scopeName: string
  isStateLevel: boolean
  onSelectDt?: (dt: DT) => void
}

/**
 * 10-segment DT health bar + legend — matches prototype's healthBar rendering.
 * Segments shrink in font-size + hide the % label at very small viewports:
 *   - ≤640px: font-size 8px, min-width 22px
 *   - ≤380px: hide the inline percentage text
 */
export function DtHealthBar({
  allDts,
  sortedAll,
  bucketCounts,
  scopeName,
  isStateLevel,
  onSelectDt,
}: DtHealthBarProps) {
  const barSegment = (d: DT) => {
    const u = ratio(d)
    const pct = Math.round(u * 100)
    const color =
      u > 1
        ? 'var(--red)'
        : u >= 0.85
          ? 'var(--amber)'
          : u >= 0.55
            ? 'var(--green)'
            : 'var(--id-text)'
    return (
      <div
        key={d.id}
        onClick={() => onSelectDt?.(d)}
        title={`${d.id} · ${pct}%${d.loss > 15 ? ' · ' + d.loss.toFixed(1) + '% loss' : ''}`}
        className={
          'flex-1 min-w-[24px] h-[34px] rounded-[3px] cursor-pointer ' +
          'flex items-end justify-center py-[3px] text-[9.5px] font-bold text-white/95 ' +
          'transition-transform duration-[120ms] relative overflow-hidden ' +
          'max-[640px]:min-w-[22px] max-[640px]:!text-[8px]'
        }
        style={{ background: color }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `rgba(255,255,255,${Math.max(0, 1 - u)})`,
            mixBlendMode: 'overlay',
          }}
        />
        <span className="relative z-[1] max-[380px]:hidden">{pct}%</span>
      </div>
    )
  }

  return (
    <div className="card mb-[14px] !py-[12px] !px-[14px]">
      <div className="flex justify-between items-center mb-[8px] flex-wrap gap-[8px]">
        <div className="text-[11.5px] font-bold text-[var(--text)] break-words">
          DT health overview · {allDts.length} transformer
          {allDts.length === 1 ? '' : 's'}
          {isStateLevel ? '' : ' at ' + scopeName}
        </div>
        <div className="flex gap-[10px] text-[10px] flex-wrap">
          <span className="flex items-center gap-[4px]">
            <span
              className="w-[8px] h-[8px] rounded-full"
              style={{ background: 'var(--red)' }}
            />
            <span className="text-[var(--text-mid)]">
              {bucketCounts.overloaded} overloaded
            </span>
          </span>
          <span className="flex items-center gap-[4px]">
            <span
              className="w-[8px] h-[8px] rounded-full"
              style={{ background: 'var(--amber)' }}
            />
            <span className="text-[var(--text-mid)]">
              {bucketCounts.nearOverload} near-overload
            </span>
          </span>
          <span className="flex items-center gap-[4px]">
            <span
              className="w-[8px] h-[8px] rounded-full"
              style={{ background: 'var(--green)' }}
            />
            <span className="text-[var(--text-mid)]">
              {bucketCounts.optimal} optimal
            </span>
          </span>
          <span className="flex items-center gap-[4px]">
            <span
              className="w-[8px] h-[8px] rounded-full"
              style={{ background: 'var(--navy-light, #4B6BB8)' }}
            />
            <span className="text-[var(--text-mid)]">
              {bucketCounts.underUtilised} under-utilised
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-[3px]">{sortedAll.map((d) => barSegment(d))}</div>
      <div className="text-[10px] text-[var(--text-dim)] mt-[6px] text-center max-[480px]:text-[9.5px]">
        Each segment is one DT, sorted by current loading. Click any to drill
        in. Bars darker = higher load.
      </div>
    </div>
  )
}
