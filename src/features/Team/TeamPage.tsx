import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Inspector {
  name: string
  role: string
  area: string
  openCases: number
  capacity: number
  hitRate: number
  avgClose: number
  status: 'active' | 'field' | 'leave'
  pastSla: number
  total: number
}

const INSPECTORS: Inspector[] = [
  { name: 'Rajesh Kumar', role: 'Senior Inspector', area: 'Bhelupur / Varunapar', openCases: 42, capacity: 50, hitRate: 68.4, avgClose: 2.8, status: 'field', pastSla: 2, total: 186 },
  { name: 'Amit Sharma', role: 'Inspector', area: 'Alambagh / Machchodari', openCases: 35, capacity: 45, hitRate: 62.9, avgClose: 3.1, status: 'active', pastSla: 3, total: 142 },
  { name: 'Sunita Verma', role: 'Senior Inspector', area: 'Gomti Nagar / Indira Nagar', openCases: 45, capacity: 50, hitRate: 60.0, avgClose: 3.4, status: 'active', pastSla: 5, total: 165 },
  { name: 'Deepak Yadav', role: 'Inspector', area: 'Aliganj / Chinhat', openCases: 28, capacity: 40, hitRate: 58.1, avgClose: 2.9, status: 'field', pastSla: 1, total: 98 },
  { name: 'Priya Singh', role: 'Inspector', area: 'Rajajipuram / Vikas Nagar', openCases: 22, capacity: 40, hitRate: 54.2, avgClose: 3.6, status: 'active', pastSla: 2, total: 88 },
  { name: 'Manish Gupta', role: 'Inspector', area: 'Hazratganj / Mahanagar', openCases: 38, capacity: 45, hitRate: 50.8, avgClose: 4.2, status: 'active', pastSla: 7, total: 112 },
  { name: 'Vikash Patel', role: 'Field Officer', area: 'Chandauli / Mirzapur', openCases: 0, capacity: 40, hitRate: 47.6, avgClose: 3.8, status: 'leave', pastSla: 0, total: 74 },
  { name: 'Priya Mishra', role: 'Inspector', area: 'Jaunpur / Azamgarh', openCases: 18, capacity: 35, hitRate: 55.3, avgClose: 2.7, status: 'active', pastSla: 0, total: 62 },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All inspectors' },
  { value: 'field', label: '📍 In field' },
  { value: 'active', label: '🟢 Active' },
  { value: 'leave', label: '🔴 On leave' },
  { value: 'overloaded', label: '⚠ Overloaded' },
]

