import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRole } from '@/shared/context/RoleContext'
import {
  ActivityLogContext,
  type ActivityEntry,
  type ActivityLogContextValue,
} from './ActivityLogContext'

/** Cap, matching the prototype. */
const MAX_ENTRIES = 200

interface ActivityLogProviderProps {
  children: ReactNode
}

/**
 * Owns the activity feed. New entries are unshifted (newest first) and the
 * list is capped at {@link MAX_ENTRIES} to avoid unbounded growth — matches
 * the prototype's `window._activityLog` behaviour.
 */
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

  const value = useMemo<ActivityLogContextValue>(
    () => ({ entries, logActivity, clear }),
    [entries, logActivity, clear],
  )

  return <ActivityLogContext.Provider value={value}>{children}</ActivityLogContext.Provider>
}
