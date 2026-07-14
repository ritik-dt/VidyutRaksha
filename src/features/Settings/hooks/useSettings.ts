// ── useSettings (sole API seam) ──────────────────────────────────────────────
// Settings is ROLE-reactive: everything below re-derives when the active role
// changes. Notification preferences live in NotifPrefsContext so they survive
// this page unmounting (the prototype keeps them on `window`).

import { useCallback, useMemo, useState } from 'react'
import { useNotifPrefs } from '@/shared/context/NotifPrefsContext'
import { useRole } from '@/shared/context/RoleContext'
import type { NotifCategoryId, NotifPref } from '@/shared/types/notif'
import { ALERT_RULES, ALERT_RULES_BLURB } from '../data/alertRules'
import { settingsInsightHtml } from '../data/aiInsight'
import { ALERT_CATEGORIES } from '../data/categories'
import { CHANNELS, FREQ_OPTIONS } from '../data/channels'
import {
  DEFAULT_QUIET_HOURS,
  QUIET_HOURS_BLURB,
  QUIET_HOURS_NOTE_HTML,
} from '../data/quietHours'
import { destinationsForRole } from '../logic/settingsLogic'
import type { QuietHours } from '../types'

export function useSettings() {
  const { currentRole } = useRole()
  const { getPref, setPref, resetToDefaults } = useNotifPrefs()

  const roleId = currentRole.id

  // Quiet hours + destinations are form state. The prototype renders these
  // controls without wiring them; we make them editable (nothing else invented).
  const [quietHours, setQuietHours] = useState<QuietHours>(DEFAULT_QUIET_HOURS)
  const [destOverride, setDestOverride] = useState<{ phone?: string; email?: string }>({})

  const destinations = useMemo(() => {
    const base = destinationsForRole(roleId)
    return {
      ...base,
      phone: destOverride.phone ?? base.phone,
      email: destOverride.email ?? base.email,
    }
  }, [roleId, destOverride])

  /** Read one category's preference for the active role. */
  const pref = useCallback(
    (category: NotifCategoryId): NotifPref => getPref(roleId, category),
    [getPref, roleId],
  )

  /** Toggle a channel, or change the delivery frequency, for the active role. */
  const updatePref = useCallback(
    <K extends keyof NotifPref>(category: NotifCategoryId, key: K, value: NotifPref[K]) =>
      setPref(roleId, category, key, value),
    [setPref, roleId],
  )

  const resetPrefs = useCallback(() => resetToDefaults(roleId), [resetToDefaults, roleId])

  const insightHtml = useMemo(() => settingsInsightHtml(roleId), [roleId])

  return {
    role: currentRole,

    // notification preferences
    categories: ALERT_CATEGORIES,
    channels: CHANNELS,
    freqOptions: FREQ_OPTIONS,
    pref,
    updatePref,
    resetPrefs,

    // alert rules
    alertRules: ALERT_RULES,
    alertRulesBlurb: ALERT_RULES_BLURB,

    // quiet hours
    quietHours,
    setQuietHours,
    quietHoursBlurb: QUIET_HOURS_BLURB,
    quietHoursNoteHtml: QUIET_HOURS_NOTE_HTML,

    // destinations
    destinations,
    setDestination: (key: 'phone' | 'email', value: string) =>
      setDestOverride((d) => ({ ...d, [key]: value })),

    // ai insight
    insightHtml,

    loading: false as const,
    error: null,
  }
}
