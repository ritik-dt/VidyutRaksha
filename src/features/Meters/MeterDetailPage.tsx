import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { SUSP_METERS, METER_THEFT_TYPES } from '@/features/Meters/data/meters'
import { ExplainabilityPanel } from './components/ExplainabilityPanel'
import { RemediationCard } from './components/RemediationCard'
import { RiskProfileTab } from './components/RiskProfileTab'
import { MeterAnalysisTab } from './components/MeterAnalysisTab'
import {
  LoadProfileTab,
  DailyConsumptionTab,
  BillingHistoryTab,
  TamperEventsTab,
  MeterInfoTab,
} from './components/MeterDetailTabs'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// Last-7-days chart data for real meters
function getLast7Data(meterId: string) {
  if (meterId === '884759') {
    return [
      { d: '02-Mar-2026', kwh: 0.0 },
      { d: '03-Mar', kwh: 14.2 },
      { d: '04-Mar', kwh: 6.8 },
      { d: '05-Mar', kwh: 1.1 },
      { d: '06-Mar', kwh: 0.0 },
      { d: '07-Mar', kwh: 18.4 },
      { d: '08-Mar-2026', kwh: 31.2 },
    ]
  }
  return [
    { d: 'Mon', kwh: 42.1 }, { d: 'Tue', kwh: 38.4 },
    { d: 'Wed', kwh: 44.2 }, { d: 'Thu', kwh: 0.0 },
    { d: 'Fri', kwh: 8.2 }, { d: 'Sat', kwh: 28.6 },
    { d: 'Sun', kwh: 22.1 },
  ]
}

const TABS = [
  { id: 'risk', label: '🎯 Risk profile' },
  { id: 'forensic', label: '🔍 Meter analysis' },
  { id: 'load', label: 'Load profile' },
  { id: 'daily', label: 'Daily consumption' },
  { id: 'billing', label: 'Billing history' },
  { id: 'events', label: 'Tamper events' },
  { id: 'info', label: 'Meter info' },
]

