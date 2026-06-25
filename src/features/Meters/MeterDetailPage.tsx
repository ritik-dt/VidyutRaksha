import { useState, Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusBadge } from '@/shared/components/ui/StatusBadge'
import { SUSP_METERS, METER_THEFT_TYPES } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'
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
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Dot,
} from 'recharts'

// Tamper event colors, matching the prototype's stacked year-bar legend
const TAMPER_TYPE_COLORS: Record<string, string> = {
  earth: '#DC3545',
  pf: '#E6921E',
  neutral: '#7C3AED',
}
const TAMPER_TYPE_LABELS: Record<string, string> = {
  earth: 'Earth Loading',
  pf: 'Power Failure',
  neutral: 'Neutral Disturbance',
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
  const realData = REAL_METER_DATA[meter.id]
  const [drillDayIdx, setDrillDayIdx] = useState<number | null>(null)
  const [drillYear, setDrillYear] = useState<string | null>(null)
  const riskColor = meter.risk >= 80 ? 'var(--red)' : meter.risk >= 60 ? 'var(--amber)' : 'var(--green)'

  // Derived forensic KPIs (computed from the real 61-day load survey, same formulas the prototype uses)
  const daily = realData?.daily ?? []
  const avgPf60 = daily.length >= 60
    ? (daily.slice(0, 60).reduce((s, d) => s + d.pf, 0) / 60).toFixed(3)
    : null
  const avgKwhDay = daily.length
    ? (daily.reduce((s, d) => s + d.kwh, 0) / daily.length).toFixed(1)
    : null
  const avgZeroPct = daily.length
    ? (daily.reduce((s, d) => s + d.zero_pct, 0) / daily.length).toFixed(1)
    : null
  const zeroKwhDays = daily.filter((d) => d.kwh < 0.5)
  const yearRows = realData ? Object.entries(realData.year_stats) : []
  const totalEarthLoading = yearRows.reduce((s, [, y]) => s + y.earth, 0)
  const peakYear = yearRows.reduce<{ year: string; total: number } | null>((best, [year, y]) => {
    const total = y.earth + y.pf + y.neutral
    return !best || total > best.total ? { year, total } : best
  }, null)

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
      {meter._real && realData && (
        <div className="card mb-4" style={{ border: '2px solid var(--ai-purple)', background: 'linear-gradient(135deg,rgba(124,58,237,.04),var(--card) 40%)' }}>
          <div className="mb-3 flex items-start justify-between">
            <span
              className="rounded-xl px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-white"
              style={{ background: 'var(--ai-gradient)' }}
            >
              ✓ REAL MRI DATA
            </span>
            <div className="flex-1 px-3 text-[11px] font-medium text-text-mid">
              Source: Meter #{meter.id} dump dated {realData.summary.visit_date}
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm shrink-0"
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Real MRI data',
                  message: `Meter dump from ${realData.summary.mri_date}, verified against KVVNL March 2026 MRI batch.`,
                  duration: 4500,
                })
              }
            >
              📋 About this data
            </button>
          </div>

          <div className="mb-1 text-[13px] font-bold text-text">
            Forensic snapshot from actual meter — {daily.length} days of half-hour load survey + {realData.summary.tamper_count} tamper events extracted
          </div>
          <div className="mb-4 text-[11.5px] text-text-dim">
            {realData.summary.meter_make} · Cat {realData.summary.category} · Mfg {realData.summary.year_mfg} · Rated {realData.summary.current_rating}
          </div>

          {/* KPI row */}
          <div className="kpi-row mb-4 flex flex-wrap gap-3">
            {[
              { label: 'Cumulative kWh', value: realData.summary.cumul_kwh, sub: 'Lifetime registered', accent: 'var(--ai-purple)', color: 'var(--ai-purple)' },
              { label: 'Tamper events (lifetime)', value: realData.summary.tamper_count, sub: `${totalEarthLoading} earth-loading`, accent: 'var(--red)', color: 'var(--red)' },
              { label: 'Avg PF (60-day)', value: avgPf60 ?? '—', sub: avgPf60 && parseFloat(avgPf60) >= 0.85 ? 'Acceptable' : 'Below LT threshold', accent: avgPf60 && parseFloat(avgPf60) >= 0.85 ? 'var(--green)' : 'var(--amber)', color: avgPf60 && parseFloat(avgPf60) >= 0.85 ? 'var(--green)' : 'var(--amber)' },
              { label: 'Zero-load intervals', value: `${avgZeroPct}%`, sub: `Of last ${daily.length} days${avgZeroPct && parseFloat(avgZeroPct) >= 15 ? ' · ⚠ flag' : ''}`, accent: 'var(--red)', color: 'var(--red)' },
              { label: 'Avg kWh/day', value: avgKwhDay ?? '—', sub: `Last ${daily.length} days`, accent: '#0EA5E9', color: 'var(--text)' },
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

          {/* Daily kWh (61 days) + Tamper events by year */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Daily kWh line chart */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[12.5px] font-bold text-text">Daily kWh — last {daily.length} days (real load survey)</div>
                <div className="text-[10px] text-text-dim">Hover for details · click any day to drill</div>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart
                  data={daily}
                  onClick={(p: { activeTooltipIndex?: number } | null) => {
                    if (p?.activeTooltipIndex != null) setDrillDayIdx(p.activeTooltipIndex)
                  }}
                >
                  <XAxis dataKey="date" tick={false} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip
                    formatter={(v: number) => `${v} kWh`}
                    labelFormatter={(l: string) => l}
                  />
                  <Line
                    type="monotone"
                    dataKey="kwh"
                    stroke="var(--ai-purple)"
                    strokeWidth={1.75}
                    dot={(props: any) => {
                      const isZero = props.payload.kwh < 0.5
                      return isZero ? (
                        <Dot key={props.key} cx={props.cx} cy={props.cy} r={4} fill="var(--red)" stroke="none" />
                      ) : (
                        <Fragment key={props.key} />
                      )
                    }}
                    activeDot={{ r: 4, fill: 'var(--ai-purple)' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-1 text-[10.5px]" style={{ color: 'var(--red)' }}>
                ● Red dots = zero-consumption days ({zeroKwhDays.length} of {daily.length})
              </div>
              <p className="mt-2 text-[11px] leading-[1.6] text-text-mid">
                Daily totals show <strong>{avgZeroPct}% of intervals at zero kWh</strong>. Actual avg{' '}
                <strong>{avgKwhDay} kWh/day</strong> vs peer group baseline ~19.2 kWh/day = 29% deficit.
              </p>
              {drillDayIdx != null && daily[drillDayIdx] && (
                <div
                  className="mt-2 rounded-xl border-2 p-3"
                  style={{ borderColor: daily[drillDayIdx].kwh < 0.5 ? 'var(--red)' : 'var(--amber)', background: 'var(--bg)' }}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-[11.5px] font-bold text-text">
                      {daily[drillDayIdx].kwh < 0.5 ? '⚠ ZERO CONSUMPTION' : 'Daily detail'}
                    </div>
                    <button type="button" onClick={() => setDrillDayIdx(null)} className="text-text-dim">✕</button>
                  </div>
                  <div className="mb-2 text-[10.5px] text-text-dim">{daily[drillDayIdx].date}</div>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                    <div>kWh: <strong>{daily[drillDayIdx].kwh}</strong></div>
                    <div>kVAh: <strong>{daily[drillDayIdx].kvah}</strong></div>
                    <div>PF: <strong>{daily[drillDayIdx].pf}</strong></div>
                    <div>Zero%: <strong>{daily[drillDayIdx].zero_pct}%</strong></div>
                    <div>Volt min: <strong>{daily[drillDayIdx].volt_min}V</strong></div>
                    <div>Volt max: <strong>{daily[drillDayIdx].volt_max}V</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Tamper events by year — stacked horizontal bars */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[12.5px] font-bold text-text">Tamper events by year — when did the theft start?</div>
                <div className="text-[10px] text-text-dim">Hover for counts · click any year to drill</div>
              </div>
              <div className="space-y-2">
                {yearRows.map(([year, y]) => {
                  const total = y.earth + y.pf + y.neutral
                  const maxTotal = Math.max(...yearRows.map(([, yy]) => yy.earth + yy.pf + yy.neutral), 1)
                  return (
                    <button
                      type="button"
                      key={year}
                      onClick={() => setDrillYear(year)}
                      className="flex w-full items-center gap-2 text-left"
                    >
                      <span className="w-9 shrink-0 text-[11px] font-semibold text-text-mid">{year}</span>
                      <div className="h-5 flex-1 overflow-hidden rounded-md bg-border-light">
                        <div className="flex h-full" style={{ width: `${(total / maxTotal) * 100}%` }}>
                          {(['earth', 'pf', 'neutral'] as const).map((k) =>
                            y[k] > 0 ? (
                              <div
                                key={k}
                                style={{ background: TAMPER_TYPE_COLORS[k], width: `${(y[k] / total) * 100}%` }}
                              />
                            ) : null,
                          )}
                        </div>
                      </div>
                      <span className="w-9 shrink-0 text-right text-[11px] font-bold text-text">{total}</span>
                      <span className="text-text-dim">›</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-text-dim">
                {(['earth', 'pf', 'neutral'] as const).map((k) => (
                  <span key={k} className="flex items-center gap-1">
                    <span className="inline-block size-2 rounded-sm" style={{ background: TAMPER_TYPE_COLORS[k] }} />
                    {TAMPER_TYPE_LABELS[k]}
                  </span>
                ))}
              </div>
              {peakYear && (
                <p className="mt-2 text-[11px] leading-[1.6]" style={{ color: 'var(--red)' }}>
                  <strong>{peakYear.year} spike</strong> ({realData.year_stats[peakYear.year].earth} earth-loading + {realData.year_stats[peakYear.year].neutral} neutral disturbance) is when this AI flags the theft as having begun. Pattern matches the assessment notice.
                </p>
              )}
              {drillYear && realData.year_stats[drillYear] && (
                <div className="mt-2 rounded-xl border-2 p-3" style={{ borderColor: 'var(--ai-purple)', background: 'var(--bg)' }}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-[11.5px] font-bold text-text">{drillYear} breakdown</div>
                    <button type="button" onClick={() => setDrillYear(null)} className="text-text-dim">✕</button>
                  </div>
                  {(['earth', 'pf', 'neutral'] as const).map((k) => (
                    <div key={k} className="flex items-center justify-between text-[11px] py-0.5">
                      <span className="flex items-center gap-1.5 text-text-mid">
                        <span className="inline-block size-2 rounded-sm" style={{ background: TAMPER_TYPE_COLORS[k] }} />
                        {TAMPER_TYPE_LABELS[k]}
                      </span>
                      <strong>{realData.year_stats[drillYear][k]}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Forensic note */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3">
            <p className="text-[11px] leading-[1.6] text-text-mid">
              <strong className="text-text">Forensic note:</strong> {realData.summary.tamper_count} lifetime tamper events
              with full RTC timestamps, kWh registers, V/I/PF values are recorded. Click any year above to drill into
              specific events, or open the dedicated tab below.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm shrink-0"
              onClick={() => setActiveTab('events')}
            >
              📋 View all events tab →
            </button>
          </div>
        </div>
      )}

      {/* Fallback simpler real-data card for other _real meters without the full forensic dataset */}
      {meter._real && !realData && (
        <div className="card mb-4" style={{ border: '2px solid var(--ai-purple)', background: 'linear-gradient(135deg,rgba(124,58,237,.04),var(--card) 40%)' }}>
          <div className="mb-3 flex items-center gap-2">
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
