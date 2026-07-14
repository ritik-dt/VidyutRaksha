import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRole } from '@/shared/context/RoleContext'
import type { RoleId } from '@/shared/types/role'

/**
 * One recorded user action. Mirrors the prototype's logActivity() entry shape.
 */
export interface ActivityEntry {
  id: string
  /** epoch millis */
  ts: number
  roleId: RoleId
  roleLabel: string
  action: string
  screen: string
  /** what was acted on; '—' when not applicable. */
  target: string
  scope: string
}

/**
 * Append-only activity log.
 *
 * Ports the prototype's `window._activityLog` + logActivity(): each entry is
 * unshifted (newest first) and the log is capped at 200 entries to avoid
 * unbounded growth. This is the feed the Audit trail screen consumes, so every
 * module that performs a meaningful action logs to it. Settings is the first
 * producer; more will follow.
 */
interface ActivityLogContextValue {
  entries: ActivityEntry[]
  /** Record an action performed by the current role. */
  logActivity: (action: string, screen: string, target?: string) => void
  clear: () => void
}

const ActivityLogContext = createContext<ActivityLogContextValue | null>(null)

/** Cap, matching the prototype. */
const MAX_ENTRIES = 200

interface ActivityLogProviderProps {
  children: ReactNode
}

export function ActivityLogProvider({ children }: ActivityLogProviderProps) {
  const { currentRole } = useRole()
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const idRef = useRef(0)

  const logActivity = useCallback(
    (action: string, screen: string, target?: string) => {
      const entry: ActivityEntry = {
        id: `act-${++idRef.current}`,
        ts: Date.now(),
        roleId: currentRole.id,
        roleLabel: currentRole.label,
        action,
        screen,
        target: target || '—',
        scope: currentRole.defaultScope?.name || currentRole.scope,
      }
      setEntries((current) => [entry, ...current].slice(0, MAX_ENTRIES))
    },
    [currentRole],
  )

  const clear = useCallback(() => setEntries([]), [])

  const value = useMemo(() => ({ entries, logActivity, clear }), [entries, logActivity, clear])

  return <ActivityLogContext.Provider value={value}>{children}</ActivityLogContext.Provider>
}

export function useActivityLog(): ActivityLogContextValue {
  const ctx = useContext(ActivityLogContext)
  if (!ctx) throw new Error('useActivityLog must be used within an ActivityLogProvider')
  return ctx
}
