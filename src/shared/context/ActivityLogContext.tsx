import { createContext, useContext } from 'react'
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
export interface ActivityLogContextValue {
  entries: ActivityEntry[]
  /** Record an action performed by the current role. */
  logActivity: (action: string, screen: string, target?: string) => void
  clear: () => void
}

/**
 * Split from `ActivityLogProvider.tsx` so this module exports only
 * non-components. See ThemeContext for the Fast Refresh rationale.
 */
export const ActivityLogContext = createContext<ActivityLogContextValue | null>(null)

export function useActivityLog(): ActivityLogContextValue {
  const ctx = useContext(ActivityLogContext)
  if (!ctx) throw new Error('useActivityLog must be used within an ActivityLogProvider')
  return ctx
}
