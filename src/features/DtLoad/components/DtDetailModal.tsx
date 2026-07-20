import { useEffect } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { ratio } from '../logic/dtLogic'
import type { DT } from '../types'
import { DtConsumerSection } from './DtConsumerSection'

interface DtDetailModalProps {
  dt: DT
  onClose: () => void
}

/**
 * DT detail modal — direct port of prototype's showDtDetail().
 *
 * Uses shared `.assign-backdrop`, `.assign-panel`, `.assign-header`,
 * `.assign-body` classes (kept as-is because they're used by 8+ modules).
 * The DtLoad-specific `.dt-modal-metrics` (2-col → 1-col at ≤480) and
 * `.dt-modal-actions` (flex-wrap → flex-col at ≤480) are inlined via
 * responsive Tailwind classes.
 */
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
  const capColor =
    utilPct < 60 ? 'var(--green)' : utilPct < 90 ? 'var(--amber)' : 'var(--red)'
  const healthColor =
    d.health === 'critical'
      ? 'var(--red)'
      : d.health === 'warning'
        ? 'var(--amber)'
        : 'var(--green)'
  const healthBg =
    d.health === 'critical'
      ? 'rgba(220,53,69,.06)'
      : d.health === 'warning'
        ? 'rgba(230,146,30,.06)'
        : 'rgba(40,167,69,.06)'
  const capacityClass =
    utilPct < 60
      ? 'capacity-low'
      : utilPct < 90
        ? 'capacity-mid'
        : 'capacity-high'
  const projColor =
    projUtil > 100
      ? 'var(--red)'
      : projUtil > 85
        ? 'var(--amber)'
        : 'var(--green)'
  const phaseColor =
    d.phaseImbalance > 10
      ? 'var(--red)'
      : d.phaseImbalance > 5
        ? 'var(--amber)'
        : 'var(--green)'
  const outagesColor =
    d.outagesYr > 3
      ? 'var(--red)'
      : d.outagesYr > 1
        ? 'var(--amber)'
        : 'var(--green)'

  return (
    <>
      <div className="assign-backdrop" onClick={onClose} />
      <div className="assign-panel">
        <div className="assign-header">
          <div className="flex justify-between items-start mb-[8px] gap-[10px]">
            <div className="flex items-center gap-[12px] min-w-0">
              <div
                className="ld-avatar shrink-0 !w-[44px] !h-[44px] !text-[16px]"
                style={{ background: healthColor }}
              >
                ⚡
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-[var(--text)] break-words">
                  {d.id}
                </div>
                <div className="text-[11px] text-[var(--text-mid)] mt-[2px] break-words">
                  {d.name} · {d.feeder} feeder
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border-none text-[var(--text-dim)] text-[22px] cursor-pointer leading-none px-[4px] shrink-0"
            >
              ×
            </button>
          </div>
          <div className="flex gap-[8px] items-center mt-[10px]">
            <div className="capacity-bar flex-1">
              <div
                className={`capacity-fill ${capacityClass}`}
                style={{ width: `${Math.min(100, utilPct)}%` }}
              />
            </div>
            <div
              className="text-[11.5px] font-bold min-w-[60px] text-right whitespace-nowrap"
              style={{ color: capColor }}
            >
              {utilPct}%
            </div>
          </div>
          <div className="flex gap-[14px] mt-[10px] text-[11px] text-[var(--text-mid)] flex-wrap">
            <span>
              <strong style={{ color: 'var(--text)' }}>
                {d.currentLoad}/{d.capacity}
              </strong>{' '}
              kVA
            </span>
            <span>
              <strong style={{ color: capColor }}>{utilPct}%</strong> current
            </span>
            {projUtil > 100 && (
              <span>
                <strong style={{ color: 'var(--red)' }}>{projUtil}%</strong>{' '}
                projected (90d)
              </span>
            )}
            <span>
              <strong
                style={{
                  color: d.loss > 15 ? 'var(--red)' : 'var(--text)',
                }}
              >
                {d.loss.toFixed(1)}%
              </strong>{' '}
              loss
            </span>
            <span>
              <strong style={{ color: 'var(--text)' }}>{d.consumers}</strong>{' '}
              consumers
            </span>
            <span>
              <strong style={{ color: 'var(--text)' }}>{d.age}y</strong> age
            </span>
          </div>
        </div>

        <div className="assign-body">
          {/* Status note */}
          <div
            className="py-[12px] px-[14px] rounded-[6px] mb-[14px]"
            style={{
              background: healthBg,
              borderLeft: `3px solid ${healthColor}`,
            }}
          >
            <div
              className="text-[11px] font-bold uppercase tracking-[0.6px] mb-[4px]"
              style={{ color: healthColor }}
            >
              Status: {d.health}
            </div>
            <div className="text-[12px] text-[var(--text)] leading-[1.5] break-words">
              {d.note}
            </div>
          </div>

          {/* 4-tile grid: Peak / Projected / Phase / Outages
              (was .dt-modal-metrics; ≤480 collapses to 1-col) */}
          <div className="grid grid-cols-2 gap-[10px] mb-[14px] max-[480px]:grid-cols-1">
            <div className="p-[10px_12px] bg-[var(--card)] border border-[var(--border)] rounded-[8px]">
              <div className="text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[4px]">
                Peak load (last 30d)
              </div>
              <div className="text-[18px] font-bold text-[var(--text)]">
                {d.peakLoad} kVA
              </div>
              <div className="text-[10px] text-[var(--text-mid)] mt-[2px]">
                {Math.round((d.peakLoad / d.capacity) * 100)}% of capacity
              </div>
            </div>
            <div className="p-[10px_12px] bg-[var(--card)] border border-[var(--border)] rounded-[8px]">
              <div className="text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[4px]">
                Projected load (90d)
              </div>
              <div
                className="text-[18px] font-bold"
                style={{ color: projColor }}
              >
                {d.projectedLoad90} kVA
              </div>
              <div className="text-[10px] text-[var(--text-mid)] mt-[2px]">
                {projUtil}% of capacity
              </div>
            </div>
            <div className="p-[10px_12px] bg-[var(--card)] border border-[var(--border)] rounded-[8px]">
              <div className="text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[4px]">
                Phase imbalance
              </div>
              <div
                className="text-[18px] font-bold"
                style={{ color: phaseColor }}
              >
                {d.phaseImbalance}%
              </div>
              <div className="text-[10px] text-[var(--text-mid)] mt-[2px]">
                {d.phaseImbalance > 10
                  ? 'Severe — needs rebalancing'
                  : d.phaseImbalance > 5
                    ? 'Moderate — monitor'
                    : 'Within limits'}
              </div>
            </div>
            <div className="p-[10px_12px] bg-[var(--card)] border border-[var(--border)] rounded-[8px]">
              <div className="text-[9.5px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[4px]">
                Outages this year
              </div>
              <div
                className="text-[18px] font-bold"
                style={{ color: outagesColor }}
              >
                {d.outagesYr}
              </div>
              <div className="text-[10px] text-[var(--text-mid)] mt-[2px]">
                {d.outagesYr > 3
                  ? 'High — investigate'
                  : d.outagesYr > 0
                    ? 'Acceptable'
                    : 'Excellent'}
              </div>
            </div>
          </div>

          {/* AI recommended actions header */}
          <div className="text-[11px] font-bold text-[var(--text-mid)] uppercase tracking-[0.5px] mb-[8px]">
            ✦ AI recommended actions
          </div>
          <div className="flex flex-col gap-[6px] mb-[14px]">
            {d.health === 'critical' && (
              <div
                className="py-[10px] px-[12px] rounded-[6px] text-[11.5px] leading-[1.5] break-words"
                style={{
                  background: 'rgba(220,53,69,.04)',
                  borderLeft: '3px solid var(--red)',
                }}
              >
                <strong style={{ color: 'var(--red)' }}>URGENT:</strong>{' '}
                {utilPct >= 90 &&
                  'Schedule capacity augmentation within 30 days. '}
                {d.loss > 15 &&
                  'Audit consumers for theft/bypass — loss is significantly above threshold. '}
                {d.phaseImbalance > 10 && 'Phase rebalancing required. '}
              </div>
            )}
            {d.health === 'warning' && (
              <div
                className="py-[10px] px-[12px] rounded-[6px] text-[11.5px] leading-[1.5] break-words"
                style={{
                  background: 'rgba(230,146,30,.04)',
                  borderLeft: '3px solid var(--amber)',
                }}
              >
                <strong style={{ color: 'var(--amber)' }}>WATCH:</strong>{' '}
                {d.phaseImbalance > 5 &&
                  'Phase rebalancing recommended within 30 days. '}
                {projUtil > 95 && 'Approaching capacity — plan upgrade. '}
                {d.loss > 12 && 'Loss creeping up — monitor for theft. '}
              </div>
            )}
            {d.health === 'healthy' && (
              <div
                className="py-[10px] px-[12px] rounded-[6px] text-[11.5px] leading-[1.5] break-words"
                style={{
                  background: 'rgba(40,167,69,.04)',
                  borderLeft: '3px solid var(--green)',
                }}
              >
                <strong style={{ color: 'var(--green)' }}>HEALTHY:</strong> No
                action required.{' '}
                {utilPct < 50
                  ? 'Underutilized — consider as redistribution target if neighboring DTs are stressed.'
                  : 'Monitor monthly.'}
              </div>
            )}
          </div>

          {/* Action buttons (was .dt-modal-actions; ≤480 → flex-col + full-width buttons) */}
          <div className="flex gap-[8px] flex-wrap max-[480px]:flex-col">
            <button
              type="button"
              className="btn-ai flex-1 py-[9px] px-[12px] text-white border-none rounded-[6px] text-[11.5px] font-bold cursor-pointer min-w-[140px] max-[480px]:!min-w-full"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Energy audit triggered',
                  message: `AI will scan all ${d.consumers} consumers under ${d.id} for theft signals and bypass patterns. Results in 4 hours.`,
                  duration: 5000,
                })
              }
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
              className="flex-1 py-[9px] px-[12px] bg-[var(--card)] border border-[var(--border)] rounded-[6px] text-[11.5px] font-semibold cursor-pointer text-[var(--text-mid)] min-w-[140px] max-[480px]:!min-w-full"
            >
              📋 Draft work order
            </button>
          </div>

          {/* Consumer section — top 15 by load contribution, with search +
              anomaly filter in 'all' mode */}
          <DtConsumerSection dt={d} onDrillConsumer={onClose} />
        </div>
      </div>
    </>
  )
}
