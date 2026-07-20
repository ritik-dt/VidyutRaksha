import { useMemo } from 'react'
import { useToast } from '@/shared/context/ToastContext'
import { findRedistributionCandidate, ratio } from '../logic/dtLogic'
import type { DT } from '../types'

interface CriticalDtCardProps {
  dt: DT
  onSelectDt?: (dt: DT) => void
}

/** Deterministic "last month" load pseudo-value seeded by DT id (replaces
 *  prototype's Math.random). */
function seededLastMonth(dt: DT): number {
  const seed = dt.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const jitter = (Math.sin(seed) + 1) / 2 // 0..1
  const drop = 5 + Math.round(jitter * 4)
  return Math.max(0, dt.currentLoad - drop)
}

/**
 * Detailed card for overloaded DTs — matches prototype's renderCriticalDtCard.
 *
 * Grid layout (was `.dt-critical-card { grid-template-columns: 1fr 220px 1.2fr }`
 * with 2 responsive breakpoints):
 *   - Desktop: 3-col (main info · 4-metric grid · AI recommendation) + actions row
 *   - ≤900px: 2-col (main info spans full width, metrics + AI in row 2, actions in row 3)
 *   - ≤640px: 1-col (everything stacks vertically)
 */
export function CriticalDtCard({ dt: d, onSelectDt }: CriticalDtCardProps) {
  const { showToast } = useToast()
  const utilPct = Math.round(ratio(d) * 100)
  const projUtil = Math.round((d.projectedLoad90 / d.capacity) * 100)
  const lastMonthLoad = useMemo(() => seededLastMonth(d), [d])
  const lastMonthPct = Math.round((lastMonthLoad / d.capacity) * 100)
  const trend = utilPct - lastMonthPct
  const candidate = findRedistributionCandidate(d)
  const lossColor =
    d.loss > 15 ? 'var(--red)' : d.loss > 12 ? 'var(--amber)' : 'var(--green)'
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
        : 'var(--text)'

  const issues: string[] = []
  if (utilPct >= 90) issues.push('approaching capacity')
  if (projUtil > 100) issues.push(`projected ${projUtil}% in 90d`)
  if (d.loss > 15) issues.push('loss >15% — likely theft')
  if (d.phaseImbalance > 10) issues.push(`${d.phaseImbalance}% phase imbalance`)

  const aiRecParts: React.ReactNode[] = []
  if (utilPct >= 90 && candidate) {
    aiRecParts.push(
      <span key="redist">
        Redistribute load to <strong>{candidate.id}</strong> ({candidate.feeder}{' '}
        feeder, {Math.round(ratio(candidate) * 100)}% loaded — has headroom).{' '}
      </span>,
    )
  } else if (utilPct >= 90) {
    aiRecParts.push(
      <span key="augment">Schedule capacity augmentation within 30 days. </span>,
    )
  }
  if (d.loss > 15)
    aiRecParts.push(
      <span key="audit">Trigger consumer audit for theft signals. </span>,
    )
  if (d.phaseImbalance > 10)
    aiRecParts.push(<span key="phase">Phase rebalancing required. </span>)

  return (
    <div
      onClick={() => onSelectDt?.(d)}
      className={
        'grid grid-cols-[1fr_220px_1.2fr] grid-rows-[auto_auto] gap-[14px] ' +
        'bg-[var(--card)] border border-[rgba(220,53,69,0.25)] border-l-4 border-l-[var(--red)] ' +
        'rounded-[10px] py-[14px] px-[16px] mb-[10px] cursor-pointer ' +
        'transition-all duration-150 shadow-[0_1px_3px_rgba(220,53,69,0.06)] ' +
        'hover:shadow-[0_4px_14px_rgba(220,53,69,0.12)] hover:-translate-y-px hover:border-[rgba(220,53,69,0.5)] hover:border-l-[var(--red)] ' +
        'max-[900px]:grid-cols-2 max-[900px]:grid-rows-[auto_auto_auto] ' +
        'max-[640px]:grid-cols-1 max-[480px]:px-[12px] max-[480px]:py-[12px]'
      }
    >
      {/* Main info — spans first row */}
      <div className="max-[900px]:col-span-2 max-[640px]:col-span-1">
        <div className="flex justify-between items-start gap-[12px]">
          <div className="flex items-center gap-[10px] min-w-0">
            <div
              className="ld-avatar shrink-0 !w-[38px] !h-[38px] !text-[14px]"
              style={{ background: 'var(--red)' }}
            >
              ⚡
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold text-[var(--text)] leading-[1.2] break-words">
                {d.id}
              </div>
              <div className="text-[11px] text-[var(--text-mid)] mt-[2px] break-words">
                {d.name} · {d.feeder} feeder · {d.consumers} consumers
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[24px] font-bold text-[var(--red)] leading-none">
              {utilPct}%
            </div>
            <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-[0.5px] mt-[2px] whitespace-nowrap">
              {d.currentLoad}/{d.capacity} kVA
            </div>
          </div>
        </div>
        <div className="mt-[10px]">
          <div className="capacity-bar" style={{ height: 8 }}>
            <div
              className="capacity-fill capacity-high"
              style={{ width: `${Math.min(100, utilPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] mt-[6px] gap-[8px] flex-wrap">
            <span className="text-[var(--text-mid)]">
              {trend > 0 ? (
                <>
                  <span style={{ color: 'var(--red)' }}>▲ +{trend}%</span> vs
                  last month (was {lastMonthPct}%)
                </>
              ) : trend < 0 ? (
                <>
                  <span style={{ color: 'var(--green)' }}>▼ {trend}%</span> vs
                  last month
                </>
              ) : (
                'flat vs last month'
              )}
            </span>
            <span
              className="font-semibold"
              style={{
                color: projUtil > 100 ? 'var(--red)' : 'var(--text-mid)',
              }}
            >
              {projUtil > 100
                ? `⚠ Projected ${projUtil}% in 90d`
                : `Projected ${projUtil}% in 90d`}
            </span>
          </div>
        </div>
      </div>

      {/* 4-metric grid */}
      <div className="grid grid-cols-2 gap-[6px] content-start">
        <div className="p-[6px_8px] bg-[var(--bg)] rounded-[5px] text-center">
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[2px]">
            Loss
          </div>
          <div
            className="text-[14px] font-bold"
            style={{ color: lossColor }}
          >
            {d.loss.toFixed(1)}%
          </div>
        </div>
        <div className="p-[6px_8px] bg-[var(--bg)] rounded-[5px] text-center">
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[2px]">
            Phase imbal.
          </div>
          <div className="text-[14px] font-bold" style={{ color: phaseColor }}>
            {d.phaseImbalance}%
          </div>
        </div>
        <div className="p-[6px_8px] bg-[var(--bg)] rounded-[5px] text-center">
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[2px]">
            Outages (yr)
          </div>
          <div
            className="text-[14px] font-bold"
            style={{ color: outagesColor }}
          >
            {d.outagesYr}
          </div>
        </div>
        <div className="p-[6px_8px] bg-[var(--bg)] rounded-[5px] text-center">
          <div className="text-[9px] text-[var(--text-dim)] uppercase tracking-[0.5px] mb-[2px]">
            Age
          </div>
          <div className="text-[14px] font-bold text-[var(--text)]">
            {d.age}y
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div
        className="p-[10px_12px] border border-[rgba(124,58,237,0.15)] rounded-[8px] min-w-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(124,58,237,0.01))',
        }}
      >
        <div className="text-[10px] font-bold text-[var(--ai-purple)] uppercase tracking-[0.5px] mb-[4px] break-words">
          ✦ {issues.join(' · ')}
        </div>
        <div className="text-[11.5px] text-[var(--text)] leading-[1.5] break-words">
          <strong>AI recommends:</strong> {aiRecParts}
        </div>
      </div>

      {/* Action row */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          'col-span-3 max-[900px]:col-span-2 max-[640px]:col-span-1 ' +
          'flex gap-[6px] flex-wrap pt-[4px] border-t border-dashed border-[var(--border-light)]'
        }
      >
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
          className="py-[8px] px-[14px] text-white border-none rounded-[6px] text-[11.5px] font-bold cursor-pointer max-[480px]:flex-1"
          style={{ background: 'var(--ai-gradient)' }}
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
          className="py-[8px] px-[14px] text-[var(--red)] rounded-[6px] text-[11.5px] font-bold cursor-pointer border border-[rgba(220,53,69,0.3)] bg-[rgba(220,53,69,0.08)] max-[480px]:flex-1"
        >
          📋 Draft work order
        </button>
        <button
          type="button"
          onClick={() => onSelectDt?.(d)}
          className="py-[8px] px-[14px] bg-transparent text-[var(--text-mid)] border border-[var(--border)] rounded-[6px] text-[11.5px] font-semibold cursor-pointer max-[480px]:flex-1"
        >
          View detail →
        </button>
      </div>
    </div>
  )
}
