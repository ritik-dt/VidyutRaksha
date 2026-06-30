import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { fmtINR } from '@/features/Dashboard/adapter'
import { useToast } from '@/shared/context/ToastContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'

const QUARTERLY_DATA = [
  { q: 'Q1 FY25', atc: 24.2, confirmed: 3240, recovery: 1840000 },
  { q: 'Q2 FY25', atc: 23.4, confirmed: 3680, recovery: 2120000 },
  { q: 'Q3 FY25', atc: 22.8, confirmed: 4120, recovery: 2580000 },
  { q: 'Q4 FY25', atc: 22.1, confirmed: 4560, recovery: 3040000 },
  { q: 'Q1 FY26', atc: 21.6, confirmed: 5200, recovery: 3860000 },
  { q: 'Q2 FY26', atc: 20.5, confirmed: 6870, recovery: 5240000 },
]

const DISCOM_PERF = [
  { name: 'KVVNL', loss: 21.8, hitRate: 57.9, recovery: 5240000 },
  { name: 'PVVNL', loss: 18.4, hitRate: 56.1, recovery: 8120000 },
  { name: 'MVVNL', loss: 19.2, hitRate: 57.2, recovery: 6840000 },
  { name: 'DVVNL', loss: 22.6, hitRate: 53.6, recovery: 4320000 },
  { name: 'PUVVNL', loss: 20.5, hitRate: 63.4, recovery: 7680000 },
]

export default function ExecutivePage() {
  const { showToast } = useToast()

  return (
    <div className="pb-2">
      <PageHeader
        title="👔 Executive view"
        subtitle="Chairman / CMD dashboard · UPPCL state-wide performance · FY 2025-26"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Board deck ready', message: 'AI-generated board presentation (16 slides) exported as PPTX.', duration: 4000 })}>
              📊 Export board deck
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Executive briefing', message: 'Generating 1-page AI briefing for CMD morning report...', duration: 3500 })}>
              ✦ AI briefing note
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI executive summary — UPPCL FY26">
        AT&C loss has improved from <strong>24.2% (Q1 FY25) to 20.5% (Q2 FY26)</strong> — a{' '}
        <strong style={{ color: 'var(--green)' }}>3.7pp improvement</strong>, saving ₹42 Cr annualized.
        VidyutRaksha AI contributed ~<strong>68%</strong> of this improvement via targeted inspections.
        DVVNL remains the laggard at 22.6% — recommend CMD review.
        PUVVNL leads on inspector hit rate (63.4%) — replicate their process across DISCOMs.
      </AiInsightBanner>

      {/* Strategic KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'AT&C Loss FY26', value: '20.5%', sub: 'Down from 22.8% FY25', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Revenue saved (ann.)', value: '₹42 Cr', sub: 'vs FY25 baseline', accent: 'var(--ai-purple)', color: 'var(--ai-purple)', fontSize: '20px' },
          { label: 'Confirmed FYTD', value: '6,870', sub: '+64% vs FY25', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Recovery FYTD', value: '₹26.4 Cr', sub: '62% realization', accent: 'var(--green)', color: 'var(--green)', fontSize: '20px' },
          { label: 'RDSS compliance', value: '94%', sub: 'Smart meter rollout', accent: '#0EA5E9', color: '#0EA5E9' },
          { label: 'FY26 target', value: '18%', sub: 'AT&C loss target', accent: 'var(--navy-light)', color: Number('20.5') > 18 ? 'var(--red)' : 'var(--green)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">AT&C loss trajectory — quarterly</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={QUARTERLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis domain={[18, 26]} unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Line type="monotone" dataKey="atc" stroke="var(--ai-purple)" strokeWidth={2.5} dot={{ fill: 'var(--ai-purple)', r: 4 }} name="AT&C Loss" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">Quarterly confirmations & recovery</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={QUARTERLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="q" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="confirmed" fill="rgba(124,58,237,0.6)" name="Confirmed" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISCOM league table */}
      <div className="card">
        <div className="card-title mb-3 text-[13px] font-bold">DISCOM performance league table</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Rank</th><th>DISCOM</th><th>AT&C Loss</th><th>Loss vs target</th><th>Inspector hit rate</th><th>Recovery FYTD</th>
              </tr>
            </thead>
            <tbody>
              {[...DISCOM_PERF].sort((a, b) => a.loss - b.loss).map((d, i) => {
                const lossColor = d.loss > 21 ? 'var(--red)' : d.loss > 19 ? 'var(--amber)' : 'var(--green)'
                const vsTarget = (d.loss - 18).toFixed(1)
                const hitColor = d.hitRate > 60 ? 'var(--green)' : d.hitRate > 55 ? 'var(--amber)' : 'var(--red)'
                return (
                  <tr key={d.name} className="table-row">
                    <td className="font-mono font-bold text-[13px] text-text-dim">{i + 1}</td>
                    <td className="font-bold text-text">{d.name}</td>
                    <td className="font-mono font-bold" style={{ color: lossColor }}>{d.loss}%</td>
                    <td className="font-mono" style={{ color: 'var(--red)' }}>+{vsTarget}pp above target</td>
                    <td className="font-mono font-bold" style={{ color: hitColor }}>{d.hitRate}%</td>
                    <td className="font-mono font-semibold" style={{ color: 'var(--green)' }}>{fmtINR(d.recovery)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
