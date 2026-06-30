import { PageHeader } from '@/shared/components/ui/PageHeader'
import { useToast } from '@/shared/context/ToastContext'

const ROI_ROWS = [
  { label: 'AT&C loss FY25 (baseline)', value: '22.8%', note: 'UPPCL Annual Report FY25' },
  { label: 'AT&C loss FY26 (current)', value: '20.5%', note: 'Current billing data + AI estimates' },
  { label: 'Loss reduction FYTD', value: '−2.3 pp', note: 'vs baseline', color: 'var(--green)' },
  { label: 'Units saved (annualized)', value: '42 MU', note: 'Loss reduction × units distributed' },
  { label: 'Revenue saved (annualized)', value: '₹21 Cr', note: '42 MU × avg realization ₹5/unit' },
  { label: 'System cost (5-year TCO)', value: '₹8.4 Cr', note: 'SaaS + integration + training' },
  { label: 'Net 5-year benefit', value: '₹96 Cr', note: 'Revenue saved × 5 − system cost', color: 'var(--green)' },
  { label: 'ROI', value: '1,143%', note: 'Net benefit / system cost', color: 'var(--green)' },
  { label: 'Payback period', value: '< 2 months', note: 'Annual benefit / annual cost', color: 'var(--green)' },
]

const COMPARISON = [
  { metric: 'AT&C loss', before: '22.8%', after: '20.5%', delta: '−2.3pp', good: true },
  { metric: 'Confirmed theft / year', before: '4,200', after: '6,870', delta: '+64%', good: true },
  { metric: 'False positive rate', before: '38%', after: '16%', delta: '−22pp', good: true },
  { metric: 'Avg case close time', before: '8.4 days', after: '3.2 days', delta: '−62%', good: true },
  { metric: 'Inspector productivity', before: '12 cases/mo', after: '28 cases/mo', delta: '+133%', good: true },
  { metric: 'Revenue recovered (FYTD)', before: '₹11.2 Cr', after: '₹26.4 Cr', delta: '+136%', good: true },
]

export default function ROIPage() {
  const { showToast } = useToast()

  return (
    <div className="pb-2">
      <PageHeader
        title="💼 ROI & business case"
        subtitle="Financial case for state-wide rollout · UPPCL · 15-lakh smart-meter footprint · Procurement grade"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Excel export ready', message: 'ROI model exported with all assumptions, sensitivity tables, and 5-year cashflow.', duration: 4500 })}>
              📊 Export model
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Tender response drafted', message: 'AI generated a 14-page response to UPPCL/RDSS/2026 tender using this ROI as Exhibit B.', duration: 4500 })}>
              ✦ Draft tender response
            </button>
          </>
        }
      />

      {/* Headline KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: '5-year ROI', value: '1,143%', sub: 'Net benefit / system cost', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Payback period', value: '< 2 mo', sub: 'Self-funded in first quarter', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Annual revenue saved', value: '₹21 Cr', sub: '42 MU × ₹5/unit avg', accent: 'var(--amber)', color: 'var(--amber)', fontSize: '20px' },
          { label: 'Net 5-yr benefit', value: '₹96 Cr', sub: 'After full TCO', accent: 'var(--green)', color: 'var(--green)', fontSize: '20px' },
          { label: 'System 5-yr TCO', value: '₹8.4 Cr', sub: 'SaaS + integration + training', accent: 'var(--navy-light)', color: 'var(--text)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[130px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono font-extrabold" style={{ color: k.color, fontSize: k.fontSize ?? '24px' }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Before / After comparison */}
      <div className="card mb-4">
        <div className="card-title mb-3 text-[13px] font-bold">Before → After: VidyutRaksha impact</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Metric</th>
                <th>Before VidyutRaksha</th>
                <th>After (current)</th>
                <th>Delta</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.metric} className="table-row">
                  <td className="font-semibold text-text">{row.metric}</td>
                  <td className="font-mono text-text-mid">{row.before}</td>
                  <td className="font-mono font-bold text-text">{row.after}</td>
                  <td className="font-mono font-bold" style={{ color: row.good ? 'var(--green)' : 'var(--red)' }}>{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI assumptions */}
      <div className="card mb-4">
        <div className="card-title mb-3 text-[13px] font-bold">Financial assumptions & anchors</div>
        <div className="space-y-0">
          {ROI_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
              <div>
                <div className="text-[12px] font-semibold text-text">{row.label}</div>
                <div className="text-[10.5px] text-text-dim">{row.note}</div>
              </div>
              <div className="font-mono text-[13px] font-extrabold" style={{ color: row.color ?? 'var(--text)' }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anchors */}
      <div className="card">
        <div className="card-title mb-2 text-[13px] font-bold">Data anchors (procurement-grade)</div>
        <div className="flex flex-wrap gap-2">
          {['UPPCL AT&C Tariff Order FY26', 'PFC RDSS Guidelines', 'CEA loss-bracket data', 'UPERC ARR Determination', 'MoP Smart Metering Programme'].map((a) => (
            <span key={a} className="rounded-full border border-border bg-bg px-3 py-1 text-[11px] text-text-mid">
              📌 {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
