import { useState, type ChangeEvent } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, Legend, ComposedChart, Cell,
} from 'recharts'

const TABS = [
  { id: 'peer', label: '⇄ Peer comparison' },
  { id: 'yoy', label: '📅 Year-over-year' },
  { id: 'ba', label: '📊 Before / After' },
  { id: 'pct', label: '🏆 Percentile ranking' },
  { id: 'pareto', label: '🎯 Pareto (80/20)' },
  { id: 'whatif', label: '🧪 What-if simulator' },
]

const PEER_DATA = [
  { name: 'Bhelupur', atc: 18.4, national: 22.5, target: 18.0, flagged: 1104 },
  { name: 'Rathayatra', atc: 22.8, national: 22.5, target: 18.0, flagged: 1892 },
  { name: 'Central Jail', atc: 8.6, national: 22.5, target: 18.0, flagged: 480 },
  { name: 'Chauk', atc: 18.4, national: 22.5, target: 18.0, flagged: 2100 },
  { name: 'Ganesh Pur', atc: 11.2, national: 22.5, target: 18.0, flagged: 840 },
  { name: 'Kabir Nagar', atc: 16.8, national: 22.5, target: 18.0, flagged: 1620 },
]

const YOY_DATA = [
  { period: 'FY22-23', atc: 26.4, confirmed: 2100, recovery: 8200000 },
  { period: 'FY23-24', atc: 24.8, confirmed: 2840, recovery: 11400000 },
  { period: 'FY24-25', atc: 22.8, confirmed: 4200, recovery: 18600000 },
  { period: 'FY25-26', atc: 20.5, confirmed: 6870, recovery: 26400000 },
]

const BA_DATA = [
  { metric: 'AT&C Loss', before: 24.2, after: 20.5, unit: '%', good: true },
  { metric: 'Hit Rate', before: 38, after: 57, unit: '%', good: true },
  { metric: 'Confirmed/year', before: 4200, after: 6870, unit: '', good: true },
  { metric: 'Avg close time', before: 8.4, after: 3.2, unit: 'd', good: true },
  { metric: 'False positives', before: 38, after: 16, unit: '%', good: true },
  { metric: 'Recovery/year', before: 1120, after: 2640, unit: '₹L', good: true },
]

const PARETO_DATA = [
  { name: 'Shivpur Colony DTR', loss: 18.2, share: 24.5, cum: 24.5 },
  { name: 'Police Line DTR', loss: 14.8, share: 19.9, cum: 44.4 },
  { name: 'Adampur DTR', loss: 11.2, share: 15.0, cum: 59.4 },
  { name: 'Gandhi Nagar DTR', loss: 7.6, share: 10.2, cum: 69.6 },
  { name: 'Kashmir Mohalla DTR', loss: 5.4, share: 7.3, cum: 76.9 },
  { name: 'Awas Vikas DTR', loss: 3.8, share: 5.1, cum: 82.0 },
  { name: 'Dhupchandi DTR', loss: 2.9, share: 3.9, cum: 85.9 },
  { name: 'Madanpura DTR', loss: 2.1, share: 2.8, cum: 88.7 },
  { name: 'Other 10 DTRs', loss: 4.7, share: 6.3, cum: 95.0 },
  { name: 'Remaining', loss: 1.4, share: 5.0, cum: 100 },
]

