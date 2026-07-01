import { useState } from 'react'
import { useScope } from '@/shared/context/ScopeContext'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { enrichLevel, fmtINR, HIER_AI } from '@/features/Dashboard/adapter'
import { useToast } from '@/shared/context/ToastContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts'

const TABS = [
  { id: 'audit', label: '📈 Energy audit' },
  { id: 'reliability', label: '⚡ Reliability' },
  { id: 'outage', label: '🔌 Outage' },
  { id: 'revenue', label: '💰 Revenue' },
  { id: 'pq', label: '📊 Power quality' },
]

const SAIDI_DATA = [
  { feeder: 'Bhelupur', saidi: 14.2, saifi: 8.4, caidi: 1.69, asai: 99.84, caifi: 11.8, maifi: 24.6, trend: '↑', worst: 'Vijaya Complex' },
  { feeder: 'Rathayatra', saidi: 22.8, saifi: 12.1, caidi: 1.88, asai: 99.74, caifi: 18.2, maifi: 42.4, trend: '↓', worst: 'Shivpur Colony' },
  { feeder: 'Central Jail', saidi: 8.6, saifi: 5.2, caidi: 1.65, asai: 99.9, caifi: 7.4, maifi: 14.8, trend: '→', worst: '—' },
  { feeder: 'Chauk', saidi: 18.4, saifi: 9.8, caidi: 1.88, asai: 99.79, caifi: 14.6, maifi: 32.2, trend: '↓', worst: 'Jal Sansthan DTR' },
  { feeder: 'Ganesh Pur', saidi: 11.2, saifi: 6.4, caidi: 1.75, asai: 99.87, caifi: 9.1, maifi: 18.4, trend: '↑', worst: 'Dindayalpur' },
  { feeder: 'Kabir Nagar', saidi: 16.8, saifi: 10.2, caidi: 1.65, asai: 99.81, caifi: 15.2, maifi: 28.6, trend: '→', worst: '—' },
  { feeder: 'Kerakatpur', saidi: 9.4, saifi: 5.8, caidi: 1.62, asai: 99.89, caifi: 8.3, maifi: 16.2, trend: '↑', worst: '—' },
  { feeder: 'Raghunath Nagar', saidi: 20.4, saifi: 11.6, caidi: 1.76, asai: 99.77, caifi: 17.4, maifi: 38.8, trend: '↓', worst: 'Raghunath Colony' },
  { feeder: 'Ramarepur', saidi: 12.8, saifi: 7.2, caidi: 1.78, asai: 99.85, caifi: 10.6, maifi: 21.4, trend: '→', worst: '—' },
  { feeder: 'Shaktipeeth', saidi: 15.6, saifi: 8.8, caidi: 1.77, asai: 99.82, caifi: 12.4, maifi: 26.2, trend: '↑', worst: 'Ledhupur DTR' },
]

const MONTHLY_LOSS = [
  { month: 'Oct', atc: 22.4, theft: 8.2, technical: 7.6, billing: 6.6 },
  { month: 'Nov', atc: 21.8, theft: 8.0, technical: 7.4, billing: 6.4 },
  { month: 'Dec', atc: 21.2, theft: 7.8, technical: 7.2, billing: 6.2 },
  { month: 'Jan', atc: 20.8, theft: 7.5, technical: 7.1, billing: 6.2 },
  { month: 'Feb', atc: 20.5, theft: 7.3, technical: 7.0, billing: 6.2 },
  { month: 'Mar', atc: 20.1, theft: 7.1, technical: 6.8, billing: 6.2 },
]

