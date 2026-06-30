import { useState, type ChangeEvent } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'

interface AuditLog {
  ts: string
  user: string
  role: string
  action: string
  entity: string
  details: string
  sig: string
  ip: string
  category: 'case' | 'meter' | 'user' | 'system' | 'data'
}

const AUDIT_LOGS: AuditLog[] = [
  { ts: '2026-04-17 14:32:18', user: 'Rajiv Mehta', role: 'Admin', action: 'CASE_CONFIRMED', entity: 'Case C-20260301-001', details: 'Theft confirmed, assessment ₹3,88,800 generated', sig: 'SHA256:a8f3...', ip: '10.12.4.22', category: 'case' },
  { ts: '2026-04-17 14:15:42', user: 'Rajesh Kumar', role: 'Inspector', action: 'INSPECTION_COMPLETED', entity: 'Meter #1849966', details: 'Field inspection completed — tamper evidence photographed (6 photos)', sig: 'SHA256:3d2c...', ip: '49.36.18.4', category: 'meter' },
  { ts: '2026-04-17 13:58:01', user: 'Rajesh Kumar', role: 'Inspector', action: 'CASE_NOTE_ADDED', entity: 'Case C-20260301-001', details: 'Added inspection note: Earth wire confirmed bypassed. CT intact.', sig: 'SHA256:b91e...', ip: '49.36.18.4', category: 'case' },
  { ts: '2026-04-17 13:30:00', user: 'System', role: 'AI Engine', action: 'BATCH_RUN_COMPLETE', entity: 'KVVNL · 1,116 meters', details: '851 new suspicious flags. 14 risk scores updated > threshold.', sig: 'SHA256:f44a...', ip: '10.12.0.1', category: 'system' },
  { ts: '2026-04-17 12:45:19', user: 'Sunita Verma', role: 'Senior Inspector', action: 'CASE_ASSIGNED', entity: 'Case C-20260228-014', details: 'Assigned to self. Scheduled for 18 Apr 2026.', sig: 'SHA256:7b3f...', ip: '10.12.5.18', category: 'case' },
  { ts: '2026-04-17 11:00:00', user: 'System', role: 'AI Engine', action: 'MODEL_RETRAIN', entity: 'risk-v3.4.1', details: 'Model retrained on 1,959 ground-truth outcomes. F1: 0.847. FP rate: 16.2%.', sig: 'SHA256:cc91...', ip: '10.12.0.1', category: 'system' },
  { ts: '2026-04-17 10:22:33', user: 'Rajiv Mehta', role: 'Admin', action: 'USER_CREATED', entity: 'Priya Mishra', details: 'New inspector account created. Zone: Jaunpur / Azamgarh.', sig: 'SHA256:5e7d...', ip: '10.12.4.22', category: 'user' },
  { ts: '2026-04-17 09:45:00', user: 'Amit Sharma', role: 'Inspector', action: 'NOTICE_DISPATCHED', entity: 'Notice UPPCL/VNS/TH/2026/038', details: 'Section 135 notice dispatched to VINOD KUMAR via registered post.', sig: 'SHA256:2f8a...', ip: '10.12.5.9', category: 'case' },
  { ts: '2026-04-17 08:30:00', user: 'System', role: 'Scheduler', action: 'MRI_INGESTION', entity: 'KVVNL batch 2026-04-17', details: '18,562 meter records ingested. 14 gaps detected. Coverage 98.7%.', sig: 'SHA256:a1b2...', ip: '10.12.0.2', category: 'data' },
  { ts: '2026-04-16 17:15:44', user: 'Deepak Yadav', role: 'Inspector', action: 'ASSESSMENT_APPROVED', entity: 'ASS-2026-0038', details: 'Assessment ₹3,20,000 for M/S CHAWLA STEEL approved at AEN level.', sig: 'SHA256:9c4d...', ip: '10.12.6.3', category: 'case' },
  { ts: '2026-04-16 14:02:11', user: 'Rajiv Mehta', role: 'Admin', action: 'RULE_UPDATED', entity: 'R02 · Earth loading threshold', details: 'Min occurrences changed from 10 to 8. Takes effect next batch run.', sig: 'SHA256:e5f6...', ip: '10.12.4.22', category: 'system' },
  { ts: '2026-04-16 11:30:00', user: 'System', role: 'AI Engine', action: 'CLUSTER_DETECTED', entity: 'DT-0445 · 12 meters', details: 'Coordinated consumption pattern detected. Cluster CL-2026-042 created.', sig: 'SHA256:d3c2...', ip: '10.12.0.1', category: 'system' },
]

