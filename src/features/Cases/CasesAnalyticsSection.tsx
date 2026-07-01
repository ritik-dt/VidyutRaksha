/**
 * CasesAnalyticsSection
 * Uses Chart.js directly — same lib as prototype — so legend-click toggle,
 * gradient fill, tension and tooltip are byte-for-byte identical.
 */
import { useEffect, useRef } from 'react'
import {
  Chart,
  ArcElement, DoughnutController,
  LineElement, PointElement, LineController,
  CategoryScale, LinearScale,
  Filler, Legend, Tooltip,
} from 'chart.js'
import { useToast } from '@/shared/context/ToastContext'
import { formatIndian } from '@/shared/utils/formatters'
import type { CasesStats, CasesTrendPoint } from './types'

Chart.register(
  ArcElement, DoughnutController,
  LineElement, PointElement, LineController,
  CategoryScale, LinearScale,
  Filler, Legend, Tooltip,
)

interface Props { scopeName: string; stats: CasesStats; trend: CasesTrendPoint[] }

/* ─── Donut — exact prototype Chart.js config ─── */
function DonutChart({ stats }: { stats: CasesStats }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch  = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    ch.current = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Past SLA', 'Open', 'In progress', 'Confirmed', 'Closed/FP'],
        datasets: [{
          data: [stats.pastSla, stats.open, stats.inProgress, stats.confirmed, stats.closed],
          backgroundColor: ['#FF4757', '#0EA5E9', '#FFA502', '#28A745', '#9CA3AF'],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 14,
              font: { size: 11, family: 'IBM Plex Sans, sans-serif' },
              color: '#4A5568',
            },
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1A1A2E',
            bodyColor: '#4A5568',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 11, family: 'IBM Plex Sans, sans-serif' },
            bodyFont:  { size: 11, family: 'IBM Plex Sans, sans-serif' },
            callbacks: {
              label: (ctx: any) => {
                const tot = (ctx.dataset.data as number[]).reduce((s: number, v: number) => s + v, 0)
                const pct = tot > 0 ? ((ctx.parsed / tot) * 100).toFixed(1) : '0'
                return `${ctx.label}: ${ctx.parsed.toLocaleString('en-IN')} (${pct}%)`
              },
            },
          },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [stats.pastSla, stats.open, stats.inProgress, stats.confirmed, stats.closed])

  return <canvas ref={ref} />
}