export default function AnalyticsPage() {
  const { currentNode, hierPath } = useScope()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('audit')

  const level = currentNode ? enrichLevel(currentNode) : null
  const scopeName = level?.name ?? 'UPPCL'
  const scopeId = hierPath[hierPath.length - 1] ?? 'uppcl'
  const feederLoss = level?.loss ? Math.max(2, level.loss - 12).toFixed(1) : '8.4'
  const dtLoss = level?.loss ? Math.max(2, level.loss - 14).toFixed(1) : '6.2'
  const insight = HIER_AI[scopeId] ?? `Avg feeder loss is ${feederLoss}% across ${SAIDI_DATA.length} feeders. DT-level losses average ${dtLoss}%.`

  const avgSaidi = (SAIDI_DATA.reduce((s, d) => s + d.saidi, 0) / SAIDI_DATA.length).toFixed(1)
  const avgSaifi = (SAIDI_DATA.reduce((s, d) => s + d.saifi, 0) / SAIDI_DATA.length).toFixed(1)
  const avgAsai = (SAIDI_DATA.reduce((s, d) => s + d.asai, 0) / SAIDI_DATA.length).toFixed(2)

  return (
    <div className="pb-2">
      <PageHeader
        title="Energy audit & analytics"
        subtitle={`Scoped to: ${scopeName} · ${level?.type ?? 'State'}`}
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'AI audit report', message: 'Generating comprehensive audit report for your scope...', duration: 3000 })}>
            ✦ AI audit report
          </button>
        }
      />

      <ScopeBreadcrumb />

      <AiInsightBanner title={`AI audit — ${scopeName}`}>
        <span dangerouslySetInnerHTML={{ __html: insight }} />
      </AiInsightBanner>

      {/* Tabs */}
      <div className="tabs mb-4 flex gap-0.5 overflow-x-auto rounded-xl border border-border bg-bg p-1">
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

      {/* Tab content */}
      {activeTab === 'audit' && <AuditTab level={level} scopeName={scopeName} feederLoss={feederLoss} dtLoss={dtLoss} />}
      {activeTab === 'reliability' && <ReliabilityTab avgSaidi={avgSaidi} avgSaifi={avgSaifi} avgAsai={avgAsai} />}
      {activeTab === 'outage' && <OutageTab />}
      {activeTab === 'revenue' && <RevenueTab level={level} />}
      {activeTab === 'pq' && <PowerQualityTab />}
    </div>
  )
}

