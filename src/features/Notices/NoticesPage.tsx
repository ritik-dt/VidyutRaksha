import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

const NOTICE_SAMPLE = `UTTAR PRADESH POWER CORPORATION LIMITED
(A Govt. of Uttar Pradesh Undertaking)
Kashi Vidyut Vitaran Nigam Ltd. — Varanasi Zone

Notice No: UPPCL/VNS/TH/2026/042                    Date: 17 April 2026

To,
Shri HEERA LAL AGRAWAL
Consumer Account: 8115290000
Meter Number: 1849966
Address: L/C ORIENTAL BLDG, HAZRATGANJ, VARANASI

Subject: Notice under Section 135 of Electricity Act 2003 —
         Unauthorized use of electricity (Theft) — Assessment Order

Sir/Madam,

This is to inform you that upon technical inspection conducted on 17 April 2026 at your premises
against Meter Number 1849966 (Account No. 8115290000), it has been detected that you have been
engaged in unauthorized use of electricity by means of EARTH LOADING.

Assessment of unauthorized use: ₹3,88,800 (Rupees Three Lakh Eighty-Eight Thousand Eight Hundred only)
for the period January 2024 to March 2026.

You are hereby directed to pay the assessed amount within 15 days of receipt of this notice,
failing which the connection shall be disconnected under Section 56 of the Electricity Act 2003.

Legal basis: Section 135, Electricity Act 2003 — Punishment: Up to 3 years imprisonment
and/or fine equal to the assessed amount.

                                                    Assistant Engineer (Anti-Theft)
                                                    KVVNL, Varanasi Zone`

interface Notice {
  id: string
  consumer: string
  meter: string
  amount: number
  date: string
  status: string
  section: string
  type: string
  dispatchMethod: string
}

const NOTICES: Notice[] = [
  { id: 'UPPCL/VNS/TH/2026/042', consumer: 'HEERA LAL AGRAWAL', meter: '1849966', amount: 388800, date: '17 Apr 2026', status: 'Dispatched', section: 'Sec 135', type: 'Theft', dispatchMethod: 'Registered post + WhatsApp' },
  { id: 'UPPCL/VNS/TH/2026/038', consumer: 'VINOD KUMAR', meter: '1567234', amount: 1240000, date: '14 Apr 2026', status: 'Dispatched', section: 'Sec 135', type: 'CT manipulation', dispatchMethod: 'Registered post' },
  { id: 'UPPCL/VNS/TH/2026/035', consumer: 'M/S CHAWLA STEEL', meter: '2187690', amount: 3200000, date: '10 Apr 2026', status: 'Acknowledged', section: 'Sec 135', type: 'Industrial bypass', dispatchMethod: 'Registered post + courier' },
  { id: 'UPPCL/VNS/TH/2026/031', consumer: 'R.K. ENTERPRISES', meter: '2034871', amount: 84200, date: '08 Apr 2026', status: 'Draft', section: 'Sec 135', type: 'Meter bypass', dispatchMethod: 'Pending' },
  { id: 'UPPCL/VNS/TH/2026/028', consumer: 'GANESH CONSUMER PRODUCTS', meter: '300415', amount: 2800000, date: '02 Apr 2026', status: 'Disputed', section: 'Sec 135', type: 'CT manipulation', dispatchMethod: 'Registered post' },
]

const STATUS_FILTERS = [
  { value: 'all', label: 'All notices' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Dispatched', label: 'Dispatched' },
  { value: 'Acknowledged', label: 'Acknowledged' },
  { value: 'Disputed', label: 'Disputed' },
]

export default function NoticesPage() {
  const { showToast } = useToast()
  const [filter, setFilter] = useState('all')
  const [preview, setPreview] = useState(false)

  const filtered = NOTICES.filter((n) => filter === 'all' || n.status === filter)

  return (
    <div className="pb-2">
      <PageHeader
        title="📄 Consumer notices"
        subtitle="Auto-generated Section 135 notices · track dispatch, acknowledgement and appeals"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => setPreview(true)}>
              👁 Preview sample notice
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Bulk notices ready', message: 'AI generated 12 notices for approved assessments. Ready for dispatch.', duration: 4000 })}>
              ✦ Generate batch notices
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI notice advisor">
        <strong>{NOTICES.filter((n) => n.status === 'Draft').length} notices in draft</strong> — approve assessments first to auto-generate.
        {' '}<strong>1 notice is disputed</strong> (GANESH CONSUMER PRODUCTS) — Schedule technical review within 7 days per EA 2003 §135(6).
        {' '}Recovery from acknowledged notices: <strong>₹{((3200000 + 388800) / 100000).toFixed(1)}L</strong> (2 cases).
      </AiInsightBanner>

      <FilterBar filters={STATUS_FILTERS} active={filter} onChange={setFilter} className="mb-4" />

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Notice No.</th>
                <th>Consumer</th>
                <th>Meter</th>
                <th>Section</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Dispatch</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => {
                const statusColor = n.status === 'Dispatched' ? '#0EA5E9' : n.status === 'Acknowledged' ? 'var(--green)' : n.status === 'Disputed' ? 'var(--red)' : 'var(--text-dim)'
                return (
                  <tr key={n.id} className="table-row">
                    <td className="font-mono text-[10.5px] font-bold" style={{ color: 'var(--id-text)' }}>{n.id.split('/').slice(-1)[0]}</td>
                    <td className="max-w-[140px] truncate text-[11.5px] font-medium text-text">{n.consumer}</td>
                    <td className="font-mono text-[11px]" style={{ color: 'var(--id-text)' }}>#{n.meter}</td>
                    <td className="text-[11px] font-semibold" style={{ color: 'var(--amber)' }}>{n.section}</td>
                    <td className="font-mono font-bold text-[12px]" style={{ color: n.amount > 1000000 ? 'var(--red)' : 'var(--text)' }}>
                      ₹{n.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="text-[11px] text-text-mid">{n.date}</td>
                    <td>
                      <span className="rounded-full border px-2 py-px text-[10px] font-semibold"
                        style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}12` }}>
                        {n.status}
                      </span>
                    </td>
                    <td className="text-[10.5px] text-text-dim">{n.dispatchMethod}</td>
                    <td>
                      <div className="flex gap-1">
                        <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px', padding: '2px 7px' }}
                          onClick={() => setPreview(true)}>
                          View
                        </button>
                        {n.status === 'Draft' && (
                          <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10px', padding: '2px 8px' }}
                            onClick={() => showToast({ type: 'success', title: 'Notice dispatched', message: `Notice for ${n.consumer} dispatched via registered post.`, duration: 3500 })}>
                            Dispatch
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice preview modal */}
      {preview && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setPreview(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[640px] max-w-[95vw] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white dark:bg-card shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between p-4"
              style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="font-bold text-white">📄 Notice preview — UPPCL/VNS/TH/2026/042</div>
              <button type="button" onClick={() => setPreview(false)}
                className="flex size-7 items-center justify-center rounded-lg text-[rgba(255,255,255,0.5)] hover:bg-white/10 hover:text-white">✕</button>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-[1.6] text-text">{NOTICE_SAMPLE}</pre>
              <div className="mt-4 flex gap-2">
                <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
                  onClick={() => { showToast({ type: 'success', title: 'PDF downloaded', message: 'Notice PDF ready for print and dispatch.', duration: 3000 }); setPreview(false) }}>
                  📥 Download PDF
                </button>
                <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px' }}
                  onClick={() => setPreview(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
