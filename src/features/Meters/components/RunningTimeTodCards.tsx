import { useMemo } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'
import { computeRunningTime, buildTODProfile } from '@/features/Meters/data/meterAnalysisData'

interface RealBadgeProps {
  isReal: boolean
}

// Shared between the "Meter analysis" and "Load profile" tabs — the prototype
// renders these two cards identically in both places (renderRunningTimeCard /
// renderTODCard), so a single component keeps the numbers and look in sync.
export function RealBadge({ isReal }: RealBadgeProps) {
  return isReal ? (
    <span
      className="ml-1.5 inline-block rounded-md px-1.5 py-px text-[9px] font-extrabold tracking-[.3px]"
      style={{ background: 'rgba(40,167,69,.12)', color: 'var(--green)', border: '1px solid rgba(40,167,69,.3)' }}
    >
      ✓ FROM REAL MRI
    </span>
  ) : (
    <span
      className="ml-1.5 inline-block rounded-md px-1.5 py-px text-[9px] font-extrabold tracking-[.3px]"
      style={{ background: 'rgba(124,58,237,.08)', color: 'var(--ai-purple)', border: '1px solid rgba(124,58,237,.25)' }}
    >
      DERIVED
    </span>
  )
}

const fmt = (n: number) => n.toLocaleString('en-IN')

