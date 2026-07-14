import { useMemo, useState } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'
import {
  buildInstantParams,
  computeImbalance,
  phaseIntegrityCheck,
  phaseIntegrityFromLoadSurvey,
  phaseSeverity,
  classifyPhasor,
  type InstantParams,
  type PhaseTriplet,
} from '@/features/Meters/data/meterAnalysisData'
import { RealBadge, RunningTimeTodCards } from './RunningTimeTodCards'
import { TamperCriticalityCard } from './TamperCriticalityCard'

interface MeterAnalysisTabProps {
  meter: SuspMeter
}

const PHASE_COLORS = { R: '#DC3545', Y: '#E6921E', B: '#0EA5E9' } as const

const fmt = (n: number) => n.toLocaleString('en-IN')

export function MeterAnalysisTab({ meter }: MeterAnalysisTabProps) {
  const realData = REAL_METER_DATA[meter.id]

  // ── Base instant params (deterministic per meter; live-editable via sliders) ─
  const baseParams = useMemo(() => buildInstantParams(meter, realData), [meter, realData])
  const [prevMeterId, setPrevMeterId] = useState(meter.id)
  const [angle, setAngle] = useState(baseParams.angle)
  const [pf, setPf] = useState<PhaseTriplet>(baseParams.pf)
  if (meter.id !== prevMeterId) {
    setPrevMeterId(meter.id)
    setAngle(baseParams.angle)
    setPf(baseParams.pf)
  }

  const p: InstantParams = { ...baseParams, angle, pf }

  const vImb = computeImbalance(p.voltage)
  const iImb = computeImbalance(p.current)
  const integrity = phaseIntegrityCheck(p)
  const cls = classifyPhasor(angle, pf)

  // ── Slider lag values (-180..180), derived live from angle state ───────────
  const lagOf = (ph: 'R' | 'Y' | 'B') => {
    const v = angle[('v' + ph) as 'vR' | 'vY' | 'vB']
    const i = angle[('i' + ph) as 'iR' | 'iY' | 'iB']
    return ((v - i + 540) % 360) - 180
  }

  function updateLag(ph: 'R' | 'Y' | 'B', lagStr: string) {
    const lag = parseFloat(lagStr) || 0
    const vKey = ('v' + ph) as 'vR' | 'vY' | 'vB'
    setAngle((prev) => ({ ...prev, [('i' + ph) as 'iR' | 'iY' | 'iB']: (prev[vKey] - lag + 720) % 360 }))
    const cosLag = Math.cos((lag * Math.PI) / 180)
    setPf((prev) => ({ ...prev, [ph]: +Math.max(-1, Math.min(1, cosLag)).toFixed(3) }))
  }

  function resetPhasor() {
    setAngle(baseParams.angle)
    setPf(baseParams.pf)
  }

  // ── Phasor SVG geometry (mirrors prototype's buildPhasorSVG exactly) ───────
  const cx = 140, cy = 140, vRadius = 100, iRadius = 70
  const toXY = (angDeg: number, len: number) => {
    const rad = (angDeg * Math.PI) / 180
    return { x: cx + len * Math.cos(-rad), y: cy + len * Math.sin(-rad) }
  }
  const maxV = Math.max(p.voltage.R, p.voltage.Y, p.voltage.B)
  const vScale = (v: number) => (v / Math.max(240, maxV)) * vRadius
  const maxI = Math.max(p.current.R, p.current.Y, p.current.B, 1)
  const iScale = (i: number) => (i / Math.max(20, maxI)) * iRadius

  const vXY = { R: toXY(angle.vR, vScale(p.voltage.R)), Y: toXY(angle.vY, vScale(p.voltage.Y)), B: toXY(angle.vB, vScale(p.voltage.B)) }
  const iXY = { R: toXY(angle.iR, iScale(p.current.R)), Y: toXY(angle.iY, iScale(p.current.Y)), B: toXY(angle.iB, iScale(p.current.B)) }

  // ── Other forensic derivations ──────────────────────────────────────────────
  const ls = useMemo(() => phaseIntegrityFromLoadSurvey(meter, realData), [meter, realData])

  const lsCritPhases = (['R', 'Y', 'B'] as const).filter((ph) => phaseSeverity(ls, ph) === 'critical')
  const lsWarnPhases = (['R', 'Y', 'B'] as const).filter((ph) => phaseSeverity(ls, ph) === 'warning')
  const instCritical = integrity.critical.length
  let verdict: string
  let verdictBg: string
  let verdictColor: string
  if (lsCritPhases.length > 0 && instCritical === 0) {
    verdict = `Instance shows clean right now, but load survey reveals ${lsCritPhases.length} phase(s) with critical anomalies (${lsCritPhases.join(', ')}). Pattern indicates the bypass may be active intermittently — operator likely disconnects when meter reads are due. Recommend surprise inspection during peak hours.`
    verdictBg = 'var(--red-light)'
    verdictColor = 'var(--red)'
  } else if (lsCritPhases.length > 0 && instCritical > 0) {
    verdict = `Bypass is active. Both instance and ${ls.windowDays}-day survey confirm sustained V_AVAIL+I=0 condition on phase(s) ${lsCritPhases.join(', ')}. Strongest possible evidence — Section 135 prosecution-grade.`
    verdictBg = 'var(--red-light)'
    verdictColor = 'var(--red)'
  } else if (lsWarnPhases.length > 0) {
    verdict = `Load survey shows ${lsWarnPhases.length} phase(s) with elevated anomaly rates (${lsWarnPhases.join(', ')}). Below the critical threshold but worth watching. Re-evaluate on next monthly MRI download.`
    verdictBg = 'rgba(230,146,30,0.08)'
    verdictColor = 'var(--amber-dark)'
  } else {
    verdict = `Both instance and ${ls.windowDays}-day load survey are clean. No bypass or PT manipulation evidence at either layer.`
    verdictBg = 'rgba(40,167,69,0.06)'
    verdictColor = 'var(--green)'
  }

  return (
    <div>
      {/* 1. Instantaneous parameter snapshot */}
      <div className="card mb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-[13px] font-bold text-text">⚡ Instantaneous parameter snapshot</span>
            <RealBadge isReal={p.isReal} />
          </div>
          <span className="text-[10.5px] text-text-dim">
            {p.isThreePhase ? '3-phase' : '1-phase'} · captured {p.timestamp.split('T')[0]}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Phasor diagram + AI classification + interactive sliders */}
          <div className="rounded-xl border border-border bg-bg p-3.5">
            <div className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-text-dim">Phasor diagram</div>
            <svg width="100%" viewBox="0 0 280 280" style={{ display: 'block', margin: '0 auto', maxWidth: 260 }}>
              <defs>
                {(['DC3545', 'E6921E', '0EA5E9'] as const).map((c) => (
                  <marker key={c} id={`arrow${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill={`#${c}`} />
                  </marker>
                ))}
              </defs>
              <circle cx={cx} cy={cy} r={vRadius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
              <circle cx={cx} cy={cy} r={iRadius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={1} strokeDasharray="2,3" />
              <line x1={cx - vRadius - 15} y1={cy} x2={cx + vRadius + 15} y2={cy} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />
              <line x1={cx} y1={cy - vRadius - 15} x2={cx} y2={cy + vRadius + 15} stroke="rgba(0,0,0,0.1)" strokeWidth={1} />
              {[0, 120, 240].map((a) => {
                const e = toXY(a, vRadius + 10)
                return <line key={a} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="rgba(0,0,0,0.06)" strokeWidth={1} strokeDasharray="2,4" />
              })}
              {(['R', 'Y', 'B'] as const).map((ph) => (
                <line key={`v-${ph}`} x1={cx} y1={cy} x2={vXY[ph].x} y2={vXY[ph].y} stroke={PHASE_COLORS[ph]} strokeWidth={2.5} markerEnd={`url(#arrow${ph === 'R' ? 'DC3545' : ph === 'Y' ? 'E6921E' : '0EA5E9'})`} />
              ))}
              {(['R', 'Y', 'B'] as const).map((ph) => (
                <line key={`i-${ph}`} x1={cx} y1={cy} x2={iXY[ph].x} y2={iXY[ph].y} stroke={PHASE_COLORS[ph]} strokeWidth={1.6} strokeDasharray="3,3" markerEnd={`url(#arrow${ph === 'R' ? 'DC3545' : ph === 'Y' ? 'E6921E' : '0EA5E9'})`} />
              ))}
              <text x={vXY.R.x + 6} y={vXY.R.y - 2} fontSize={10} fontWeight={700} fill={PHASE_COLORS.R}>VR</text>
              <text x={vXY.Y.x - 12} y={vXY.Y.y - 4} fontSize={10} fontWeight={700} fill={PHASE_COLORS.Y}>VY</text>
              <text x={vXY.B.x - 6} y={vXY.B.y + 12} fontSize={10} fontWeight={700} fill={PHASE_COLORS.B}>VB</text>
              <text x={iXY.R.x + 4} y={iXY.R.y + 10} fontSize={9} fontWeight={600} fill={PHASE_COLORS.R} opacity={0.85}>IR</text>
              <text x={iXY.Y.x - 10} y={iXY.Y.y + 8} fontSize={9} fontWeight={600} fill={PHASE_COLORS.Y} opacity={0.85}>IY</text>
              <text x={iXY.B.x - 4} y={iXY.B.y - 4} fontSize={9} fontWeight={600} fill={PHASE_COLORS.B} opacity={0.85}>IB</text>
              <circle cx={cx} cy={cy} r={2.5} fill="#333" />
            </svg>
            <div className="flex justify-center gap-2.5 text-[9.5px] text-text-mid">
              <span>━━ Voltage</span>
              <span className="text-text-dim">┄┄ Current</span>
            </div>

            {/* AI Classification — live, reacts to sliders */}
            <div className="mt-2.5 rounded-lg p-2.5" style={{ background: cls.bg, border: `1px solid ${cls.color}` }}>
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-[.4px]" style={{ color: cls.color }}>✦ AI CLASSIFICATION</span>
                <span className="font-mono text-[9.5px] font-bold" style={{ color: cls.color }}>{cls.sig}</span>
              </div>
              <div className="mb-0.5 text-[11.5px] font-extrabold" style={{ color: cls.color }}>{cls.cls}</div>
              <div className="text-[10px] leading-[1.45] text-text-mid">{cls.msg}</div>
            </div>

            {/* Interactive demo sliders */}
            <div className="mt-3 border-t border-dashed border-border pt-2.5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-[.4px] text-ai-purple">✦ Interactive demo · rotate current vectors</span>
                <button type="button" onClick={resetPhasor} className="rounded-md border border-border bg-card px-2 py-0.5 text-[9.5px] text-text-mid hover:border-ai-purple">
                  ↺ Reset
                </button>
              </div>
              <p className="mb-2 text-[10px] leading-[1.4] text-text-dim">
                Drag the sliders to simulate CT manipulation. Each lag angle represents the phase shift between
                voltage and current that an inspector would observe with a tong-tester on-site.
              </p>
              {(['R', 'Y', 'B'] as const).map((ph) => {
                const lag = lagOf(ph)
                return (
                  <div key={ph} className="mb-1.5 grid grid-cols-[44px_1fr_38px] items-center gap-2">
                    <span className="text-[10.5px] font-bold" style={{ color: PHASE_COLORS[ph] }}>
                      I<sub>{ph}</sub> lag
                    </span>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={1}
                      value={lag}
                      onChange={(e) => updateLag(ph, e.target.value)}
                      className="w-full cursor-pointer"
                      style={{ accentColor: PHASE_COLORS[ph] }}
                    />
                    <span className="text-right font-mono text-[10.5px] font-bold" style={{ color: PHASE_COLORS[ph] }}>
                      {lag.toFixed(0)}°
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Parameter table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-[11.5px]">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="px-2 py-1.5 text-left text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Phase</th>
                  <th className="px-2 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Voltage (V)</th>
                  <th className="px-2 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Current (A)</th>
                  <th className="px-2 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Power factor</th>
                  <th className="px-2 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">V angle</th>
                  <th className="px-2 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">I angle</th>
                </tr>
              </thead>
              <tbody>
                {(['R', 'Y', 'B'] as const).map((ph) => {
                  const v = p.voltage[ph]
                  const i = p.current[ph]
                  const pfv = pf[ph]
                  const vCol = v < 200 ? 'var(--red)' : v > 250 ? 'var(--amber)' : 'var(--text)'
                  const iCol = i < 0.5 ? 'var(--red)' : 'var(--text)'
                  const pfCol = pfv < 0.85 ? 'var(--red)' : pfv < 0.92 ? 'var(--amber)' : 'var(--green)'
                  const vAng = angle[('v' + ph) as 'vR' | 'vY' | 'vB']
                  const iAng = angle[('i' + ph) as 'iR' | 'iY' | 'iB']
                  return (
                    <tr key={ph} className="border-b border-border-light">
                      <td className="px-2 py-2 font-bold" style={{ color: PHASE_COLORS[ph] }}>
                        <span className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ background: PHASE_COLORS[ph] }} />
                        {ph}-phase
                      </td>
                      <td className="px-2 py-2 text-right font-mono font-bold" style={{ color: vCol }}>{v}</td>
                      <td className="px-2 py-2 text-right font-mono font-bold" style={{ color: iCol }}>{i}</td>
                      <td className="px-2 py-2 text-right font-mono font-bold" style={{ color: pfCol }}>{pfv}</td>
                      <td className="px-2 py-2 text-right font-mono text-text-mid">{vAng.toFixed(0)}°</td>
                      <td className="px-2 py-2 text-right font-mono text-text-mid">{iAng.toFixed(0)}°</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                { label: 'V imbalance', value: `${vImb.toFixed(1)}%`, sub: 'healthy < 2%', color: vImb > 5 ? 'var(--red)' : vImb > 2 ? 'var(--amber)' : 'var(--green)' },
                { label: 'I imbalance', value: `${iImb.toFixed(1)}%`, sub: 'healthy < 10%', color: iImb > 30 ? 'var(--red)' : iImb > 10 ? 'var(--amber)' : 'var(--green)' },
                { label: 'Frequency', value: `${p.frequency.toFixed(2)} Hz`, sub: 'grid: 50 ± 0.5', color: 'var(--ai-purple)' },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border-l-[3px] bg-bg p-2.5" style={{ borderLeftColor: m.color }}>
                  <div className="text-[9.5px] font-bold uppercase tracking-[.3px] text-text-dim">{m.label}</div>
                  <div className="font-mono text-[16px] font-extrabold" style={{ color: m.label === 'Frequency' ? 'var(--text)' : m.color }}>{m.value}</div>
                  <div className="mt-px text-[9.5px] text-text-dim">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Phase integrity check — bypass & PT manipulation rules */}
      <div className="card mb-4">
        <div className="card-title mb-3.5 text-[13px] font-bold">🔍 Phase integrity check · bypass &amp; PT manipulation rules</div>
        <p className="mb-3.5 text-[11px] leading-[1.5] text-text-mid">
          Two complementary rules tested at <strong>two layers</strong>: (a) <strong>V available + I zero</strong> = line
          energized but meter records nothing → bypass. (b) <strong>I flowing + V low</strong> = consumer drawing through
          manipulated PT or upstream tap. The single-instant snapshot tells you the current state; the load-survey window
          tells you whether the anomaly is a <strong>persistent pattern</strong>.
        </p>

        <div className="mb-3 grid gap-3.5 lg:grid-cols-[1fr_1.3fr]">
          {/* Right now (instantaneous) */}
          <div className="rounded-xl border border-border-light bg-bg p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11.5px] font-bold text-text">⚡ Right now (instantaneous)</span>
              <span className="text-[9px] font-semibold text-text-dim">single snapshot</span>
            </div>
            {integrity.critical.length === 0 && integrity.warnings.length === 0 ? (
              <div className="rounded-lg p-2.5 text-[11px] font-semibold" style={{ background: 'rgba(40,167,69,0.08)', border: '1px solid rgba(40,167,69,0.25)', color: 'var(--green)' }}>
                ✓ All three phases pass. V and I readings consistent with a healthy connection at this moment.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {integrity.critical.map((c) => (
                  <div key={c.code + c.phase} className="rounded-lg p-2.5" style={{ background: 'var(--red-light)', border: '1px solid var(--red)' }}>
                    <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'var(--red)' }}>
                      ⚠ {c.phase}-phase: V available, I zero
                      <span className="rounded px-1.5 py-px font-mono text-[8.5px]" style={{ background: 'rgba(220,53,69,0.2)' }}>{c.code}</span>
                    </div>
                    <div className="text-[10.5px] leading-[1.45]" style={{ color: 'var(--red)' }}>{c.desc}</div>
                  </div>
                ))}
                {integrity.warnings.map((w) => (
                  <div key={w.code + w.phase} className="rounded-lg p-2.5" style={{ background: 'rgba(230,146,30,0.1)', border: '1px solid var(--amber)' }}>
                    <div className="mb-0.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'var(--amber-dark)' }}>
                      ⚠ {w.phase}-phase: I available, V low
                      <span className="rounded px-1.5 py-px font-mono text-[8.5px]" style={{ background: 'rgba(230,146,30,0.2)' }}>{w.code}</span>
                    </div>
                    <div className="text-[10.5px] leading-[1.45]" style={{ color: 'var(--amber-dark)' }}>{w.desc}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2.5 rounded-md p-2 text-[9.5px] leading-[1.5] text-text-dim" style={{ background: 'rgba(0,0,0,0.03)' }}>
              Thresholds: V_normal = 220–250 V · V_low = &lt; 200 V · I_zero = &lt; 0.5 A
            </div>
          </div>

          {/* Load survey check */}
          <div
            className="rounded-xl border p-3.5"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.04) 0%,rgba(255,255,255,0) 60%), var(--card)', borderColor: 'rgba(124,58,237,0.18)' }}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center text-[11.5px] font-bold text-text">
                📊 Over {ls.windowDays}-day load survey
                <RealBadge isReal={ls.isReal} />
              </span>
              <span className="text-[9px] font-semibold text-text-dim">{fmt(ls.totalIntervals)} intervals analysed</span>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[300px] text-[11px]">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="px-1.5 py-1.5 text-left text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Phase</th>
                  <th className="px-1.5 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim" title="V available + I = 0">V_AVAIL &amp; I=0</th>
                  <th className="px-1.5 py-1.5 text-right text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim" title="I flowing + V low">I_AVAIL &amp; V_LOW</th>
                  <th className="px-1.5 py-1.5 text-center text-[9.5px] font-bold uppercase tracking-[.4px] text-text-dim">Status</th>
                </tr>
              </thead>
              <tbody>
                {(['R', 'Y', 'B'] as const).map((ph) => {
                  const pp = ls.perPhase[ph]
                  const sev = phaseSeverity(ls, ph)
                  const vCol = pp.vAvailIZero > 25 ? 'var(--red)' : pp.vAvailIZero > 10 ? 'var(--amber)' : 'var(--text)'
                  const iCol = pp.iAvailVLow > 15 ? 'var(--red)' : pp.iAvailVLow > 5 ? 'var(--amber)' : 'var(--text)'
                  const sevColor = sev === 'critical' ? 'var(--red)' : sev === 'warning' ? 'var(--amber)' : 'var(--green)'
                  const sevBg = sev === 'critical' ? 'var(--red-light)' : sev === 'warning' ? 'rgba(230,146,30,0.08)' : 'rgba(40,167,69,0.06)'
                  return (
                    <tr key={ph} className="border-b border-border-light">
                      <td className="px-1.5 py-2 font-bold" style={{ color: PHASE_COLORS[ph] }}>
                        <span className="mr-1.5 inline-block size-2 rounded-full align-middle" style={{ background: PHASE_COLORS[ph] }} />
                        {ph}-phase
                      </td>
                      <td className="px-1.5 py-2 text-right font-mono font-bold" style={{ color: vCol }}>{pp.vAvailIZero}%</td>
                      <td className="px-1.5 py-2 text-right font-mono font-bold" style={{ color: iCol }}>{pp.iAvailVLow}%</td>
                      <td className="px-1.5 py-2 text-center">
                        <span className="inline-block rounded-full px-2 py-px text-[9px] font-extrabold tracking-[.3px]" style={{ background: sevBg, color: sevColor, border: `1px solid ${sevColor}` }}>
                          {sev === 'critical' ? '⚠ CRITICAL' : sev === 'warning' ? 'WARNING' : '✓ OK'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
            <div className="mt-2.5 rounded-md p-2 text-[9.5px] leading-[1.5] text-text-dim" style={{ background: 'rgba(0,0,0,0.03)' }}>
              <strong>Severity bands:</strong> Critical = V_AVAIL&amp;I=0 &gt; 25% or I_AVAIL&amp;V_LOW &gt; 15% · Warning = &gt; 10% / &gt; 5% · OK below.
            </div>
          </div>
        </div>

        <div className="rounded-lg p-2.5 text-[11px] leading-[1.5]" style={{ background: verdictBg, color: verdictColor }}>
          <strong>✦ AI synthesis:</strong> {verdict}
        </div>
      </div>

      {/* 3. Running time + 4. TOD profile */}
      <RunningTimeTodCards meter={meter} />


      {/* 5. Tamper event criticality, year-by-year */}
      <TamperCriticalityCard meter={meter} canvasIdSuffix="analysis" />
    </div>
  )
}