export default function TeamPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')

  const filtered = INSPECTORS.filter((i) => {
    if (filter === 'all') return true
    if (filter === 'field') return i.status === 'field'
    if (filter === 'active') return i.status === 'active'
    if (filter === 'leave') return i.status === 'leave'
    if (filter === 'overloaded') return i.openCases / i.capacity >= 0.85 && i.status !== 'leave'
    return true
  })

  const totalCap = INSPECTORS.reduce((s, i) => s + i.capacity, 0)
  const totalOpen = INSPECTORS.reduce((s, i) => s + i.openCases, 0)
  const utilPct = Math.round((totalOpen / totalCap) * 100)
  const avgHit = (INSPECTORS.reduce((s, i) => s + i.hitRate, 0) / INSPECTORS.length).toFixed(1)
  const totalPastSla = INSPECTORS.reduce((s, i) => s + i.pastSla, 0)
  const inField = INSPECTORS.filter((i) => i.status === 'field').length

  const chartData = [...INSPECTORS].sort((a, b) => b.hitRate - a.hitRate).map((i) => ({
    name: i.name.split(' ')[0],
    hitRate: i.hitRate,
    load: Math.round((i.openCases / i.capacity) * 100),
  }))

  return (
    <div className="pb-8">
      <PageHeader
        title="👥 Team & inspectors"
        subtitle={`${INSPECTORS.length} inspectors · ${inField} in field · ${utilPct}% capacity utilized`}
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Schedule exported', message: 'Inspector schedule exported as PDF.', duration: 3000 })}>
              📅 Export schedule
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'AI workload rebalance', message: 'Redistributing 8 cases from Manish Gupta to Priya Mishra (lower load).', duration: 4000 })}>
              ✦ AI rebalance
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI team advisor">
        <strong>{INSPECTORS.filter((i) => i.openCases / i.capacity >= 0.85).length} inspectors overloaded</strong> (≥85% capacity).{' '}
        <strong style={{ color: 'var(--red)' }}>Manish Gupta</strong> has the highest past-SLA count ({INSPECTORS.find((i) => i.name === 'Manish Gupta')?.pastSla} cases) — recommend redistributing.{' '}
        <strong>Rajesh Kumar</strong> leads on hit rate ({INSPECTORS[0].hitRate}%) — consider assigning complex clusters.{' '}
        <strong>Vikash Patel</strong> is on leave — re-assign {INSPECTORS.find((i) => i.name === 'Vikash Patel')?.total ?? 0} pending cases.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Total capacity', value: String(totalCap), sub: 'Cases/month across team', accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'Open cases', value: String(totalOpen), sub: `${utilPct}% utilized`, accent: 'var(--amber)', color: utilPct > 85 ? 'var(--red)' : 'var(--text)' },
          { label: 'In field today', value: String(inField), sub: 'Live GPS tracked', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Avg hit rate', value: `${avgHit}%`, sub: 'Confirmed / inspected', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Past SLA', value: String(totalPastSla), sub: 'Across all inspectors', accent: 'var(--red)', color: 'var(--red)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-2xl font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">Hit rate by inspector</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-mid)' }} width={55} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="hitRate" radius={[0, 3, 3, 0]}
                fill="var(--green)"
                label={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">Workload distribution (% capacity used)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-mid)' }} width={55} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="load" radius={[0, 3, 3, 0]}
                fill="var(--amber)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inspector table */}
      <div className="card">
        <div className="card-title mb-3 text-[13px] font-bold">Inspector roster</div>
        <FilterBar filters={STATUS_FILTERS} active={filter} onChange={setFilter} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Inspector</th><th>Role / Area</th><th>Status</th><th>Open cases</th><th>Load</th><th>Hit rate</th><th>Avg close</th><th>Past SLA</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins) => {
                const loadPct = Math.round((ins.openCases / ins.capacity) * 100)
                const loadColor = loadPct >= 85 ? 'var(--red)' : loadPct >= 70 ? 'var(--amber)' : 'var(--green)'
                const hitColor = ins.hitRate >= 60 ? 'var(--green)' : ins.hitRate >= 50 ? 'var(--amber)' : 'var(--red)'
                const closeColor = ins.avgClose > 3.5 ? 'var(--red)' : ins.avgClose > 3 ? 'var(--amber)' : 'var(--green)'
                return (
                  <tr key={ins.name} className="table-row">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: ins.status === 'leave' ? 'var(--text-dim)' : ins.status === 'field' ? 'var(--green)' : 'var(--navy-light)' }}>
                          {ins.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[12px] font-semibold text-text">{ins.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-[11px] font-medium text-text">{ins.role}</div>
                      <div className="text-[10px] text-text-dim">{ins.area}</div>
                    </td>
                    <td>
                      <span className="rounded-full px-2 py-px text-[10px] font-semibold"
                        style={{
                          background: ins.status === 'field' ? 'rgba(34,197,94,0.1)' : ins.status === 'leave' ? 'rgba(107,114,128,0.1)' : 'rgba(14,165,233,0.1)',
                          color: ins.status === 'field' ? 'var(--green)' : ins.status === 'leave' ? '#6b7280' : '#0EA5E9',
                        }}>
                        {ins.status === 'field' ? '📍 Field' : ins.status === 'leave' ? '🔴 Leave' : '🟢 Active'}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-text">{ins.openCases}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full" style={{ width: `${loadPct}%`, background: loadColor }} />
                        </div>
                        <span className="font-mono text-[10.5px] font-bold" style={{ color: loadColor }}>{loadPct}%</span>
                      </div>
                    </td>
                    <td className="font-mono font-bold" style={{ color: hitColor }}>{ins.hitRate}%</td>
                    <td className="font-mono" style={{ color: closeColor }}>{ins.avgClose}d</td>
                    <td className="font-mono font-bold text-center" style={{ color: ins.pastSla > 0 ? 'var(--red)' : 'var(--text-dim)' }}>{ins.pastSla}</td>
                    <td>
                      <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }}
                        onClick={() => showToast({ type: 'info', title: ins.name, message: `Viewing profile for ${ins.name}`, duration: 2500 })}>
                        View
                      </button>
                    </td>
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
