import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

interface Report {
  id: string
  name: string
  regulator: string
  basis: string
  frequency: string
  deadline: string
  daysLeft: number
  lastFiled: string
  status: string
  statusColor: string
  owner: string
  penalty: string
  cat: 'statutory' | 'operational' | 'ai'
}

const REPORTS: Report[] = [
  { id: 'rep-uperc-arr', name: 'UPERC ARR petition · FY26-27', regulator: 'UPERC', basis: 'UPERC True-Up Regulations 2019', frequency: 'Annual', deadline: '15 May 2026', daysLeft: 9, lastFiled: '22 Apr 2025 (FY25-26)', status: 'In draft', statusColor: 'var(--amber)', owner: 'Director (Finance)', penalty: 'Deemed approval at status-quo · ₹2,800 Cr ARR shortfall', cat: 'statutory' },
  { id: 'rep-uperc-true-up', name: 'UPERC True-up petition · FY24-25', regulator: 'UPERC', basis: 'EA 2003 §62 · True-up Regulations', frequency: 'Annual', deadline: '30 Sep 2026', daysLeft: 147, lastFiled: '28 Sep 2024 (FY23-24)', status: 'Pending audit close', statusColor: 'var(--text-mid)', owner: 'Director (Finance)', penalty: 'Revenue gap of FY24-25 cannot be recovered if not filed', cat: 'statutory' },
  { id: 'rep-rdss-quarterly', name: 'RDSS quarterly progress · Q1 FY26', regulator: 'Ministry of Power · PFC', basis: 'RDSS Scheme Guidelines', frequency: 'Quarterly', deadline: '10 Jul 2026', daysLeft: 65, lastFiled: '08 Apr 2026 (Q4 FY25)', status: 'Auto-generating', statusColor: 'var(--teal, #00c2cb)', owner: 'Director (Distribution)', penalty: 'Sanction-linked tranches blocked · ₹3,200 Cr exposure', cat: 'statutory' },
  { id: 'rep-bee-audit', name: 'BEE Energy Audit · Half-yearly', regulator: 'BEE · MoP', basis: 'BEE Energy Audit Regulations 2021', frequency: 'Half-yearly', deadline: '31 Jul 2026', daysLeft: 86, lastFiled: '28 Jan 2026 (H2 FY25)', status: 'On track', statusColor: 'var(--green)', owner: 'Chief Engineer (Energy Audit)', penalty: 'Designated Consumer non-compliance · Section 26 EC Act', cat: 'statutory' },
  { id: 'rep-cea-reliability', name: 'CEA reliability indices · monthly', regulator: 'CEA', basis: 'CEA (Technical Standards) Regulations 2010', frequency: 'Monthly', deadline: '5 Jul 2026', daysLeft: 30, lastFiled: '3 Jun 2026 (May-26)', status: 'On track', statusColor: 'var(--green)', owner: 'Chief Engineer (O&M)', penalty: 'Non-compliance notice under Section 53', cat: 'statutory' },
  { id: 'rep-weekly-theft', name: 'Weekly theft summary', regulator: 'Internal', basis: 'UPPCL Operations SOP', frequency: 'Weekly', deadline: 'Every Monday', daysLeft: 3, lastFiled: '2 Jun 2026', status: 'Ready to send', statusColor: 'var(--green)', owner: 'VidyutRaksha AI', penalty: '—', cat: 'operational' },
  { id: 'rep-monthly-atc', name: 'Monthly AT&C loss report', regulator: 'Internal / CMD', basis: 'Monthly review SOP', frequency: 'Monthly', deadline: '5 Jul 2026', daysLeft: 30, lastFiled: '4 Jun 2026 (May-26)', status: 'Auto-generating', statusColor: 'var(--teal, #00c2cb)', owner: 'VidyutRaksha AI', penalty: '—', cat: 'operational' },
  { id: 'rep-ai-insights', name: 'AI detection performance report', regulator: 'Internal', basis: 'Model monitoring SOP', frequency: 'Monthly', deadline: '5 Jul 2026', daysLeft: 30, lastFiled: '4 Jun 2026', status: 'On track', statusColor: 'var(--green)', owner: 'VidyutRaksha AI', penalty: '—', cat: 'ai' },
]

