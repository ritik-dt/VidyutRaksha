import type { SuspMeter } from '@/features/Meters/data/meters'
import { REAL_METER_DATA } from '@/features/Meters/data/realMeterData'

interface MeterInfoTabProps {
  meter: SuspMeter
}

function RealBadge({ label }: { label: string }) {
  return (
    <span
      className="ml-1.5 inline-block rounded-md px-1.5 py-px text-[9px] font-extrabold tracking-[.3px]"
      style={{ background: 'rgba(40,167,69,.12)', color: 'var(--green)', border: '1px solid rgba(40,167,69,.3)' }}
    >
      ✓ {label}
    </span>
  )
}

// 2-col CSS-grid info table, row-major fill — mirrors the prototype's .info-grid /
// .info-item exactly (odd-indexed items, i.e. the left column, get the zebra bg).
function InfoGrid({ fields }: { fields: [string, string | number][] }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {fields.map(([key, val], i) => (
        <div
          key={key}
          className="flex items-center justify-between rounded-md px-3 py-2 text-[11px]"
          style={i % 2 === 0 ? { background: 'var(--bg)' } : undefined}
        >
          <span className="font-medium text-text-dim">{key}</span>
          <span className="font-mono font-semibold text-text">{val}</span>
        </div>
      ))}
    </div>
  )
}

const fmtNum = (v: string | undefined) =>
  v != null && v !== '' && !Number.isNaN(Number(v))
    ? Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : '—'

// ─── Meter Info Tab — mirrors the prototype's tab-info exactly ──────────────
export function MeterInfoTab({ meter }: MeterInfoTabProps) {
  const realData = REAL_METER_DATA[meter.id]
  const isFlagship = realData?.summary != null

  // The flagship meter's consumer-master fields come from the known case file
  // (HEERA LAL AGRAWAL) — the MRI dump itself only carries meter-side fields.
  const flagshipConsumer: [string, string | number][] = [
    ['Account No', '1705463'],
    ['Consumer Name', 'HEERA LAL AGRAWAL'],
    ['Address', 'B-21/56-1, KAMACHHA, BHELUPUR, VARANASI'],
    ['Zone', 'Varanasi I'],
    ['Circle', 'UEDC-I Varanasi'],
    ['Division', 'Bhelupur Division'],
    ['Sub-division', 'Bhelupur West'],
    ['Activity', 'Industrial Establishment'],
    ['Tariff Code', '22'],
    ['Contract Load', '35 KW'],
    ['Ageing Count', 4],
  ]

  const genericConsumer: [string, string | number][] = [
    ['Account No', meter._account ?? '—'],
    ['Consumer Name', meter._consumer ?? `Consumer #${meter.id}`],
    ['Address', '—'],
    ['Zone', meter._zone ?? '—'],
    ['Circle', meter.area?.split('/')[1]?.trim() ?? '—'],
    ['Division', meter.area?.split('/')[0]?.trim() ?? '—'],
    ['Activity', meter._activity ?? meter.cat],
    ['Tariff Code', meter._tariff ?? '—'],
    ['Contract Load', meter._load ? `${meter._load} ${meter._load_unit ?? 'kW'}` : meter.sl],
  ]

  const flagshipMeterSpecs: [string, string | number][] = realData?.summary
    ? [
        ['Meter Number', realData.summary.meter_no || '—'],
        ['Make', realData.summary.meter_make || '—'],
        ['Category', realData.summary.category || '—'],
        ['Current Rating', realData.summary.current_rating || '—'],
        ['Year of Mfg', realData.summary.year_mfg || '—'],
        ['Cumulative kWh', fmtNum(realData.summary.cumul_kwh)],
        ['Cumulative kVAh', fmtNum(realData.summary.cumul_kvah)],
        ['Tamper Count', realData.summary.tamper_count || '—'],
        ['RTC at Read', realData.summary.rtc_date || '—'],
        ['Visit Date', realData.summary.visit_date || '—'],
      ]
    : []

  const genericMeterSpecs: [string, string | number][] = [
    ['Meter Number', meter.id],
    ['Make', meter.id === '884759' ? 'LINKWELL TELESYSTEMS PVT.LTD.HYD' : 'L&T Metering Solutions'],
    ['Year of Mfg', meter.id === '884759' ? '2021' : '2019'],
    ['Cumulative kWh', meter.id === '884759' ? '34,596.31' : '18,420.50'],
    ['Cumulative kVAh', meter.id === '884759' ? '58,853.09' : '19,840.20'],
    ['Lifetime PF', meter.id === '884759' ? '0.588' : '0.924'],
    ['Tamper Count', meter.events.toLocaleString('en-IN')],
    ['Last 7-day Avg kWh/day', meter.id === '884759' ? '21.9' : '8.4'],
    ['Zero-load Intervals (7d)', meter.id === '884759' ? '225 (77.9%)' : '—'],
  ]

  const consumerFields = isFlagship ? flagshipConsumer : genericConsumer
  const meterFields = isFlagship ? flagshipMeterSpecs : genericMeterSpecs

  return (
    <div>
      <div className="card mb-4">
        <div className="card-title mb-3 flex items-center text-[13px] font-bold">
          Consumer details
          {meter._real && <RealBadge label="FROM REAL DATA" />}
        </div>
        <InfoGrid fields={consumerFields} />
      </div>

      <div className="card">
        <div className="card-title mb-3 flex items-center text-[13px] font-bold">
          Meter specifications
          {meter._real && <RealBadge label="FROM REAL MRI" />}
        </div>
        <InfoGrid fields={meterFields} />
      </div>
    </div>
  )
}
