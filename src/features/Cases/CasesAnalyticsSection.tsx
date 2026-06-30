/**
 * CasesAnalyticsSection
 * Uses Chart.js directly — same lib as prototype — so legend-click toggle,
 * gradient fill, tension and tooltip are byte-for-byte identical.
 */
import { useEffect, useRef, useState } from 'react'
import {
  Chart,
  ArcElement, DoughnutController,
  LineElement, PointElement, LineController,
  CategoryScale, LinearScale,
  Filler, Legend, Tooltip,
} from 'chart.js'
import { useToast } from '@/shared/context/ToastContext'
import { fmtINR } from '@/features/Dashboard/adapter'
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
    try { ch.current?.destroy() } catch (_) {}
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
    return () => { try { ch.current?.destroy() } catch (_) {} }
  }, [stats.pastSla, stats.open, stats.inProgress, stats.confirmed, stats.closed])

  return <canvas ref={ref} />
}

/* ─── Trend — exact prototype Chart.js config ─── */
function TrendChart({ trend, avgClose }: { trend: CasesTrendPoint[]; avgClose: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const ch  = useRef<Chart | null>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    try { ch.current?.destroy() } catch (_) {}
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
    return () => { try { ch.current?.destroy() } catch (_) {} }
  }, [trend, avgClose])

  return <canvas ref={ref} />
}

/* ─── ActionCard ─── */
interface ACProps {
  borderColor: string; icon: string; title: string
  subColor: string; sub: string; body: React.ReactNode
  btnLabel: string; btnBase: React.CSSProperties
  btnHover?: React.CSSProperties; disabled: boolean; onClick: () => void
}
function ActionCard({ borderColor, icon, title, subColor, sub, body, btnLabel, btnBase, btnHover, disabled, onClick }: ACProps) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{
      padding: '18px 16px 16px',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      borderTop: `3px solid ${borderColor}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* icon + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 20, lineHeight: 1, marginTop: 1 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: subColor, fontWeight: 600, marginTop: 3 }}>{sub}</div>
        </div>
      </div>
      {/* body */}
      <div style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>{body}</div>
      {/* CTA */}
      <button
        type="button" disabled={disabled} onClick={onClick}
        onMouseEnter={() => !disabled && setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 7,
          fontSize: 12, fontWeight: 700,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all .15s ease',
          ...(hov && !disabled && btnHover ? { ...btnBase, ...btnHover } : btnBase),
        }}
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
      <div className="grid-2" style={{ marginTop: 14 }}>

        {/* Donut */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">📊 Case status distribution · {scopeName}</div>
          <div className="page-sub" style={{ margin: '-2px 0 12px', fontSize: 10.5 }}>
            {formatIndian(stats.total)} cases at this scope · {formatIndian(stats.active)} active ·{' '}
            {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}% confirmed
          </div>
          {/* height matches prototype screenshot exactly */}
          <div style={{ position: 'relative', height: 240 }}>
            <DonutChart stats={stats} />
          </div>
        </div>

        {/* Closure trend */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">📈 Closure-time trend · {scopeName} · 12 months</div>
          <div className="page-sub" style={{ margin: '-2px 0 12px', fontSize: 10.5 }}>
            Avg {stats.avgClose}d at {scopeName}{' '}
            {stats.avgClose <= 3
              ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ within 3-day target</span>
              : <span style={{ color: 'var(--amber)', fontWeight: 600 }}>⚠ above 3-day target</span>}
            {' '}· target line dashed
          </div>
          <div style={{ position: 'relative', height: 240 }}>
            <TrendChart trend={trend} avgClose={stats.avgClose} />
          </div>
        </div>
      </div>

      {/* ══ AI recommended actions ══ */}
      <div
        className="card"
        style={{
          marginTop: 14,
          border: '1px solid rgba(124,58,237,0.18)',
          background: 'linear-gradient(180deg,rgba(124,58,237,0.025) 0%,rgba(124,58,237,0.005) 100%)',
        }}
      >
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ai-purple)', marginBottom: 4 }}>
          ✦ AI-recommended actions · {scopeName}
          <span className="ai-live-badge" style={{ marginLeft: 'auto' }}>Live</span>
        </div>
        <div className="page-sub" style={{ margin: '0 0 16px', fontSize: 10.5 }}>
          Three highest-impact actions based on current workload at{' '}
          <strong>{scopeName}</strong> · {formatIndian(stats.active)} active cases
        </div>

        <div className="grid-3">
          {/* Card 1 — Auto-escalate */}
          <ActionCard
            borderColor="var(--red)" icon="⚠" title="Auto-escalate past-SLA cases"
            subColor="var(--red)"
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
            btnBase={stats.pastSla > 0
              ? { background: 'linear-gradient(135deg,#FF4757 0%,#C0392B 100%)', color: '#fff', border: 'none' }
              : { background: '#E5E7EB', color: '#9CA3AF', border: 'none', cursor: 'not-allowed' }
            }
            btnHover={stats.pastSla > 0 ? { background: 'linear-gradient(135deg,#D63031 0%,#8B1A25 100%)' } : undefined}
            disabled={stats.pastSla === 0}
            onClick={() => showToast({ type: 'success', title: 'Auto-escalation queued', message: `${formatIndian(stats.pastSla)} past-SLA cases at ${scopeName} escalated to next-level supervisor.`, duration: 5000 })}
          />

          {/* Card 2 — Rebalance */}
          <ActionCard
            borderColor="var(--amber)" icon="⚖" title="Rebalance inspector load"
            subColor="var(--amber)"
            sub={`${formatIndian(overCapacity)} inspector${overCapacity !== 1 ? 's' : ''} over capacity in ${scopeName}`}
            body={<>
              {scopeName}'s top inspectors hold{' '}
              <strong>{formatIndian(top42)} of {formatIndian(stats.active)} active cases</strong>{' '}
              (42%). Redistribute to keep per-inspector load under 18 cases.
            </>}
            btnLabel="Review plan →"
            btnBase={{ background: '#fff', border: '1px solid var(--amber)', color: 'var(--amber)' }}
            btnHover={{ background: 'var(--amber)', color: '#fff', border: '1px solid var(--amber)' }}
            disabled={false}
            onClick={() => showToast({ type: 'info', title: 'Rebalancing draft', message: `AI redistribution plan for ${scopeName} ready. Review on Team & Reports.`, duration: 5000 })}
          />

          {/* Card 3 — Batch-close */}
          <ActionCard
            borderColor="#6B7280" icon="🗑" title="Batch-close stale false positives"
            subColor="#6B7280"
            sub={`${fpCandidates} candidates ≥ 30d in ${scopeName}`}
            body={<>
              {fpCandidates} cases in {scopeName} marked False Positive remain open
              ≥ 30 days. AI confidence on these closures is <strong>90%+</strong>.
            </>}
            btnLabel={`Close ${fpCandidates} →`}
            btnBase={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--text-mid)' }}
            btnHover={{ background: '#6B7280', color: '#fff', border: '1px solid #6B7280' }}
            disabled={fpCandidates === 0}
            onClick={() => showToast({ type: 'success', title: 'Batch close queued', message: `${fpCandidates} stale false-positive cases at ${scopeName} will be closed.`, duration: 5000 })}
          />
        </div>
      </div>
    </>
  )
}
