import { useMemo, useState } from 'react'
import {
  ALERTS_DATA,
  computeAlertStats,
  filterAlerts,
} from '../data/alerts'
import type { AlertCategoryId, AlertFilter } from '../types'

/**
 * Encapsulates all Alerts state (category tab, active filter, acked status) and
 * derived data (stats + filtered feed). Keeps the page component presentational
 * and the logic API-swappable.
 */
export function useAlerts() {
  const [activeCat, setActiveCat] = useState<AlertCategoryId>('all')
  const [filter, setFilter] = useState<AlertFilter>({})
  const [ackedMap, setAckedMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALERTS_DATA.map((a) => [a.id, a.acked])),
  )

  const stats = useMemo(() => computeAlertStats(ALERTS_DATA, ackedMap), [ackedMap])
  const filtered = useMemo(
    () => filterAlerts(ALERTS_DATA, activeCat, filter, ackedMap),
    [activeCat, filter, ackedMap],
  )

  function ack(id: string) {
    setAckedMap((prev) => ({ ...prev, [id]: true }))
  }

  function ackAll() {
    setAckedMap(Object.fromEntries(ALERTS_DATA.map((a) => [a.id, true])))
  }

  function clearFilter() {
    setFilter({})
  }

  return {
    alerts: ALERTS_DATA,
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
  }
}
