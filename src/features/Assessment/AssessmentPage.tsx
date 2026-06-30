import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { useToast } from '@/shared/context/ToastContext'
import { useRole } from '@/shared/context/RoleContext'

interface Assessment {
  id: string
  caseId: string
  meter: string
  consumer: string
  amount: number
  period: string
  theftType: string
  status: string
  approvalLevel: 'auto' | 'aen' | 'ee' | 'se'
  inspector: string
  date: string
  approved?: boolean
}

const ASSESSMENTS: Assessment[] = [
  { id: 'ASS-2026-0042', caseId: 'C-20260301-001', meter: '1849966', consumer: 'HEERA LAL AGRAWAL', amount: 388800, period: 'Jan 2024 – Mar 2026', theftType: 'Earth Loading', status: 'Pending approval', approvalLevel: 'aen', inspector: 'Rajesh Kumar', date: '17 Apr 2026' },
  { id: 'ASS-2026-0041', caseId: 'C-20260225-008', meter: '1567234', consumer: 'VINOD KUMAR', amount: 1240000, period: 'Mar 2023 – Mar 2026', theftType: 'CT Manipulation', status: 'Pending approval', approvalLevel: 'ee', inspector: 'Amit Sharma', date: '14 Apr 2026' },
  { id: 'ASS-2026-0039', caseId: 'C-20260228-014', meter: '2034871', consumer: 'R.K. ENTERPRISES', amount: 84200, period: 'Oct 2025 – Mar 2026', theftType: 'Meter Bypass', status: 'Auto-approved', approvalLevel: 'auto', inspector: 'Sunita Verma', date: '10 Apr 2026', approved: true },
  { id: 'ASS-2026-0038', caseId: 'C-20260218-005', meter: '2187690', consumer: 'M/S CHAWLA STEEL', amount: 3200000, period: 'Jan 2023 – Mar 2026', theftType: 'Industrial Bypass', status: 'Approved (SE)', approvalLevel: 'se', inspector: 'Deepak Yadav', date: '08 Apr 2026', approved: true },
  { id: 'ASS-2026-0035', caseId: 'C-20260301-R415', meter: '300415', consumer: 'GANESH CONSUMER PRODUCTS', amount: 2800000, period: 'Apr 2023 – Mar 2026', theftType: 'CT Manipulation', status: 'Disputed', approvalLevel: 'se', inspector: 'Vikash Patel', date: '02 Apr 2026' },
]

const LEVEL_LABELS: Record<string, string> = {
  auto: 'Auto-approve (< ₹1L)',
  aen: 'AEN approval (₹1L–₹5L)',
  ee: 'EE approval (₹5L–₹20L)',
  se: 'SE/CE approval (> ₹20L)',
}

export default function AssessmentPage() {
  const { showToast } = useToast()
  const { currentRole } = useRole()
  const [assessments, setAssessments] = useState<Assessment[]>(ASSESSMENTS)

  function approveAssessment(id: string) {
    setAssessments((prev: Assessment[]) =>
      prev.map((a: Assessment) =>
        a.id === id ? { ...a, approved: true, status: `Approved (${currentRole.id.toUpperCase()})` } : a,
      ),
    )
    showToast({ type: 'success', title: 'Assessment approved', message: `Assessment ${id} approved. Notice generation triggered.`, duration: 4000 })
  }

  const pending = assessments.filter((a: Assessment) => !a.approved && a.status !== 'Disputed').length
  const totalApproved = assessments.filter((a: Assessment) => a.approved).length
  const totalAmount = assessments.reduce((s: number, a: Assessment) => s + a.amount, 0)
  const pendingAmount = assessments.filter((a: Assessment) => !a.approved && a.status !== 'Disputed').reduce((s: number, a: Assessment) => s + a.amount, 0)

  return (
    <div className="pb-2">
      <PageHeader
        title="⚖️ Assessment"
        subtitle="Revenue assessment workflow — create, review, approve and generate recovery notices"
        actions={
          <button type="button" className="btn btn-ai btn-sm"
            onClick={() => showToast({ type: 'ai', title: 'Bulk assessment', message: 'AI generating assessments for all 47 confirmed cases...', duration: 4000 })}>
            ✦ Bulk AI assessment
          </button>
        }
      />

      <AiInsightBanner title="AI assessment advisor">
        <strong style={{ color: 'var(--amber)' }}>{pending} assessments pending approval</strong> — total{' '}
        <strong>₹{(pendingAmount / 100000).toFixed(1)}L</strong> awaiting sign-off.
        ASS-2026-0042 (HEERA LAL AGRAWAL) requires AEN-level approval — review the earth loading evidence before signing.
        ASS-2026-0035 is disputed by the consumer — recommend scheduling a technical re-inspection.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Pending approval', value: String(pending), sub: `₹${(pendingAmount / 100000).toFixed(1)}L awaiting`, accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Approved', value: String(totalApproved), sub: 'Ready for notice', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Total assessed', value: `₹${(totalAmount / 100000).toFixed(1)}L`, sub: `Across ${assessments.length} assessments`, accent: 'var(--ai-purple)', color: 'var(--ai-purple)', fontSize: '18px' },
          { label: 'Disputed', value: String(assessments.filter((a: Assessment) => a.status === 'Disputed').length), sub: 'Under review', accent: 'var(--red)', color: 'var(--red)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Assessments */}
      <div className="space-y-3">
        {assessments.map((a: Assessment) => {
          const levelLabel = LEVEL_LABELS[a.approvalLevel]
          const amountColor = a.amount > 2000000 ? 'var(--red)' : a.amount > 500000 ? 'var(--amber)' : 'var(--text)'
          const canApprove = !a.approved && a.status !== 'Disputed'

          return (
            <div key={a.id} className="card overflow-hidden"
              style={{ borderLeft: `3px solid ${canApprove ? 'var(--amber)' : a.status === 'Disputed' ? 'var(--red)' : 'var(--green)'}` }}>
              <div className="flex flex-wrap items-start justify-between gap-3 p-[14px_16px]">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--id-text)' }}>{a.id}</span>
                    <span className="text-[11px] text-text-dim">→ Case {a.caseId}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-[13px] font-bold text-text mb-1">{a.consumer}</div>
                  <div className="text-[11px] text-text-dim mb-1">
                    Meter #{a.meter} · {a.theftType} · {a.period}
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10.5px]">
                    <span className="text-text-dim">Inspector: <span className="text-text-mid font-medium">{a.inspector}</span></span>
                    <span className="text-text-dim">Date: <span className="text-text-mid">{a.date}</span></span>
                    <span style={{ color: 'var(--ai-purple)' }}>🔐 {levelLabel}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="font-mono text-[18px] font-extrabold" style={{ color: amountColor }}>
                    ₹{a.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '3px 8px' }}
                      onClick={() => showToast({ type: 'info', title: 'Assessment detail', message: `Opening full assessment ${a.id}`, duration: 2500 })}>
                      View
                    </button>
                    {canApprove && (
                      <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10px', padding: '3px 10px' }}
                        onClick={() => approveAssessment(a.id)}>
                        ✓ Approve
                      </button>
                    )}
                    {a.approved && (
                      <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '3px 8px', color: 'var(--green)' }}
                        onClick={() => showToast({ type: 'success', title: 'Notice generated', message: `Section 135 notice for ${a.consumer} ready for dispatch.`, duration: 4000 })}>
                        📄 Issue notice
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