export function RunningTimeTodCards({ meter }: { meter: SuspMeter }) {
  const realData = REAL_METER_DATA[meter.id]
  const rt = useMemo(() => computeRunningTime(meter, realData), [meter, realData])
  const tod = useMemo(() => buildTODProfile(meter), [meter])

  const todTotal = tod.offPeak + tod.normal + tod.peak
  const offPct = todTotal > 0 ? (tod.offPeak / todTotal) * 100 : 0
  const normPct = todTotal > 0 ? (tod.normal / todTotal) * 100 : 0
  const peakPct = todTotal > 0 ? (tod.peak / todTotal) * 100 : 0

  const gaugeColor = rt.pct < 30 ? '#DC3545' : rt.pct < 55 ? '#E6921E' : '#28A745'
  const gaugeRadius = 64
  const circ = 2 * Math.PI * gaugeRadius
  const fillCirc = circ * 0.75

  return (
    <div className="mb-4 grid gap-3.5 lg:grid-cols-[1fr_1.4fr]">
      {/* Running time gauge */}
      <div className="card mb-0">
        <div className="mb-1 flex items-center justify-between">
          <span className="flex items-center text-[13px] font-bold text-text">⏱ Running time<RealBadge isReal={rt.isReal} /></span>
          <span className="text-[10px] text-text-dim">last 30 days</span>
        </div>
        <div className="py-3 text-center">
          <svg width="160" height="140" viewBox="0 0 160 140" className="mx-auto">
            <circle cx={80} cy={80} r={gaugeRadius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={11} strokeDasharray={`${fillCirc} ${circ}`} transform="rotate(135 80 80)" />
            <circle cx={80} cy={80} r={gaugeRadius} fill="none" stroke={gaugeColor} strokeWidth={11} strokeLinecap="round" strokeDasharray={`${(rt.pct / 100) * fillCirc} ${circ}`} transform="rotate(135 80 80)" />
            <text x={80} y={78} textAnchor="middle" fontSize={28} fontWeight={800} fill={gaugeColor} className="font-mono">{rt.pct}%</text>
            <text x={80} y={96} textAnchor="middle" fontSize={10} fill="#71717A">running time</text>
          </svg>
          <div className="flex justify-center gap-3.5 text-[10.5px] text-text-mid">
            <div><strong className="font-mono text-text">{fmt(rt.activeIntervals)}</strong> active</div>
            <div className="text-text-dim">/</div>
            <div><strong className="font-mono text-text">{fmt(rt.totalIntervals)}</strong> intervals</div>
          </div>
          <div
            className="mt-2.5 rounded-lg p-2.5 text-left text-[10.5px] leading-[1.5]"
            style={{
              background: rt.pct < 30 ? 'var(--red-light)' : rt.pct < 55 ? 'rgba(230,146,30,0.08)' : 'rgba(40,167,69,0.06)',
              color: rt.pct < 30 ? 'var(--red)' : rt.pct < 55 ? 'var(--amber-dark)' : 'var(--green)',
            }}
          >
            {rt.pct < 30 ? (
              <><strong>⚠ Suspiciously low.</strong> Industrial baseline is 70–85%. This consumer's meter recorded current in only {rt.pct}% of intervals — strong bypass signature.</>
            ) : rt.pct < 55 ? (
              <><strong>Below baseline.</strong> Healthy {meter.cat || 'industrial'} meters typically run 60–80% of intervals. Investigate.</>
            ) : (
              <><strong>✓ Within normal range</strong> for {meter.cat || 'this category'}. No running-time concern.</>
            )}
          </div>
        </div>
      </div>

      {/* TOD profile */}
      <div className="card mb-0">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center text-[13px] font-bold text-text">🕒 Time-of-Day (TOD) profile<RealBadge isReal={tod.isReal} /></span>
          <span className="text-[10px] text-text-dim">last billing cycle</span>
        </div>
        <div
          className="flex h-8 overflow-hidden rounded-lg"
          style={{ background: 'rgba(0,0,0,0.05)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'linear-gradient(180deg,#0EA5E9,#0284C7)', width: `${offPct}%` }}>
            {offPct > 8 ? `${offPct.toFixed(0)}%` : ''}
          </div>
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'linear-gradient(180deg,#7C3AED,#5B21B6)', width: `${normPct}%` }}>
            {normPct > 8 ? `${normPct.toFixed(0)}%` : ''}
          </div>
          <div className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'linear-gradient(180deg,#DC3545,#A8222F)', width: `${peakPct}%` }}>
            {peakPct > 8 ? `${peakPct.toFixed(0)}%` : ''}
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <div className="rounded-lg border-l-[3px] p-2.5" style={{ background: 'rgba(14,165,233,0.06)', borderLeftColor: '#0EA5E9' }}>
            <div className="text-[9px] font-bold uppercase tracking-[.3px]" style={{ color: '#0284C7' }}>Off-peak</div>
            <div className="text-[9px] text-text-dim">22:00–06:00 · discount</div>
            <div className="mt-0.5 font-mono text-[14px] font-extrabold" style={{ color: '#0284C7' }}>{fmt(tod.offPeak)} <span className="text-[9px] font-medium text-text-dim">kWh</span></div>
          </div>
          <div className="rounded-lg border-l-[3px] p-2.5" style={{ background: 'rgba(124,58,237,0.06)', borderLeftColor: 'var(--ai-purple)' }}>
            <div className="text-[9px] font-bold uppercase tracking-[.3px] text-ai-purple">Normal</div>
            <div className="text-[9px] text-text-dim">06:00–18:00 · standard</div>
            <div className="mt-0.5 font-mono text-[14px] font-extrabold text-ai-purple">{fmt(tod.normal)} <span className="text-[9px] font-medium text-text-dim">kWh</span></div>
          </div>
          <div className="rounded-lg border-l-[3px] p-2.5" style={{ background: 'rgba(220,53,69,0.06)', borderLeftColor: 'var(--red)' }}>
            <div className="text-[9px] font-bold uppercase tracking-[.3px]" style={{ color: 'var(--red)' }}>Peak</div>
            <div className="text-[9px] text-text-dim">18:00–22:00 · surcharge</div>
            <div className="mt-0.5 font-mono text-[14px] font-extrabold" style={{ color: 'var(--red)' }}>{fmt(tod.peak)} <span className="text-[9px] font-medium text-text-dim">kWh</span></div>
          </div>
        </div>
        <div
          className="mt-2.5 rounded-lg p-2.5 text-[10.5px] leading-[1.5]"
          style={{
            background: tod.actualPeakPct < tod.expectedPeakPct - 5 ? 'var(--red-light)' : 'rgba(124,58,237,0.05)',
            color: tod.actualPeakPct < tod.expectedPeakPct - 5 ? 'var(--red)' : 'var(--text-mid)',
          }}
        >
          <strong>✦ AI:</strong> Peak slab is <strong>{tod.actualPeakPct}%</strong> of total. Expected for {meter.cat || 'this category'}: ~{tod.expectedPeakPct}%.{' '}
          {tod.actualPeakPct < tod.expectedPeakPct - 5 ? (
            <><strong style={{ color: 'var(--red)' }}>Significantly below baseline</strong> — possible peak-hour tampering. Bypass may be timed to peak slab when each kWh costs more.</>
          ) : (
            'Within expected range.'
          )}
        </div>
      </div>
    </div>
  )
}
