import { useCallback, useEffect, useState } from 'react'
import { NAV_SECTIONS } from '@/config/navConfig'

const NAV_COLLAPSE_STORAGE_KEY = '_navCollapsed'

type NavCollapseState = Record<string, boolean>

function readInitialCollapseState(): NavCollapseState {
  const defaults = NAV_SECTIONS.reduce<NavCollapseState>((acc, section) => {
    if (section.defaultCollapsed) {
      acc[section.id] = true
    }
    return acc
  }, {})

  try {
    const stored = localStorage.getItem(NAV_COLLAPSE_STORAGE_KEY)
    if (!stored) {
      return defaults
    }
    const parsed = JSON.parse(stored) as NavCollapseState
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function useNavCollapse() {
  const [collapsedSections, setCollapsedSections] = useState<NavCollapseState>(
    readInitialCollapseState,
  )

  useEffect(() => {
    try {
      localStorage.setItem(
        NAV_COLLAPSE_STORAGE_KEY,
        JSON.stringify(collapsedSections),
      )
    } catch {
      // ignore persistence errors
    }
  }, [collapsedSections])

  const isSectionCollapsed = useCallback(
    (sectionId: string) => collapsedSections[sectionId] === true,
    [collapsedSections],
  )

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }, [])

  return {
    isSectionCollapsed,
    toggleSection,
  }
}
