import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface DtPillListProps {
  dts: DT[]
  variant: 'optimal' | 'under-utilised'
  onSelectDt?: (dt: DT) => void
}

/** Compact clickable pill list — used for optimal + under-utilised DT sections. */
export function DtPillList({ dts, variant, onSelectDt }: DtPillListProps) {
  const color = variant === 'optimal' ? 'var(--green)' : 'var(--navy-light, #4B6BB8)'
  const hoverBg =
    variant === 'optimal' ? 'rgba(40,167,69,.05)' : 'rgba(27,79,114,.05)'
  const hoverBorder = variant === 'optimal' ? 'var(--green)' : 'var(--id-text, #0284c7)'

  return (
    <div className="card dt-pill-list" style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {dts.map((d) => (
        <div
          key={d.id}
          onClick={() => onSelectDt?.(d)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            cursor: 'pointer',
            transition: 'all .12s',
            fontSize: 11.5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = hoverBorder
            e.currentTarget.style.background = hoverBg
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.background = 'var(--bg)'
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{d.id}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 10.5 }}>
            {Math.round(ratio(d) * 100)}% · {d.feeder}
          </span>
        </div>
      ))}
    </div>
  )
}
