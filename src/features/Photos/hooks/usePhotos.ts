import { useMemo, useState } from 'react'
import { PHOTOS, filterPhotos } from '../data/photos'
import type { PhotoFilter, PhotoFilterId } from '../types'

/** Presentation-agnostic Photos state (active tab + KPI filter). */
export function usePhotos() {
  const [activeTab, setActiveTab] = useState<PhotoFilterId>('all')
  const [filter, setFilter] = useState<PhotoFilter>({})

  const filtered = useMemo(
    () => filterPhotos(PHOTOS, activeTab, filter),
    [activeTab, filter],
  )

  function clearFilter() {
    setFilter({})
  }

  function resetToDefault() {
    setFilter({})
    setActiveTab('all')
  }

  return {
    photos: PHOTOS,
    activeTab,
    setActiveTab,
    filter,
    setFilter,
    clearFilter,
    resetToDefault,
    filtered,
  }
}
