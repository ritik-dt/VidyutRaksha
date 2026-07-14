import { useMemo, useState } from 'react'
import { APPEALS, filterAppeals } from '../data/appeals'
import type { AppealsFilter } from '../types'

/**
 * Appeals state — active KPI-set filter + derived filtered list.
 * Presentational components stay stateless; the data source stays swappable.
 */
export function useAppeals() {
  const [filter, setFilter] = useState<AppealsFilter>({})

  const filtered = useMemo(() => filterAppeals(APPEALS, filter), [filter])

  function clearFilter() {
    setFilter({})
  }

  function resetToDefault() {
    setFilter({})
  }

  return {
    appeals: APPEALS,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    filtered,
  }
}
