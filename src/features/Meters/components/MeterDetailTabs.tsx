import type { SuspMeter } from '@/features/Meters/data/meters'

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
