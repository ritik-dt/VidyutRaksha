import { useMemo, useState } from 'react'
import type { SuspMeter } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'
import { buildTamperEventsRaw } from '@/features/Meters/data/meterAnalysisData'
import { TamperCriticalityCard } from './TamperCriticalityCard'

interface TamperEventsTabProps {
  meter: SuspMeter
}

const EVENT_COLOR: Record<string, string> = {
  'Earth Loading': 'var(--red)',
  'Power Failure': 'var(--amber)',
  'Neutral Disturbance': 'var(--ai-purple)',
}

// ─── Tamper Events Tab — mirrors prototype's tab-events exactly ──────────────
export function TamperEventsTab({ meter }: TamperEventsTabProps) {
  const realData = REAL_METER_DATA[meter.id]
  const raw = useMemo(() => buildTamperEventsRaw(meter, realData), [meter, realData])
  const [showAll, setShowAll] = useState(false)

  const showCount = showAll ? raw.total : Math.min(100, raw.total)
  const visible = raw.events.slice(0, showCount)

  return (
    <div>
      <div className="mb-4">
        <TamperCriticalityCard meter={meter} canvasIdSuffix="events" />
      </div>

      {raw.total === 0 ? (
        <div className="card">
          <div className="card-title text-[13px] font-bold">Tamper events</div>
          <p className="mt-2 text-[11.5px] text-text-dim">No tamper events on record for this meter.</p>
        </div>
      ) : (
        <div className="card">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3.5">
            <div>
              <div className="card-title flex items-center text-[13px] font-bold">
                Tamper events
                <span
                  className="ml-1.5 inline-block rounded-md px-1.5 py-px text-[9px] font-extrabold tracking-[.3px]"
                  style={{ background: 'rgba(40,167,69,.12)', color: 'var(--green)', border: '1px solid rgba(40,167,69,.3)' }}
                >
                  ✓ FROM REAL MRI
                </span>
              </div>
              <div className="mt-1 text-[10.5px] text-text-dim">
                Showing latest {showCount} of {raw.total} lifetime events with RTC timestamps · use the
                year-by-year chart in the Real MRI panel above to drill by year
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-lg px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                ⚠ {raw.earthCount} Earth Loading events
              </span>
              <span className="rounded-lg border border-border bg-bg px-2.5 py-1 text-[11px] font-semibold text-text-mid">
                {raw.total} total
              </span>
            </div>
          </div>

          <div className="table-wrap scrollable">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="table-header">
                  <th className="px-3 py-2.5 text-left">Timestamp (RTC)</th>
                  <th className="px-3 py-2.5 text-left">Event</th>
                  <th className="px-3 py-2.5 text-left">Occurrence</th>
                  <th className="px-3 py-2.5 text-left">kWh at event</th>
                  <th className="px-3 py-2.5 text-left">V</th>
                  <th className="px-3 py-2.5 text-left">I</th>
                  <th className="px-3 py-2.5 text-left">PF</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((e, i) => (
                  <tr key={i} className="table-row">
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[10.5px] text-text-mid">{e.ts}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="inline-block rounded-full px-2 py-px text-[9.5px] font-bold text-white"
                        style={{ background: EVENT_COLOR[e.type] ?? 'var(--text-dim)' }}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td
                      className="px-3 py-2.5 text-[11px] font-semibold"
                      style={{ color: e.occ === 'Occurrence' ? 'var(--red)' : 'var(--green)' }}
                    >
                      {e.occ}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[10.5px] text-text-mid">
                      {e.kwhAt != null ? e.kwhAt.toFixed(2) : '—'}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[10.5px] text-text-mid">{e.v != null ? e.v : '—'}</td>
                    <td className="px-3 py-2.5 font-mono text-[10.5px] text-text-mid">{e.i != null ? e.i.toFixed(2) : '—'}</td>
                    <td
                      className="px-3 py-2.5 font-mono text-[10.5px] font-semibold"
                      style={{ color: e.pf != null && e.pf < 0.85 ? 'var(--red)' : 'var(--text-mid)' }}
                    >
                      {e.pf != null ? e.pf.toFixed(2) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showAll && raw.total > 100 && (
            <div className="mt-3 text-center text-[11px] text-text-dim">
              Showing latest 100 of {raw.total} events.{' '}
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="font-semibold text-ai-purple hover:underline"
              >
                Load all {raw.total} events →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
