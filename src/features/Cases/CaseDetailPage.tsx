/**
 * CaseDetailPage — exact port of prototype's renderCaseDetail()
 * Route: /cases/:caseId
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import { CASES_LIST } from './data/cases'
import type { CaseRecord } from './types'

/* ── theft type map — exact prototype meterTheftType ── */
const METER_THEFT_TYPE: Record<string, string> = {
  '1849966': 'Earth Loading',
  '2034871': 'Meter Bypass',
  '1567234': 'CT Manipulation',
  '1923445': 'Magnetic Tamper',
  '2187690': 'Earth Loading',
  '1678432': 'CT Manipulation',
  '1445567': 'Meter Bypass',
  '2098123': 'Neutral Disturbance',
}

/* ── remediation KB — exact prototype remediationKB ── */
const REMEDIATION_KB: Record<string, {
  type: string; safety: string[]; checklist: string[]
  evidence: string[]; formula: string
}> = {
  'Earth Loading': {
    type: 'Earth Loading / Neutral Bypass',
    safety: ['Wear insulated safety gloves before approaching meter', 'Do not touch bare wires or exposed connections', 'Keep a safe distance from live conductors'],
    checklist: ['Photograph meter seal and serial number', 'Check neutral wire — is it intact, cut, or bypassed?', 'Check for bypass wire between phase and earth', 'Take clamp-meter reading: compare neutral current vs phase current', 'Photograph any unauthorized wiring from multiple angles', 'Record meter display reading (kWh, kVAh, tamper count)', 'Check earth pit connection', 'If bypass confirmed — do NOT reconnect, escalate to AE'],
    evidence: ['Photographs of wiring (before and after)', 'Clamp-meter readings (neutral vs phase)', 'Meter event log screenshot (earth loading events)', 'GPS coordinates of meter location', 'Witness signatures if available'],
    formula: '(Days from first event to detection) × Peer avg kWh/day × Tariff rate + 2x penalty under Section 135',
  },
  'Meter Bypass': {
    type: 'Full Meter Bypass',
    safety: ['De-energize the connection before physical inspection', 'Wear insulated gloves and safety shoes', 'Have a helper present during inspection'],
    checklist: ['Inspect meter seal — is it intact or broken?', 'Check for jumper wire across CT or across meter terminals', 'Verify serial number matches DISCOM records', 'Check if direct connection exists before the meter point', 'Take clamp-meter reading at input vs output of meter', 'Photograph all connections from multiple angles', 'Record meter display readings'],
    evidence: ['Photographs of bypass wiring', 'Meter seal status (intact/broken/missing)', 'Serial number verification', 'Clamp-meter readings (input vs output)', 'Consumer statement if cooperative'],
    formula: 'Connected load (kW) × Hours of unauthorized use × Tariff rate + 2x penalty under Section 135',
  },
  'CT Manipulation': {
    type: 'CT Ratio Manipulation',
    safety: ['De-energize before testing CT connections', 'Wear insulated gloves'],
    checklist: ['Test CT ratio with clamp meter — compare primary vs secondary current', 'Compare CT readings with meter-recorded values', 'Check CT seals — intact or tampered?', 'Verify CT specifications match DISCOM records', 'Photograph CT installation and connections', 'Record all readings for evidence'],
    evidence: ['CT test results (primary vs secondary current)', 'Photographs of CT installation', 'CT seal status', 'Comparison with DISCOM CT records'],
    formula: 'Total kVAh billed × (Correct CT ratio / Tampered CT ratio - 1) × Tariff rate + penalty',
  },
  'Magnetic Tamper': {
    type: 'Magnetic Tampering / Meter Slow-down',
    safety: ['Wear non-magnetic gloves', 'Check for external magnetic devices attached to meter'],
    checklist: ['Check for magnets attached to or near meter', 'Inspect meter display for abnormal readings', 'Compare meter load vs actual connected load', 'Check tamper event log in smart meter', 'Photograph any magnetic devices found', 'Test meter accuracy with portable meter tester'],
    evidence: ['Photographs of magnetic device(s)', 'Meter tamper event log', 'Before/after meter readings', 'Load comparison data'],
    formula: '(Actual consumption - Billed consumption) × Tariff rate × Duration + penalty',
  },
  'Neutral Disturbance': {
    type: 'Neutral Wire Disturbance',
    safety: ['Wear insulated gloves', 'Check neutral conductor carefully — may be live'],
    checklist: ['Inspect neutral connection at meter terminal', 'Check for loose or cut neutral wire', 'Test voltage between neutral and earth', 'Compare phase and neutral currents', 'Photograph neutral terminal connections', 'Record meter readings'],
    evidence: ['Voltage measurement (neutral to earth)', 'Current measurements', 'Photographs of neutral connections', 'Meter tamper log'],
    formula: 'Estimated unbilled units × Tariff rate × Duration + penalty under Section 135',
  },
}

