import { useMemo } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { findRedistributionCandidate, ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface CriticalDtCardProps {
  dt: DT
  onSelectDt?: (dt: DT) => void
}

/** Deterministic "last month" load pseudo-value seeded by DT id (replaces prototype's Math.random). */
function seededLastMonth(dt: DT): number {
  const seed = dt.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const jitter = (Math.sin(seed) + 1) / 2  // 0..1
  const drop = 5 + Math.round(jitter * 4)
  return Math.max(0, dt.currentLoad - drop)
}

/** Detailed card for overloaded DTs — matches prototype's renderCriticalDtCard */
export function CriticalDtCard({ dt: d, onSelectDt }: CriticalDtCardProps) {
  const { showToast } = useToast()
  const utilPct = Math.round(ratio(d) * 100)
  const projUtil = Math.round((d.projectedLoad90 / d.capacity) * 100)
  const lastMonthLoad = useMemo(() => seededLastMonth(d), [d])
  const lastMonthPct = Math.round((lastMonthLoad / d.capacity) * 100)
  const trend = utilPct - lastMonthPct
  const candidate = findRedistributionCandidate(d)
  const lossColor = d.loss > 15 ? 'var(--red)' : d.loss > 12 ? 'var(--amber)' : 'var(--green)'

  const issues: string[] = []
  if (utilPct >= 90) issues.push('approaching capacity')
  if (projUtil > 100) issues.push(`projected ${projUtil}% in 90d`)
  if (d.loss > 15) issues.push('loss >15% — likely theft')
  if (d.phaseImbalance > 10) issues.push(`${d.phaseImbalance}% phase imbalance`)

  const aiRecParts: React.ReactNode[] = []
  if (utilPct >= 90 && candidate) {
    aiRecParts.push(
      <span key="redist">
        Redistribute load to <strong>{candidate.id}</strong> ({candidate.feeder} feeder,{' '}
        {Math.round(ratio(candidate) * 100)}% loaded — has headroom).{' '}
      </span>,
    )
  } else if (utilPct >= 90) {
    aiRecParts.push(<span key="augment">Schedule capacity augmentation within 30 days. </span>)
  }
  if (d.loss > 15) aiRecParts.push(<span key="audit">Trigger consumer audit for theft signals. </span>)
  if (d.phaseImbalance > 10) aiRecParts.push(<span key="phase">Phase rebalancing required. </span>)

  return (
    <div className="dt-critical-card" onClick={() => onSelectDt?.(d)}>
      <div className="dt-critical-left">
        <div className="dt-critical-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="ld-avatar" style={{ background: 'var(--red)', width: 38, height: 38, fontSize: 14 }}>⚡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{d.id}</div>
              <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>
                {d.name} · {d.feeder} feeder · {d.consumers} consumers
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{utilPct}%</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 2 }}>
              {d.currentLoad}/{d.capacity} kVA
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="capacity-bar" style={{ height: 8 }}>
            <div className="capacity-fill capacity-high" style={{ width: `${Math.min(100, utilPct)}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6, gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-mid)' }}>
              {trend > 0 ? (
                <>
                  <span style={{ color: 'var(--red)' }}>▲ +{trend}%</span> vs last month (was {lastMonthPct}%)
                </>
              ) : trend < 0 ? (
                <>
                  <span style={{ color: 'var(--green)' }}>▼ {trend}%</span> vs last month
                </>
              ) : (
                'flat vs last month'
              )}
            </span>
            <span style={{ color: projUtil > 100 ? 'var(--red)' : 'var(--text-mid)', fontWeight: 600 }}>
              {projUtil > 100 ? `⚠ Projected ${projUtil}% in 90d` : `Projected ${projUtil}% in 90d`}
            </span>
          </div>
        </div>
      </div>

      <div className="dt-critical-metrics">
        <div className="dt-metric">
          <div className="dt-metric-label">Loss</div>
          <div className="dt-metric-val" style={{ color: lossColor }}>{d.loss.toFixed(1)}%</div>
        </div>
        <div className="dt-metric">
          <div className="dt-metric-label">Phase imbal.</div>
          <div className="dt-metric-val" style={{ color: d.phaseImbalance > 10 ? 'var(--red)' : d.phaseImbalance > 5 ? 'var(--amber)' : 'var(--green)' }}>
            {d.phaseImbalance}%
          </div>
        </div>
        <div className="dt-metric">
          <div className="dt-metric-label">Outages (yr)</div>
          <div className="dt-metric-val" style={{ color: d.outagesYr > 3 ? 'var(--red)' : d.outagesYr > 1 ? 'var(--amber)' : 'var(--text)' }}>
            {d.outagesYr}
          </div>
        </div>
        <div className="dt-metric">
          <div className="dt-metric-label">Age</div>
          <div className="dt-metric-val">{d.age}y</div>
        </div>
      </div>

      <div className="dt-critical-ai">
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ai-purple)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
          ✦ {issues.join(' · ')}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text)', lineHeight: 1.5 }}>
          <strong>AI recommends:</strong> {aiRecParts}
        </div>
      </div>

      <div className="dt-critical-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() =>
            showToast({
              type: 'success',
              title: 'Energy audit triggered',
              message: `AI scanning ${d.consumers} consumers under ${d.id} for theft signals. Results in 4 hours.`,
              duration: 5000,
            })
          }
          style={{ padding: '8px 14px', background: 'var(--ai-gradient)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
        >
          ✦ Audit consumers
        </button>
        <button
          type="button"
          onClick={() =>
            showToast({
              type: 'warning',
              title: `Work order — ${d.id}`,
              message: `Capacity augmentation request sent to maintenance. Tracking ID: WO-${Date.now().toString().slice(-6)}.`,
              duration: 4500,
            })
          }
          style={{ padding: '8px 14px', background: 'rgba(220,53,69,.08)', color: 'var(--red)', border: '1px solid rgba(220,53,69,.3)', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
        >
          📋 Draft work order
        </button>
        <button
          type="button"
          onClick={() => onSelectDt?.(d)}
          style={{ padding: '8px 14px', background: 'transparent', color: 'var(--text-mid)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
        >
          View detail →
        </button>
      </div>
    </div>
  )
}