function AuditTab({ level, scopeName, feederLoss, dtLoss }: { level: ReturnType<typeof enrichLevel> | null; scopeName: string; feederLoss: string; dtLoss: string }) {
  const kpis = [
    { label: 'Feeder loss', value: `${feederLoss}%`, sub: `Avg across feeders`, accent: 'var(--red)', color: 'var(--red)' },
    { label: 'DT-level loss', value: `${dtLoss}%`, sub: 'Avg DT losses', accent: 'var(--amber)', color: 'var(--amber)' },
    { label: 'Collection eff.', value: '88.4%', sub: 'Bills collected / bills raised', accent: 'var(--green)', color: 'var(--green)' },
    { label: 'Billing eff.', value: '94.2%', sub: 'Units billed / units supplied', accent: '#0EA5E9', color: '#0EA5E9' },
    { label: 'AT&C loss', value: `${level?.loss ?? 20.5}%`, sub: `Target: 18% FY26`, accent: 'var(--ai-purple)', color: (level?.loss ?? 0) > 20 ? 'var(--red)' : 'var(--green)' },
  ]

  return (
    <div>
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[24px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Loss trend chart */}
      <div className="card mb-4">
        <div className="card-title mb-3 text-[13px] font-bold">AT&C loss breakdown trend — {scopeName}</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_LOSS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-dim)' }} unit="%" />
            <Tooltip formatter={(v: any) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="theft" stackId="1" stroke="var(--red)" fill="rgba(220,53,69,0.3)" name="Theft losses" />
            <Area type="monotone" dataKey="technical" stackId="1" stroke="var(--amber)" fill="rgba(230,146,30,0.3)" name="Technical losses" />
            <Area type="monotone" dataKey="billing" stackId="1" stroke="#0EA5E9" fill="rgba(14,165,233,0.2)" name="Billing/collection" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ReliabilityTab({ avgSaidi, avgSaifi, avgAsai }: { avgSaidi: string; avgSaifi: string; avgAsai: string }) {
  const reliKpis = [
    { label: 'Avg SAIDI', value: `${avgSaidi} hrs`, sub: 'Interruption duration/consumer', accent: 'var(--amber)', color: 'var(--amber)' },
    { label: 'Avg SAIFI', value: `${avgSaifi}`, sub: 'Interruptions/consumer/yr', accent: 'var(--red)', color: 'var(--red)' },
    { label: 'Avg ASAI', value: `${avgAsai}%`, sub: 'Availability index', accent: 'var(--green)', color: 'var(--green)' },
    { label: 'Worst feeder', value: 'Rathayatra', sub: 'SAIDI 22.8 hrs', accent: 'var(--red)', color: 'var(--red)' },
    { label: 'Best feeder', value: 'Central Jail', sub: 'SAIDI 8.6 hrs', accent: 'var(--green)', color: 'var(--green)' },
  ]
  return (
    <div>
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {reliKpis.map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[20px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title mb-3 text-[13px] font-bold">Feeder reliability indices</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Feeder</th><th>SAIDI (hrs)</th><th>SAIFI</th><th>CAIDI</th><th>ASAI %</th><th>CAIFI</th><th>MAIFI</th><th>Trend</th><th>Worst DTR</th>
              </tr>
            </thead>
            <tbody>
              {SAIDI_DATA.map((d) => {
                const saidiColor = d.saidi > 18 ? 'var(--red)' : d.saidi > 12 ? 'var(--amber)' : 'var(--green)'
                return (
                  <tr key={d.feeder} className="table-row">
                    <td className="font-semibold text-text">{d.feeder}</td>
                    <td className="font-mono font-bold" style={{ color: saidiColor }}>{d.saidi}</td>
                    <td className="font-mono">{d.saifi}</td>
                    <td className="font-mono">{d.caidi}</td>
                    <td className="font-mono">{d.asai}</td>
                    <td className="font-mono">{d.caifi}</td>
                    <td className="font-mono">{d.maifi}</td>
                    <td className="text-center">{d.trend}</td>
                    <td className="text-[11px] text-text-dim">{d.worst}</td>
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

function OutageTab() {
  const outageData = [
    { month: 'Oct', planned: 12, unplanned: 8, consumer: 3 },
    { month: 'Nov', planned: 10, unplanned: 9, consumer: 4 },
    { month: 'Dec', planned: 8, unplanned: 12, consumer: 5 },
    { month: 'Jan', planned: 11, unplanned: 7, consumer: 2 },
    { month: 'Feb', planned: 9, unplanned: 6, consumer: 3 },
    { month: 'Mar', planned: 7, unplanned: 5, consumer: 2 },
  ]
  return (
    <div className="card">
      <div className="card-title mb-3 text-[13px] font-bold">Outage events by type — monthly</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={outageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="planned" fill="rgba(14,165,233,0.7)" name="Planned" radius={[3, 3, 0, 0]} />
          <Bar dataKey="unplanned" fill="rgba(220,53,69,0.7)" name="Unplanned" radius={[3, 3, 0, 0]} />
          <Bar dataKey="consumer" fill="rgba(230,146,30,0.7)" name="Consumer-side" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function RevenueTab({ level }: { level: ReturnType<typeof enrichLevel> | null }) {
  const revenueData = [
    { month: 'Oct', assessed: 420, realized: 268, gap: 152 },
    { month: 'Nov', assessed: 435, realized: 280, gap: 155 },
    { month: 'Dec', assessed: 450, realized: 290, gap: 160 },
    { month: 'Jan', assessed: 442, realized: 285, gap: 157 },
    { month: 'Feb', assessed: 460, realized: 295, gap: 165 },
    { month: 'Mar', assessed: 475, realized: 305, gap: 170 },
  ]
  return (
    <div>
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Assessed (FYTD)', value: fmtINR(level?.assessed ?? 42600000000), sub: 'Demand raised', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Realized (FYTD)', value: fmtINR(level?.realized ?? 26412000000), sub: '62.0% realization', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Collection eff.', value: '88.4%', sub: 'Bills collected vs billed', accent: '#0EA5E9', color: '#0EA5E9' },
          { label: 'Outstanding', value: '₹18 Cr', sub: 'Overdue > 60 days', accent: 'var(--red)', color: 'var(--red)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative flex-1 min-w-[140px] overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[18px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title mb-3 text-[13px] font-bold">Revenue assessed vs realized (₹ Lakhs)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-dim)' }} unit="L" />
            <Tooltip formatter={(v: any) => `₹${v}L`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="assessed" fill="rgba(124,58,237,0.5)" name="Assessed" radius={[3, 3, 0, 0]} />
            <Bar dataKey="realized" fill="rgba(34,197,94,0.6)" name="Realized" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function PowerQualityTab() {
  return (
    <div className="card py-12 text-center">
      <div className="mb-3 text-4xl">📊</div>
      <div className="text-[14px] font-bold text-text">Power quality analytics</div>
      <div className="mt-1 text-[12px] text-text-dim">THD, power factor trends, voltage profile charts</div>
      <div className="mt-2 inline-block rounded-lg border border-border bg-bg px-3 py-1 text-[11px] text-text-dim">
        Requires smart meter PQ data stream — connect via Integrations
      </div>
    </div>
  )
}
