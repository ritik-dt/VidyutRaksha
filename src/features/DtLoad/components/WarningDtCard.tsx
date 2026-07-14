import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface WarningDtCardProps {
  dt: DT
  onSelectDt?: (dt: DT) => void
}

/** Compact 2-up grid card for near-overload DTs — matches prototype's renderWarningDtCard. */
export function WarningDtCard({ dt: d, onSelectDt }: WarningDtCardProps) {
  const utilPct = Math.round(ratio(d) * 100)
  const projUtil = Math.round((d.projectedLoad90 / d.capacity) * 100)
  const lossColor = d.loss > 15 ? 'var(--red)' : d.loss > 12 ? 'var(--amber)' : 'var(--green)'

  return (
    <div className="dt-warning-card" onClick={() => onSelectDt?.(d)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{d.id}</div>
          <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 1 }}>
            {d.feeder} feeder · {d.consumers} consumers
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>{utilPct}%</div>
          <div style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>
            {d.currentLoad}/{d.capacity} kVA
          </div>
        </div>
      </div>
      <div className="capacity-bar" style={{ height: 6, marginBottom: 8 }}>
        <div className="capacity-fill capacity-mid" style={{ width: `${Math.min(100, utilPct)}%` }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, fontSize: 10 }}>
        <div style={{ textAlign: 'center', padding: 4, background: 'var(--bg)', borderRadius: 4 }}>
          <div style={{ color: 'var(--text-dim)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.4px' }}>Loss</div>
          <div style={{ fontWeight: 700, color: lossColor, marginTop: 1 }}>{d.loss.toFixed(1)}%</div>
        </div>
        <div style={{ textAlign: 'center', padding: 4, background: 'var(--bg)', borderRadius: 4 }}>
          <div style={{ color: 'var(--text-dim)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.4px' }}>Phase</div>
          <div style={{ fontWeight: 700, color: d.phaseImbalance > 10 ? 'var(--red)' : d.phaseImbalance > 5 ? 'var(--amber)' : 'var(--text)', marginTop: 1 }}>
            {d.phaseImbalance}%
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: 4, background: 'var(--bg)', borderRadius: 4 }}>
          <div style={{ color: 'var(--text-dim)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '.4px' }}>90d proj</div>
          <div style={{ fontWeight: 700, color: projUtil > 100 ? 'var(--red)' : projUtil > 90 ? 'var(--amber)' : 'var(--text)', marginTop: 1 }}>
            {projUtil}%
          </div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--text-mid)', lineHeight: 1.4 }}>{d.note}</div>
    </div>
  )
}
