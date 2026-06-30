import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'

const ACTIVE_INSPECTORS = [
  { name: 'Rajesh Kumar', area: 'Bhelupur', cases: 3, lat: '25.3176°N', lng: '82.9739°E', lastSync: '4 min ago', battery: 82 },
  { name: 'Deepak Yadav', area: 'Aliganj', cases: 2, lat: '25.3212°N', lng: '82.9801°E', lastSync: '12 min ago', battery: 54 },
]

const PENDING_INSPECTIONS = [
  { caseId: 'C-20260301-001', meter: '1849966', consumer: 'HEERA LAL AGRAWAL', area: 'Bhelupur', assignee: 'Rajesh Kumar', scheduled: '11:30 AM', priority: 'high' },
  { caseId: 'C-20260302-R160', meter: '895160', consumer: 'MRF CENTRE NAGAR PALIKA', area: 'Fatehpur', assignee: 'Sunita Verma', scheduled: '2:00 PM', priority: 'high' },
  { caseId: 'C-20260228-014', meter: '2034871', consumer: 'R.K. ENTERPRISES', area: 'Gomti Nagar', assignee: 'Sunita Verma', scheduled: '3:30 PM', priority: 'medium' },
  { caseId: 'C-20260225-008', meter: '1567234', consumer: 'VINOD KUMAR', area: 'Alambagh', assignee: 'Amit Sharma', scheduled: '4:00 PM', priority: 'medium' },
]

export default function MobilePage() {
  const { showToast } = useToast()

  return (
    <div className="pb-2">
      <PageHeader
        title="📱 Inspector mobile app"
        subtitle="Full-featured field app — offline mode, photo capture, geo-tag, e-signature"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'App link generated', message: 'QR code and download link sent to all active inspectors.', duration: 3500 })}>
              📲 Generate app link
            </button>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'success', title: 'Sync triggered', message: '6 devices syncing. Data will be available in ~2 minutes.', duration: 3000 })}>
              🔄 Sync status
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI field assistant">
        The inspector mobile app runs on Android (min v8.0).{' '}
        <strong>Works fully offline</strong> — cases, remediation checklists, photos, and notes are cached locally
        and sync when connectivity returns. Today{' '}
        <strong>6 inspectors</strong> are in the field,{' '}
        <strong>18 inspections</strong> scheduled, and{' '}
        <strong>42 photos + 8 signatures</strong> synced so far.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Inspectors in field', value: '6', sub: 'Live GPS tracked', accent: 'var(--navy-light)', color: 'var(--text)' },
          { label: 'Pending today', value: '18', sub: "Today's schedule", accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Completed today', value: '7', sub: 'Since 9 AM', accent: 'var(--green)', color: 'var(--green)' },
          { label: 'Photos synced', value: '42', sub: 'Evidence collected', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'E-signatures', value: '8', sub: 'Consumer-signed reports', accent: '#0EA5E9', color: '#0EA5E9' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-2xl font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Live field tracker */}
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">📍 Live field tracker</div>
          <div className="space-y-3">
            {ACTIVE_INSPECTORS.map((insp) => (
              <div key={insp.name} className="rounded-xl border border-border bg-bg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: 'var(--green)' }}>
                      {insp.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-text">{insp.name}</div>
                      <div className="text-[10.5px] text-text-dim">{insp.area} area</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10.5px] font-medium text-text-mid">{insp.cases} active cases</div>
                    <div className="text-[10px] text-text-dim">Synced {insp.lastSync}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-text-dim">
                  <span>📍 {insp.lat}, {insp.lng}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-10 overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full" style={{ width: `${insp.battery}%`, background: insp.battery < 30 ? 'var(--red)' : 'var(--green)' }} />
                    </div>
                    <span>{insp.battery}%</span>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[10.5px] text-text-dim text-center">+ 4 more inspectors (offline)</p>
          </div>
        </div>

        {/* Today's inspection schedule */}
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">📋 Today's inspection schedule</div>
          <div className="space-y-2">
            {PENDING_INSPECTIONS.map((ins) => (
              <div key={ins.caseId} className="rounded-lg border border-border bg-bg p-2.5"
                style={{ borderLeft: `3px solid ${ins.priority === 'high' ? 'var(--red)' : 'var(--amber)'}` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[10.5px] font-bold" style={{ color: 'var(--id-text)' }}>{ins.caseId}</span>
                    </div>
                    <div className="text-[11.5px] font-semibold text-text">{ins.consumer}</div>
                    <div className="text-[10.5px] text-text-dim">{ins.area} · Meter #{ins.meter}</div>
                    <div className="text-[10.5px] text-text-mid mt-0.5">👤 {ins.assignee}</div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="font-mono text-[11px] font-bold text-text">{ins.scheduled}</div>
                    <button type="button" className="btn btn-outline btn-sm mt-1" style={{ fontSize: '9.5px', padding: '2px 6px' }}
                      onClick={() => showToast({ type: 'info', title: 'Dispatched', message: `${ins.assignee} notified for ${ins.caseId}`, duration: 2500 })}>
                      Dispatch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App features */}
      <div className="card mt-4">
        <div className="card-title mb-3 text-[13px] font-bold">📱 App capabilities</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '📷', title: 'Photo capture', desc: 'Geo-tagged evidence photos with timestamp' },
            { icon: '✍️', title: 'E-signature', desc: 'Consumer acknowledgment with digital sign' },
            { icon: '📴', title: 'Offline mode', desc: 'Full functionality without internet' },
            { icon: '🗺️', title: 'GPS tracking', desc: 'Live location for field team visibility' },
            { icon: '📋', title: 'Checklists', desc: 'AI-generated inspection checklists per case' },
            { icon: '⚡', title: 'Instant sync', desc: 'Real-time sync when connectivity returns' },
            { icon: '📊', title: 'Field reports', desc: 'Automatic report generation from field data' },
            { icon: '🔔', title: 'Push alerts', desc: 'New case assignments and SLA reminders' },
          ].map((feat) => (
            <div key={feat.title} className="rounded-xl border border-border bg-bg p-3">
              <div className="mb-1.5 text-2xl">{feat.icon}</div>
              <div className="text-[12px] font-semibold text-text">{feat.title}</div>
              <div className="text-[10.5px] text-text-dim">{feat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
