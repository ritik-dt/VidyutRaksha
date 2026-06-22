import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { FilterBar } from '@/shared/components/ui/FilterBar'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'

interface AlertItem {
  id: string
  sev: 'Critical' | 'Warning' | 'Info'
  time: string
  ageMin: number
  acked: boolean
  entity: string
  msg: string
  rule: string
  action: string
  cat: 'dt' | 'feeder' | 'meter' | 'system'
}

const ALERTS_DATA: AlertItem[] = [
  { id: 'A-2098', sev: 'Critical', time: '2 min ago', ageMin: 2, acked: false, entity: 'DT-0445', msg: 'DT loading exceeded 94% — potential transformer failure risk', rule: 'DT overload', action: 'Create case', cat: 'dt' },
  { id: 'A-2097', sev: 'Critical', time: '18 min ago', ageMin: 18, acked: false, entity: 'Feeder Bhelupur', msg: '12 meters showed synchronized zero consumption — organized theft pattern', rule: 'Cluster detection', action: 'Investigate', cat: 'feeder' },
  { id: 'A-2096', sev: 'Warning', time: '42 min ago', ageMin: 42, acked: false, entity: 'Meter #1849966', msg: 'Risk score crossed threshold (88 → from 72)', rule: 'Risk escalation', action: 'Assign inspector', cat: 'meter' },
  { id: 'A-2095', sev: 'Warning', time: '1h ago', ageMin: 60, acked: true, entity: 'DTR Vijaya Complex', msg: 'AT&C loss increased by 3.2pp this week — above alert threshold', rule: 'Loss spike', action: 'View analytics', cat: 'dt' },
  { id: 'A-2094', sev: 'Critical', time: '2h ago', ageMin: 120, acked: true, entity: 'Feeder Rathayatra', msg: 'SAIDI jumped from 14.2 to 22.8 hrs — reliability degradation', rule: 'SAIDI threshold', action: 'View reliability', cat: 'feeder' },
  { id: 'A-2093', sev: 'Info', time: '3h ago', ageMin: 180, acked: false, entity: 'MRI ingestion', msg: '851 new suspicious meters detected in nightly batch', rule: 'Batch summary', action: 'Review batch', cat: 'system' },
  { id: 'A-2092', sev: 'Warning', time: '5h ago', ageMin: 300, acked: false, entity: '8,420 meters', msg: 'Meters in Raghunath Nagar stopped reporting — communication issue', rule: 'Comm failure', action: 'Dispatch team', cat: 'meter' },
  { id: 'A-2091', sev: 'Info', time: 'Yesterday', ageMin: 1440, acked: true, entity: 'Model v2.5', msg: 'Model retrained overnight — false positives reduced by 8%', rule: 'Model update', action: 'View metrics', cat: 'system' },
]

const CATEGORIES = [
  { id: 'all', label: '🔔 All alerts' },
  { id: 'meter', label: '🔌 Meter' },
  { id: 'dt', label: '⚡ DT / transformer' },
  { id: 'feeder', label: '🔋 Feeder / network' },
  { id: 'system', label: '📊 System' },
]

const SEV_FILTERS = [
  { value: 'all', label: 'All severity' },
  { value: 'Critical', label: '🔴 Critical' },
  { value: 'Warning', label: '🟡 Warning' },
  { value: 'Info', label: '🔵 Info' },
  { value: 'unacked', label: 'Unacknowledged' },
  { value: 'stale', label: '⏰ Stale (>1h)' },
]

function getSevColor(sev: string) {
  if (sev === 'Critical') return 'var(--red)'
  if (sev === 'Warning') return 'var(--amber)'
  return 'var(--teal)'
}
function getSevBg(sev: string) {
  if (sev === 'Critical') return 'rgba(220,53,69,.1)'
  if (sev === 'Warning') return 'rgba(230,146,30,.1)'
  return 'rgba(23,162,184,.1)'
}

