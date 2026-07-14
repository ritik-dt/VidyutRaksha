import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { useActivityLog } from '@/shared/context/ActivityLogContext'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import { useAlerts } from './hooks/useAlerts'
import { AlertsKpiStrip } from './components/AlertsKpiStrip'
import { AlertFeed } from './components/AlertFeed'
import type { AlertItem } from './types'

export default function AlertsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { logActivity } = useActivityLog()
  const {
    alerts,
    activeCat,
    setActiveCat,
    filter,
    setFilter,
    clearFilter,
    ackedMap,
    ack,
    ackAll,
    stats,
    filtered,
  } = useAlerts()

  const filterEntries: FilterPillEntry[] = []
  if (filter.severity) filterEntries.push({ label: 'Severity', value: filter.severity })
  if (filter.status) filterEntries.push({ label: 'Status', value: filter.status })

  function handleAck(id: string) {
    ack(id)
    showToast({ type: 'success', title: 'Alert acknowledged', message: `Alert ${id} acknowledged.`, duration: 2500 })
    logActivity('Acknowledged alert', 'alerts', id)
  }

  function handleAckAll() {
    ackAll()
    showToast({
      type: 'success',
      title: 'All alerts acknowledged',
      message: `Acknowledged ${stats.totalUnacked} unacknowledged alerts across all categories.`,
      duration: 3500,
    })
  }

  function handleAction(alert: AlertItem) {
    showToast({ type: 'info', title: alert.action, message: `Action triggered for alert ${alert.id}.`, duration: 3000 })
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="🔔 Alerts & notifications"
        subtitle="Real-time alerts from detection engine, network health, and program events"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                navigate(getPathForScreen('settings'))
                showToast({
                  type: 'info',
                  title: 'Alert rules in Settings',
                  message: 'Rule configuration moved to Settings → Alert rules. Edit thresholds, channels, severity here.',
                  duration: 4000,
                })
              }}
            >
              ⚙️ Configure rules
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleAckAll}>
              ✓ Acknowledge all
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'AI prioritization',
                  message: 'AI re-ranked the alerts by urgency and blast radius.',
                  duration: 3000,
                })
              }
            >
              ✦ AI prioritize
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill
          entries={filterEntries}
          onClear={clearFilter}
          backLabel="Alerts"
          onBack={() => {
            clearFilter()
            setActiveCat('all')
          }}
        />
      )}

      <AiInsightBanner title="AI alert summary">
        You have{' '}
        <strong style={{ color: 'var(--red)' }}>{stats.totalCritical} critical alerts</strong> requiring immediate
        attention. The most urgent: <strong>12-meter cluster in Feeder Bhelupur</strong> showing synchronized zero
        consumption — this is the strongest organized-theft signal detected this week. I recommend dispatching a batch
        inspection team. DT-0445 is approaching failure threshold (94% loading) — schedule load rebalancing.
        {stats.totalStale > 0 && (
          <>
            <br />
            <br />
            <strong style={{ color: 'var(--amber)' }}>
              ⏰ {stats.totalStale} alert{stats.totalStale > 1 ? 's have' : ' has'} been unacknowledged for over 1 hour
            </strong>{' '}
            — review at the top of the list below.
          </>
        )}
      </AiInsightBanner>

      <AlertsKpiStrip stats={stats} onFilter={setFilter} />

      <AlertFeed
        alerts={alerts}
        filtered={filtered}
        activeCat={activeCat}
        onSelectCat={setActiveCat}
        filter={filter}
        ackedMap={ackedMap}
        onAck={handleAck}
        onAction={handleAction}
      />
    </div>
  )
}
