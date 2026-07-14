import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { AiInsightBanner } from '@/shared/components/ui/AiInsightBanner'
import { FilterPill, type FilterPillEntry } from '@/shared/components/ui/FilterPill'
import { PillTabs, type PillTabOption } from '@/shared/components/ui/PillTabs'
import { useToast } from '@/shared/context/ToastContext'
import { getPathForScreen } from '@/shared/utils/navigation'
import { useNotifications } from './hooks/useNotifications'
import { NotificationsKpiStrip } from './components/NotificationsKpiStrip'
import { NotificationsList } from './components/NotificationsList'
import { NOTIFICATION_TABS } from './data/notifications'
import type { Notification, NotificationFilterId } from './types'

const AVG_RESPONSE_MINUTES = 18

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    notifications,
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    stats,
    filtered,
    tabCount,
    isRead,
    markRead,
    markAllRead,
  } = useNotifications()

  const filterEntries: FilterPillEntry[] = []
  if (filter.read === 'false') filterEntries.push({ label: 'Status', value: 'Unread' })
  if (filter.type) filterEntries.push({ label: 'Type', value: filter.type })

  function handleItemClick(n: Notification) {
    markRead(n.id)

    // '#' link — matches the prototype's inert anchor; show a friendly toast.
    if (n.link === '#') {
      showToast({
        type: 'info',
        title: n.action,
        message: n.context,
        duration: 3500,
      })
      return
    }

    // caseDetail needs a case ID — extract "C-YYYYMMDD-NNN" from action/context.
    if (n.link === 'caseDetail') {
      const match = `${n.action} ${n.context}`.match(/C-\d{8}-\d{3}/)
      const caseId = match?.[0]
      if (caseId) {
        navigate(`/cases/${caseId}`)
        return
      }
      // No ID found — open the Cases list rather than dropping to Dashboard.
      navigate('/cases')
      return
    }

    // Any other known screen — the util's fallback for unknown names is
    // `/dashboard`, which is not useful here, so we only navigate for the
    // known non-detail routes and toast otherwise.
    const KNOWN_ROUTES: Record<string, string> = {
      cases: '/cases',
      alerts: '/alerts',
      appeals: '/appeals',
      meters: '/meters',
      dashboard: '/dashboard',
      diagnostics: '/diagnostics',
      clusters: '/clusters',
      assessment: '/assessment',
      notifications: '/notifications',
    }
    const path = KNOWN_ROUTES[n.link]
    if (path) {
      navigate(path)
    } else {
      showToast({ type: 'info', title: n.action, message: n.context, duration: 3500 })
    }
  }

  function handleMarkAllRead() {
    if (stats.unread === 0) {
      showToast({ type: 'info', title: 'Nothing to mark', message: 'You have no unread notifications.', duration: 2000 })
      return
    }
    const n = stats.unread
    markAllRead()
    showToast({ type: 'success', title: 'Marked all as read', message: `${n} unread notifications marked as read.`, duration: 2500 })
  }

  function handlePreferences() {
    navigate(getPathForScreen('settings'))
    showToast({
      type: 'info',
      title: 'Notification preferences in Settings',
      message: 'Channel preferences, digest, and quiet hours moved to Settings.',
      duration: 4000,
    })
  }

  return (
    <div className="pb-2">
      <PageHeader
        title="🔔 Notifications"
        subtitle="Your personal updates — mentions, case activity, assignments, and reminders"
        actions={
          <>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
              ✓ Mark all read
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handlePreferences}>
              ⚙️ Preferences
            </button>
            <button
              type="button"
              className="btn btn-ai btn-sm"
              onClick={() =>
                showToast({
                  type: 'ai',
                  title: 'Summarizing notifications',
                  message: 'AI-generated summary of your unread notifications ready.',
                  duration: 3000,
                })
              }
            >
              ✦ Summarize
            </button>
          </>
        }
      />

      {filterEntries.length > 0 && (
        <FilterPill entries={filterEntries} onClear={clearFilter} backLabel="Notifications" onBack={resetToDefault} />
      )}

      <AiInsightBanner title="AI daily digest">
        <strong className="text-ai-purple">{stats.unread} unread notifications</strong> since your last visit. Priority items:{' '}
        <strong className="text-ai-purple">Rajiv Mehta mentioned you</strong> on the HEERA LAL case (expecting your response),{' '}
        <strong className="text-ai-purple">3 new cases assigned</strong> automatically by the system, and an{' '}
        <strong className="text-ai-purple">appeal filed</strong> on one of your active cases (hearing in 5 days). Your tomorrow's calendar:{' '}
        <strong className="text-ai-purple">2 hearings scheduled</strong>. Recommended action: prepare the AP-2026-018 hearing brief today.
      </AiInsightBanner>

      <NotificationsKpiStrip
        stats={stats}
        avgResponseMinutes={AVG_RESPONSE_MINUTES}
        onFilter={setFilter}
      />

      <PillTabs<NotificationFilterId>
        tabs={NOTIFICATION_TABS.map((t) => ({
          ...t,
          count: t.id === 'unread' ? tabCount('unread') : undefined,
        })) as PillTabOption<NotificationFilterId>[]}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />

      <NotificationsList
        notifications={notifications}
        filtered={filtered}
        activeTab={activeTab}
        isRead={isRead}
        onItemClick={handleItemClick}
      />
    </div>
  )
}
