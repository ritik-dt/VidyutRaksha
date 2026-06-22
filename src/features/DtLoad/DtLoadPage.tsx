import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { ScopeBreadcrumb } from '@/shared/components/ui/ScopeBreadcrumb'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

interface DT {
  id: string
  name: string
  feeder: string
  capacity: number
  currentLoad: number
  peakLoad: number
  projectedLoad90: number
  consumers: number
  loss: number
  phaseImbalance: number
  age: number
  health: 'critical' | 'warning' | 'healthy'
  outagesYr: number
  note: string
}

const DTS: DT[] = [
  { id: 'DT-0445', name: 'DT-0445 Bhelupur West', feeder: 'Bhelupur', capacity: 100, currentLoad: 102, peakLoad: 108, projectedLoad90: 118, consumers: 142, loss: 18.4, phaseImbalance: 14, age: 9, health: 'critical', outagesYr: 6, note: '102% loading — overloaded. Projected 118% in 6 weeks. 14% phase imbalance.' },
  { id: 'DT-0312', name: 'DT-0312 Chowk Central', feeder: 'Chowk', capacity: 160, currentLoad: 148, peakLoad: 155, projectedLoad90: 172, consumers: 218, loss: 22.1, phaseImbalance: 8, age: 7, health: 'critical', outagesYr: 4, note: 'Loss 22% — possible bypass theft. 4 outages this year. Investigate consumers.' },
  { id: 'DT-0521', name: 'DT-0521 Residency Park', feeder: 'Residency', capacity: 100, currentLoad: 88, peakLoad: 92, projectedLoad90: 96, consumers: 104, loss: 11.2, phaseImbalance: 5, age: 4, health: 'warning', outagesYr: 1, note: 'Approaching capacity. Recommend phase rebalancing within 30 days.' },
  { id: 'DT-0789', name: 'DT-0789 Gomti Industrial', feeder: 'Gomti Nagar', capacity: 250, currentLoad: 218, peakLoad: 235, projectedLoad90: 252, consumers: 38, loss: 14.6, phaseImbalance: 11, age: 6, health: 'warning', outagesYr: 2, note: 'Industrial DT — high seasonal variation. PF penalty recoverable: ₹4.2L/yr.' },
  { id: 'DT-0658', name: 'DT-0658 Mahanagar', feeder: 'Mahanagar', capacity: 160, currentLoad: 124, peakLoad: 138, projectedLoad90: 142, consumers: 186, loss: 9.8, phaseImbalance: 4, age: 3, health: 'healthy', outagesYr: 0, note: 'Healthy. Operating well within parameters.' },
  { id: 'DT-0901', name: 'DT-0901 Bhelupur East', feeder: 'Bhelupur', capacity: 63, currentLoad: 54, peakLoad: 58, projectedLoad90: 61, consumers: 84, loss: 13.5, phaseImbalance: 7, age: 5, health: 'warning', outagesYr: 1, note: 'Smaller DT. Phase imbalance suggests one feeder leg overloaded.' },
  { id: 'DT-0234', name: 'DT-0234 Chauk North', feeder: 'Chauk', capacity: 200, currentLoad: 128, peakLoad: 148, projectedLoad90: 138, consumers: 248, loss: 7.2, phaseImbalance: 3, age: 2, health: 'healthy', outagesYr: 0, note: 'Healthy. Recently installed (2 years). Headroom for growth.' },
  { id: 'DT-0156', name: 'DT-0156 Aliganj', feeder: 'Aliganj', capacity: 100, currentLoad: 72, peakLoad: 80, projectedLoad90: 84, consumers: 96, loss: 10.1, phaseImbalance: 6, age: 8, health: 'healthy', outagesYr: 1, note: 'Aging but stable. Replacement scheduled for FY27.' },
  { id: 'DT-0823', name: 'DT-0823 Sigra Market', feeder: 'Sigra', capacity: 160, currentLoad: 142, peakLoad: 152, projectedLoad90: 165, consumers: 202, loss: 16.8, phaseImbalance: 9, age: 8, health: 'warning', outagesYr: 3, note: 'Ageing + high loss. Candidate for replacement in RDSS Phase-II.' },
  { id: 'DT-0667', name: 'DT-0667 Kabir Nagar', feeder: 'Kabir Nagar', capacity: 100, currentLoad: 45, peakLoad: 52, projectedLoad90: 54, consumers: 68, loss: 8.4, phaseImbalance: 2, age: 5, health: 'healthy', outagesYr: 0, note: 'Healthy. Low utilization — possible load transfer candidate.' },
]

