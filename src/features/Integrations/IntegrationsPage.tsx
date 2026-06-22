import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'

const INTEGRATIONS = [
  { name: 'MRI File Ingestion', type: 'SFTP + FileSystem', status: 'Healthy', icon: '📥', color: 'var(--green)', lastSync: '2 min ago', recordsToday: '18,562 files', uptime: '99.98%', vendor: 'UPPCL internal', desc: 'Daily meter reading batches from all 5 DISCOMs. Auto-parsed and loaded into timeseries store.' },
  { name: 'Billing / CIS System', type: 'REST API', status: 'Healthy', icon: '💰', color: 'var(--green)', lastSync: '5 min ago', recordsToday: '1,116 consumers', uptime: '99.7%', vendor: 'Wipro RAPDRP', desc: 'Consumer master, billing history, and collection data. Hourly sync for real-time case context.' },
  { name: 'GIS / Network Map', type: 'Shapefile + WMS', status: 'Warning', icon: '🗺️', color: 'var(--amber)', lastSync: '14 days ago', recordsToday: '49 DTRs', uptime: '94.2%', vendor: 'ESRI ArcGIS', desc: 'Feeder routing, DTR location, network topology. Stale — request updated shapefile from GIS team.' },
  { name: 'Tamper Event Stream', type: 'MQTT / RTU', status: 'Healthy', icon: '⚡', color: 'var(--green)', lastSync: 'Live', recordsToday: 'Streaming', uptime: '99.9%', vendor: 'Itron / L&T', desc: 'Real-time tamper events from smart meters. Feeds alert engine and live risk score updates.' },
  { name: 'Inspector Mobile App', type: 'REST API', status: 'Healthy', icon: '📱', color: 'var(--green)', lastSync: 'Live', recordsToday: '42 syncs today', uptime: '100%', vendor: 'VidyutRaksha native', desc: 'Field inspection results, GPS, photos, and e-signatures sync back to platform in real time.' },
  { name: 'WhatsApp Notifications', type: 'Meta Cloud API', status: 'Healthy', icon: '💬', color: 'var(--green)', lastSync: '1 min ago', recordsToday: '18 messages', uptime: '99.5%', vendor: 'Meta for Business', desc: 'Consumer notice dispatch and inspector alerts via WhatsApp Business API.' },
  { name: 'Email (SMTP)', type: 'SMTP / SendGrid', status: 'Healthy', icon: '✉️', color: 'var(--green)', lastSync: '30 min ago', recordsToday: '6 reports', uptime: '99.9%', vendor: 'SendGrid', desc: 'Scheduled report delivery to officers. Digest emails and statutory filing reminders.' },
  { name: 'UPERC / CEA Reporting Portal', type: 'Portal upload', status: 'Warning', icon: '📑', color: 'var(--amber)', lastSync: 'Manual', recordsToday: 'Pending', uptime: 'N/A', vendor: 'UPERC / CEA', desc: 'Manual upload to regulatory portal. Upcoming: API integration for auto-filing. Configure credentials.' },
]

const STATUS_COLOR: Record<string, string> = { Healthy: 'var(--green)', Warning: 'var(--amber)', Error: 'var(--red)' }

export default function IntegrationsPage() {
  const { showToast } = useToast()

  const healthy = INTEGRATIONS.filter(i => i.status === 'Healthy').length
  const warning = INTEGRATIONS.filter(i => i.status === 'Warning').length

  return (
    <div className="pb-8">
      <PageHeader
        title="🔗 Integrations"
        subtitle="Connected systems, data pipelines, and third-party services"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Add integration', message: 'Integration marketplace opening…', duration: 3000 })}>
              + Add integration
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'Health check', message: 'Running full integration health check…', duration: 3500 })}>
              ✦ Health check all
            </button>
          </>
        }
      />

      <AiInsightBanner title="Integration health">
        <strong style={{ color: 'var(--green)' }}>{healthy} integrations healthy</strong>,{' '}
        <strong style={{ color: 'var(--amber)' }}>{warning} need attention</strong>.
        GIS shapefile is 14 days stale — network map clustering will degrade. Request updated file from GIS team.
        UPERC portal integration is manual — auto-filing API is available; configure credentials to automate.
      </AiInsightBanner>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((intg) => {
          const statusColor = STATUS_COLOR[intg.status]
          return (
            <div key={intg.name} className="card flex flex-col gap-0" style={{ borderTop: `3px solid ${statusColor}` }}>
              <div className="flex items-start justify-between p-[14px_16px_10px]">
                <div className="flex items-center gap-3">
                  <span className="text-[26px]">{intg.icon}</span>
                  <div>
                    <div className="text-[13px] font-bold text-text">{intg.name}</div>
                    <div className="text-[10.5px] text-text-dim">{intg.type}</div>
                  </div>
                </div>
                <span className="rounded-full px-2 py-px text-[9.5px] font-bold text-white"
                  style={{ background: statusColor }}>{intg.status}</span>
              </div>

              <div className="border-t border-border px-4 py-3">
                <p className="mb-3 text-[11px] leading-[1.5] text-text-mid">{intg.desc}</p>
                <div className="grid grid-cols-3 gap-2 text-center text-[9.5px]">
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-semibold text-text">{intg.lastSync}</div>
                    <div className="text-text-dim">Last sync</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-semibold text-text">{intg.recordsToday}</div>
                    <div className="text-text-dim">Today</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-semibold" style={{ color: intg.uptime === 'N/A' ? 'var(--text-dim)' : parseFloat(intg.uptime) >= 99 ? 'var(--green)' : 'var(--amber)' }}>
                      {intg.uptime}
                    </div>
                    <div className="text-text-dim">Uptime</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-text-dim">Vendor: {intg.vendor}</div>
              </div>

              <div className="flex gap-1.5 border-t border-border px-4 py-2.5">
                <button type="button" className="btn btn-outline btn-sm flex-1 justify-center" style={{ fontSize: '10px' }}
                  onClick={() => showToast({ type: 'info', title: intg.name, message: `Viewing configuration for ${intg.name}`, duration: 2500 })}>
                  Configure
                </button>
                <button type="button" className="btn btn-outline btn-sm flex-1 justify-center" style={{ fontSize: '10px' }}
                  onClick={() => showToast({ type: 'success', title: 'Sync triggered', message: `Manual sync started for ${intg.name}.`, duration: 3000 })}>
                  Sync now
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