const FILTERS = [
  { value: 'all', label: 'All reports' },
  { value: 'statutory', label: '⚖️ Statutory' },
  { value: 'operational', label: '📋 Operational' },
  { value: 'ai', label: '✦ AI-generated' },
  { value: 'urgent', label: '🔴 Due < 30 days' },
]

export default function ReportsPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')

  const filtered = REPORTS.filter((r) => {
    if (filter === 'all') return true
    if (filter === 'urgent') return r.daysLeft < 30
    return r.cat === filter
  })

  return (
    <div className="pb-2">
      <PageHeader
        title="📄 Reports"
        subtitle="Statutory filings, operational summaries, and AI-generated analytics reports"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'AI report bundle', message: 'Generating all pending reports...', duration: 3500 })}>
            ✦ Generate all pending
          </button>
        }
      />

      <AiInsightBanner title="AI filing advisor">
        <strong style={{ color: 'var(--red)' }}>UPERC ARR petition due in 9 days</strong> — highest urgency.
        Penalty: ₹2,800 Cr ARR shortfall if not filed. Draft is in progress — assign Director (Finance) for review.
        RDSS quarterly report is auto-generating (65 days left).
        <strong> 3 reports due this month</strong> — all are on track or in progress.
      </AiInsightBanner>

      <FilterBar filters={FILTERS} active={filter} onChange={setFilter} className="mb-4" />

      <div className="space-y-2">
        {filtered.map((r) => {
          const urgentColor = r.daysLeft <= 14 ? 'var(--red)' : r.daysLeft <= 30 ? 'var(--amber)' : 'var(--text-dim)'
          return (
            <div key={r.id} className="card overflow-hidden"
              style={{ borderLeft: `3px solid ${r.daysLeft <= 14 ? 'var(--red)' : r.daysLeft <= 30 ? 'var(--amber)' : 'var(--border)'}` }}>
              <div className="flex flex-wrap items-start justify-between gap-3 p-[12px_16px]">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[12.5px] font-bold text-text">{r.name}</span>
                    <span className="rounded-full px-2 py-px text-[9.5px] font-semibold text-white"
                      style={{ background: r.cat === 'statutory' ? '#6366f1' : r.cat === 'ai' ? 'var(--ai-purple)' : 'var(--navy-light)' }}>
                      {r.cat === 'statutory' ? '⚖️ Statutory' : r.cat === 'ai' ? '✦ AI' : '📋 Ops'}
                    </span>
                    <span className="rounded-full border px-2 py-px text-[10px] font-semibold"
                      style={{ color: r.statusColor, borderColor: `${r.statusColor}40`, background: `${r.statusColor}12` }}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-dim mb-1.5">
                    {r.regulator} · {r.basis} · {r.frequency}
                  </div>
                  {r.penalty !== '—' && (
                    <div className="text-[10.5px] font-medium" style={{ color: 'var(--red)' }}>
                      ⚠ Penalty: {r.penalty}
                    </div>
                  )}
                  <div className="mt-1 text-[10.5px] text-text-dim">
                    Owner: <span className="font-medium text-text-mid">{r.owner}</span> · Last filed: {r.lastFiled}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="font-mono text-[11.5px] font-bold" style={{ color: urgentColor }}>
                      {r.daysLeft <= 0 ? 'OVERDUE' : `${r.daysLeft}d left`}
                    </div>
                    <div className="text-[10px] text-text-dim">Due {r.deadline}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '3px 8px' }}
                      onClick={() => showToast({ type: 'info', title: 'Opening draft', message: `Opening ${r.name}`, duration: 2500 })}>
                      View
                    </button>
                    <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10px', padding: '3px 10px' }}
                      onClick={() => showToast({ type: 'success', title: 'Report ready', message: `${r.name} prepared for download.`, duration: 3000 })}>
                      ✦ Generate
                    </button>
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