export default function ComparePage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('peer')
  const [whatIf, setWhatIf] = useState<{ hitRateBoost: number; inspectors: number; ruleImprove: number; mriCoverage: number }>({ hitRateBoost: 5, inspectors: 2, ruleImprove: 3, mriCoverage: 4 })

  // What-if calculations
  const baseline = { atc: 20.5, hitRate: 57, recovery: 14.2, roi: 7.9 }
  const newHitRate = Math.min(75, baseline.hitRate + whatIf.hitRateBoost)
  const newRecovery = baseline.recovery + (whatIf.hitRateBoost * 0.3) + (whatIf.inspectors * 0.8) + (whatIf.ruleImprove * 0.4) + (whatIf.mriCoverage * 0.2)
  const newAtc = Math.max(15, baseline.atc - (whatIf.hitRateBoost * 0.1) - (whatIf.inspectors * 0.15) - (whatIf.ruleImprove * 0.08) - (whatIf.mriCoverage * 0.05))
  const newRoi = newRecovery / 1.8

  return (
    <div className="pb-8">
      <PageHeader
        title="⇄ Comparative & trend analysis"
        subtitle="Peer comparison, year-over-year, before/after impact, and percentile ranking"
        actions={
          <>
            <select className="h-8 rounded-lg border border-border bg-card px-2 text-[11px] outline-none focus:border-ai-purple">
              <option>Last 12 months</option>
              <option>Last 6 months</option>
              <option>This quarter</option>
            </select>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'AI insight', message: 'Generating comparative AI insight report…', duration: 3500 })}>
              ✦ AI insight
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI comparative analysis guide">
        Comparative analysis answers four critical questions: <strong>(1) How does X compare to peers?</strong>{' '}
        (2) Is this year better than last year?{' '}
        <strong>(3) Did VidyutRaksha deployment actually help?</strong>{' '}
        (4) Where does this entity rank in its cohort? Leveraging 3–4 years of historical data,
        the analyses below are precomputed for <strong>10 feeders, 49 DTRs, and 1,116 consumers</strong>.
      </AiInsightBanner>

      {/* Tabs */}
      <div className="tabs mb-4 flex overflow-x-auto rounded-xl border border-border bg-bg p-1 gap-0.5">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-[11.5px] font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-dim)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Peer comparison */}
      {activeTab === 'peer' && (
        <div>
          <div className="card mb-4">
            <div className="card-title mb-3 text-[13px] font-bold">AT&C loss — feeder vs national avg vs target</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={PEER_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
                <YAxis unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="atc" name="AT&C loss" radius={[3,3,0,0]}>
                  {PEER_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.atc > entry.target ? '#DC3545' : '#22C55E'} />
                  ))}
                </Bar>
                <Bar dataKey="national" name="National avg" fill="rgba(107,114,128,0.3)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 rounded-lg p-2.5 text-[11px]"
              style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <strong style={{ color: 'var(--ai-purple)' }}>✦ AI: </strong>
              Central Jail feeder is a <strong>best-practice benchmark</strong> at 8.6% — significantly below national avg.
              Rathayatra feeder at 22.8% is the primary intervention target.
            </div>
          </div>
        </div>
      )}

      {/* Year-over-year */}
      {activeTab === 'yoy' && (
        <div className="card mb-4">
          <div className="card-title mb-3 text-[13px] font-bold">AT&C loss trajectory — 4-year YoY</div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={YOY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis yAxisId="atc" unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis yAxisId="conf" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="conf" dataKey="confirmed" fill="rgba(124,58,237,0.5)" name="Confirmed cases" radius={[3,3,0,0]} />
              <Line yAxisId="atc" type="monotone" dataKey="atc" stroke="var(--red)" strokeWidth={2.5} dot={{ r: 4 }} name="AT&C loss %" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <strong style={{ color: 'var(--green)' }}>✦ AI trend: </strong>
            AT&C loss has declined <strong>5.9pp in 3 years</strong> while confirmed cases grew <strong>227%</strong>.
            VidyutRaksha deployment in FY24-25 correlates with the steepest improvement.
          </div>
        </div>
      )}

      {/* Before / After */}
      {activeTab === 'ba' && (
        <div className="card">
          <div className="card-title mb-4 text-[13px] font-bold">Before VidyutRaksha (FY24) vs After (FY26)</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr className="table-header">
                  <th>Metric</th><th>Before (FY24)</th><th>After (FY26)</th><th>Change</th><th>Direction</th>
                </tr>
              </thead>
              <tbody>
                {BA_DATA.map((row) => {
                  const delta = row.after - row.before
                  const improved = row.good ? delta > 0 : delta < 0
                  const deltaStr = delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)
                  const deltaColor = improved ? 'var(--green)' : 'var(--red)'
                  return (
                    <tr key={row.metric} className="table-row">
                      <td className="font-semibold text-text">{row.metric}</td>
                      <td className="font-mono text-text-mid">{row.before}{row.unit}</td>
                      <td className="font-mono font-bold text-text">{row.after}{row.unit}</td>
                      <td className="font-mono font-bold" style={{ color: deltaColor }}>{deltaStr}{row.unit}</td>
                      <td style={{ color: deltaColor }}>{improved ? '↑ Improved' : '↓ Declined'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Percentile ranking */}
      {activeTab === 'pct' && (
        <div className="card">
          <div className="card-title mb-4 text-[13px] font-bold">Percentile ranking — KVVNL vs all UP DISCOMs</div>
          <div className="space-y-4">
            {[
              { metric: 'AT&C loss reduction', pct: 78, label: '78th percentile — top quartile', color: 'var(--green)' },
              { metric: 'Confirmed theft rate', pct: 62, label: '62nd percentile — above median', color: '#0EA5E9' },
              { metric: 'Inspector hit rate', pct: 71, label: '71st percentile — strong performer', color: 'var(--green)' },
              { metric: 'Average case close time', pct: 55, label: '55th percentile — near median', color: 'var(--amber)' },
              { metric: 'MRI data coverage', pct: 84, label: '84th percentile — high coverage', color: 'var(--green)' },
            ].map((row) => (
              <div key={row.metric}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-text">{row.metric}</span>
                  <span className="font-mono text-[12px] font-bold" style={{ color: row.color }}>{row.pct}th pct</span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                  <div className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-bold text-white">
                    {row.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pareto */}
      {activeTab === 'pareto' && (
        <div className="card">
          <div className="card-title mb-1 text-[13px] font-bold">🎯 Pareto analysis — DTR-wise loss contribution</div>
          <div className="mb-3 text-[10.5px] text-text-dim">Top 5 DTRs account for 76.9% of total losses — Pareto principle confirmed</div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={PARETO_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: 'var(--text-dim)' }} angle={-30} textAnchor="end" height={50} />
              <YAxis yAxisId="share" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis yAxisId="cum" orientation="right" unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="share" dataKey="share" name="Loss share %" radius={[3,3,0,0]}>
                {PARETO_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.cum <= 80 ? '#DC3545' : 'rgba(107,114,128,0.5)'} />
                ))}
              </Bar>
              <Line yAxisId="cum" type="monotone" dataKey="cum" stroke="var(--ai-purple)" strokeWidth={2} dot={{ r: 3 }} name="Cumulative %" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <strong style={{ color: 'var(--ai-purple)' }}>✦ AI: </strong>
            <strong>5 DTRs drive 76.9% of losses</strong> — prioritise Shivpur Colony and Police Line for maximum impact.
            This is a stronger Pareto ratio than typical utility networks (usually 80/40 not 80/20).
          </div>
        </div>
      )}

      {/* What-if */}
      {activeTab === 'whatif' && (
        <div>
          <div className="card mb-4" style={{ border: '2px solid var(--ai-purple)' }}>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[13px] font-bold" style={{ color: 'var(--ai-purple)' }}>
                ✦ What-if simulator — model interventions before committing budget
              </div>
              <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10.5px' }}
                onClick={() => setWhatIf({ hitRateBoost: 5, inspectors: 2, ruleImprove: 3, mriCoverage: 4 })}>
                ↻ Reset
              </button>
            </div>
            <div className="rounded-lg p-3 mb-4 text-[11px] text-text-mid"
              style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
              Move sliders to model interventions. Baseline: <strong>20.5% AT&C loss · 57% hit rate · ₹14.2 Cr/yr · 7.9× ROI</strong>.
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                { key: 'hitRateBoost' as const, label: '🎯 Improve hit rate', unit: 'pp', max: 18, desc: '+1pp hit rate ≈ ₹30L additional recovery/yr', color: 'var(--ai-purple)' },
                { key: 'inspectors' as const, label: '👥 Add inspectors', unit: '', max: 12, desc: 'Each inspector handles ~28 cases/month', color: '#0EA5E9' },
                { key: 'ruleImprove' as const, label: '🔧 Improve rule precision', unit: 'pp', max: 15, desc: 'Reduce false positive rate by refining rule weights', color: 'var(--green)' },
                { key: 'mriCoverage' as const, label: '📡 Increase MRI coverage', unit: 'pp', max: 10, desc: 'Each 1pp more coverage surfaces ~85 additional suspects', color: 'var(--amber)' },
              ].map((lever) => (
                <div key={lever.key} className="rounded-xl border border-border bg-bg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[12px] font-bold text-text">{lever.label}</div>
                    <div className="font-mono text-[18px] font-extrabold" style={{ color: lever.color }}>
                      +{whatIf[lever.key]}{lever.unit}
                    </div>
                  </div>
                  <input type="range" min={0} max={lever.max} step={1} value={whatIf[lever.key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatIf((p: { hitRateBoost: number; inspectors: number; ruleImprove: number; mriCoverage: number }) => ({ ...p, [lever.key]: parseInt(e.target.value) }))}
                    className="w-full cursor-pointer" style={{ accentColor: lever.color }} />
                  <div className="mt-2 text-[10.5px] text-text-dim">{lever.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What-if results */}
          <div className="card" style={{ border: '2px solid var(--green)' }}>
            <div className="mb-3 text-[13px] font-bold" style={{ color: 'var(--green)' }}>
              ✦ Projected outcomes
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'AT&C loss', baseline: `${baseline.atc}%`, projected: `${newAtc.toFixed(1)}%`, delta: `-${(baseline.atc - newAtc).toFixed(1)}pp`, good: true },
                { label: 'Hit rate', baseline: `${baseline.hitRate}%`, projected: `${newHitRate.toFixed(0)}%`, delta: `+${(newHitRate - baseline.hitRate).toFixed(0)}pp`, good: true },
                { label: 'Recovery/yr', baseline: `₹${baseline.recovery}Cr`, projected: `₹${newRecovery.toFixed(1)}Cr`, delta: `+₹${(newRecovery - baseline.recovery).toFixed(1)}Cr`, good: true },
                { label: 'ROI', baseline: `${baseline.roi}×`, projected: `${newRoi.toFixed(1)}×`, delta: `+${(newRoi - baseline.roi).toFixed(1)}×`, good: true },
              ].map((r) => (
                <div key={r.label} className="rounded-xl border border-border bg-bg p-3 text-center">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-text-dim mb-2">{r.label}</div>
                  <div className="font-mono text-[12px] text-text-dim line-through mb-1">{r.baseline}</div>
                  <div className="font-mono text-[20px] font-extrabold" style={{ color: 'var(--green)' }}>{r.projected}</div>
                  <div className="mt-1 font-mono text-[11px] font-bold" style={{ color: 'var(--green)' }}>{r.delta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
