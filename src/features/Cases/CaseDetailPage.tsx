/**
 * CaseDetailPage — exact port of prototype's renderCaseDetail()
 * Route: /cases/:caseId
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/shared/context/ToastContext'
import { CASES_LIST } from './data/cases'
import { ReassignInspectorPanel } from './ReassignInspectorPanel'
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
const STATUS_STYLES: Record<string, string> = {
  'Assigned':        'bg-[rgba(14,165,233,0.1)] text-[#0EA5E9] border-[rgba(14,165,233,0.3)]',
  'In Progress':     'bg-[rgba(230,146,30,0.1)] text-[#E6921E] border-[rgba(230,146,30,0.3)]',
  'Escalated':       'bg-[rgba(220,53,69,0.1)] text-[#DC3545] border-[rgba(220,53,69,0.3)]',
  'Confirmed Theft': 'bg-[rgba(40,167,69,0.1)] text-[#28A745] border-[rgba(40,167,69,0.3)]',
  'False Positive':  'bg-[rgba(107,114,128,0.1)] text-[#6B7280] border-[rgba(107,114,128,0.3)]',
  'Closed':          'bg-[rgba(107,114,128,0.1)] text-[#6B7280] border-[rgba(107,114,128,0.3)]',
}
function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? STATUS_STYLES['Assigned']
  return (
    <span className={`rounded-[10px] border px-2.5 py-[3px] text-[11px] font-bold ${cls}`}>
      {status}
    </span>
  )
}

/* ── lifecycle dot ── */
function LcDot({ done }: { done: boolean }) {
  return (
    <div className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${done ? 'border-green bg-[rgba(40,167,69,0.12)]' : 'border-border bg-bg-soft'}`}>
      {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
    </div>
  )
}

/* ── timeline dot — color comes from a small fixed CSS-var palette ── */
const TL_DOT_CLASS: Record<string, string> = {
  'var(--red)': 'bg-red shadow-[0_0_0_2px_var(--red)]',
  'var(--id-text)': 'bg-id-text shadow-[0_0_0_2px_var(--id-text)]',
  '#0D9488': 'bg-[#0D9488] shadow-[0_0_0_2px_#0D9488]',
  'var(--ai-purple)': 'bg-ai-purple shadow-[0_0_0_2px_var(--ai-purple)]',
  'var(--green)': 'bg-green shadow-[0_0_0_2px_var(--green)]',
  'var(--amber)': 'bg-amber shadow-[0_0_0_2px_var(--amber)]',
  'var(--text-dim)': 'bg-text-dim shadow-[0_0_0_2px_var(--text-dim)]',
}
function TlDot({ color }: { color: string }) {
  return (
    <div className={`absolute top-1 -left-[26px] size-2.5 rounded-full border-2 border-white ${TL_DOT_CLASS[color] ?? 'bg-text-dim'}`} />
  )
}

/* ── small color->class helper for text colors drawn from the same fixed palette ── */
const TEXT_COLOR_CLASS: Record<string, string> = {
  'var(--red)': 'text-red',
  'var(--id-text)': 'text-id-text',
  '#0D9488': 'text-[#0D9488]',
  'var(--ai-purple)': 'text-ai-purple',
  'var(--green)': 'text-green',
  'var(--amber)': 'text-amber',
  'var(--text-dim)': 'text-text-dim',
}
function textColorClass(c: string) {
  return TEXT_COLOR_CLASS[c] ?? 'text-text-dim'
}
const BORDER_COLOR_CLASS: Record<string, string> = {
  'var(--red)': 'border-l-red',
  'var(--amber)': 'border-l-amber',
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
  const [showReassignPanel, setShowReassignPanel] = useState(false)
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

  const LINKED_CASES = [
    { id: 'C-20260310-015', consumer: 'BHUWAL JAISWAL',         desc: 'Same DTR · Earth loading', match: '94%', color: 'var(--red)'   },
    { id: 'C-20260312-022', consumer: 'ANAND PRAKASH AGARWAL',  desc: 'Same DTR · Tariff misuse', match: '76%', color: 'var(--amber)' },
    { id: 'C-20260314-030', consumer: 'ISHANT',                 desc: 'Same DTR · Direct hooking', match: '72%', color: 'var(--amber)' },
  ]

  const showDossier = ['Confirmed Theft','In Progress','Escalated','Assigned'].includes(cs.status)

  return (
    <div className="pb-2">
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
        <div className="flex items-center gap-2">
          <StatusBadge status={cs.status} />
          {showDossier && (
            <button
              type="button"
              onClick={() => showToast({ type: 'success', title: 'Generating dossier…', message: `Court-ready dossier for ${cs.consumer} is being compiled.`, duration: 4000 })}
              className="flex cursor-pointer items-center gap-[5px] rounded-lg border-none bg-[image:var(--ai-gradient)] px-3 py-1.5 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(124,58,237,0.25)]"
            >
              ⚖️ Court-ready dossier
            </button>
          )}
        </div>
      </div>

      {/* real case panel */}
      {cs._real && (
        <div className="mb-3.5 flex items-start gap-3.5 rounded-[10px] border-2 border-[rgba(40,167,69,0.4)] bg-[linear-gradient(135deg,rgba(40,167,69,0.06),rgba(255,255,255,1)_30%)] px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green text-[18px] text-white">✓</div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-[10px] bg-[rgba(40,167,69,0.15)] px-2 py-0.5 text-[9.5px] font-extrabold tracking-[0.3px] text-green">REAL CASE</span>
              <span className="text-[11.5px] font-bold text-text">From Mar-2026 KVVNL tamper event report (1,371 events)</span>
            </div>
            <div className="text-[11px] leading-[1.5] text-text-mid">
              <strong>Account #{cs._account}</strong> · {cs.consumer} · {cs._activity || '—'} · {cs._load}{cs._load_unit || ''} sanctioned · Tariff {cs._tariff || '—'} · {cs._zone || '—'} zone
            </div>
          </div>
        </div>
      )}

      {/* AI briefing */}
      <div className="ai-insight mb-3.5">
        <div className="ai-insight-header">✦ AI case briefing</div>
        <div className="ai-insight-body">
          This case involves a <strong>{cs.risk}-risk meter</strong> with {cs.flags} flag triggers. Based on similar cases in your network, I predict a{' '}
          <strong className="text-ai-purple">68% probability of confirmed theft</strong>. If confirmed, the inspection outcome will automatically retrain my model for better future detection.
        </div>
      </div>

      {/* Details + Lifecycle */}
      <div className="grid-2">
        {/* Details card */}
        <div className="card">
          <div className="card-title flex items-center justify-between">
            <span>Details</span>
            <button
              type="button"
              onClick={() => setShowReassignPanel(true)}
              className="flex cursor-pointer items-center gap-1 rounded-md border-none bg-[image:var(--ai-gradient)] px-3 py-[5px] text-[11px] font-bold text-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
              Reassign inspector
            </button>
          </div>
          {[['Assigned', cs.assignee], ['Created', cs.created], ['Due', cs.due], ['Risk', cs.risk], ['Flags', cs.flags]].map(([k, v]) => (
            <div key={String(k)} className="flex justify-between border-b border-border-light py-2 text-xs">
              <span className="text-text-dim">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>

        {/* Case lifecycle card */}
        <div className="card">
          <div className="card-title">Case lifecycle</div>
          <div className="mt-1 flex flex-col gap-2.5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <LcDot done={step.done} />
                <div>
                  <div className={`text-xs font-medium ${step.done ? 'text-text' : 'text-text-dim'}`}>{step.s}</div>
                  <div className="text-[10px] text-text-dim">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI inspection guide */}
      {rem && (
        <div className="card mb-3.5 border border-[rgba(124,58,237,0.2)]">
          <div className="-mx-[18px] -mt-[18px] mb-3.5 h-[3px] w-[calc(100%+36px)] rounded-[3px] bg-[image:var(--ai-gradient)]" />
          <div className="card-title flex items-center gap-1.5 text-ai-purple">
            ✦ AI inspection guide — {rem.type}
          </div>
          <div className="mb-3 flex gap-3.5">
            <div className="flex-1">
              <div className="mb-1 text-[11px] font-semibold text-red">⚠ Safety first</div>
              {rem.safety.map((s, i) => (
                <div key={i} className="flex gap-1 py-0.5 text-[11px]">
                  <span className="text-red">●</span>{s}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="mb-1 text-[11px] font-semibold text-id-text">📋 Evidence to collect</div>
              {rem.evidence.slice(0, 4).map((e, i) => (
                <div key={i} className="flex gap-1 py-0.5 text-[11px]">
                  <span>📎</span>{e}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-1.5 text-[11px] font-semibold text-ai-purple">✦ Step-by-step inspection checklist</div>
          {rem.checklist.map((c, i) => (
            <div key={i} className="flex items-start gap-2 border-b border-border-light py-[5px] text-xs">
              <span className="min-w-[18px] font-semibold text-ai-purple">{i + 1}.</span>
              <span>{c}</span>
            </div>
          ))}
          <div className="mt-2.5 rounded-md bg-ai-purple-light px-2.5 py-2 text-[10px] text-ai-purple">
            <strong>Assessment formula:</strong> {rem.formula}
          </div>
        </div>
      )}

      {/* Timeline + Right column */}
      <div className="grid-2 mb-3.5 gap-3.5">
        {/* Timeline */}
        <div className="card">
          <div className="card-title">📅 Case timeline</div>
          <div className="relative my-3.5 border-l-2 border-border pl-5">
            {timelineEvents.map((ev, i) => (
              <div key={i} className="relative mb-3">
                <TlDot color={ev.c} />
                <div className="mb-0.5 flex items-start justify-between">
                  <div className={`text-xs font-bold ${textColorClass(ev.c)}`}>{ev.e}</div>
                  <div className="font-mono text-[10px] text-text-dim">{ev.d}</div>
                </div>
                <div className="text-[11px] leading-[1.4] text-text-mid">{ev.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: linked cases + tasks + attachments */}
        <div>
          {/* Linked cases */}
          <div className="card mb-3">
            <div className="card-title">🔗 Linked cases — AI cluster</div>
            <div className="mb-2 text-[11px] text-text-mid">
              AI identified <strong>3 related cases</strong> under same DTR showing coordinated pattern
            </div>
            <div className="flex flex-col gap-1.5">
              {LINKED_CASES.map((lc) => (
                <div
                  key={lc.id}
                  onClick={() => navigate(`/cases/${lc.id}`)}
                  className={`cursor-pointer rounded-md border-l-[3px] bg-bg px-2.5 py-2 ${BORDER_COLOR_CLASS[lc.color] ?? 'border-l-amber'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`text-[11px] font-bold ${textColorClass(lc.color)}`}>{lc.id}</div>
                    <span className="rounded-lg bg-[rgba(14,165,233,0.1)] px-1.5 py-px text-[9px] font-bold text-[#0EA5E9]">{lc.match} match</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-text-mid">{lc.consumer} · {lc.desc}</div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ai btn-sm mt-2.5 w-full justify-center text-[11px]"
              onClick={() => showToast({ type: 'info', title: 'Batch inspection', message: 'Batch inspection for all 4 cases queued.', duration: 3000 })}>
              ✦ Create batch inspection for all 4
            </button>
          </div>

          {/* Tasks */}
          <div className="card mb-3">
            <div className="card-title">✅ Tasks</div>
            <div className="flex flex-col gap-1.5">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 rounded bg-bg p-1.5">
                  <input type="checkbox" checked={task.done} onChange={() => {
                    setTasks((prev) => prev.map((t, j) => j === i ? { ...t, done: !t.done } : t))
                  }} className="size-3.5 shrink-0 cursor-pointer" />
                  <div className="flex-1">
                    <div className={`text-[11px] ${task.done ? 'text-text-dim line-through' : 'text-text no-underline'}`}>{task.t}</div>
                    <div className="text-[10px] text-text-dim">Due {task.d} · {task.who}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm mt-2 w-full text-[11px]"
              onClick={() => showToast({ type: 'info', title: 'Add task', message: 'Task creation dialog would open here.', duration: 2500 })}>
              + Add task
            </button>
          </div>

          {/* Attachments */}
          <div className="card">
            <div className="card-title">📎 Attachments ({ATTACHMENTS.length})</div>
            <div className="grid grid-cols-2 gap-1.5">
              {ATTACHMENTS.map((a) => (
                <div key={a.n} className="flex cursor-pointer items-center gap-1.5 rounded bg-bg p-1.5"
                  onClick={() => showToast({ type: 'info', title: 'Opening file', message: a.n, duration: 2000 })}>
                  <span className="text-base">{a.i}</span>
                  <div className="min-w-0 flex-1">
                    <div className="overflow-hidden text-[10px] font-semibold text-ellipsis whitespace-nowrap">{a.n}</div>
                    <div className="text-[9px] text-text-dim">{a.s}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline btn-sm mt-2 w-full text-[11px]"
              onClick={() => showToast({ type: 'info', title: 'Upload', message: 'File upload dialog would open here.', duration: 2000 })}>
              + Upload
            </button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card mb-3.5">
        <div className="card-title">💬 Comments & collaboration</div>
        <div className="mb-3 flex flex-col gap-2.5">
          {/* RK comment */}
          <div className="flex gap-2.5 rounded-md bg-bg p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--ai-gradient)] text-[11px] font-bold text-white">RK</div>
            <div className="flex-1">
              <div className="mb-[3px] flex items-center justify-between">
                <div className="text-[11px] font-bold">Rajesh Kumar <span className="ml-1 font-normal text-text-dim">· Inspector</span></div>
                <div className="text-[10px] text-text-dim">07 Mar · 1:20 PM</div>
              </div>
              <div className="text-[11px] leading-[1.5] text-text-mid">Consumer was cooperative. Tamper was clearly visible — earth wire was attached directly to neutral terminal inside panel. 6 photos uploaded including close-ups. Consumer admitted installing it "due to business loss" but requested installment payment.</div>
            </div>
          </div>
          {/* RM comment */}
          <div className="flex gap-2.5 rounded-md bg-bg p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-white">RM</div>
            <div className="flex-1">
              <div className="mb-[3px] flex items-center justify-between">
                <div className="text-[11px] font-bold">Rajiv Mehta <span className="ml-1 font-normal text-text-dim">· Vigilance Officer</span></div>
                <div className="text-[10px] text-text-dim">08 Mar · 3:15 PM</div>
              </div>
              <div className="text-[11px] leading-[1.5] text-text-mid">Good work <span className="font-bold text-ai-purple">@RajeshKumar</span>. Proceeding with Section 135 notice. Given good cooperation, I'll approve 6-month installment plan if consumer applies formally. Please document the FIR promptly.</div>
            </div>
          </div>
          {/* AI comment */}
          <div className="flex gap-2.5 rounded-md border-l-[3px] border-ai-purple bg-ai-purple-light p-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ai-purple text-[11px] font-bold text-white">✦</div>
            <div className="flex-1">
              <div className="mb-[3px] flex items-center justify-between">
                <div className="text-[11px] font-bold text-ai-purple">AI Assistant</div>
                <div className="text-[10px] text-text-dim">08 Apr · 2:45 PM</div>
              </div>
              <div className="text-[11px] leading-[1.5] text-ai-purple">Consumer has filed appeal (AP-2026-018) disputing baseline methodology. I've prepared counter-arguments for the hearing on 22 Apr. Key point: consumer's own 3-year historical average (21.4 kWh/day) exceeds the disputed peer baseline (19.2 kWh/day) — their argument is self-contradictory.</div>
            </div>
          </div>
        </div>
        {/* compose */}
        <div className="flex items-start gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[image:var(--ai-gradient)] text-[11px] font-bold text-white">YO</div>
          <div className="flex-1">
            <textarea
              className="form-input box-border min-h-[60px] w-full resize-y p-2.5 text-xs"
              placeholder="Add a comment... use @name to mention others"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="mt-1.5 flex items-center justify-between">
              <div className="text-[10px] text-text-dim">Supports <strong>@mentions</strong> and <strong>markdown</strong></div>
              <button type="button" className="btn btn-ai btn-sm text-[11px]"
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
        <div className="mt-3.5 flex justify-end gap-1.5">
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

      {showReassignPanel && (
        <ReassignInspectorPanel
          caseRecord={cs}
          theftType={theftKey}
          onClose={() => setShowReassignPanel(false)}
        />
      )}
    </div>
  )
}
