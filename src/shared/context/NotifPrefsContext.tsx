import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_NOTIF_PREFS } from '@/shared/data/notifDefaults'
import type {
  NotifCategoryId,
  NotifPref,
  NotifPrefsMap,
  RoleNotifPrefs,
} from '@/shared/types/notif'
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
interface NotifPrefsContextValue {
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

const NotifPrefsContext = createContext<NotifPrefsContextValue | null>(null)

/** Fallback when a role/category has no stored entry (matches the prototype). */
const FALLBACK_PREF: NotifPref = { inApp: true, email: false, sms: false, freq: 'realtime' }

function clonePrefs(prefs: NotifPrefsMap): NotifPrefsMap {
  return JSON.parse(JSON.stringify(prefs)) as NotifPrefsMap
}

interface NotifPrefsProviderProps {
  children: ReactNode
}

export function NotifPrefsProvider({ children }: NotifPrefsProviderProps) {
  const [prefs, setPrefs] = useState<NotifPrefsMap>(() => clonePrefs(DEFAULT_NOTIF_PREFS))

  const getPref = useCallback(
    (roleId: RoleId, category: NotifCategoryId): NotifPref =>
      prefs[roleId]?.[category] ?? FALLBACK_PREF,
    [prefs],
  )

  const setPref = useCallback(
    <K extends keyof NotifPref>(
      roleId: RoleId,
      category: NotifCategoryId,
      key: K,
      value: NotifPref[K],
    ) => {
      setPrefs((current) => {
        const rolePrefs = current[roleId] ?? ({} as RoleNotifPrefs)
        const catPref = rolePrefs[category] ?? FALLBACK_PREF
        return {
          ...current,
          [roleId]: {
            ...rolePrefs,
            [category]: { ...catPref, [key]: value },
          },
        }
      })
    },
    [],
  )

  const resetToDefaults = useCallback((roleId: RoleId) => {
    setPrefs((current) => ({
      ...current,
      [roleId]: clonePrefs(DEFAULT_NOTIF_PREFS)[roleId] ?? clonePrefs(DEFAULT_NOTIF_PREFS).cmd,
    }))
  }, [])

  const value = useMemo(
    () => ({ getPref, setPref, resetToDefaults }),
    [getPref, setPref, resetToDefaults],
  )

  return <NotifPrefsContext.Provider value={value}>{children}</NotifPrefsContext.Provider>
}

export function useNotifPrefs(): NotifPrefsContextValue {
  const ctx = useContext(NotifPrefsContext)
  if (!ctx) throw new Error('useNotifPrefs must be used within a NotifPrefsProvider')
  return ctx
}
