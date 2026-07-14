import { useEffect } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'
import { DtConsumerSection } from './DtConsumerSection'

interface DtDetailModalProps {
  dt: DT
  onClose: () => void
}

/** DT detail modal — direct port of prototype's showDtDetail(). */
export function DtDetailModal({ dt: d, onClose }: DtDetailModalProps) {
  const { showToast } = useToast()

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const utilPct = Math.round(ratio(d) * 100)
  const projUtil = Math.round((d.projectedLoad90 / d.capacity) * 100)
  const capColor = utilPct < 60 ? 'var(--green)' : utilPct < 90 ? 'var(--amber)' : 'var(--red)'
  const healthColor =
    d.health === 'critical' ? 'var(--red)' : d.health === 'warning' ? 'var(--amber)' : 'var(--green)'
  const healthBg =
    d.health === 'critical' ? 'rgba(220,53,69,.06)' : d.health === 'warning' ? 'rgba(230,146,30,.06)' : 'rgba(40,167,69,.06)'
  const capacityClass = utilPct < 60 ? 'capacity-low' : utilPct < 90 ? 'capacity-mid' : 'capacity-high'

  return (
    <>
      <div className="assign-backdrop" onClick={onClose} />
      <div className="assign-panel">
        <div className="assign-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="ld-avatar" style={{ width: 44, height: 44, fontSize: 16, background: healthColor }}>⚡</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>{d.id}</div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>
                  {d.name} · {d.feeder} feeder
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
            >
              ×
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
            <div className="capacity-bar" style={{ flex: 1 }}>
              <div className={`capacity-fill ${capacityClass}`} style={{ width: `${Math.min(100, utilPct)}%` }} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: capColor, minWidth: 60, textAlign: 'right' }}>
              {utilPct}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11, color: 'var(--text-mid)', flexWrap: 'wrap' }}>
            <span>
              <strong style={{ color: 'var(--text)' }}>{d.currentLoad}/{d.capacity}</strong> kVA
            </span>
            <span>
              <strong style={{ color: capColor }}>{utilPct}%</strong> current
            </span>
            {projUtil > 100 && (
              <span>
                <strong style={{ color: 'var(--red)' }}>{projUtil}%</strong> projected (90d)
              </span>
            )}
            <span>
              <strong style={{ color: d.loss > 15 ? 'var(--red)' : 'var(--text)' }}>{d.loss.toFixed(1)}%</strong> loss
            </span>
            <span>
              <strong style={{ color: 'var(--text)' }}>{d.consumers}</strong> consumers
            </span>
            <span>
              <strong style={{ color: 'var(--text)' }}>{d.age}y</strong> age
            </span>
          </div>
        </div>

        <div className="assign-body">
          {/* Status note */}
          <div
            style={{
              padding: '12px 14px',
              background: healthBg,
              borderLeft: `3px solid ${healthColor}`,
              borderRadius: 6,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: healthColor, textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 4 }}>
              Status: {d.health}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{d.note}</div>
          </div>

          {/* 4-tile grid: Peak / Projected / Phase / Outages */}
          <div className="dt-modal-metrics" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div style={{ padding: '10px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 9.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
                Peak load (last 30d)
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{d.peakLoad} kVA</div>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>
                {Math.round((d.peakLoad / d.capacity) * 100)}% of capacity
              </div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 9.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
                Projected load (90d)
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: projUtil > 100 ? 'var(--red)' : projUtil > 85 ? 'var(--amber)' : 'var(--green)' }}>
                {d.projectedLoad90} kVA
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>{projUtil}% of capacity</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 9.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
                Phase imbalance
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: d.phaseImbalance > 10 ? 'var(--red)' : d.phaseImbalance > 5 ? 'var(--amber)' : 'var(--green)' }}>
                {d.phaseImbalance}%
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>
                {d.phaseImbalance > 10 ? 'Severe — needs rebalancing' : d.phaseImbalance > 5 ? 'Moderate — monitor' : 'Within limits'}
              </div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ fontSize: 9.5, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>
                Outages this year
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: d.outagesYr > 3 ? 'var(--red)' : d.outagesYr > 1 ? 'var(--amber)' : 'var(--green)' }}>
                {d.outagesYr}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>
                {d.outagesYr > 3 ? 'High — investigate' : d.outagesYr > 0 ? 'Acceptable' : 'Excellent'}
              </div>
            </div>
          </div>

          {/* AI recommended actions */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>
            ✦ AI recommended actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {d.health === 'critical' && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'rgba(220,53,69,.04)',
                  borderLeft: '3px solid var(--red)',
                  borderRadius: 6,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--red)' }}>URGENT:</strong>{' '}
                {utilPct >= 90 && 'Schedule capacity augmentation within 30 days. '}
                {d.loss > 15 && 'Audit consumers for theft/bypass — loss is significantly above threshold. '}
                {d.phaseImbalance > 10 && 'Phase rebalancing required. '}
              </div>
            )}
            {d.health === 'warning' && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'rgba(230,146,30,.04)',
                  borderLeft: '3px solid var(--amber)',
                  borderRadius: 6,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--amber)' }}>WATCH:</strong>{' '}
                {d.phaseImbalance > 5 && 'Phase rebalancing recommended within 30 days. '}
                {projUtil > 95 && 'Approaching capacity — plan upgrade. '}
                {d.loss > 12 && 'Loss creeping up — monitor for theft. '}
              </div>
            )}
            {d.health === 'healthy' && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'rgba(40,167,69,.04)',
                  borderLeft: '3px solid var(--green)',
                  borderRadius: 6,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--green)' }}>HEALTHY:</strong> No action required.{' '}
                {utilPct < 50 ? 'Underutilized — consider as redistribution target if neighboring DTs are stressed.' : 'Monitor monthly.'}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="dt-modal-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-ai"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Energy audit triggered',
                  message: `AI will scan all ${d.consumers} consumers under ${d.id} for theft signals and bypass patterns. Results in 4 hours.`,
                  duration: 5000,
                })
              }
              style={{ flex: 1, padding: '9px 12px', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', minWidth: 140 }}
            >
              ✦ Audit consumers
            </button>
            <button
              type="button"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Work order drafted',
                  message: `Maintenance request for ${d.id} sent to field team. Tracking ID: WO-${Date.now().toString().slice(-6)}.`,
                  duration: 4000,
                })
              }
              style={{ flex: 1, padding: '9px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', color: 'var(--text-mid)', minWidth: 140 }}
            >
              📋 Draft work order
            </button>
          </div>

          {/* Consumer section — top 15 by load contribution, with search + anomaly filter in 'all' mode */}
          <DtConsumerSection dt={d} onDrillConsumer={onClose} />
        </div>
      </div>
    </>
  )
}