const HEALTH_FILTERS = [
  { value: 'all', label: 'All DTs' },
  { value: 'critical', label: '🔴 Critical' },
  { value: 'warning', label: '🟡 Warning' },
  { value: 'healthy', label: '🟢 Healthy' },
  { value: 'overloaded', label: '⚡ Overloaded (>85%)' },
]

const HEALTH_COLOR: Record<string, string> = {
  critical: 'var(--red)',
  warning: 'var(--amber)',
  healthy: 'var(--green)',
}

export default function DtLoadPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<DT | null>(null)

  const filtered = DTS.filter((d) => {
    if (filter === 'all') return true
    if (filter === 'overloaded') return d.currentLoad / d.capacity >= 0.85
    return d.health === filter
  })

  const critical = DTS.filter((d) => d.health === 'critical').length
  const overloaded = DTS.filter((d) => d.currentLoad / d.capacity >= 0.85).length
  const projOverload = DTS.filter((d) => d.projectedLoad90 / d.capacity > 1).length
  const highLoss = DTS.filter((d) => d.loss > 15).length

  return (
    <div className="pb-8">
      <PageHeader
        title="⚡ Load management"
        subtitle="Distribution transformer health, loading, loss and 90-day projection"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'Load rebalancing plan', message: 'AI generating optimal load transfer plan for DT-0445 and DT-0312...', duration: 4000 })}>
            ✦ AI rebalance plan
          </button>
        }
      />

      <ScopeBreadcrumb
        rightActions={
          <span className="text-[10.5px] font-semibold text-text-mid">{DTS.length} DTs</span>
        }
      />

      <AiInsightBanner title="AI DT health summary">
        <strong style={{ color: 'var(--red)' }}>{critical} DTs are critical</strong> —
        DT-0445 is at <strong>102% capacity</strong> with 14% phase imbalance; immediate action needed.
        DT-0312 shows <strong>22.1% losses</strong> — possible bypass theft; trigger diagnostics.
        <strong> {projOverload} DTs projected to overload</strong> within 90 days — schedule capacity augmentation.
        {highLoss > 0 && (
          <> <strong style={{ color: 'var(--amber)' }}>{highLoss} DTs with loss &gt; 15%</strong> — priority inspection targets.</>
        )}
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Critical DTs', value: String(critical), sub: 'Immediate action needed', accent: 'var(--red)', color: 'var(--red)' },
          { label: 'Overloaded (>85%)', value: String(overloaded), sub: 'Current load', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Proj. overload (90d)', value: String(projOverload), sub: 'Within 90 days', accent: '#F4A847', color: '#d97706' },
          { label: 'High loss (>15%)', value: String(highLoss), sub: 'Theft / loss investigation', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Total DTs', value: String(DTS.length), sub: 'In current scope', accent: 'var(--navy-light)', color: 'var(--text)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-2xl font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* DT Grid */}
      <FilterBar filters={HEALTH_FILTERS} active={filter} onChange={setFilter} className="mb-4" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((dt) => {
          const loadPct = Math.round((dt.currentLoad / dt.capacity) * 100)
          const projPct = Math.round((dt.projectedLoad90 / dt.capacity) * 100)
          const lossColor = dt.loss > 15 ? 'var(--red)' : dt.loss > 10 ? 'var(--amber)' : 'var(--green)'
          const healthColor = HEALTH_COLOR[dt.health]
          const loadColor = loadPct >= 100 ? 'var(--red)' : loadPct >= 85 ? 'var(--amber)' : 'var(--green)'

          return (
            <button key={dt.id} type="button" onClick={() => setSelected(dt)}
              className="card group text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderTop: `3px solid ${healthColor}` }}>
              <div className="p-[14px_16px_10px]">
                {/* Header */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] font-bold" style={{ color: 'var(--id-text)' }}>{dt.id}</div>
                    <div className="text-[12px] font-bold text-text truncate">{dt.name.replace(dt.id + ' ', '')}</div>
                    <div className="text-[10.5px] text-text-dim">{dt.feeder} feeder · {dt.age}yr old</div>
                  </div>
                  <span className="shrink-0 rounded-lg px-2 py-1 text-[9.5px] font-extrabold uppercase"
                    style={{ background: `${healthColor}18`, color: healthColor, border: `1px solid ${healthColor}40` }}>
                    {dt.health}
                  </span>
                </div>

                {/* Load bar */}
                <div className="mb-2">
                  <div className="mb-1 flex items-center justify-between text-[10.5px]">
                    <span className="text-text-dim">Current load</span>
                    <span className="font-mono font-bold" style={{ color: loadColor }}>{loadPct}% ({dt.currentLoad} kVA)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, loadPct)}%`, background: loadColor }} />
                  </div>
                  <div className="mt-0.5 text-[9.5px] text-text-dim">
                    Capacity: {dt.capacity} kVA · Peak: {dt.peakLoad} kVA · 90d proj: {projPct}%
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="rounded-md bg-bg p-1.5 text-center">
                    <div className="font-mono text-[12px] font-bold" style={{ color: lossColor }}>{dt.loss}%</div>
                    <div className="text-[9px] text-text-dim">Loss</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5 text-center">
                    <div className="font-mono text-[12px] font-bold text-text">{dt.consumers}</div>
                    <div className="text-[9px] text-text-dim">Consumers</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5 text-center">
                    <div className="font-mono text-[12px] font-bold" style={{ color: dt.outagesYr > 3 ? 'var(--red)' : 'var(--text)' }}>{dt.outagesYr}</div>
                    <div className="text-[9px] text-text-dim">Outages/yr</div>
                  </div>
                </div>

                <p className="text-[10.5px] leading-[1.4] text-text-dim">{dt.note}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* DT Detail Modal */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelected(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[500px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between rounded-t-2xl p-4"
              style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div className="font-bold text-white">{selected.name}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{selected.feeder} feeder · {selected.age} years old</div>
              </div>
              <button type="button" onClick={() => setSelected(null)}
                className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white">✕</button>
            </div>
            <div className="p-4">
              {/* Full stat grid */}
              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  { label: 'Current load', value: `${Math.round(selected.currentLoad / selected.capacity * 100)}%`, color: selected.currentLoad > selected.capacity ? 'var(--red)' : 'var(--text)' },
                  { label: 'Loss', value: `${selected.loss}%`, color: selected.loss > 15 ? 'var(--red)' : selected.loss > 10 ? 'var(--amber)' : 'var(--green)' },
                  { label: 'Phase imbalance', value: `${selected.phaseImbalance}%`, color: selected.phaseImbalance > 10 ? 'var(--red)' : 'var(--text)' },
                  { label: 'Capacity', value: `${selected.capacity} kVA`, color: 'var(--text)' },
                  { label: '90d projection', value: `${Math.round(selected.projectedLoad90 / selected.capacity * 100)}%`, color: selected.projectedLoad90 > selected.capacity ? 'var(--red)' : 'var(--amber)' },
                  { label: 'Consumers', value: String(selected.consumers), color: 'var(--text)' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-bg p-2.5 text-center">
                    <div className="font-mono text-[16px] font-extrabold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[9.5px] text-text-dim">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mb-4 rounded-xl p-3 text-[11.5px] text-text-mid"
                style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <strong className="text-ai-purple">✦ AI recommendation: </strong>{selected.note}
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
                  onClick={() => { showToast({ type: 'success', title: 'Work order created', message: `Work order for ${selected.id} assigned to field team.`, duration: 3500 }); setSelected(null) }}>
                  Create work order
                </button>
                <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px' }}
                  onClick={() => showToast({ type: 'info', title: 'Diagnostic triggered', message: `Running full diagnostic for ${selected.id}.`, duration: 3000 })}>
                  Run diagnostic
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
