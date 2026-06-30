import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { useToast } from '@/shared/context/ToastContext'

interface Cluster {
  id: string
  name: string
  dtr: string
  feeder: string
  members: number
  confirmed: number
  pending: number
  amount: string
  amountNum: number
  pattern: string
  started: string
  risk: number
  status: string
  lead: string
}

const CLUSTERS: Cluster[] = [
  { id: 'CL-2026-042', name: 'Vijaya Complex Cluster', dtr: 'Vijaya Complex (Kothi)', feeder: 'Bhelupur', members: 5, confirmed: 2, pending: 3, amount: '₹10,28,400', amountNum: 1028400, pattern: 'Earth loading + tariff misuse', started: 'Nov 2025', risk: 94, status: 'Active investigation', lead: 'Rajesh Kumar' },
  { id: 'CL-2026-038', name: 'Rathayatra Sector-4 Cluster', dtr: 'RYT-DTR-014', feeder: 'Rathayatra', members: 8, confirmed: 3, pending: 5, amount: '₹18,42,600', amountNum: 1842600, pattern: 'Synchronized zero consumption', started: 'Dec 2025', risk: 91, status: 'Active investigation', lead: 'Amit Singh' },
  { id: 'CL-2026-031', name: 'Raghunath Industrial Cluster', dtr: 'RAG-DTR-007', feeder: 'Raghunath Nagar', members: 4, confirmed: 4, pending: 0, amount: '₹24,80,000', amountNum: 2480000, pattern: 'CT manipulation (industrial)', started: 'Sep 2025', risk: 96, status: 'All confirmed', lead: 'Sunita Verma' },
  { id: 'CL-2026-028', name: 'Machchodari Domestic Ring', dtr: 'MCH-DTR-003', feeder: 'Machchodari', members: 12, confirmed: 1, pending: 11, amount: '₹8,14,200', amountNum: 814200, pattern: 'Night meter bypass (domestic)', started: 'Jan 2026', risk: 78, status: 'Early stage', lead: 'Deepak Yadav' },
  { id: 'CL-2026-019', name: 'Chauk Commercial Strip', dtr: 'CK-DTR-011', feeder: 'Chauk', members: 6, confirmed: 5, pending: 1, amount: '₹32,60,000', amountNum: 3260000, pattern: 'Meter bypass + tariff fraud', started: 'Aug 2025', risk: 92, status: 'Near closure', lead: 'Rajesh Kumar' },
  { id: 'CL-2026-015', name: 'Kerakatpur Agricultural Bloc', dtr: 'KPR-DTR-002', feeder: 'Kerakatpur', members: 9, confirmed: 0, pending: 9, amount: '₹6,30,000', amountNum: 630000, pattern: 'Seasonal bypass (agricultural)', started: 'Feb 2026', risk: 65, status: 'Monitoring', lead: 'Priya Singh' },
]

const STATUS_MAP: Record<string, string> = {
  'Active investigation': 'In Progress',
  'All confirmed': 'Confirmed Theft',
  'Early stage': 'New',
  'Near closure': 'In Progress',
  'Monitoring': 'Assigned',
}

