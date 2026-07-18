import {
  useCallback,
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
import {
  NotifPrefsContext,
  type NotifPrefsContextValue,
} from './NotifPrefsContext'

/** Fallback when a role/category has no stored entry (matches the prototype). */
const FALLBACK_PREF: NotifPref = { inApp: true, email: false, sms: false, freq: 'realtime' }

function clonePrefs(prefs: NotifPrefsMap): NotifPrefsMap {
  return JSON.parse(JSON.stringify(prefs)) as NotifPrefsMap
}

interface NotifPrefsProviderProps {
  children: ReactNode
}

/**
 * Owns per-role notification preferences and persists them for the app
 * session. Reads happen through {@link NotifPrefsContextValue.getPref} so
 * missing entries fall back to a shared default rather than exploding.
 */
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

  const value = useMemo<NotifPrefsContextValue>(
    () => ({ getPref, setPref, resetToDefaults }),
    [getPref, setPref, resetToDefaults],
  )

  return <NotifPrefsContext.Provider value={value}>{children}</NotifPrefsContext.Provider>
}