export default function AlertsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeCat, setActiveCat] = useState('all')
  const [sevFilter, setSevFilter] = useState('all')
  const [ackedMap, setAckedMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALERTS_DATA.map((a) => [a.id, a.acked])),
  )

  const totalCritical = ALERTS_DATA.filter((a) => a.sev === 'Critical').length
  const totalWarning = ALERTS_DATA.filter((a) => a.sev === 'Warning').length
  const totalInfo = ALERTS_DATA.filter((a) => a.sev === 'Info').length
  const totalUnacked = ALERTS_DATA.filter((a) => !ackedMap[a.id]).length
  const totalStale = ALERTS_DATA.filter((a) => !ackedMap[a.id] && a.ageMin >= 60).length

  const filtered = ALERTS_DATA.filter((a) => {
    const catOk = activeCat === 'all' || a.cat === activeCat
    const sevOk =
      sevFilter === 'all' ? true :
      sevFilter === 'unacked' ? !ackedMap[a.id] :
      sevFilter === 'stale' ? (!ackedMap[a.id] && a.ageMin >= 60) :
      a.sev === sevFilter
    return catOk && sevOk
  })

  function ack(id: string) {
    setAckedMap((prev: Record<string, boolean>) => ({ ...prev, [id]: true }))
    showToast({ type: 'success', title: 'Alert acknowledged', message: `Alert ${id} acknowledged`, duration: 2500 })
  }

  function ackAll() {
    const newMap = Object.fromEntries(ALERTS_DATA.map((a) => [a.id, true]))
    setAckedMap(newMap)
    showToast({ type: 'success', title: 'All alerts acknowledged', message: `Acknowledged ${totalUnacked} unacknowledged alerts.`, duration: 3500 })
  }

  return (
    <div className="pb-8">
      <PageHeader
        title="🔔 Alerts & notifications"
        subtitle="Real-time alerts from detection engine, network health, and program events"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate(getPathForScreen('settings'))}
            >
              ⚙️ Configure rules
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={ackAll}
            >
              ✓ Acknowledge all
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
            >
              ✦ AI prioritize
            </button>
          </>
        }
      />

      {/* AI Insight */}
      <AiInsightBanner
        title="AI alert summary"
      >
        You have{' '}
        <strong style={{ color: 'var(--red)' }}>{totalCritical} critical alerts</strong> requiring immediate attention.
        The most urgent: <strong>12-meter cluster in Feeder Bhelupur</strong> showing synchronized zero consumption —
        this is the strongest organized-theft signal detected this week. I recommend dispatching a batch inspection team.
        DT-0445 is approaching failure threshold (94% loading) — schedule load rebalancing.
        {totalStale > 0 && (
          <>
            <br /><br />
            <strong style={{ color: 'var(--amber)' }}>
              ⏰ {totalStale} alert{totalStale > 1 ? 's have' : ' has'} been unacknowledged for over 1 hour
            </strong>{' '}
            — review at the top of the list below.
          </>
        )}
      </AiInsightBanner>

      {/* KPI Row */}
      <div className="kpi-row mb-5 flex flex-wrap gap-3">
        {[
          { label: 'Critical', value: String(totalCritical), sub: 'Needs immediate action', accent: 'var(--red)', valueColor: 'var(--red)', filter: 'Critical' },
          { label: 'Warning', value: String(totalWarning), sub: 'Review within the hour', accent: 'var(--amber)', valueColor: 'var(--amber)', filter: 'Warning' },
          { label: 'Info', value: String(totalInfo), sub: 'FYI — no action required', accent: 'var(--teal)', valueColor: 'var(--teal)', filter: 'Info' },
          { label: 'Unacknowledged', value: String(totalUnacked), sub: 'Need review', accent: 'var(--ai-purple)', valueColor: 'var(--text)', filter: 'unacked' },
          { label: 'Stale (>1h)', value: String(totalStale), sub: 'Old unacked alerts', accent: '#F4A847', valueColor: totalStale > 0 ? 'var(--amber-dark)' : 'var(--text)', filter: 'stale' },
        ].map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => setSevFilter(kpi.filter)}
            className="kpi-card clickable relative min-w-[120px] flex-1 overflow-hidden rounded-xl border border-border bg-card p-4 px-[18px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:shadow-md"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: kpi.accent }} />
            <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.5px] text-text-dim">{kpi.label}</div>
            <div className="font-mono text-2xl font-extrabold" style={{ color: kpi.valueColor }}>{kpi.value}</div>
            <div className="mt-0.5 text-[10px] text-text-mid">{kpi.sub}</div>
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const count = cat.id === 'all' ? ALERTS_DATA.length : ALERTS_DATA.filter((a) => a.cat === cat.id).length
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCat(cat.id)}
              className="rounded-lg border px-3 py-[5px] text-[11px] font-semibold transition-all"
              style={{
                borderColor: activeCat === cat.id ? 'var(--ai-purple)' : 'var(--border)',
                background: activeCat === cat.id ? 'var(--ai-purple)' : 'var(--card)',
                color: activeCat === cat.id ? '#fff' : 'var(--text-mid)',
              }}
            >
              {cat.label}
              <span
                className="ml-1.5 rounded-full px-1.5 py-px text-[10px]"
                style={{
                  background: activeCat === cat.id ? 'rgba(255,255,255,0.2)' : 'var(--bg)',
                  color: activeCat === cat.id ? '#fff' : 'var(--text-dim)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Severity filter bar */}
      <FilterBar filters={SEV_FILTERS} active={sevFilter} onChange={setSevFilter} className="mb-3" />

      {/* Alerts list */}
      <div className="space-y-2">
        {filtered.map((alert) => {
          const isAcked = ackedMap[alert.id]
          const color = getSevColor(alert.sev)
          const bg = getSevBg(alert.sev)
          const isStale = !isAcked && alert.ageMin >= 60

          return (
            <div
              key={alert.id}
              className="card mb-0 overflow-hidden transition-all"
              style={{
                borderLeft: `4px solid ${isAcked ? 'var(--border)' : color}`,
                opacity: isAcked ? 0.65 : 1,
              }}
            >
              <div className="flex items-start gap-3 p-[12px_14px]">
                {/* Severity badge */}
                <div
                  className="mt-0.5 flex h-[28px] shrink-0 items-center justify-center rounded-lg px-2 text-[10px] font-bold whitespace-nowrap"
                  style={{ background: bg, color }}
                >
                  {alert.sev}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--id-text)' }}>
                      {alert.id}
                    </span>
                    <span className="font-semibold text-[11.5px] text-text">{alert.entity}</span>
                    {isStale && (
                      <span className="rounded-full px-1.5 py-px text-[9px] font-bold" style={{ background: 'rgba(230,146,30,0.15)', color: 'var(--amber-dark)' }}>
                        ⏰ STALE
                      </span>
                    )}
                    {isAcked && (
                      <span className="rounded-full px-1.5 py-px text-[9px] font-semibold text-text-dim" style={{ background: 'var(--bg)' }}>
                        ✓ Acked
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] leading-[1.45] text-text-mid">{alert.msg}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-text-dim">
                    <span>Rule: <span className="font-medium text-text-mid">{alert.rule}</span></span>
                    <span>·</span>
                    <span>{alert.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {!isAcked && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '10px', padding: '3px 8px' }}
                      onClick={() => ack(alert.id)}
                    >
                      ✓ Ack
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ai btn-sm"
                    style={{ fontSize: '10px', padding: '3px 10px' }}
                    onClick={() => {
                      if (alert.cat === 'meter') navigate(getPathForScreen('meters'))
                      else if (alert.cat === 'dt') navigate(getPathForScreen('dtload'))
                      else if (alert.cat === 'feeder') navigate(getPathForScreen('clusters'))
                      else navigate(getPathForScreen('analytics'))
                    }}
                  >
                    {alert.action} →
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="card py-10 text-center text-[13px] text-text-dim">
            <div className="mb-2 text-3xl">✅</div>
            <div className="font-semibold">No alerts in this category</div>
            <div className="mt-1 text-[11px]">All clear for the selected filter.</div>
          </div>
        )}
      </div>
    </div>
  )
}