export default function ClustersPage() {
  const { showToast } = useToast()
  const [selected, setSelected] = useState<Cluster | null>(null)

  const totalRecovery = CLUSTERS.reduce((s, c) => s + c.amountNum, 0)
  const totalMembers = CLUSTERS.reduce((s, c) => s + c.members, 0)
  const totalConfirmed = CLUSTERS.reduce((s, c) => s + c.confirmed, 0)

  return (
    <div className="pb-2">
      <PageHeader
        title="🕸️ Coordinated theft clusters"
        subtitle="AI-detected groups where multiple consumers in the same DTR or feeder show synchronized theft patterns"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'AI cluster scan', message: 'Running cluster detection on last 30-day data...', duration: 3000 })}>
            ✦ Re-scan for clusters
          </button>
        }
      />

      <AiInsightBanner title="AI cluster detection">
        <strong>{CLUSTERS.length} active clusters</strong> detected across{' '}
        <strong>{CLUSTERS.reduce((s, c) => s + c.members, 0)} consumers</strong> in{' '}
        <strong>{new Set(CLUSTERS.map((c) => c.feeder)).size} feeders</strong>. Coordinated theft is{' '}
        <strong style={{ color: 'var(--red)' }}>3.2× harder to detect</strong> individually — cluster-level patterns are the primary signal.
        Total exposure:{' '}
        <strong style={{ color: 'var(--red)' }}>
          ₹{(totalRecovery / 100000).toFixed(1)}L
        </strong>.
        Raghunath Industrial Cluster (100% confirmation) should proceed to legal filing.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Active clusters', value: String(CLUSTERS.length), sub: 'Across all feeders', accent: 'var(--ai-purple)', color: 'var(--text)' },
          { label: 'Total consumers', value: String(totalMembers), sub: 'Across all clusters', accent: 'var(--red)', color: 'var(--red)' },
          { label: 'Confirmed theft', value: String(totalConfirmed), sub: `${Math.round((totalConfirmed / totalMembers) * 100)}% confirmation rate`, accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Total exposure', value: `₹${(totalRecovery / 100000).toFixed(1)}L`, sub: 'Combined assessment', accent: 'var(--amber)', color: 'var(--amber)', fontSize: '20px' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Cluster grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CLUSTERS.map((cl) => {
          const riskColor = cl.risk >= 80 ? 'var(--red)' : cl.risk >= 60 ? 'var(--amber)' : 'var(--green)'
          const pctConf = cl.members > 0 ? Math.round((cl.confirmed / cl.members) * 100) : 0
          return (
            <button
              key={cl.id}
              type="button"
              onClick={() => setSelected(cl)}
              className="card group text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderTop: `3px solid ${riskColor}` }}
            >
              <div className="p-[14px_16px_10px]">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold" style={{ color: 'var(--id-text)' }}>{cl.id}</span>
                  <div className="flex size-[30px] items-center justify-center rounded-lg border-2 font-mono text-[10px] font-extrabold"
                    style={{ background: `${riskColor}18`, borderColor: riskColor, color: riskColor }}>
                    {cl.risk}
                  </div>
                </div>
                <div className="text-[13px] font-bold text-text">{cl.name}</div>
                <div className="mt-0.5 text-[11px] text-text-dim">{cl.dtr} · {cl.feeder} feeder</div>

                {/* Progress bar */}
                <div className="my-3">
                  <div className="mb-1 flex justify-between text-[10px]">
                    <span className="text-text-dim">{cl.confirmed} confirmed / {cl.members} total</span>
                    <span className="font-bold" style={{ color: pctConf === 100 ? 'var(--green)' : 'var(--text-mid)' }}>{pctConf}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full" style={{ width: `${pctConf}%`, background: pctConf === 100 ? 'var(--green)' : riskColor }} />
                  </div>
                </div>

                <div className="mb-2 text-[11px] font-medium text-text-mid">📋 {cl.pattern}</div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={STATUS_MAP[cl.status] ?? cl.status} />
                  <span className="text-[11px] font-bold" style={{ color: 'var(--red)' }}>{cl.amount}</span>
                </div>
                <div className="mt-2 text-[10px] text-text-dim">Lead: {cl.lead} · Since {cl.started}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Cluster detail modal */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setSelected(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[500px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between rounded-t-2xl p-4"
              style={{ background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy-light) 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div className="font-bold text-white">{selected.name}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.5)]">{selected.id} · {selected.feeder} feeder</div>
              </div>
              <button type="button" onClick={() => setSelected(null)}
                className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white">✕</button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ['Members', String(selected.members)], ['Confirmed', String(selected.confirmed)],
                  ['Pattern', selected.pattern], ['Lead', selected.lead],
                  ['Total exposure', selected.amount], ['Started', selected.started],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-bg p-2.5">
                    <div className="text-[10px] text-text-dim">{k}</div>
                    <div className="text-[12px] font-semibold text-text">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
                  onClick={() => { showToast({ type: 'success', title: 'Batch case initiated', message: `Creating cases for all ${selected.members} members of ${selected.name}.`, duration: 3500 }); setSelected(null) }}>
                  ✦ Create batch cases
                </button>
                <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px' }}
                  onClick={() => showToast({ type: 'info', title: 'Dossier ready', message: 'Court-ready dossier exported.', duration: 3000 })}>
                  ⚖️ Court dossier
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