/* ── status badge — exact prototype sb() ── */
const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  'Assigned':        { bg: 'rgba(14,165,233,0.1)',  color: '#0EA5E9', border: 'rgba(14,165,233,0.3)'  },
  'In Progress':     { bg: 'rgba(230,146,30,0.1)',  color: '#E6921E', border: 'rgba(230,146,30,0.3)'  },
  'Escalated':       { bg: 'rgba(220,53,69,0.1)',   color: '#DC3545', border: 'rgba(220,53,69,0.3)'   },
  'Confirmed Theft': { bg: 'rgba(40,167,69,0.1)',   color: '#28A745', border: 'rgba(40,167,69,0.3)'   },
  'False Positive':  { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', border: 'rgba(107,114,128,0.3)' },
  'Closed':          { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', border: 'rgba(107,114,128,0.3)' },
}
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES['Assigned']
  return (
    <span style={{ padding: '3px 10px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
      {status}
    </span>
  )
}

/* ── lifecycle dot ── */
function LcDot({ done }: { done: boolean }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
      background: done ? 'rgba(40,167,69,0.12)' : 'var(--bg-soft)',
      border: `2px solid ${done ? 'var(--green)' : 'var(--border)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
    </div>
  )
}

/* ── timeline dot ── */
function TlDot({ color }: { color: string }) {
  return (
    <div style={{
      position: 'absolute', left: -26, top: 4,
      width: 10, height: 10, borderRadius: '50%',
      background: color, border: '2px solid #fff',
      boxShadow: `0 0 0 2px ${color}`,
    }} />
  )
}

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [comment, setComment] = useState('')
  const [outcome, setOutcome] = useState('')
  const [theftType, setTheftType] = useState('')
  const [recoveredKwh, setRecoveredKwh] = useState('')
  const [assessmentAmt, setAssessmentAmt] = useState('')
  const [inspectorNotes, setInspectorNotes] = useState('')
  const [tasks, setTasks] = useState([
    { t: 'Upload meter reading certificate',  d: '12 Apr', done: true,  who: 'Rajesh K' },
    { t: 'Get FIR copy from police station',  d: '14 Apr', done: true,  who: 'Amit S'   },
    { t: 'Schedule hearing for appeal',        d: '15 Apr', done: true,  who: 'Rajiv M'  },
    { t: 'Prepare hearing brief',              d: '20 Apr', done: false, who: 'Rajiv M'  },
    { t: 'Send installment plan proposal',     d: '25 Apr', done: false, who: 'System'   },
  ])

  /* find case — fallback to first */
  const cs: CaseRecord = CASES_LIST.find((c) => c.id === caseId) ?? CASES_LIST[0]

  /* lifecycle steps */
  const isDone = cs.status === 'Confirmed Theft' || cs.status === 'False Positive'
  const steps = [
    { s: 'AI flagged meter',          d: cs.created, done: true  },
    { s: 'Case auto-created',         d: cs.created, done: true  },
    { s: `Assigned to ${cs.assignee}`,d: cs.created, done: true  },
    { s: 'Field inspection',          d: isDone ? cs.due : 'Pending', done: isDone },
    { s: 'Outcome → model retrain',   d: cs.status === 'Confirmed Theft' ? 'Feeds AI learning' : '—', done: cs.status === 'Confirmed Theft' },
  ]

  /* AI inspection guide */
  const theftKey = METER_THEFT_TYPE[cs.meter] ?? 'Meter Bypass'
  const rem = REMEDIATION_KB[theftKey]

  /* timeline events */
  const timelineEvents = [
    { d: '05 Mar 2026 10:24', e: 'Case created',               c: 'var(--red)',      desc: `AI detected high risk (${cs.risk}) from nightly batch` },
    { d: '05 Mar 2026 14:32', e: 'Case assigned',              c: 'var(--id-text)',  desc: `Assigned to ${cs.assignee} by Rajiv Mehta` },
    { d: '06 Mar 2026 09:15', e: 'Pre-visit notice sent',      c: '#0D9488',         desc: 'SMS + email to consumer 24hrs advance notice' },
    { d: '07 Mar 2026 11:08', e: 'Field inspection started',   c: 'var(--ai-purple)',desc: 'Inspector GPS check-in at premises' },
    { d: '07 Mar 2026 12:42', e: 'Tamper evidence captured',   c: 'var(--red)',      desc: '6 photos geo-tagged, earth loading confirmed' },
    { d: '07 Mar 2026 13:15', e: 'Consumer signature captured',c: 'var(--green)',    desc: 'Digital signature on inspection report' },
    { d: '08 Mar 2026 15:00', e: 'Assessment calculated',      c: 'var(--amber)',    desc: '₹3,88,800 (peer baseline method, 92% confidence)' },
    { d: '09 Mar 2026 10:00', e: 'Section 135 notice generated',c:'var(--id-text)', desc: 'Notice UPPCL/VNS/TH/2026/042 · English + Hindi' },
    { d: '09 Mar 2026 10:30', e: 'Notice delivered',           c: 'var(--green)',    desc: 'SMS (read) + Post (delivered 12 Mar)' },
    { d: '08 Apr 2026 14:18', e: 'Consumer filed appeal',      c: 'var(--amber)',    desc: 'Appeal AP-2026-018 · Disputes baseline' },
    { d: 'Pending',            e: 'Hearing scheduled',          c: 'var(--text-dim)', desc: '22 Apr 2026 · Under Section 127' },
  ]

  const ATTACHMENTS = [
    { i: '📷', n: 'photo_tamper_seal.jpg',  s: '2.4 MB' },
    { i: '📷', n: 'photo_meter_body.jpg',   s: '3.1 MB' },
    { i: '📷', n: 'photo_earth_wire.jpg',   s: '1.8 MB' },
    { i: '📄', n: 'FIR_copy.pdf',           s: '340 KB' },
    { i: '📋', n: 'inspection_report.pdf',  s: '180 KB' },
    { i: '✉️', n: 'consumer_response.eml', s: '42 KB'  },
  ]

  const showDossier = ['Confirmed Theft','In Progress','Escalated','Assigned'].includes(cs.status)

  return (
    <div className="pb-8">
      {/* back link */}
      <button type="button" className="back-link" onClick={() => navigate('/cases')}>
        ← Back to cases
      </button>

      {/* page header */}
      <div className="page-header">
        <div>
          <div className="page-title">Case {cs.id}</div>
          <div className="page-sub">Meter #{cs.meter} • {cs.area}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusBadge status={cs.status} />
          {showDossier && (
            <button
              type="button"
              onClick={() => showToast({ type: 'success', title: 'Generating dossier…', message: `Court-ready dossier for ${cs.consumer} is being compiled.`, duration: 4000 })}
              style={{ padding: '6px 12px', background: 'var(--ai-gradient)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(124,58,237,0.25)' }}
            >
              ⚖️ Court-ready dossier
            </button>
          )}
        </div>
      </div>

      {/* real case panel */}
      {cs._real && (
        <div style={{ background: 'linear-gradient(135deg,rgba(40,167,69,.06),rgba(255,255,255,1) 30%)', border: '2px solid rgba(40,167,69,.4)', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ padding: '2px 8px', background: 'rgba(40,167,69,.15)', color: 'var(--green)', borderRadius: 10, fontSize: 9.5, fontWeight: 800, letterSpacing: '.3px' }}>REAL CASE</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text)' }}>From Mar-2026 KVVNL tamper event report (1,371 events)</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.5 }}>
              <strong>Account #{cs._account}</strong> · {cs.consumer} · {cs._activity || '—'} · {cs._load}{cs._load_unit || ''} sanctioned · Tariff {cs._tariff || '—'} · {cs._zone || '—'} zone
            </div>
          </div>
        </div>
      )}

      {/* AI briefing */}
      <div className="ai-insight" style={{ marginBottom: 14 }}>
        <div className="ai-insight-header">✦ AI case briefing</div>
        <div className="ai-insight-body">
          This case involves a <strong>{cs.risk}-risk meter</strong> with {cs.flags} flag triggers. Based on similar cases in your network, I predict a{' '}
          <strong style={{ color: 'var(--ai-purple)' }}>68% probability of confirmed theft</strong>. If confirmed, the inspection outcome will automatically retrain my model for better future detection.
        </div>
      </div>

      {/* Details + Lifecycle */}
      <div className="grid-2">
        {/* Details card */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Details</span>
            <button
              type="button"
              onClick={() => showToast({ type: 'info', title: 'Reassign inspector', message: `Opening reassignment flow for case ${cs.id}.`, duration: 3000 })}
              style={{ padding: '5px 12px', background: 'var(--ai-gradient)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
              Reassign inspector
            </button>
          </div>
          {[['Assigned', cs.assignee], ['Created', cs.created], ['Due', cs.due], ['Risk', cs.risk], ['Flags', cs.flags]].map(([k, v]) => (
            <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}>
              <span style={{ color: 'var(--text-dim)' }}>{k}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Case lifecycle card */}
        <div className="card">
          <div className="card-title">Case lifecycle</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <LcDot done={step.done} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: step.done ? 'var(--text)' : 'var(--text-dim)' }}>{step.s}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI inspection guide */}
      {rem && (
        <div className="card" style={{ border: '1px solid rgba(124,58,237,.2)', marginBottom: 14 }}>
          <div style={{ height: 3, background: 'var(--ai-gradient)', borderRadius: 3, margin: '-18px -18px 14px', width: 'calc(100% + 36px)' }} />
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ai-purple)' }}>
            ✦ AI inspection guide — {rem.type}
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>⚠ Safety first</div>
              {rem.safety.map((s, i) => (
                <div key={i} style={{ fontSize: 11, padding: '2px 0', display: 'flex', gap: 4 }}>
                  <span style={{ color: 'var(--red)' }}>●</span>{s}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--id-text)', marginBottom: 4 }}>📋 Evidence to collect</div>
              {rem.evidence.slice(0, 4).map((e, i) => (
                <div key={i} style={{ fontSize: 11, padding: '2px 0', display: 'flex', gap: 4 }}>
                  <span>📎</span>{e}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ai-purple)', marginBottom: 6 }}>✦ Step-by-step inspection checklist</div>
          {rem.checklist.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}>
              <span style={{ color: 'var(--ai-purple)', fontWeight: 600, minWidth: 18 }}>{i + 1}.</span>
              <span>{c}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--ai-purple-light)', borderRadius: 6, fontSize: 10, color: 'var(--ai-purple)' }}>
            <strong>Assessment formula:</strong> {rem.formula}
          </div>
        </div>
      )}

      {/* Timeline + Right column */}
      <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
        {/* Timeline */}
        <div className="card">
          <div className="card-title">📅 Case timeline</div>
          <div style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid var(--border)', margin: '14px 0' }}>
            {timelineEvents.map((ev, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 12 }}>
                <TlDot color={ev.c} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ev.c }}>{ev.e}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{ev.d}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-mid)', lineHeight: 1.4 }}>{ev.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: linked cases + tasks + attachments */}
        <div>
          {/* Linked cases */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">🔗 Linked cases — AI cluster</div>
            <div style={{ fontSize: 11, color: 'var(--text-mid)', marginBottom: 8 }}>
              AI identified <strong>3 related cases</strong> under same DTR showing coordinated pattern
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'C-20260310-015', consumer: 'BHUWAL JAISWAL',       desc: 'Same DTR · Earth loading', match: '94%', color: 'var(--red)'   },
                { id: 'C-20260312-022', consumer: 'ANAND PRAKASH AGARWAL', desc: 'Same DTR · Tariff misuse', match: '76%', color: 'var(--amber)' },
                { id: 'C-20260314-030', consumer: 'ISHANT',               desc: 'Same DTR · Direct hooking', match: '72%', color: 'var(--amber)' },
              ].map((lc) => (
                <div
                  key={lc.id}
                  onClick={() => navigate(`/cases/${lc.id}`)}
                  style={{ padding: '8px 10px', background: 'var(--bg-soft)', borderRadius: 6, borderLeft: `3px solid ${lc.color}`, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: lc.color }}>{lc.id}</div>
                    <span style={{ padding: '1px 6px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', borderRadius: 8, fontSize: 9, fontWeight: 700 }}>{lc.match} match</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-mid)', marginTop: 2 }}>{lc.consumer} · {lc.desc}</div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ai btn-sm" style={{ width: '100%', marginTop: 10, fontSize: 11, justifyContent: 'center' }}
              onClick={() => showToast({ type: 'info', title: 'Batch inspection', message: 'Batch inspection for all 4 cases queued.', duration: 3000 })}>
              ✦ Create batch inspection for all 4
            </button>
          </div>

          {/* Tasks */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">✅ Tasks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tasks.map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: 'var(--bg-soft)', borderRadius: 4 }}>
                  <input type="checkbox" checked={task.done} onChange={() => {
                    setTasks((prev) => prev.map((t, j) => j === i ? { ...t, done: !t.done } : t))
                  }} style={{ cursor: 'pointer', width: 14, height: 14, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text-dim)' : 'var(--text)' }}>{task.t}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Due {task.d} · {task.who}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 8, fontSize: 11 }}
              onClick={() => showToast({ type: 'info', title: 'Add task', message: 'Task creation dialog would open here.', duration: 2500 })}>
              + Add task
            </button>
          </div>

          {/* Attachments */}
          <div className="card">
            <div className="card-title">📎 Attachments ({ATTACHMENTS.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {ATTACHMENTS.map((a) => (
                <div key={a.n} style={{ padding: 6, background: 'var(--bg-soft)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                  onClick={() => showToast({ type: 'info', title: 'Opening file', message: a.n, duration: 2000 })}>
                  <span style={{ fontSize: 16 }}>{a.i}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.n}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-dim)' }}>{a.s}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 8, fontSize: 11 }}
              onClick={() => showToast({ type: 'info', title: 'Upload', message: 'File upload dialog would open here.', duration: 2000 })}>
              + Upload
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-title">💬 Comments & collaboration</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {/* RK comment */}
          <div style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--bg-soft)', borderRadius: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ai-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>RK</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>Rajesh Kumar <span style={{ color: 'var(--text-dim)', fontWeight: 400, marginLeft: 4 }}>· Inspector</span></div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>07 Mar · 1:20 PM</div>
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-mid)' }}>Consumer was cooperative. Tamper was clearly visible — earth wire was attached directly to neutral terminal inside panel. 6 photos uploaded including close-ups. Consumer admitted installing it "due to business loss" but requested installment payment.</div>
            </div>
          </div>
          {/* RM comment */}
          <div style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--bg-soft)', borderRadius: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>RM</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>Rajiv Mehta <span style={{ color: 'var(--text-dim)', fontWeight: 400, marginLeft: 4 }}>· Vigilance Officer</span></div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>08 Mar · 3:15 PM</div>
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-mid)' }}>Good work <span style={{ color: 'var(--ai-purple)', fontWeight: 700 }}>@RajeshKumar</span>. Proceeding with Section 135 notice. Given good cooperation, I'll approve 6-month installment plan if consumer applies formally. Please document the FIR promptly.</div>
            </div>
          </div>
          {/* AI comment */}
          <div style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--ai-purple-light)', borderRadius: 6, borderLeft: '3px solid var(--ai-purple)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ai-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>✦</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ai-purple)' }}>AI Assistant</div>
                <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>08 Apr · 2:45 PM</div>
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--ai-purple)' }}>Consumer has filed appeal (AP-2026-018) disputing baseline methodology. I've prepared counter-arguments for the hearing on 22 Apr. Key point: consumer's own 3-year historical average (21.4 kWh/day) exceeds the disputed peer baseline (19.2 kWh/day) — their argument is self-contradictory.</div>
            </div>
          </div>
        </div>
        {/* compose */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ai-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>YO</div>
          <div style={{ flex: 1 }}>
            <textarea
              className="form-input"
              placeholder="Add a comment... use @name to mention others"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', minHeight: 60, fontSize: 12, padding: 10, resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Supports <strong>@mentions</strong> and <strong>markdown</strong></div>
              <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: 11 }}
                onClick={() => { showToast({ type: 'success', title: 'Comment posted', message: 'Your comment has been added to the case.', duration: 3000 }); setComment('') }}>
                Post comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection outcome */}
      <div className="card">
        <div className="card-title">Inspection outcome</div>
        <div className="form-grid">
          <div>
            <label className="form-label">Outcome</label>
            <select className="form-select" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
              <option value="">Select...</option>
              <option>Confirmed Theft</option>
              <option>False Positive</option>
              <option>Inconclusive</option>
            </select>
          </div>
          <div>
            <label className="form-label">Theft type</label>
            <select className="form-select" value={theftType} onChange={(e) => setTheftType(e.target.value)}>
              <option value="">Select...</option>
              <option>Meter Bypass</option>
              <option>Earth Loading</option>
              <option>Tariff Misuse</option>
              <option>CT Manipulation</option>
              <option>Magnetic Tamper</option>
            </select>
          </div>
          <div>
            <label className="form-label">Recovered kWh</label>
            <input className="form-input" type="number" placeholder="Enter kWh" value={recoveredKwh} onChange={(e) => setRecoveredKwh(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Assessment ₹</label>
            <input className="form-input" type="number" placeholder="Enter amount" value={assessmentAmt} onChange={(e) => setAssessmentAmt(e.target.value)} />
          </div>
          <div className="form-full">
            <label className="form-label">Inspector notes</label>
            <textarea className="form-textarea" rows={3} placeholder="Observations from field visit..." value={inspectorNotes} onChange={(e) => setInspectorNotes(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 14, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline btn-sm"
            onClick={() => showToast({ type: 'info', title: 'Draft saved', message: 'Inspection outcome saved as draft.', duration: 2500 })}>
            Save draft
          </button>
          <button type="button" className="btn btn-green btn-sm"
            onClick={() => showToast({ type: 'success', title: 'Submitted!', message: 'Outcome submitted. AI model will retrain on this case.', duration: 4000 })}>
            Submit → retrain AI
          </button>
        </div>
      </div>
    </div>
  )
}
