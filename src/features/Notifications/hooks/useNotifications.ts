import { useMemo, useState } from 'react'
import {
  NOTIFICATIONS,
  computeNotificationStats,
  filterNotifications,
  getTabCount,
} from '../data/notifications'
import type {
  NotificationFilter,
  NotificationFilterId,
} from '../types'

/**
 * Notifications state: read overrides (per-item + mark-all), the active filter
 * tab, and the KPI-set filter. Presentational components stay stateless and the
 * data source stays swappable.
 */
export function useNotifications() {
  const [activeTab, setActiveTab] = useState<NotificationFilterId>('all')
  const [filter, setFilter] = useState<NotificationFilter>({})
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({})

  const stats = useMemo(
    () => computeNotificationStats(NOTIFICATIONS, readOverrides),
    [readOverrides],
  )
  const filtered = useMemo(
    () => filterNotifications(NOTIFICATIONS, activeTab, filter, readOverrides),
    [activeTab, filter, readOverrides],
  )
  const tabCount = (id: NotificationFilterId) =>
    getTabCount(NOTIFICATIONS, id, readOverrides)
  const isRead = (id: string, seed: boolean) => readOverrides[id] ?? seed

  function markRead(id: string) {
    setReadOverrides((prev) => ({ ...prev, [id]: true }))
  }

  function markAllRead() {
    const map: Record<string, boolean> = {}
    NOTIFICATIONS.forEach((n) => {
      map[n.id] = true
    })
    setReadOverrides(map)
  }

  function clearFilter() {
    setFilter({})
  }

  function resetToDefault() {
    setFilter({})
    setActiveTab('all')
  }

  return {
    notifications: NOTIFICATIONS,
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
  }
}
