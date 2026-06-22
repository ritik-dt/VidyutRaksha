import { useState, type ChangeEvent } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'

interface MeterAnalysisTabProps {
  meter: SuspMeter
}

const PHASE_DATA = {
  R: { voltage: 233.6, current: 23.69, pf: 0.52, vAngle: 2, iAngle: 303 },
  Y: { voltage: 199.1, current: 13.34, pf: 0.43, vAngle: 111, iAngle: 46 },
  B: { voltage: 215.5, current: 0.1, pf: 0.55, vAngle: 250, iAngle: 76 },
}

const PHASE_COLORS = { R: '#DC3545', Y: '#E6921E', B: '#0EA5E9' }

interface SliderState { R: number; Y: number; B: number }

export function MeterAnalysisTab({ meter: _meter }: MeterAnalysisTabProps) {
  const [lags, setLags] = useState<SliderState>({ R: 59, Y: 65, B: 174 })

  const vImbalance = 8.1
  const iImbalance = 9.2
  const freq = 49.8

  const hasReversal = (Object.values(lags) as number[]).some((lag) => lag > 90)

  // Simple SVG phasor: draw vectors at given angles
  const cx = 110, cy = 110, r = 80
  function polarToXY(angleDeg: number, len: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + len * Math.cos(rad), y: cy + len * Math.sin(rad) }
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-text">Instantaneous parameter snapshot</div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded-md px-1.5 py-px text-[9px] font-bold text-white"
                style={{ background: 'var(--amber)' }}>DERIVED</span>
              <span className="text-[10.5px] text-text-dim">3-phase · captured 2026-06-11</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Phasor SVG */}
          <div>
            <div className="mb-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">Phasor diagram</div>
            <div className="flex items-center gap-4">
              <svg width="220" height="220" style={{ background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                {/* Grid circles */}
                {[0.33, 0.67, 1].map((f) => (
                  <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="var(--border)" strokeWidth={0.5} />
                ))}
                {/* Axis lines */}
                <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="var(--border)" strokeWidth={0.5} />

                {/* Voltage phasors (solid) */}
                {(['R', 'Y', 'B'] as const).map((ph) => {
                  const d = PHASE_DATA[ph]
                  const vLen = (d.voltage / 240) * r
                  const end = polarToXY(d.vAngle, vLen)
                  const c = PHASE_COLORS[ph]
                  return (
                    <g key={`v-${ph}`}>
                      <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={c} strokeWidth={2.5} markerEnd={`url(#arrow-${ph})`} />
                      <defs>
                        <marker id={`arrow-${ph}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L6,3 z" fill={c} />
                        </marker>
                      </defs>
                      <text x={end.x + 4} y={end.y + 4} fontSize={9} fill={c} fontWeight={700}>{`V${ph}`}</text>
                    </g>
                  )
                })}

                {/* Current phasors (dashed) */}
                {(['R', 'Y', 'B'] as const).map((ph) => {
                  const d = PHASE_DATA[ph]
                  const iLen = (d.current / 30) * r * 0.85
                  const end = polarToXY(d.iAngle, iLen)
                  const c = PHASE_COLORS[ph]
                  return (
                    <line key={`i-${ph}`} x1={cx} y1={cy} x2={end.x} y2={end.y}
                      stroke={c} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.7} />
                  )
                })}

                {/* Legend */}
                <g transform="translate(4,196)">
                  <line x1={0} y1={4} x2={14} y2={4} stroke="var(--text-mid)" strokeWidth={2} />
                  <text x={18} y={7} fontSize={9} fill="var(--text-dim)">Voltage</text>
                  <line x1={50} y1={4} x2={64} y2={4} stroke="var(--text-mid)" strokeWidth={1.5} strokeDasharray="3 2" />
                  <text x={68} y={7} fontSize={9} fill="var(--text-dim)">Current</text>
                </g>
              </svg>

              {/* AI Classification */}
              <div className="flex-1">
                <div className="rounded-xl p-3 text-[11px]"
                  style={{ background: 'rgba(220,53,69,0.06)', border: '2px solid rgba(220,53,69,0.25)' }}>
                  <div className="mb-1 text-[9.5px] font-extrabold uppercase tracking-wider text-red-600">
                    ✦ AI Classification
                  </div>
                  <div className="font-bold text-red-600">
                    1 phase with |lag| &gt; 90°
                  </div>
                  <div className="mt-0.5 font-bold text-red-600">
                    SINGLE-PHASE REVERSAL · SUSPICIOUS
                  </div>
                  <p className="mt-1.5 text-text-mid">
                    One phase showing reverse current. Could be CT installation error or selective tampering on
                    highest-load phase. Site verification recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase table */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-dim">Phase measurements</div>
            <div className="table-wrap mb-3">
              <table>
                <thead>
                  <tr className="table-header">
                    <th>Phase</th><th>Voltage (V)</th><th>Current (A)</th>
                    <th style={{ color: 'var(--amber)' }}>Power Factor</th>
                    <th>V Angle</th><th>I Angle</th>
                  </tr>
                </thead>
                <tbody>
                  {(['R', 'Y', 'B'] as const).map((ph) => {
                    const d = PHASE_DATA[ph]
                    const pfWarn = d.pf < 0.6
                    return (
                      <tr key={ph} className="table-row">
                        <td>
                          <span className="font-bold" style={{ color: PHASE_COLORS[ph] }}>{ph}-phase</span>
                        </td>
                        <td className="font-mono">{d.voltage}</td>
                        <td className="font-mono font-bold"
                          style={{ color: d.current < 1 ? 'var(--red)' : 'var(--text)' }}>
                          {d.current}
                        </td>
                        <td className="font-mono font-bold"
                          style={{ color: pfWarn ? 'var(--red)' : 'var(--text)' }}>
                          {d.pf}
                        </td>
                        <td className="font-mono">{d.vAngle}°</td>
                        <td className="font-mono"
                          style={{ color: d.iAngle > 180 ? 'var(--red)' : 'var(--text)' }}>
                          {d.iAngle}°
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'V Imbalance', value: `${vImbalance}%`, sub: 'healthy < 2%', color: 'var(--red)' },
                { label: 'I Imbalance', value: `${iImbalance}%`, sub: 'healthy < 10%', color: 'var(--amber)' },
                { label: 'Frequency', value: `${freq} Hz`, sub: 'grid: 50 ± 0.5', color: 'var(--green)' },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border bg-bg p-2.5 text-center">
                  <div className="font-mono text-[14px] font-extrabold" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-[9.5px] font-semibold text-text">{m.label}</div>
                  <div className="text-[9px] text-text-dim">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive CT lag simulator */}
      <div className="card">
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="text-[13px] font-bold text-text">✦ Interactive demo — rotate current vectors</div>
            <button type="button" onClick={() => setLags({ R: 59, Y: 65, B: 174 })}
              className="rounded-md border border-border bg-bg px-2 py-0.5 text-[10px] text-text-dim hover:border-ai-purple">
              Reset
            </button>
          </div>
          <p className="mt-1 text-[11px] text-text-dim">
            Drag the sliders to simulate CT manipulation. Each lag angle represents the phase shift between
            voltage and current that an inspector would observe with a tong-tester on-site.
          </p>
        </div>
        <div className="space-y-3">
          {(['R', 'Y', 'B'] as const).map((ph) => (
            <div key={ph} className="flex items-center gap-3">
              <span className="w-8 text-[11px] font-bold" style={{ color: PHASE_COLORS[ph] }}>
                I{ph} lag
              </span>
              <input type="range" min={0} max={180} value={lags[ph]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLags((p: SliderState) => ({ ...p, [ph]: parseInt(e.target.value) }))}
                className="flex-1" style={{ accentColor: PHASE_COLORS[ph] }} />
              <span className="w-10 text-right font-mono text-[11px] font-bold" style={{ color: PHASE_COLORS[ph] }}>
                {lags[ph]}°
              </span>
            </div>
          ))}
        </div>
        {hasReversal && (
          <div className="mt-3 rounded-lg p-2.5 text-[11px] font-semibold"
            style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.3)', color: 'var(--red)' }}>
            ▲ Reverse current detected on one or more phases — strong CT manipulation signature
          </div>
        )}
      </div>
    </div>
  )
}
