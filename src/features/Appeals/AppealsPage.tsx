import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { useToast } from '@/shared/context/ToastContext'

interface Appeal {
  id: string; case: string; consumer: string; amount: string; amountNum: number
  filed: string; status: string; reviewer: string; hearing: string; grounds: string; priority: string
}

const APPEALS: Appeal[] = [
  { id: 'AP-2026-018', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL', amount: '₹3,88,800', amountNum: 388800, filed: '08 Apr 2026', status: 'Under review', reviewer: 'Rajiv Mehta', hearing: '22 Apr 2026', grounds: 'Disputed consumption baseline — claims peer avg is unfair comparison', priority: 'High' },
  { id: 'AP-2026-017', case: 'C-20260228-038', consumer: 'M/S AGRAWAL ENTERPRISES', amount: '₹1,24,200', amountNum: 124200, filed: '05 Apr 2026', status: 'Hearing scheduled', reviewer: 'Priya Singh', hearing: '18 Apr 2026', grounds: 'Claims meter was defective — requests replacement before assessment', priority: 'Medium' },
  { id: 'AP-2026-016', case: 'C-20260218-005', consumer: 'M/S CHAWLA STEEL', amount: '₹3,20,000', amountNum: 3200000, filed: '01 Apr 2026', status: 'Dismissed', reviewer: 'Rajiv Mehta', hearing: '10 Apr 2026', grounds: 'Technical objection to CT test methodology', priority: 'High' },
  { id: 'AP-2026-015', case: 'C-20260215-011', consumer: 'ANAND KUMAR', amount: '₹89,400', amountNum: 89400, filed: '28 Mar 2026', status: 'Withdrawn', reviewer: '—', hearing: '—', grounds: 'Consumer withdrew appeal after reviewing evidence pack', priority: 'Low' },
  { id: 'AP-2026-014', case: 'C-20260301-R415', consumer: 'GANESH CONSUMER PRODUCTS', amount: '₹28,00,000', amountNum: 2800000, filed: '25 Mar 2026', status: 'Under review', reviewer: 'Rajiv Mehta', hearing: '25 Apr 2026', grounds: 'Disputes assessment period — claims tamper events pre-date their occupancy', priority: 'High' },
  { id: 'AP-2026-013', case: 'C-20260220-022', consumer: 'SUSHILA DEVI', amount: '₹22,800', amountNum: 22800, filed: '20 Mar 2026', status: 'Settled', reviewer: 'Sunita Verma', hearing: '30 Mar 2026', grounds: 'Partial settlement agreed — 60% of assessed amount accepted', priority: 'Low' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All appeals' },
  { value: 'Under review', label: '🔍 Under review' },
  { value: 'Hearing scheduled', label: '📅 Hearing scheduled' },
  { value: 'Dismissed', label: '✗ Dismissed' },
  { value: 'Settled', label: '✓ Settled' },
  { value: 'Withdrawn', label: 'Withdrawn' },
]

const PRIORITY_COLOR: Record<string, string> = { High: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--text-dim)' }

export default function AppealsPage() {
  const { showToast } = useToast()
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = APPEALS.filter((a) => statusFilter === 'all' || a.status === statusFilter)
  const underReview = APPEALS.filter((a) => a.status === 'Under review').length
  const totalAmount = APPEALS.reduce((s, a) => s + a.amountNum, 0)
  const settled = APPEALS.filter((a) => a.status === 'Settled' || a.status === 'Dismissed').length

  return (
    <div className="pb-2">
      <PageHeader
        title="⚖️ Appeals"
        subtitle="Consumer appeals against Section 135 assessments · track hearings and outcomes"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'AI appeal analysis', message: 'Reviewing appeal grounds against evidence packs…', duration: 3500 })}>
            ✦ AI appeal review
          </button>
        }
      />

      <AiInsightBanner title="AI appeals advisor">
        <strong>{underReview} appeals under review</strong> — total amount in dispute:{' '}
        <strong>₹{(totalAmount / 100000).toFixed(1)}L</strong>.
        AP-2026-014 (GANESH CONSUMER PRODUCTS · ₹28L) is highest-stakes —{' '}
        <strong>prepare evidence pack</strong> before the 25 Apr hearing.
        AP-2026-016 (M/S CHAWLA STEEL) was dismissed — precedent useful for similar CT manipulation cases.
        <strong> {settled} appeals resolved</strong> this month (dismissed or settled).
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Total appeals', value: String(APPEALS.length), sub: 'All time', accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'Under review', value: String(underReview), sub: 'Active', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Amount disputed', value: `₹${(totalAmount / 100000).toFixed(1)}L`, sub: 'Total contested', accent: 'var(--red)', color: 'var(--red)', fontSize: '18px' },
          { label: 'Resolved', value: String(settled), sub: 'Dismissed or settled', accent: 'var(--green)', color: 'var(--green)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      <FilterBar filters={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} />

      <div className="space-y-3">
        {filtered.map((appeal) => {
          const priorityColor = PRIORITY_COLOR[appeal.priority]
          const isActive = ['Under review', 'Hearing scheduled'].includes(appeal.status)
          return (
            <div key={appeal.id} className="card overflow-hidden"
              style={{ borderLeft: `4px solid ${isActive ? 'var(--amber)' : appeal.status === 'Dismissed' ? 'var(--red)' : 'var(--green)'}` }}>
              <div className="flex flex-wrap items-start justify-between gap-3 p-[14px_16px]">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--id-text)' }}>{appeal.id}</span>
                    <span className="text-[11px] text-text-dim">→ {appeal.case}</span>
                    <StatusBadge status={appeal.status} />
                    <span className="rounded-full border px-1.5 py-px text-[9.5px] font-bold"
                      style={{ color: priorityColor, borderColor: `${priorityColor}40`, background: `${priorityColor}10` }}>
                      {appeal.priority} priority
                    </span>
                  </div>
                  <div className="text-[13px] font-bold text-text mb-1">{appeal.consumer}</div>
                  <div className="text-[11px] italic text-text-dim mb-1">"{appeal.grounds}"</div>
                  <div className="flex flex-wrap gap-3 text-[10.5px] text-text-dim">
                    <span>Filed: {appeal.filed}</span>
                    {appeal.hearing !== '—' && <span>Hearing: <strong className="text-text">{appeal.hearing}</strong></span>}
                    {appeal.reviewer !== '—' && <span>Reviewer: <strong className="text-text">{appeal.reviewer}</strong></span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="font-mono text-[18px] font-extrabold" style={{ color: 'var(--amber)' }}>
                    {appeal.amount}
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px' }}
                      onClick={() => showToast({ type: 'info', title: 'Evidence pack', message: `Evidence pack for ${appeal.id} opened.`, duration: 3000 })}>
                      📁 Evidence
                    </button>
                    {isActive && (
                      <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10px' }}
                        onClick={() => showToast({ type: 'ai', title: 'AI response drafted', message: `Counter-argument drafted for ${appeal.id}.`, duration: 3500 })}>
                        ✦ AI counter-argument
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
