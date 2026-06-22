import { useState } from 'react'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { useToast } from '@/shared/context/ToastContext'

interface DQSource {
  name: string
  type: string
  status: 'Healthy' | 'Warning' | 'Error'
  icon: string
  coverage: number
  missing: number
  delay: number
  lastRun: string
  records: string
}

const SOURCES: DQSource[] = [
  { name: 'MRI daily batch', type: 'File / SFTP', status: 'Healthy', icon: '📥', coverage: 98.7, missing: 14, delay: 0, lastRun: '06:58 IST', records: '18,562' },
  { name: 'Billing / CIS sync', type: 'REST API', status: 'Healthy', icon: '💰', coverage: 99.2, missing: 9, delay: 2, lastRun: '07:00 IST', records: '1,116' },
  { name: 'GIS feeder map', type: 'Shapefile', status: 'Warning', icon: '🗺️', coverage: 84.0, missing: 186, delay: 14, lastRun: '2 days ago', records: '49 DTRs' },
  { name: 'Tamper event stream', type: 'MQTT / RTU', status: 'Healthy', icon: '⚡', coverage: 97.4, missing: 29, delay: 0, lastRun: 'Live', records: 'Streaming' },
  { name: 'Inspector GPS', type: 'Mobile API', status: 'Healthy', icon: '📍', coverage: 100.0, missing: 0, delay: 0, lastRun: 'Live', records: '6 active' },
  { name: 'Meter inventory', type: 'CSV', status: 'Warning', icon: '📋', coverage: 91.3, missing: 97, delay: 30, lastRun: '30 days ago', records: '1,116' },
]

const ANOMALIES = [
  { meter: '1849966', issue: 'Zero kWh for 3+ consecutive days', severity: 'critical', count: 14 },
  { meter: '885838', issue: 'Power factor below 0.5 threshold', severity: 'high', count: 8 },
  { meter: '2034871', issue: 'Timestamp gap > 6 hours', severity: 'medium', count: 22 },
  { meter: '1923445', issue: 'MD value missing (null)', severity: 'medium', count: 5 },
  { meter: 'Multiple', issue: 'GIS coordinates missing', severity: 'low', count: 186 },
]

const STATUS_COLOR = { Healthy: 'var(--green)', Warning: 'var(--amber)', Error: 'var(--red)' }
const SEV_COLOR: Record<string, string> = { critical: 'var(--red)', high: 'var(--amber)', medium: '#0EA5E9', low: 'var(--text-dim)' }

