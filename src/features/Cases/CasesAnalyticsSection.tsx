import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CasesStats } from './types'
import { fmtINR } from '@/features/Dashboard/adapter'

interface CasesAnalyticsSectionProps {
  scopeName: string
  stats: CasesStats
  trend: Array<{ month: string; value: number }>
}

export function CasesAnalyticsSection({ scopeName, stats, trend }: CasesAnalyticsSectionProps) {
  const chartData = [
    { label: 'Past SLA', value: stats.pastSla, color: '#FF4757' },
    { label: 'Open', value: stats.open, color: '#0EA5E9' },
    { label: 'In progress', value: stats.inProgress, color: '#FFA502' },
    { label: 'Confirmed', value: stats.confirmed, color: '#28A745' },
    { label: 'Closed/FP', value: stats.closed, color: '#9CA3AF' },
  ]

  return (
    <>
      <div
        className="card mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.04), var(--card) 40%)',
          border: '1px solid rgba(124,58,237,0.18)',
        }}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>
            <span>✦ AI case advisor</span>
            <span className="ai-live-badge">Live</span>
          </div>
          <span className="text-[10.5px] font-medium text-text-dim">{scopeName}</span>
        </div>
        <p className="text-[13px] leading-[1.75] text-text">
          Across <strong>{scopeName}</strong>, <strong style={{ color: 'var(--red)' }}>
            {stats.pastSla.toLocaleString('en-IN')} cases are past SLA
          </strong> - recommend immediate escalation. <strong>{stats.confirmed.toLocaleString('en-IN')} confirmed</strong> theft cases have generated assessments worth <strong>{fmtINR(stats.recovery)}</strong> (at 62% realization). Closure rate is <strong>{stats.avgClose} days</strong>{' '}
          {stats.avgClose > 3 ? '(above 3-day target - investigate inspector load)' : '(within 3-day target)'}.
        </p>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-title mb-3">Case status distribution · {scopeName}</div>
          <div className="text-[11px] text-text-dim">
            {stats.total.toLocaleString('en-IN')} cases at this scope · {stats.active.toLocaleString('en-IN')} active · {Math.round((stats.confirmed / Math.max(stats.total, 1)) * 100)}% confirmed
          </div>
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={72} outerRadius={110} paddingAngle={3}>
                  {chartData.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={((value: unknown) => [Number(value ?? 0).toLocaleString('en-IN'), '']) as any}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-3">Closure-time trend · {scopeName} · 12 months</div>
          <div className="text-[11px] text-text-dim">
            Avg {stats.avgClose}d at {scopeName}{' '}
            <span style={{ color: stats.avgClose > 3 ? 'var(--amber)' : 'var(--green)', fontWeight: 700 }}>
              {stats.avgClose > 3 ? 'above 3-day target' : 'within target'}
            </span>
            {' '}· target line dashed
          </div>
          <div className="h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: 'rgba(148,163,184,0.35)' }} />
                <YAxis domain={[0, 'auto']} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0EA5E9"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 0, fill: '#0EA5E9' }}
                  activeDot={{ r: 5 }}
                />
                <ReferenceLine y={3} stroke="rgba(34,197,94,0.55)" strokeDasharray="6 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mb-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-bold text-text">
            <span>✦ AI-recommended actions · {scopeName}</span>
            <span className="ai-live-badge">Live</span>
          </div>
          <span className="text-[11px] text-text-dim">Three highest-impact actions based on current workload</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl border border-red-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] font-bold text-text">Auto-escalate past-SLA cases</div>
            <div className="mt-1 text-[11px] font-semibold text-red-500">{stats.pastSla.toLocaleString('en-IN')} cases qualify in {scopeName}</div>
            <p className="mt-3 text-[11.5px] leading-[1.6] text-text-mid">
              Notify next-level supervisor and tag with priority flag. Escalated cases close faster than the average backlog.
            </p>
            <button type="button" className="btn btn-ai mt-4 w-full" style={{ justifyContent: 'center' }}>
              Escalate {stats.pastSla.toLocaleString('en-IN')} →
            </button>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] font-bold text-text">Rebalance inspector load</div>
            <div className="mt-1 text-[11px] font-semibold" style={{ color: 'var(--amber)' }}>
              {Math.max(1, Math.round(stats.active * 0.12)).toLocaleString('en-IN')} inspectors over capacity
            </div>
            <p className="mt-3 text-[11.5px] leading-[1.6] text-text-mid">
              Redistribute active cases so no inspector exceeds their practical daily load. The fastest closure teams should absorb overflow.
            </p>
            <button type="button" className="btn btn-outline mt-4 w-full" style={{ justifyContent: 'center' }}>
              Review plan →
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-[12px] font-bold text-text">Batch-close stale false positives</div>
            <div className="mt-1 text-[11px] font-semibold text-text-mid">
              {Math.max(20, Math.round(stats.closed * 0.18)).toLocaleString('en-IN')} candidates over 30 days in {scopeName}
            </div>
            <p className="mt-3 text-[11.5px] leading-[1.6] text-text-mid">
              Clear out stale false positives that no longer require inspection. This trims clutter and keeps the active queue focused.
            </p>
            <button type="button" className="btn btn-outline mt-4 w-full" style={{ justifyContent: 'center' }}>
              Close 350 →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
