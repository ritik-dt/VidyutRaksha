import { useMemo, useState } from 'react'
import { RECENT_NOTICES } from '../data/notices'
import type { NoticeLanguage, NoticesFilter } from '../types'

/**
 * Notices state — active language (preview) + KPI-set filter.
 * Filtered rows recompute when the filter changes.
 */
export function useNotices() {
  const [language, setLanguage] = useState<NoticeLanguage>('en')
  const [filter, setFilter] = useState<NoticesFilter>({})

  const filteredNotices = useMemo(() => {
    if (filter.status === 'sent') {
      return RECENT_NOTICES.filter((n) => n.response !== 'Pending')
    }
    return RECENT_NOTICES
  }, [filter])

  function clearFilter() {
    setFilter({})
  }

  function resetToDefault() {
    setFilter({})
    setLanguage('en')
  }

  return {
    language,
    setLanguage,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    filteredNotices,
  }
}
