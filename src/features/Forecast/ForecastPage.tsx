import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, AreaChart, Area
} from 'recharts'

const FORECAST_DATA = [
  // Actuals
  { month: 'Oct', actual: 22.4, forecast: null, lower: null, upper: null },
  { month: 'Nov', actual: 21.8, forecast: null, lower: null, upper: null },
  { month: 'Dec', actual: 21.2, forecast: null, lower: null, upper: null },
  { month: 'Jan', actual: 20.8, forecast: null, lower: null, upper: null },
  { month: 'Feb', actual: 20.5, forecast: null, lower: null, upper: null },
  { month: 'Mar', actual: 20.1, forecast: null, lower: null, upper: null },
  // Forecasts with confidence interval
  { month: 'Apr', actual: null, forecast: 19.6, lower: 18.9, upper: 20.3 },
  { month: 'May', actual: null, forecast: 19.2, lower: 18.2, upper: 20.1 },
  { month: 'Jun', actual: null, forecast: 18.8, lower: 17.5, upper: 20.1 },
  { month: 'Jul', actual: null, forecast: 18.5, lower: 17.0, upper: 20.0 },
  { month: 'Aug', actual: null, forecast: 18.3, lower: 16.8, upper: 19.8 },
  { month: 'Sep', actual: null, forecast: 18.1, lower: 16.5, upper: 19.7 },
]

const DEMAND_FORECAST = [
  { month: 'Oct', actual: 14200, forecast: null },
  { month: 'Nov', actual: 13800, forecast: null },
  { month: 'Dec', actual: 15200, forecast: null },
  { month: 'Jan', actual: 14600, forecast: null },
  { month: 'Feb', actual: 13900, forecast: null },
  { month: 'Mar', actual: 14800, forecast: null },
  { month: 'Apr', actual: null, forecast: 16200 },
  { month: 'May', actual: null, forecast: 17800 },
  { month: 'Jun', actual: null, forecast: 19400 },
  { month: 'Jul', actual: null, forecast: 20600 },
  { month: 'Aug', actual: null, forecast: 19800 },
  { month: 'Sep', actual: null, forecast: 17200 },
]

export default function ForecastPage() {
  const { showToast } = useToast()

  return (
    <div className="pb-2">
      <PageHeader
        title="📈 Forecast"
        subtitle="AI-powered AT&C loss trajectory and demand forecasting · UPPCL FY26"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'Forecast updated', message: 'Re-running 12-month forecast with latest actuals...', duration: 3500 })}>
            ✦ Refresh forecast
          </button>
        }
      />

      <AiInsightBanner title="AI forecast summary">
        Based on current trajectory, <strong>AT&C loss is forecast to reach 18.1% by Sep 2026</strong> — 
        just above the 18% RDSS target. To achieve the target by Jun 2026,
        we need <strong>+12% inspection throughput</strong> (currently limited by inspector capacity in Varanasi circle).
        Peak demand forecast: <strong>20,600 MU in July</strong> — ensure DT augmentation in Chowk and Rathayatra feeders before summer.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Forecast loss (Sep 26)', value: '18.1%', sub: 'AI model · 90-day horizon', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Target loss (FY26)', value: '18.0%', sub: 'RDSS UPPCL target', accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'Gap to target', value: '0.1pp', sub: 'Very achievable with current pace', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Peak demand (Jul)', value: '20,600 MU', sub: 'Jul forecast · +39% vs Mar', accent: 'var(--red)', color: 'var(--red)', fontSize: '16px' },
          { label: 'Model accuracy', value: '94.2%', sub: 'Backtested on FY25 actuals', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* AT&C forecast chart */}
      <div className="card mb-4">
        <div className="card-title mb-1 text-[13px] font-bold">AT&C loss forecast — Oct FY25 to Sep FY26</div>
        <div className="mb-3 text-[10.5px] text-text-dim">Shaded region = 80% confidence interval · Dashed line = 18% RDSS target</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={FORECAST_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <YAxis domain={[15, 24]} unit="%" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <Tooltip formatter={(v: number | null) => v != null ? `${v}%` : '—'} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={18} stroke="var(--green)" strokeDasharray="6 3" label={{ value: '18% target', position: 'insideLeft', fontSize: 10, fill: 'var(--green)' }} />
            <Line type="monotone" dataKey="actual" stroke="var(--navy-light)" strokeWidth={2.5} dot={{ r: 4 }} name="Actual" connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke="var(--ai-purple)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Forecast" connectNulls={false} />
            <Line type="monotone" dataKey="upper" stroke="rgba(124,58,237,0.2)" strokeWidth={1} dot={false} name="Upper CI" legendType="none" />
            <Line type="monotone" dataKey="lower" stroke="rgba(124,58,237,0.2)" strokeWidth={1} dot={false} name="Lower CI" legendType="none" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Demand forecast */}
      <div className="card">
        <div className="card-title mb-3 text-[13px] font-bold">Peak demand forecast — MU/month</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={DEMAND_FORECAST}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-dim)' }} unit="MU" />
            <Tooltip formatter={(v: number | null) => v != null ? `${v.toLocaleString('en-IN')} MU` : '—'} />
            <Area type="monotone" dataKey="actual" stroke="var(--navy-light)" fill="rgba(6,35,71,0.2)" name="Actual" />
            <Area type="monotone" dataKey="forecast" stroke="var(--ai-purple)" fill="rgba(124,58,237,0.12)" strokeDasharray="5 3" name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