const ACTION_COLOR: Record<string, string> = {
  CASE_CONFIRMED: 'var(--green)',
  INSPECTION_COMPLETED: 'var(--green)',
  CASE_NOTE_ADDED: '#0EA5E9',
  BATCH_RUN_COMPLETE: 'var(--ai-purple)',
  CASE_ASSIGNED: 'var(--amber)',
  MODEL_RETRAIN: 'var(--ai-purple)',
  USER_CREATED: '#0EA5E9',
  NOTICE_DISPATCHED: 'var(--green)',
  MRI_INGESTION: '#0EA5E9',
  ASSESSMENT_APPROVED: 'var(--green)',
  RULE_UPDATED: 'var(--amber)',
  CLUSTER_DETECTED: 'var(--ai-purple)',
}

const CAT_FILTERS = [
  { value: 'all', label: 'All events' },
  { value: 'case', label: '📋 Cases' },
  { value: 'meter', label: '🔌 Meters' },
  { value: 'system', label: '🤖 System/AI' },
  { value: 'user', label: '👤 Users' },
  { value: 'data', label: '📥 Data' },
]

export default function AuditPage() {
  const { showToast } = useToast()
  const [catFilter, setCatFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = AUDIT_LOGS.filter((log) => {
    const catOk = catFilter === 'all' || log.category === catFilter
    const searchOk = !search || log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
    return catOk && searchOk
  })

  return (
    <div className="pb-2">
      <PageHeader
        title="🔍 Audit trail"
        subtitle="Immutable, tamper-evident log of all system and user actions · cryptographically signed"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Exported', message: 'Audit log exported as CSV with hash verification.', duration: 3500 })}>
              📥 Export log
            </button>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Verified', message: 'All 1,247 signatures verified. Tamper-free.', duration: 3500 })}>
              🔐 Verify integrity
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI audit summary">
        <strong>1,247 events</strong> logged in the last 30 days. All signatures verified —
        <strong style={{ color: 'var(--green)' }}> zero tamper events</strong> detected.
        Most active user: <strong>Rajiv Mehta</strong> (Admin, 142 actions).
        <strong> 3 rule changes</strong> in the last 7 days — all authorised by Admin role.
        Model retrain at 11:00 IST today improved F1 score by 0.8pp.
      </AiInsightBanner>

      {/* Filters */}
      <FilterBar filters={CAT_FILTERS} active={catFilter} onChange={setCatFilter}
        rightSlot={
          <input type="text" value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search action, user, entity…"
            className="h-8 rounded-lg border border-border bg-card px-3 text-[11px] outline-none focus:border-ai-purple"
            style={{ width: 200 }} />
        }
      />

      {/* Log */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr className="table-header">
                <th>Timestamp</th>
                <th>User / Role</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th>IP</th>
                <th>Sig</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const color = ACTION_COLOR[log.action] ?? 'var(--text-mid)'
                return (
                  <tr key={i} className="table-row">
                    <td className="font-mono text-[10.5px] text-text-dim whitespace-nowrap">{log.ts}</td>
                    <td>
                      <div className="text-[11.5px] font-semibold text-text">{log.user}</div>
                      <div className="text-[10px] text-text-dim">{log.role}</div>
                    </td>
                    <td>
                      <span className="rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-bold"
                        style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="max-w-[140px] text-[11px] font-medium text-text">{log.entity}</td>
                    <td className="max-w-[220px] text-[11px] text-text-mid">{log.details}</td>
                    <td className="font-mono text-[10px] text-text-dim">{log.ip}</td>
                    <td className="font-mono text-[9.5px] text-text-dim">
                      <span title={log.sig}>✓ {log.sig.substring(0, 12)}…</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10.5px] text-text-dim">
          <span>Showing <strong className="text-text">{filtered.length}</strong> of <strong className="text-text">1,247</strong> events</span>
          <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px' }}>Load more</button>
        </div>
      </div>
    </div>
  )
}
