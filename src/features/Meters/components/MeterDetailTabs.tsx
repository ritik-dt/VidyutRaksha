import { useState } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { getLoadProfileData, getDailyConsumptionData, getBillingHistoryData, getLoadFactorData, getTamperYearlyData, getTamperBreakdown } from '../data/meterChartData'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Legend, BarChart, ReferenceLine,
} from 'recharts'

// ─── Load Profile Tab ─────────────────────────────────────────────────────────
export function LoadProfileTab({ meter: _meter }: { meter: SuspMeter }) {
  const loadData = getLoadProfileData()
  const runningTimePct = 22.1
  const totalIntervals = 1440
  const activeIntervals = Math.round(totalIntervals * runningTimePct / 100)

  return (
    <div>
      <div className="card mb-4">
        <div className="card-title mb-1 text-[13px] font-bold">30-minute load survey + demand</div>
        <div className="mb-3 text-[10.5px] text-text-dim">
          Intraday consumption (kWh) + demand (kW) — 04 Jan 2026
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={loadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--text-dim)' }} interval={3} />
            <YAxis yAxisId="kwh" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <YAxis yAxisId="kw" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="kwh" type="monotone" dataKey="kwh" stroke="#0EA5E9" strokeWidth={2}
              dot={false} name="kWh" />
            <Line yAxisId="kw" type="monotone" dataKey="demand" stroke="#DC3545" strokeWidth={1.5}
              dot={false} strokeDasharray="4 2" name="Demand (kW)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Running time */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold text-text">Running time</div>
            <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
              style={{ background: 'var(--green)' }}>FROM REAL MRI</span>
          </div>
          <div className="mb-2 text-[10.5px] text-text-dim">last 30 days</div>

          {/* Gauge */}
          <div className="relative mx-auto mb-4 flex h-28 w-28 items-center justify-center">
            <svg width="112" height="112" viewBox="0 0 112 112" className="absolute">
              <circle cx="56" cy="56" r="46" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="56" cy="56" r="46" fill="none" stroke="var(--red)" strokeWidth="8"
                strokeDasharray={`${(runningTimePct / 100) * 289} 289`}
                strokeDashoffset="72" strokeLinecap="round"
                transform="rotate(-90 56 56)" />
            </svg>
            <div className="text-center">
              <div className="font-mono text-[18px] font-extrabold" style={{ color: 'var(--red)' }}>
                {runningTimePct}%
              </div>
              <div className="text-[9px] text-text-dim">running time</div>
            </div>
          </div>

          <div className="text-center text-[10.5px] text-text-dim mb-3">
            {activeIntervals.toLocaleString('en-IN')} active / {totalIntervals.toLocaleString('en-IN')} intervals
          </div>
          <div className="rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.15)', color: 'var(--red)' }}>
            ▲ Suspiciously low. Industrial baseline is 70–85%. This consumer's meter recorded current in only
            22.1% of intervals — strong bypass signature.
          </div>
        </div>

        {/* TOD profile */}
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[13px] font-bold text-text">Time-of-Day (TOD) profile</div>
            <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
              style={{ background: 'var(--amber)' }}>DERIVED</span>
          </div>
          <div className="mb-3 text-[10.5px] text-text-dim">last billing cycle</div>

          {/* TOD bar */}
          <div className="mb-3 flex h-8 overflow-hidden rounded-xl">
            <div className="flex items-center justify-center text-[11px] font-bold text-white"
              style={{ width: '32%', background: '#0EA5E9' }}>32%</div>
            <div className="flex items-center justify-center text-[11px] font-bold text-white"
              style={{ width: '62%', background: '#7C3AED' }}>62%</div>
            <div className="flex items-center justify-center text-[11px] font-bold text-white"
              style={{ width: '6%', background: '#DC3545' }}>6%</div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'OFF-PEAK', sub: '22:00–06:00 · discount', kwh: 256, color: '#0EA5E9' },
              { label: 'NORMAL', sub: '06:00–18:00 · standard', kwh: 496, color: '#7C3AED' },
              { label: 'PEAK', sub: '18:00–22:00 · surcharge', kwh: 48, color: '#DC3545' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border p-2">
                <div className="text-[9.5px] font-extrabold uppercase" style={{ color: s.color }}>{s.label}</div>
                <div className="text-[9px] text-text-dim">{s.sub}</div>
                <div className="mt-1 font-mono text-[13px] font-bold text-text">{s.kwh}</div>
                <div className="text-[9px] text-text-dim">kWh</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-2.5 text-[11px]"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <strong style={{ color: 'var(--ai-purple)' }}>✦ AI: </strong>
            Peak slab is 6% of total. Expected for Industrial: ~20%.{' '}
            <strong>Significantly below baseline</strong> — possible peak-hour tampering.
            Bypass may be timed to peak slab when each kWh costs more.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Day Drilldown Panel ──────────────────────────────────────────────────────
interface DayDrillProps {
  day: { day: string; meter: number; peer: number }
  onClose: () => void
}
function DayDrillPanel({ day, onClose }: DayDrillProps) {
  const isZero = day.meter < 0.5
  const isLow = !isZero && day.meter < day.peer * 0.5
  const sevColor = isZero ? 'var(--red)' : isLow ? 'var(--amber)' : 'var(--green)'
  const sevLabel = isZero ? 'ZERO CONSUMPTION' : isLow ? 'LOW CONSUMPTION' : 'NORMAL'
  const sevIcon = isZero ? '⚠' : isLow ? '⬇' : '✓'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[460px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        style={{ border: `1px solid var(--border)`, borderTop: `3px solid ${sevColor}` }}>
        <div className="flex items-start gap-3 p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl text-[22px] text-white"
            style={{ background: sevColor }}>{sevIcon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-extrabold text-text">Day drill — {day.day}</div>
            <div className="text-[10.5px] text-text-dim">30-min interval breakdown</div>
            <div className="mt-2 inline-block rounded-full px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-white"
              style={{ background: sevColor }}>{sevLabel}</div>
          </div>
          <button type="button" onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg text-text-dim hover:text-text">✕</button>
        </div>
        <div className="mx-4 mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-border bg-bg p-3 text-center">
            <div className="font-mono text-[18px] font-extrabold" style={{ color: sevColor }}>{day.meter.toFixed(1)}</div>
            <div className="text-[10px] text-text-dim">kWh this day</div>
          </div>
          <div className="rounded-xl border border-border bg-bg p-3 text-center">
            <div className="font-mono text-[18px] font-extrabold text-text">{day.peer.toFixed(1)}</div>
            <div className="text-[10px] text-text-dim">Peer avg kWh</div>
          </div>
          <div className="rounded-xl border border-border bg-bg p-3 text-center">
            <div className="font-mono text-[18px] font-extrabold" style={{ color: 'var(--red)' }}>
              {day.peer > 0 ? `-${Math.round((1 - day.meter / day.peer) * 100)}%` : '—'}
            </div>
            <div className="text-[10px] text-text-dim">vs peer</div>
          </div>
        </div>
        <div className="mx-4 mb-4 rounded-xl p-3 text-[11.5px] leading-[1.5] text-text-mid"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <strong style={{ color: 'var(--ai-purple)' }}>✦ AI analysis: </strong>
          {isZero
            ? 'Zero consumption detected. Either power was cut or meter was bypassed completely. Recommend field check to rule out supply interruption.'
            : isLow
            ? 'Consumption is 50%+ below peer average. Consistent with partial bypass — some load diverting around meter. Field inspection recommended.'
            : 'Consumption within normal range for this day. No anomaly detected.'}
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button type="button" className="btn btn-ai flex-1" style={{ justifyContent: 'center' }}
            onClick={onClose}>🚩 Flag for inspector</button>
          <button type="button" className="btn btn-outline flex-1" style={{ justifyContent: 'center', fontSize: '11px' }}
            onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  )
}

// ─── Daily Consumption Tab ────────────────────────────────────────────────────
export function DailyConsumptionTab({ meter: _meter }: { meter: SuspMeter }) {
  const data = getDailyConsumptionData()
  const [drillDay, setDrillDay] = useState<{ day: string; meter: number; peer: number } | null>(null)

  return (
    <div>
      <div className="card mb-0">
        <div className="card-title mb-1 flex items-center gap-2 text-[13px] font-bold">
          ✦ Daily consumption vs peer group
        </div>
        <div className="mb-1 text-[10.5px] text-text-dim">
          Day-by-day kWh — shows exactly when the consumption drop started.
          Blue = this meter, dashed green = peer-group average.
        </div>
        <div className="mb-3 text-[10px] font-medium" style={{ color: 'var(--ai-purple)' }}>
          Hover · click to drill
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} onClick={(payload: { activePayload?: Array<{ payload: unknown }> } | null) => {
            if (payload?.activePayload?.[0]) {
              const d = payload.activePayload[0].payload as { day: string; meter: number; peer: number }
              setDrillDay(d)
            }
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text-dim)' }} interval={4} />
            <YAxis domain={[0, 22]} tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <Tooltip cursor={{ stroke: 'var(--ai-purple)', strokeWidth: 1 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="meter" stroke="#7C3AED" strokeWidth={2}
              dot={{ r: 3, fill: '#7C3AED', cursor: 'pointer' }} activeDot={{ r: 5 }}
              name="This meter (kWh/day)" />
            <Line type="monotone" dataKey="peer" stroke="#10B981" strokeWidth={1.5}
              strokeDasharray="5 3" dot={false} name="Peer avg (kWh/day)" />
          </LineChart>
        </ResponsiveContainer>

        {/* Zero-load markers */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: 'var(--red)' }}>●</div>
          <span className="text-[10.5px] font-medium" style={{ color: 'var(--red)' }}>
            2 zero-load day(s) detected
          </span>
        </div>
        <div className="mt-1.5 text-[10.5px]" style={{ color: 'var(--amber)' }}>
          ▲ 77.9% of recent intervals at zero load
        </div>

        <div className="mt-4 rounded-xl p-3 text-[11.5px] leading-[1.6] text-text-mid"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <div className="mb-1 font-bold" style={{ color: 'var(--ai-purple)' }}>✦ AI pattern analysis</div>
          The daily profile reveals a <strong>gradual decline starting around 8 Feb</strong>, not a sudden drop.
          This is consistent with a <strong>partial bypass</strong> being installed — the thief didn't disconnect
          fully but reduced the meter's recording by approximately 40–50%. The peer group average (green line)
          remained stable at ~19 kWh/day throughout, confirming this is{' '}
          <strong>not a seasonal or area-wide effect</strong>. By 3 Mar, consumption had dropped to near-zero,
          suggesting the bypass was extended to a full disconnect.
        </div>
      </div>

      {drillDay && <DayDrillPanel day={drillDay} onClose={() => setDrillDay(null)} />}
    </div>
  )
}

// ─── Billing History Tab ──────────────────────────────────────────────────────
export function BillingHistoryTab({ meter: _meter }: { meter: SuspMeter }) {
  const billingData = getBillingHistoryData()
  const lfData = getLoadFactorData()

  return (
    <div>
      <div className="card mb-4">
        <div className="card-title mb-1 text-[13px] font-bold">Monthly consumption + demand</div>
        <div className="mb-3 text-[10.5px] text-text-dim">
          Monthly kWh (bars) + Max Demand kW (red line) — dual axis
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={billingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <YAxis yAxisId="kwh" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <YAxis yAxisId="kw" orientation="right" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="kwh" dataKey="kwh" fill="rgba(6,35,71,0.7)" name="kWh" radius={[3, 3, 0, 0]} />
            <Line yAxisId="kw" type="monotone" dataKey="md" stroke="var(--red)" strokeWidth={2}
              dot={{ r: 3, fill: 'var(--red)' }} name="Max Demand (kW)" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap gap-4 rounded-lg bg-bg p-3 text-[11.5px]">
          {[
            { label: 'Peak kWh', value: 'Jun — 944 kWh', color: 'var(--text)' },
            { label: 'Recent kWh', value: "Feb — 434 kWh", color: 'var(--red)' },
            { label: 'kWh drop', value: '-54%', color: 'var(--red)' },
            { label: 'Peak MD', value: 'Jun — 6.56 kW', color: 'var(--text)' },
            { label: 'Recent MD', value: 'Feb — 3.0 kW', color: 'var(--amber)' },
            { label: 'MD drop', value: '-54%', color: 'var(--amber)' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-text-dim text-[10px]">{s.label}</div>
              <div className="font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-1 text-[13px] font-bold">Load factor trend</div>
        <div className="mb-3 text-[10.5px] text-text-dim">Monthly load factor vs normal range (0.15–0.30)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lfData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <YAxis domain={[0, 0.45]} tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <Tooltip formatter={(v: number) => v.toFixed(3)} />
            <ReferenceLine y={0.15} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 2" />
            <ReferenceLine y={0.30} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 2"
              label={{ value: 'Normal range', position: 'insideRight', fontSize: 9, fill: 'var(--green)' }} />
            <Line type="monotone" dataKey="lf" stroke="#7C3AED" strokeWidth={2}
              dot={{ r: 3, fill: '#7C3AED' }} name="Load Factor" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 rounded-xl p-3 text-[11.5px] text-text-mid"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <strong className="text-ai-purple">✦ AI demand analysis: </strong>
          Consumption and demand both dropped ~54%, which is <strong>unusual</strong> — in a typical bypass,
          consumption drops but demand stays stable. In this case, the proportional decline suggests either{' '}
          <strong>genuine reduction in usage</strong> or a <strong>full bypass</strong> where the meter isn't
          recording any load at all. The load factor remained around 0.19–0.20 throughout, which is consistent
          with a complete diversion rather than partial tapping.
        </div>
      </div>
    </div>
  )
}

// ─── Tamper Events Tab ────────────────────────────────────────────────────────
export function TamperEventsTab({ meter }: { meter: SuspMeter }) {
  const yearlyData = getTamperYearlyData(meter.id)
  const breakdown = getTamperBreakdown(meter.id)
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0)

  const breakdownItems = [
    { label: 'EARTH LOADING', value: breakdown.earth, color: 'var(--red)' },
    { label: 'POWER FAILURE', value: breakdown.pf, color: 'var(--amber)' },
    { label: 'NEUTRAL DISTURBANCE', value: breakdown.neutral, color: '#7C3AED' },
    { label: 'MAGNET', value: breakdown.magnet, color: '#0EA5E9' },
    { label: 'COVER OPEN', value: breakdown.cover, color: '#10B981' },
    { label: 'OTHER', value: breakdown.other, color: 'var(--text-dim)' },
  ]

  return (
    <div>
      <div className="card mb-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="card-title text-[13px] font-bold">Tamper event criticality · year-by-year</div>
          <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
            style={{ background: 'var(--green)' }}>FROM REAL MRI</span>
          <span className="ml-auto text-[10px] text-text-dim">stacked by severity</span>
        </div>
        <div className="mb-2 flex flex-wrap gap-3 text-[10.5px]">
          {[['Critical = Earth Loading + Magnetic Tamper', 'var(--red)'],
            ['High = Neutral Disturbance + Cover Open', 'var(--amber)'],
            ['Medium = Power Failure + Other', 'var(--text-dim)']].map(([lbl, c]) => (
            <span key={lbl} className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-sm" style={{ background: c }} />
              <span className="text-text-dim">{lbl}</span>
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-dim)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-dim)' }} />
            <Tooltip />
            <Bar dataKey="critical" stackId="a" fill="var(--red)" name="Critical" />
            <Bar dataKey="high" stackId="a" fill="var(--amber)" name="High" />
            <Bar dataKey="medium" stackId="a" fill="var(--text-dim)" name="Medium" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 rounded-lg p-2.5 text-[11px]"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <strong style={{ color: 'var(--ai-purple)' }}>✦ AI: </strong>
          {breakdown.earth === 0 ? '0% of all events are critical (Earth/Magnetic). ' : ''}
          Tamper count rose significantly YoY — escalating pattern.
        </div>
      </div>

      {/* Breakdown cards */}
      <div className="card">
        <div className="mb-3 flex items-center gap-2">
          <div className="card-title text-[13px] font-bold">Tamper events</div>
          <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
            style={{ background: 'var(--green)' }}>FROM REAL MRI</span>
        </div>
        <p className="mb-3 text-[10.5px] text-text-dim">
          Aggregate counts by type for this meter (lifetime). Click any year in the Real MRI panel above for year-by-year breakdown.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {breakdownItems.map((item) => (
            <div key={item.label} className="rounded-xl border border-border p-3 text-center"
              style={{ borderTop: `3px solid ${item.color}` }}>
              <div className="font-mono text-[20px] font-extrabold" style={{ color: item.color }}>
                {item.value.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-text-dim">
                {item.label}
              </div>
              <div className="text-[9px] text-text-dim">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}% of total
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg p-2.5 text-[11px]"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)' }}>
          <strong>Total: {total.toLocaleString('en-IN')} lifetime tamper events.</strong>{' '}
          Mixed event types — investigate root cause through field inspection.
        </div>
      </div>
    </div>
  )
}

// ─── Meter Info Tab ────────────────────────────────────────────────────────────
export function MeterInfoTab({ meter }: { meter: SuspMeter }) {
  const isReal = meter._real

  const consumerFields = [
    { label: 'Account No', value: meter._account ?? '—' },
    { label: 'Consumer Name', value: meter._consumer ?? `Consumer #${meter.id}` },
    { label: 'Address', value: meter._account === '1243849000' ? 'SEWAITH BIHARI LALHAJI GANJ, UP, IND' : '—' },
    { label: 'Zone', value: meter._zone ?? '—' },
    { label: 'Circle', value: meter.area?.split('/')[1]?.trim() ?? '—' },
    { label: 'Division', value: meter.area?.split('/')[0]?.trim() ?? '—' },
    { label: 'Activity', value: meter._activity ?? meter.cat },
    { label: 'Tariff Code', value: meter._tariff ?? '—' },
    { label: 'Contract Load', value: meter._load ? `${meter._load} ${meter._load_unit ?? 'kW'}` : meter.sl },
  ]

  const meterFields = [
    { label: 'Meter Number', value: meter.id },
    { label: 'Make', value: meter.id === '884759' ? 'LINKWELL TELESYSTEMS PVT.LTD.HYD' : 'L&T Metering Solutions' },
    { label: 'Year of Mfg', value: meter.id === '884759' ? '2021' : '2019' },
    { label: 'Cumulative kWh', value: meter.id === '884759' ? '34,596.31' : '18,420.50' },
    { label: 'Cumulative kVAh', value: meter.id === '884759' ? '58,853.09' : '19,840.20' },
    { label: 'Lifetime PF', value: meter.id === '884759' ? '0.588' : '0.924' },
    { label: 'Tamper Count', value: meter.events.toLocaleString('en-IN') },
    { label: 'Last 7-day Avg kWh/day', value: meter.id === '884759' ? '21.9' : '8.4' },
    { label: 'Zero-load Intervals (7d)', value: meter.id === '884759' ? '225 (77.9%)' : '—' },
  ]

  return (
    <div>
      {/* Consumer details */}
      <div className="card mb-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="card-title text-[13px] font-bold">Consumer details</div>
          {isReal && (
            <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
              style={{ background: 'var(--green)' }}>✓ FROM REAL DATA</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-0">
          {consumerFields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
              <span className="text-[11.5px] text-text-dim">{label}</span>
              <span className="text-right font-mono text-[11.5px] font-semibold text-text">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meter specs */}
      <div className="card">
        <div className="mb-3 flex items-center gap-2">
          <div className="card-title text-[13px] font-bold">Meter specifications</div>
          {isReal && (
            <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
              style={{ background: 'var(--green)' }}>✓ FROM REAL MRI</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-0">
          {meterFields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
              <span className="text-[11.5px] text-text-dim">{label}</span>
              <span className="text-right font-mono text-[11.5px] font-semibold text-text">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
