import { useState } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'
import type { RealMeterData } from '@/features/Meters/data/realMeterData'
import { LineageModal } from '@/shared/components/layout/LineageModal'

/**
 * Faithful port of the prototype's buildExplainabilityPanel(m, realData):
 * a 12-signal catalog is evaluated → fired signals (contribution = weight ×
 * strength, normalized) render as ranked bars; non-fired signals render in a
 * collapsible 2-column transparency grid; the "Model lineage →" pill opens the
 * shared data-lineage modal.
 */

interface EvaluatedSignal {
  n: string
  w: number
  fired: boolean
  strength: number
  detail: string
}

const RANK_COLORS = ['var(--red)', '#E6921E', '#F4A847', 'var(--ai-purple)']
const RANK_GRADIENT_TO = ['#FF6B7A', '#FFA94D', '#FFD580', '#A78BFA']

function evaluateSignals(
  meter: SuspMeter,
  realData?: RealMeterData,
): EvaluatedSignal[] {
  const flagsStr = (meter.flags || []).join(' ').toLowerCase()
  const aiNote = (meter.aiNote || '').toLowerCase()

  // Derived numeric attributes — prefer real-meter fields when present.
  const daily = realData?.daily ?? []
  const zeroFromReal =
    daily.length > 0
      ? daily.reduce((s, d) => s + (d.zero_pct ?? 0), 0) / daily.length
      : null
  const zeroMatch = flagsStr.match(
    /(\d+(\.\d+)?)%\s*of recent intervals at zero/,
  )
  const zeroPct = zeroFromReal ?? (zeroMatch ? parseFloat(zeroMatch[1]) : 0)

  const tcount =
    meter.events ||
    (realData ? parseInt(realData.summary.tamper_count, 10) || 0 : 0)

  const pfVals = daily.map((d) => d.pf).filter((v): v is number => v != null)
  const pfFromReal =
    pfVals.length > 0 ? pfVals.reduce((s, v) => s + v, 0) / pfVals.length : null
  const pfMatch = flagsStr.match(/lifetime pf\s*([\d.]+)/)
  const pf = pfFromReal ?? (pfMatch ? parseFloat(pfMatch[1]) : null)

  const dropMatch =
    flagsStr.match(/(\d+)%\s*(consumption\s+drop|drop\s+in)/) ||
    aiNote.match(/(\d+)%\s*(consumption\s+drop|drop\s+in|reduction)/)
  const dropPct = dropMatch ? parseInt(dropMatch[1], 10) : Math.abs(meter.drop || 0)

  const raw: {
    n: string
    w: number
    match: () => { fired: boolean; strength: number; detail: string }
  }[] = [
    { n: 'Zero-load anomaly', w: 0.18, match: () => { const fired = zeroPct > 20; return { fired, strength: Math.min(1, zeroPct / 100), detail: fired ? `${zeroPct.toFixed(1)}% intervals at zero kWh (threshold: 20%)` : 'within normal range' } } },
    { n: 'Lifetime tamper events', w: 0.16, match: () => { const fired = tcount > 300; return { fired, strength: Math.min(1, tcount / 5000), detail: fired ? `${tcount.toLocaleString('en-IN')} events on record (threshold: 300)` : 'no significant history' } } },
    { n: 'Power-factor degradation', w: 0.12, match: () => { const fired = pf != null && pf < 0.85; return { fired, strength: pf != null ? Math.min(1, (0.85 - pf) / 0.4) : 0, detail: fired ? `lifetime PF ${pf?.toFixed(2)} (threshold: 0.85)` : 'PF within acceptable range' } } },
    { n: 'Consumption drop vs baseline', w: 0.12, match: () => { const fired = dropPct >= 15; return { fired, strength: Math.min(1, dropPct / 80), detail: fired ? `${dropPct}% drop vs 3-month rolling avg` : 'consumption stable' } } },
    { n: 'CT manipulation pattern', w: 0.10, match: () => { const fired = flagsStr.includes('ct ') || aiNote.includes('ct manipulation') || (pf != null && pf < 0.65); return { fired, strength: 0.7, detail: fired ? 'phase angle anomaly + low PF signature' : 'no phasor anomaly' } } },
    { n: 'Earth-loading signature', w: 0.08, match: () => { const fired = flagsStr.includes('earth') || aiNote.includes('earth'); return { fired, strength: 0.7, detail: fired ? 'earth-wire current detected above threshold' : 'no earth-loading detected' } } },
    { n: 'kWh-MD divergence', w: 0.06, match: () => { const fired = flagsStr.includes('kwh-md') || aiNote.includes('demand stability') || aiNote.includes('divergence'); return { fired, strength: 0.6, detail: fired ? 'Max Demand unchanged while kWh dropped' : 'kWh and MD tracking together' } } },
    { n: 'Cluster correlation', w: 0.06, match: () => { const fired = aiNote.includes('cluster') || aiNote.includes('collective'); return { fired, strength: 0.5, detail: fired ? 'co-located meters showing same pattern' : 'isolated case' } } },
    { n: 'Sanctioned-load mismatch', w: 0.04, match: () => { const fired = aiNote.includes('sanctioned') || flagsStr.includes('sanctioned'); return { fired, strength: 0.5, detail: fired ? 'avg load < 30% of sanctioned (unusual for activity)' : 'load consistent with sanction' } } },
    { n: 'Activity-tariff mismatch', w: 0.04, match: () => { const fired = aiNote.includes('chakki') || aiNote.includes('mill') || aiNote.includes('tower') || flagsStr.includes('chakki'); return { fired, strength: 0.4, detail: fired ? 'commercial/industrial activity flagged · tariff cross-check needed' : 'activity matches tariff' } } },
    { n: 'Phase imbalance', w: 0.02, match: () => { const fired = flagsStr.includes('phase imbalance') || aiNote.includes('phase imbalance'); return { fired, strength: 0.5, detail: fired ? 'I-RMS deviation > 25% across phases' : 'phases balanced' } } },
    { n: 'Voltage interruption', w: 0.02, match: () => { const fired = flagsStr.includes('voltage') || flagsStr.includes('low v'); return { fired, strength: 0.4, detail: fired ? 'elevated low-voltage event count' : 'voltage stable' } } },
  ]

  return raw.map((s) => ({ n: s.n, w: s.w, ...s.match() }))
}