export default function MeterDetailPage() {
  const { meterId } = useParams<{ meterId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('risk')

  const meter = SUSP_METERS.find((m) => m.id === meterId) ?? SUSP_METERS[0]
  const theftType = METER_THEFT_TYPES[meter.id] ?? meter.theftType ?? 'Earth Loading'
  const last7 = meter._real ? getLast7Data(meter.id) : []
  const [drillDayIdx, setDrillDayIdx] = useState<number | null>(null)
  const riskColor = meter.risk >= 80 ? 'var(--red)' : meter.risk >= 60 ? 'var(--amber)' : 'var(--green)'

  return (
    <div className="pb-10">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate(getPathForScreen('meters'))}
        className="mb-4 flex items-center gap-1.5 text-[11.5px] font-semibold text-text-mid hover:text-text"
      >
        ← Back to list
      </button>

      {/* Page header */}
      <div className="page-header mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          {/* Risk badge */}
          <div>
            <div
              className="flex size-14 items-center justify-center rounded-2xl border-[3px] font-mono text-[22px] font-extrabold"
              style={{ background: `${riskColor}18`, borderColor: riskColor, color: riskColor }}
            >
              {meter.risk}
            </div>
            <div className="mt-1 text-center font-mono text-[9.5px] font-semibold text-text-dim">
              {meter.conf}%
            </div>
          </div>
          <div>
            <div className="page-title text-[20px] font-bold text-text">Meter #{meter.id}</div>
            {meter._real ? (
              <div className="page-sub mt-0.5 flex items-center gap-1.5 text-[12px]">
                <span className="font-semibold" style={{ color: 'var(--ai-purple)' }}>
                  ✓ Real MRI data loaded
                </span>
                <span className="text-text-dim">· See panel below for full consumer & forensic details</span>
              </div>
            ) : (
              <div className="page-sub mt-0.5 text-[12px] text-text-dim">
                {meter.cat} · {meter.area} · {meter.dt} · Sanctioned: {meter.sl}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={meter.status} />
          <button
            type="button"
            className="btn btn-ai"
            onClick={() => {
              showToast({
                type: 'success',
                title: 'AI case created',
                message: `Case created for Meter #${meter.id}. Assigned to nearest available inspector.`,
                duration: 4000,
              })
              navigate(getPathForScreen('cases'))
            }}
          >
            ✦ Create AI case
          </button>
        </div>
      </div>

      {/* Real MRI summary card */}
      {meter._real && (
        <div className="card mb-4" style={{ border: '2px solid var(--ai-purple)', background: 'linear-gradient(135deg,rgba(124,58,237,.04),var(--card) 40%)' }}>
          <div className="mb-3 flex items-start justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="rounded-xl px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-white"
                  style={{ background: 'var(--ai-gradient)' }}
                >
                  ✓ REAL MRI DATA
                </span>
                <span className="text-[11px] font-medium text-text-mid">
                  Account {meter._account} · {meter._zone ?? meter.area}
                </span>
              </div>
              <div className="text-[14px] font-bold text-text">{meter._consumer}</div>
              {meter._activity && (
                <div className="mt-0.5 text-[11.5px] text-text-dim">
                  {meter._activity}
                  {meter._load && ` · ${meter._load} ${meter._load_unit ?? 'kW'} sanctioned`}
                  {meter._tariff && ` · Tariff ${meter._tariff}`}
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Real MRI data',
                  message: `Meter dump from ${meter._account}, verified against KVVNL March 2026 MRI batch.`,
                  duration: 4500,
                })
              }
            >
              📋 About this data
            </button>
          </div>

          {/* KPI row */}
          <div className="kpi-row flex flex-wrap gap-3">
            {[
              { label: 'Cumulative kWh', value: '34,596', sub: 'Lifetime registered', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
              { label: 'Tamper events (lifetime)', value: meter.events.toLocaleString('en-IN'), sub: `${meter.id === '884759' ? '0' : '389'} earth-loading`, accent: 'var(--red)', color: 'var(--red)' },
              { label: 'Avg PF (60-day)', value: '0.588', sub: 'Below LT threshold', accent: 'var(--amber)', color: 'var(--amber)' },
              { label: 'Zero intervals (7D)', value: '77.9%', sub: '225 of 225 intervals', accent: '#0EA5E9', color: '#0EA5E9' },
              { label: 'Avg kWh/day (7D)', value: '21.9', sub: 'Last week trailing', accent: 'var(--green)', color: 'var(--text)' },
            ].map((k) => (
              <div
                key={k.label}
                className="kpi-card relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-3 px-4"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: k.accent }} />
                <div className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.5px] text-text-dim">{k.label}</div>
                <div className="font-mono text-[18px] font-extrabold" style={{ color: k.color }}>{k.value}</div>
                <div className="text-[9.5px] text-text-dim">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Last 7 days chart */}
          {last7.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[12px] font-bold text-text">Daily kWh — last 7 days</div>
                <div className="text-[10px] text-text-dim">Hover · click to drill</div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={last7} onClick={(p: { activeTooltipIndex?: number } | null) => {
                      if (p?.activeTooltipIndex != null) setDrillDayIdx(p.activeTooltipIndex)
                    }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="d" tick={{ fontSize: 9, fill: 'var(--text-dim)' }} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--text-dim)' }} />
                      <Tooltip formatter={(v: number) => `${v} kWh`} />
                      <Bar dataKey="kwh" radius={[3,3,0,0]} cursor="pointer">
                        {last7.map((d, i) => (
                          <Cell key={i} fill={d.kwh < 0.5 ? '#DC3545' : d.kwh < 15 ? '#E6921E' : '#7C3AED'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {last7.some((d) => d.kwh < 0.5) && (
                    <div className="mt-1 text-[10.5px] font-semibold" style={{ color: 'var(--red)' }}>
                      ● {last7.filter((d) => d.kwh < 0.5).length} zero-load day(s) detected
                    </div>
                  )}
                </div>
                {drillDayIdx != null && last7[drillDayIdx] ? (
                  <div className="rounded-xl border-2 p-3"
                    style={{ borderColor: last7[drillDayIdx].kwh < 0.5 ? 'var(--red)' : 'var(--amber)', background: 'var(--bg)' }}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="text-[11.5px] font-bold text-text">
                        {last7[drillDayIdx].kwh < 0.5 ? '⚠ ZERO CONSUMPTION' : '⬇ LOW CONSUMPTION'}
                      </div>
                      <button type="button" onClick={() => setDrillDayIdx(null)} className="text-text-dim">✕</button>
                    </div>
                    <div className="text-[10.5px] text-text-dim mb-2">{last7[drillDayIdx].d}</div>
                    <div className="font-mono text-[20px] font-extrabold mb-2" style={{ color: last7[drillDayIdx].kwh < 0.5 ? 'var(--red)' : 'var(--amber)' }}>
                      {last7[drillDayIdx].kwh} kWh
                    </div>
                    <div className="text-[10.5px] text-text-dim mb-3">
                      {last7[drillDayIdx].kwh < 0.5 ? 'Zero load — bypass suspected.' : 'Below baseline — partial bypass pattern.'}
                    </div>
                    <button type="button" className="btn btn-ai w-full" style={{ justifyContent: 'center', fontSize: '10.5px' }}
                      onClick={() => setDrillDayIdx(null)}>
                      🚩 Flag for inspector
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-xl border border-border text-[11px] text-text-dim">
                    Click a bar to drill into that day
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI flags */}
          <div className="mt-3 rounded-xl p-3 text-[11.5px]"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="mb-1.5 text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>
              ✦ AI flags from real data — {meter.flags.length} signals detected
            </div>
            {meter.flags.map((f) => (
              <div key={f} className="flex items-start gap-2 py-0.5 text-[11px] text-text">
                <div className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: 'var(--ai-purple)' }} />
                {f}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn btn-outline btn-sm" style={{ fontSize: '10.5px' }}>
              📋 Full MRI
            </button>
            <button type="button" className="btn btn-ai btn-sm" style={{ fontSize: '10.5px' }}>
              ✦ Open case
            </button>
          </div>
        </div>
      )}

      {/* AI analyst briefing */}
      <div
        className="card mb-4"
        style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.18)' }}
      >
        {meter._real ? (
          <>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>
                ✦ AI analyst briefing
              </span>
              <span
                className="rounded-full px-2 py-px text-[9px] font-bold text-white"
                style={{ background: 'var(--ai-purple)' }}
              >
                Model confidence: {meter.conf}%
              </span>
            </div>
            <p className="text-[11.5px] leading-[1.6] text-text-mid">{meter.aiNote}</p>
            <p className="mt-2 text-[11px] italic" style={{ color: 'var(--ai-purple)' }}>
              Legal basis: Section 135, Electricity Act 2003. Evidence pack ready for download.
            </p>
          </>
        ) : (
          <>
            <div className="mb-2 text-[11.5px] font-bold text-text">✦ Why AI flagged this meter</div>
            <div className="mb-3 space-y-2">
              {meter.flags.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 rounded-lg p-2 text-[11px]"
                  style={{ background: 'rgba(220,53,69,0.05)', border: '1px solid rgba(220,53,69,0.12)' }}
                >
                  <div className="mt-0.5 size-2 shrink-0 rounded-full" style={{ background: 'var(--red)' }} />
                  <span className="text-text">{f}</span>
                </div>
              ))}
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold" style={{ color: 'var(--ai-purple)' }}>
                ✦ AI analyst briefing
              </span>
              <span
                className="rounded-full px-2 py-px text-[9px] font-bold text-white"
                style={{ background: 'var(--ai-purple)' }}
              >
                Model confidence: {meter.conf}%
              </span>
            </div>
            <p className="text-[11.5px] leading-[1.6] text-text-mid">
              {meter.aiNote}
              <br /><br />
              I've been tracking this meter for <strong>3 months</strong>. The evidence has been strengthening
              each cycle. Based on similar cases in your network, there is a{' '}
              <strong>{meter.conf}% probability</strong> this is genuine theft. If confirmed, estimated
              recoverable energy is <strong>~3,200 kWh</strong> (₹16,000 at current tariff).
              <br /><br />
              <em style={{ color: 'var(--ai-purple)' }}>
                Legal basis: Section 135, Electricity Act 2003. Evidence pack ready for download.
              </em>
            </p>
          </>
        )}
      </div>

      {/* Remediation card */}
      <RemediationCard theftType={theftType} meterId={meter.id} />

      {/* Explainability panel */}
      <ExplainabilityPanel meter={meter} />

      {/* Tabs */}
      <div className="tabs mb-4 flex overflow-x-auto rounded-xl border border-border bg-bg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-lg px-4 py-2 text-[11.5px] font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-dim)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'risk' && <RiskProfileTab meter={meter} />}
      {activeTab === 'forensic' && <MeterAnalysisTab meter={meter} />}
      {activeTab === 'load' && <LoadProfileTab meter={meter} />}
      {activeTab === 'daily' && <DailyConsumptionTab meter={meter} />}
      {activeTab === 'billing' && <BillingHistoryTab meter={meter} />}
      {activeTab === 'events' && <TamperEventsTab meter={meter} />}
      {activeTab === 'info' && <MeterInfoTab meter={meter} />}
    </div>
  )
}
