import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_HIER_PATH,
  HIER_ROOT_ID,
  hierData,
} from '@/data/hierarchy'
import type { HierPath } from '@/shared/types'
import {
  getNodeAtPath,
  getScopeLabel,
  isHierAwareScreen,
  scopePathFor,
} from '@/shared/utils/hierarchy'
import { ScopeContext, type ScopeContextValue } from './ScopeContext'
import { useNavigation } from './NavigationContext'
import { useToast } from './ToastContext'

function createExpandedSetForPath(path: HierPath): Set<string> {
  return new Set(path)
}

interface ScopeProviderProps {
  children: ReactNode
}

/**
 * Provides the current hierarchical scope (State → DISCOM → Zone → … → DTR)
 * and the derived facilities every scoped page depends on: the currently
 * selected node, breadcrumb label, and a monotonically-incrementing
 * `scopeVersion` used as the shell's `<Outlet />` `key` so pages remount on
 * scope change (matching the prototype's "renderPage on scope change"
 * behaviour).
 */
export function ScopeProvider({ children }: ScopeProviderProps) {
  const { showToast } = useToast()
  const { currentScreen } = useNavigation()
  const [hierPath, setHierPath] = useState<HierPath>(DEFAULT_HIER_PATH)
  const [scopeVersion, setScopeVersion] = useState(0)
  const [scopePickerOpen, setScopePickerOpen] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() =>
    createExpandedSetForPath(DEFAULT_HIER_PATH),
  )

  const currentNode = useMemo(
    () => getNodeAtPath(hierPath, hierData),
    [hierPath],
  )

  const scopeLabel = useMemo(
    () => getScopeLabel(hierPath, hierData),
    [hierPath],
  )

  const openScopePicker = useCallback(() => {
    setExpandedNodes((current: Set<string>) => {
      const next = new Set(current)
      hierPath.forEach((id: string) => next.add(id))
      return next
    })
    setScopePickerOpen(true)
  }, [hierPath])

  const closeScopePicker = useCallback(() => {
    setScopePickerOpen(false)
  }, [])

  const toggleScopePicker = useCallback(() => {
    if (scopePickerOpen) {
      closeScopePicker()
      return
    }
    openScopePicker()
  }, [scopePickerOpen, closeScopePicker, openScopePicker])

  const applyScopePath = useCallback(
    (newPath: HierPath) => {
      if (newPath.length === 0) {
        return
      }

      setHierPath(newPath)
      setScopeVersion((version: number) => version + 1)
      closeScopePicker()
    },
    [closeScopePicker],
  )

  const jumpToScope = useCallback(
    (nodeId: string) => {
      if (!hierData[nodeId]) {
        return
      }

      const newPath = scopePathFor(nodeId, hierData)
      applyScopePath(newPath)

      if (isHierAwareScreen(currentScreen)) {
        return
      }

      showToast({
        type: 'info',
        title: 'Scope updated',
        message: `Scope set to ${hierData[nodeId].name}. Navigate to Overview, Suspicious meters, Cases, or Tamper & anomaly reports to see scoped data.`,
        duration: 4500,
      })
    },
    [applyScopePath, currentScreen, showToast],
  )

  const navigateToPathIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= hierPath.length) {
        return
      }
      applyScopePath(hierPath.slice(0, index + 1))
    },
    [applyScopePath, hierPath],
  )

  const drillToChild = useCallback(
    (childId: string) => {
      if (!hierData[childId]) {
        showToast({
          type: 'info',
          title: 'Not yet in prototype data',
          message:
            'This prototype demonstrates the full drill-down on the KVVNL → Varanasi → EUDC I/II → Bhelupur path. Other paths will be available with live database connection.',
          duration: 5000,
        })
        return
      }
      jumpToScope(childId)
    },
    [jumpToScope, showToast],
  )

  const toggleScopeNode = useCallback((nodeId: string) => {
    setExpandedNodes((current: Set<string>) => {
      const next = new Set(current)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  const resetScope = useCallback(() => {
    jumpToScope(HIER_ROOT_ID)
  }, [jumpToScope])

  const value = useMemo<ScopeContextValue>(
    () => ({
      hierData,
      hierPath,
      currentNode,
      scopeLabel,
      scopeVersion,
      scopePickerOpen,
      expandedNodes,
      openScopePicker,
      closeScopePicker,
      toggleScopePicker,
      jumpToScope,
      navigateToPathIndex,
      drillToChild,
      toggleScopeNode,
      resetScope,
      setExpandedNodes,
    }),
    [
      hierPath,
      currentNode,
      scopeLabel,
      scopeVersion,
      scopePickerOpen,
      expandedNodes,
      openScopePicker,
      closeScopePicker,
      toggleScopePicker,
      jumpToScope,
      navigateToPathIndex,
      drillToChild,
      toggleScopeNode,
      resetScope,
    ],
  )

  return (
    <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>
  )
}
