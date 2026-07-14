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

/** 10-segment DT health bar + legend — matches prototype's healthBar rendering. */
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
      u > 1 ? 'var(--red)' : u >= 0.85 ? 'var(--amber)' : u >= 0.55 ? 'var(--green)' : 'var(--id-text)'
    return (
      <div
        key={d.id}
        onClick={() => onSelectDt?.(d)}
        title={`${d.id} · ${pct}%${d.loss > 15 ? ' · ' + d.loss.toFixed(1) + '% loss' : ''}`}
        className="dt-health-segment"
        style={{
          flex: 1,
          minWidth: 24,
          height: 34,
          background: color,
          borderRadius: 3,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '3px 0',
          fontSize: 9.5,
          fontWeight: 700,
          color: 'rgba(255,255,255,.95)',
          transition: 'transform .12s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(255,255,255,${Math.max(0, 1 - u)})`,
            mixBlendMode: 'overlay',
          }}
        />
        <span style={{ position: 'relative', zIndex: 1 }}>{pct}%</span>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: 14, padding: '12px 14px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text)' }}>
          DT health overview · {allDts.length} transformer{allDts.length === 1 ? '' : 's'}
          {isStateLevel ? '' : ' at ' + scopeName}
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)' }} />
            <span style={{ color: 'var(--text-mid)' }}>{bucketCounts.overloaded} overloaded</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
            <span style={{ color: 'var(--text-mid)' }}>{bucketCounts.nearOverload} near-overload</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ color: 'var(--text-mid)' }}>{bucketCounts.optimal} optimal</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--navy-light, #4B6BB8)' }}
            />
            <span style={{ color: 'var(--text-mid)' }}>{bucketCounts.underUtilised} under-utilised</span>
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>{sortedAll.map((d) => barSegment(d))}</div>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 6, textAlign: 'center' }}>
        Each segment is one DT, sorted by current loading. Click any to drill in. Bars darker = higher load.
      </div>
    </div>
  )
}