/* ─── Trend — exact prototype Chart.js config ─── */
function TrendChart({ trend, avgClose }: { trend: CasesTrendPoint[]; avgClose: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch  = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    try { ch.current?.destroy() } catch { /* noop */ }
    const months = trend.map((p) => p.month)
    const data   = trend.map((p) => p.avgDays)
    ch.current = new Chart(el, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Avg days to close',
            data,
            borderColor: '#0EA5E9',
            backgroundColor: 'rgba(14,165,233,0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: '#0EA5E9',
          },
          {
            label: 'Target (3d)',
            data: months.map(() => 3.0),
            borderColor: 'rgba(40,167,69,0.6)',
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 12,
              font: { size: 10.5, family: 'IBM Plex Sans, sans-serif' },
              color: '#4A5568',
            },
          },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#1A1A2E',
            bodyColor: '#4A5568',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 11, family: 'IBM Plex Sans, sans-serif' },
            bodyFont:  { size: 11, family: 'IBM Plex Sans, sans-serif' },
            callbacks: {
              label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}d`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: 'IBM Plex Sans, sans-serif' }, color: '#8B95A5' },
            border: { display: false },
          },
          y: {
            grid: { color: '#EDF2F7' },
            ticks: {
              font: { size: 10, family: 'IBM Plex Sans, sans-serif' },
              color: '#8B95A5',
              callback: (v: any) => `${v}d`,
            },
            beginAtZero: true,
            suggestedMax: Math.max(5, avgClose + 2),
            border: { display: false, dash: [3, 3] },
          },
        },
      },
    })
    return () => { try { ch.current?.destroy() } catch { /* noop */ } }
  }, [trend, avgClose])

  return <canvas ref={ref} />
}

/* ─── ActionCard ─── */
type ACVariant = 'red' | 'amber' | 'gray'

const TOP_BORDER: Record<ACVariant, string> = {
  red: 'border-t-red',
  amber: 'border-t-amber',
  gray: 'border-t-[#6B7280]',
}
const SUB_COLOR: Record<ACVariant, string> = {
  red: 'text-red',
  amber: 'text-amber',
  gray: 'text-[#6B7280]',
}
const BTN_ACTIVE: Record<ACVariant, string> = {
  red: 'border-none bg-[linear-gradient(135deg,#FF4757_0%,#C0392B_100%)] text-white hover:bg-[linear-gradient(135deg,#D63031_0%,#8B1A25_100%)]',
  amber: 'border border-amber bg-white text-amber hover:bg-amber hover:text-white',
  gray: 'border border-border bg-white text-text-mid hover:border-[#6B7280] hover:bg-[#6B7280] hover:text-white',
}
const BTN_DISABLED = 'cursor-not-allowed border-none bg-[#E5E7EB] text-[#9CA3AF]'

interface ACProps {
  variant: ACVariant; icon: string; title: string
  sub: string; body: React.ReactNode
  btnLabel: string; disabled: boolean; onClick: () => void
}
function ActionCard({ variant, icon, title, sub, body, btnLabel, disabled, onClick }: ACProps) {
  return (
    <div className={`flex flex-col rounded-[10px] border border-border bg-card px-4 pt-4.5 pb-4 border-t-[3px] ${TOP_BORDER[variant]}`}>
      {/* icon + title */}
      <div className="mb-2.5 flex items-start gap-2.5">
        <span className="mt-px text-xl leading-none">{icon}</span>
        <div>
          <div className="text-[12.5px] leading-[1.35] font-bold text-text">{title}</div>
          <div className={`mt-[3px] text-[10.5px] font-semibold ${SUB_COLOR[variant]}`}>{sub}</div>
        </div>
      </div>
      {/* body */}
      <div className="mb-4 flex-1 text-[11px] leading-[1.65] text-text-mid">{body}</div>
      {/* CTA */}
      <button
        type="button" disabled={disabled} onClick={onClick}
        className={`w-full rounded-[7px] px-3 py-2.5 text-xs font-bold transition-all duration-150 ${disabled ? BTN_DISABLED : `cursor-pointer ${BTN_ACTIVE[variant]}`}`}
      >
        {btnLabel}
      </button>
    </div>
  )
}

/* ─── Main ─── */
export function CasesAnalyticsSection({ scopeName, stats, trend }: Props) {
  const { showToast } = useToast()
  const fpCandidates = Math.round(stats.closed  * 0.4)
  const overCapacity = Math.max(1, Math.round(stats.active / 18))
  const top42        = Math.round(stats.active  * 0.42)

  return (
    <>
      {/* ══ Charts 2-col ══ */}
      <div className="grid-2 mt-3.5">

        {/* Donut */}
        <div className="card mb-0">
          <div className="card-title">📊 Case status distribution · {scopeName}</div>
          <div className="page-sub my-[-2px] mb-3 text-[10.5px]">
            {formatIndian(stats.total)} cases at this scope · {formatIndian(stats.active)} active ·{' '}
            {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}% confirmed
          </div>
          {/* height matches prototype screenshot exactly */}
          <div className="relative h-[240px]">
            <DonutChart stats={stats} />
          </div>
        </div>

        {/* Closure trend */}
        <div className="card mb-0">
          <div className="card-title">📈 Closure-time trend · {scopeName} · 12 months</div>
          <div className="page-sub my-[-2px] mb-3 text-[10.5px]">
            Avg {stats.avgClose}d at {scopeName}{' '}
            {stats.avgClose <= 3
              ? <span className="font-semibold text-green">✓ within 3-day target</span>
              : <span className="font-semibold text-amber">⚠ above 3-day target</span>}
            {' '}· target line dashed
          </div>
          <div className="relative h-[240px]">
            <TrendChart trend={trend} avgClose={stats.avgClose} />
          </div>
        </div>
      </div>

      {/* ══ AI recommended actions ══ */}
      <div className="card mt-3.5 border border-[rgba(124,58,237,0.18)] bg-[linear-gradient(180deg,rgba(124,58,237,0.025)_0%,rgba(124,58,237,0.005)_100%)]">
        <div className="card-title mb-1 flex items-center gap-2 text-ai-purple">
          ✦ AI-recommended actions · {scopeName}
          <span className="ai-live-badge ml-auto">Live</span>
        </div>
        <div className="page-sub mb-4 text-[10.5px]">
          Three highest-impact actions based on current workload at{' '}
          <strong>{scopeName}</strong> · {formatIndian(stats.active)} active cases
        </div>

        <div className="grid-3">
          {/* Card 1 — Auto-escalate */}
          <ActionCard
            variant="red" icon="⚠" title="Auto-escalate past-SLA cases"
            sub={`${formatIndian(stats.pastSla)} cases qualify in ${scopeName}`}
            body={<>
              {stats.pastSla > 0
                ? <>{formatIndian(stats.pastSla)} active case{stats.pastSla !== 1 ? 's are' : ' is'} past their due date in {scopeName}.</>
                : <>No past-SLA cases in {scopeName}.</>
              }{' '}
              Notify next-level supervisor and tag with priority flag.
              Escalated cases close <strong>1.4× faster</strong> on average.
            </>}
            btnLabel={stats.pastSla > 0 ? `Escalate ${formatIndian(stats.pastSla)} →` : 'Nothing to escalate'}
            disabled={stats.pastSla === 0}
            onClick={() => showToast({ type: 'success', title: 'Auto-escalation queued', message: `${formatIndian(stats.pastSla)} past-SLA cases at ${scopeName} escalated to next-level supervisor.`, duration: 5000 })}
          />

          {/* Card 2 — Rebalance */}
          <ActionCard
            variant="amber" icon="⚖" title="Rebalance inspector load"
            sub={`${formatIndian(overCapacity)} inspector${overCapacity !== 1 ? 's' : ''} over capacity in ${scopeName}`}
            body={<>
              {scopeName}'s top inspectors hold{' '}
              <strong>{formatIndian(top42)} of {formatIndian(stats.active)} active cases</strong>{' '}
              (42%). Redistribute to keep per-inspector load under 18 cases.
            </>}
            btnLabel="Review plan →"
            disabled={false}
            onClick={() => showToast({ type: 'info', title: 'Rebalancing draft', message: `AI redistribution plan for ${scopeName} ready. Review on Team & Reports.`, duration: 5000 })}
          />

          {/* Card 3 — Batch-close */}
          <ActionCard
            variant="gray" icon="🗑" title="Batch-close stale false positives"
            sub={`${fpCandidates} candidates ≥ 30d in ${scopeName}`}
            body={<>
              {fpCandidates} cases in {scopeName} marked False Positive remain open
              ≥ 30 days. AI confidence on these closures is <strong>90%+</strong>.
            </>}
            btnLabel={`Close ${fpCandidates} →`}
            disabled={fpCandidates === 0}
            onClick={() => showToast({ type: 'success', title: 'Batch close queued', message: `${fpCandidates} stale false-positive cases at ${scopeName} will be closed.`, duration: 5000 })}
          />
        </div>
      </div>
    </>
  )
}
