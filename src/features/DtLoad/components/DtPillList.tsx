import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface DtPillListProps {
  dts: DT[]
  variant: 'optimal' | 'under-utilised'
  onSelectDt?: (dt: DT) => void
}

/**
 * Compact clickable pill list — used for optimal + under-utilised DT sections.
 *
 * Replaces prototype's `.dt-pill-list` container. Mobile override
 * (`.dt-pill-list { padding: 10px !important; gap: 6px !important }` at
 * ≤480px) is inlined via responsive Tailwind classes.
 */
export function DtPillList({ dts, variant, onSelectDt }: DtPillListProps) {
  const color =
    variant === 'optimal' ? 'var(--green)' : 'var(--navy-light, #4B6BB8)'
  const hoverBg =
    variant === 'optimal' ? 'rgba(40,167,69,.05)' : 'rgba(27,79,114,.05)'
  const hoverBorder =
    variant === 'optimal' ? 'var(--green)' : 'var(--id-text, #0284c7)'

  return (
    <div className="card !p-[14px] flex flex-wrap gap-[8px] max-[480px]:!p-[10px] max-[480px]:!gap-[6px]">
      {dts.map((d) => (
        <div
          key={d.id}
          onClick={() => onSelectDt?.(d)}
          className={
            'flex items-center gap-[8px] py-[7px] px-[12px] ' +
            'bg-[var(--bg)] border border-[var(--border)] rounded-[18px] cursor-pointer ' +
            'transition-all duration-[120ms] text-[11.5px] ' +
            'max-[480px]:py-[5px] max-[480px]:px-[10px] max-[480px]:text-[11px]'
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = hoverBorder
            e.currentTarget.style.background = hoverBg
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.background = 'var(--bg)'
          }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0"
            style={{ background: color }}
          />
          <span className="font-bold text-[var(--text)] whitespace-nowrap">
            {d.id}
          </span>
          <span className="text-[var(--text-dim)] text-[10.5px] whitespace-nowrap">
            {Math.round(ratio(d) * 100)}% · {d.feeder}
          </span>
        </div>
      ))}
    </div>
  )
}