export default function DataQualityPage() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'sources' | 'anomalies' | 'completeness'>('sources')

  const healthyCount = SOURCES.filter(s => s.status === 'Healthy').length
  const warnCount = SOURCES.filter(s => s.status === 'Warning').length
  const overallHealth = Math.round((healthyCount / SOURCES.length) * 100)

  return (
    <div className="pb-8">
      <PageHeader
        title="📡 Data quality monitoring"
        subtitle="Real-time health of MRI ingestion pipeline, meter communication, and data completeness"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => showToast({ type: 'info', title: 'Alert config', message: 'Opening data quality alert configuration…', duration: 3000 })}>
              ⚙️ Configure alerts
            </button>
            <button type="button" className="btn btn-ai btn-sm"
              onClick={() => showToast({ type: 'ai', title: 'AI diagnostic', message: 'Running full data quality diagnostic scan…', duration: 3500 })}>
              ✦ AI diagnostic
            </button>
          </>
        }
      />

      <AiInsightBanner title="AI data quality assessment">
        Overall pipeline health: <strong style={{ color: overallHealth >= 90 ? 'var(--green)' : 'var(--amber)' }}>{overallHealth}%</strong>.
        MRI ingestion and billing sync are healthy. <strong style={{ color: 'var(--amber)' }}>GIS feeder map is stale (14 days)</strong> —
        this affects network-map clustering accuracy. Meter inventory CSV is 30 days old; request updated extract from MDM.
        <strong> {ANOMALIES.reduce((s, a) => s + a.count, 0)} data anomalies</strong> detected across {ANOMALIES.length} categories.
      </AiInsightBanner>

      {/* KPIs */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Overall health', value: `${overallHealth}%`, sub: `${healthyCount}/${SOURCES.length} sources healthy`, accent: overallHealth >= 90 ? 'var(--green)' : 'var(--amber)', color: overallHealth >= 90 ? 'var(--green)' : 'var(--amber)' },
          { label: 'Sources warning', value: String(warnCount), sub: 'Need attention', accent: 'var(--amber)', color: 'var(--amber)' },
          { label: 'Missing records', value: String(SOURCES.reduce((s, src) => s + src.missing, 0)), sub: 'Across all pipelines', accent: 'var(--red)', color: 'var(--red)' },
          { label: 'Data anomalies', value: String(ANOMALIES.reduce((s, a) => s + a.count, 0)), sub: 'Flagged for review', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
          { label: 'Last full batch', value: '07:00 IST', sub: 'Today · on schedule', accent: 'var(--green)', color: 'var(--text)' },
        ].map((k) => (
          <div key={k.label} className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px]">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
            <div className="font-mono text-[22px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs mb-4 flex gap-0.5 overflow-x-auto rounded-xl border border-border bg-bg p-1">
        {[
          { id: 'sources' as const, label: '📥 Data sources' },
          { id: 'anomalies' as const, label: '⚠ Anomalies' },
          { id: 'completeness' as const, label: '📊 Completeness' },
        ].map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-[11.5px] font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-dim)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SOURCES.map((src) => {
            const statusColor = STATUS_COLOR[src.status]
            return (
              <div key={src.name} className="card" style={{ borderTop: `3px solid ${statusColor}` }}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[22px]">{src.icon}</span>
                    <div>
                      <div className="text-[12.5px] font-bold text-text">{src.name}</div>
                      <div className="text-[10.5px] text-text-dim">{src.type}</div>
                    </div>
                  </div>
                  <span className="rounded-full px-2 py-px text-[9.5px] font-bold text-white"
                    style={{ background: statusColor }}>{src.status}</span>
                </div>

                {/* Coverage bar */}
                <div className="mb-3">
                  <div className="mb-1 flex justify-between text-[10.5px]">
                    <span className="text-text-dim">Coverage</span>
                    <span className="font-mono font-bold" style={{ color: src.coverage >= 95 ? 'var(--green)' : 'var(--amber)' }}>
                      {src.coverage}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full"
                      style={{ width: `${src.coverage}%`, background: src.coverage >= 95 ? 'var(--green)' : 'var(--amber)' }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-mono font-bold text-text">{src.records}</div>
                    <div className="text-text-dim">Records</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-mono font-bold" style={{ color: src.missing > 0 ? 'var(--amber)' : 'var(--green)' }}>{src.missing}</div>
                    <div className="text-text-dim">Missing</div>
                  </div>
                  <div className="rounded-md bg-bg p-1.5">
                    <div className="font-mono font-bold" style={{ color: src.delay > 7 ? 'var(--red)' : src.delay > 0 ? 'var(--amber)' : 'var(--green)' }}>
                      {src.delay > 0 ? `${src.delay}d` : 'Live'}
                    </div>
                    <div className="text-text-dim">Lag</div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-text-dim">Last run: {src.lastRun}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">Data anomalies detected</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr className="table-header">
                  <th>Severity</th><th>Meter / Entity</th><th>Issue</th><th>Count</th><th></th>
                </tr>
              </thead>
              <tbody>
                {ANOMALIES.map((a) => (
                  <tr key={a.meter + a.issue} className="table-row">
                    <td>
                      <span className="rounded-full border px-2 py-px text-[10px] font-bold capitalize"
                        style={{ color: SEV_COLOR[a.severity], borderColor: `${SEV_COLOR[a.severity]}40`, background: `${SEV_COLOR[a.severity]}12` }}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="font-mono font-bold" style={{ color: 'var(--id-text)' }}>{a.meter}</td>
                    <td className="text-[11.5px] text-text">{a.issue}</td>
                    <td className="font-mono font-bold text-center">{a.count}</td>
                    <td>
                      <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10px' }}
                        onClick={() => showToast({ type: 'info', title: 'Anomaly detail', message: `Reviewing ${a.count} records for: ${a.issue}`, duration: 3000 })}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Completeness Tab */}
      {activeTab === 'completeness' && (
        <div className="card">
          <div className="card-title mb-3 text-[13px] font-bold">Field completeness — consumer master records</div>
          {[
            { field: 'Meter number', pct: 100 },
            { field: 'Account number', pct: 100 },
            { field: 'Consumer name', pct: 99.8 },
            { field: 'Address', pct: 97.2 },
            { field: 'GPS coordinates', pct: 84.0 },
            { field: 'Activity type', pct: 91.3 },
            { field: 'Tariff category', pct: 98.6 },
            { field: 'Contract load', pct: 95.4 },
            { field: 'Email / mobile', pct: 62.1 },
            { field: 'Aadhaar linkage', pct: 44.7 },
          ].map((row) => (
            <div key={row.field} className="mb-2 flex items-center gap-3">
              <div className="w-36 shrink-0 text-[11.5px] text-text">{row.field}</div>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, background: row.pct >= 95 ? 'var(--green)' : row.pct >= 80 ? 'var(--amber)' : 'var(--red)' }} />
                </div>
              </div>
              <div className="w-12 text-right font-mono text-[11px] font-bold"
                style={{ color: row.pct >= 95 ? 'var(--green)' : row.pct >= 80 ? 'var(--amber)' : 'var(--red)' }}>
                {row.pct}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
