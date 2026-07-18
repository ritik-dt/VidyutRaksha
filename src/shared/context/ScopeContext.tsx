import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import { hierData } from '@/data/hierarchy'
import type { HierNode, HierPath } from '@/shared/types'

export interface ScopeContextValue {
  hierData: typeof hierData
  hierPath: HierPath
  currentNode: HierNode | null
  scopeLabel: string
  scopeVersion: number
  scopePickerOpen: boolean
  expandedNodes: Set<string>
  openScopePicker: () => void
  closeScopePicker: () => void
  toggleScopePicker: () => void
  jumpToScope: (nodeId: string) => void
  navigateToPathIndex: (index: number) => void
  drillToChild: (childId: string) => void
  toggleScopeNode: (nodeId: string) => void
  resetScope: () => void
  setExpandedNodes: Dispatch<SetStateAction<Set<string>>>
}

/**
 * Scope context — split from `ScopeProvider.tsx` so this module exports only
 * non-components. See ThemeContext for the Fast Refresh rationale.
 */
export const ScopeContext = createContext<ScopeContextValue | null>(null)

export function useScope(): ScopeContextValue {
  const context = useContext(ScopeContext)
  if (!context) {
    throw new Error('useScope must be used within ScopeProvider')
  }
  return context
}