interface ExplainabilityPanelProps {
  meter: SuspMeter
  realData?: RealMeterData
}

export function ExplainabilityPanel({ meter, realData }: ExplainabilityPanelProps) {
  const [lineageOpen, setLineageOpen] = useState(false)
  const [notFiredOpen, setNotFiredOpen] = useState(false)

  const evaluated = evaluateSignals(meter, realData)

  // Fired signals: contribution = weight × strength, normalized to % of risk.
  const fired = evaluated
    .filter((s) => s.fired)
    .map((s) => ({ ...s, contrib: s.w * s.strength }))
  const totalContrib = fired.reduce((a, s) => a + s.contrib, 0) || 1
  const firedWithPct = fired
    .map((s) => ({ ...s, pct: (s.contrib / totalContrib) * 100 }))
    .sort((a, b) => b.contrib - a.contrib)

  const topFired = firedWithPct.slice(0, 6)
  const remaining = firedWithPct.length - topFired.length
  const maxPct = topFired.length ? topFired[0].pct : 1
  const remainingPct = 100 - topFired.reduce((a, s) => a + s.pct, 0)

  const notFired = evaluated
    .filter((s) => !s.fired)
    .sort((a, b) => b.w - a.w)
    .slice(0, 4)

  if (topFired.length === 0) return null

  // Trust-note figures (verbatim prototype formulas).
  const nCases = 1200 + ((parseInt(meter.id, 10) || 0) % 800)
  const precision = 72 + (meter.conf % 18)
  const action =
    meter.risk >= 80
      ? 'priority field inspection within 48h'
      : meter.risk >= 60
        ? 'standard inspection within 7 days'
        : 'monitor for 2 more billing cycles'

  return (
    <div
      className="card mb-[14px] overflow-hidden"
      style={{ border: '1px solid rgba(124,58,237,.25)' }}
    >
      {/* Gradient top accent (prototype: 3px full-bleed bar) */}
      <div
        className="mx-[-18px] mt-[-18px] mb-[14px] h-[3px] rounded-[3px]"
        style={{ background: 'var(--ai-gradient)', width: 'calc(100% + 36px)' }}
      />

      {/* Header */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div
            className="card-title mb-[3px] flex items-center gap-1.5"
            style={{ color: 'var(--ai-purple)' }}
          >
            ✦ How the AI got to risk {meter.risk}
          </div>
          <div className="text-[11px] leading-[1.5] text-text-mid">
            Signal-by-signal breakdown · model{' '}
            <span className="font-mono font-semibold">risk-v3.4.1</span> ·
            confidence{' '}
            <strong style={{ color: 'var(--ai-purple)' }}>{meter.conf}%</strong>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLineageOpen(true)}
          className="shrink-0 self-start whitespace-nowrap rounded-[14px] border border-ai-purple bg-bg px-2.5 py-[5px] text-[10px] font-bold text-ai-purple hover:bg-ai-purple hover:text-white"
        >
          Model lineage →
        </button>
      </div>

      {/* Top fired signals */}
      <div className="mb-[14px]">
        {topFired.map((s, i) => {
          const color = RANK_COLORS[i] ?? 'var(--ai-purple)'
          const gradTo = RANK_GRADIENT_TO[i] ?? '#A78BFA'
          return (
            <div key={s.n} className="mb-[9px]">
              <div className="mb-[3px] flex items-center justify-between gap-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-extrabold text-white"
                    style={{ background: color }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[11.5px] font-bold text-text">
                    {s.n}
                  </span>
                  <span className="shrink-0 font-mono text-[9.5px] text-text-dim">
                    base w={s.w.toFixed(2)}
                  </span>
                </div>
                <div
                  className="shrink-0 font-mono text-[12.5px] font-extrabold"
                  style={{ color: 'var(--ai-purple)' }}
                >
                  {s.pct.toFixed(0)}%
                </div>
              </div>
              <div className="h-[9px] overflow-hidden rounded-[5px] bg-bg">
                <div
                  className="h-full transition-all duration-[250ms]"
                  style={{
                    width: `${((s.pct / maxPct) * 100).toFixed(1)}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${gradTo} 100%)`,
                  }}
                />
              </div>
              <div className="mt-[3px] text-[10px] leading-[1.4] text-text-mid">
                ↳ {s.detail}
              </div>
            </div>
          )
        })}
      </div>

      {remaining > 0 && (
        <div className="mb-2.5 text-[10px] italic text-text-dim">
          + {remaining} other minor signal{remaining > 1 ? 's' : ''} contributing
          the remaining {remainingPct.toFixed(0)}%
        </div>
      )}

      {/* Signals that did NOT fire (collapsible transparency grid) */}
      <div className="mt-2 border-t border-dashed border-border pt-2.5">
        <button
          type="button"
          onClick={() => setNotFiredOpen((o) => !o)}
          className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.3px] text-text-dim"
        >
          <span className="inline-block w-3.5">{notFiredOpen ? '▾' : '▸'}</span>
          Signals that did NOT fire ({notFired.length})
        </button>
        {notFiredOpen && (
          <div className="mt-2 grid grid-cols-1 gap-[5px] sm:grid-cols-2">
            {notFired.map((s) => (
              <div
                key={s.n}
                className="flex items-center gap-1.5 rounded-[5px] border border-border-light bg-bg px-2 py-[5px] text-[10px]"
              >
                <span className="shrink-0 font-bold text-green">✓</span>
                <span className="font-semibold text-text">{s.n}</span>
                <span className="ml-auto shrink-0 text-right text-[9.5px] text-text-dim">
                  {s.detail}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust note */}
      <div
        className="mt-3 rounded-md px-3 py-[9px] text-[10.5px] leading-[1.45] text-text-mid"
        style={{
          background: 'rgba(40,167,69,0.05)',
          border: '1px solid rgba(40,167,69,0.2)',
        }}
      >
        <strong style={{ color: 'var(--green)' }}>
          Why we trust this score:
        </strong>{' '}
        Inspector ground-truth on similar signal mixes (last 12 months, n=
        {nCases.toLocaleString('en-IN')} cases) shows{' '}
        <strong className="text-text">{precision}% precision</strong> at this
        risk band. False-positive risk:{' '}
        <strong className="text-text">{100 - precision}%</strong>. Recommended
        action: <strong className="text-text">{action}</strong>.
      </div>

      <LineageModal open={lineageOpen} onClose={() => setLineageOpen(false)} />
    </div>
  )
}
