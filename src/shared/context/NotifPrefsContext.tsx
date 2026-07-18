import { createContext, useContext } from 'react'
import type { NotifCategoryId, NotifPref } from '@/shared/types/notif'
import type { RoleId } from '@/shared/types/role'

/**
 * Per-role notification preferences.
 *
 * Ports the prototype's `window._notifPrefs`: preferences are keyed by role and
 * persist while the app is open, so navigating away from Settings and back — or
 * switching role and switching back — preserves what the user chose. Settings is
 * currently the only reader, but the state has to live above it to survive the
 * page unmounting, which is why it's a context rather than local state.
 */
export interface NotifPrefsContextValue {
  /** Preferences for a single category, for the given role. */
  getPref: (roleId: RoleId, category: NotifCategoryId) => NotifPref
  /** Set one field of one category for the given role. */
  setPref: <K extends keyof NotifPref>(
    roleId: RoleId,
    category: NotifCategoryId,
    key: K,
    value: NotifPref[K],
  ) => void
  /** Restore this role's preferences to its defaults. */
  resetToDefaults: (roleId: RoleId) => void
}

/**
 * Split from `NotifPrefsProvider.tsx` so this module exports only
 * non-components. See ThemeContext for the Fast Refresh rationale.
 */
export const NotifPrefsContext = createContext<NotifPrefsContextValue | null>(null)

export function useNotifPrefs(): NotifPrefsContextValue {
  const ctx = useContext(NotifPrefsContext)
  if (!ctx) throw new Error('useNotifPrefs must be used within a NotifPrefsProvider')
  return ctx
}
