import type { RoleId } from './role'

/** The 5 alert categories a user can configure notifications for. */
export type NotifCategoryId =
  | 'high-risk'
  | 'sla-breach'
  | 'overload'
  | 'approval'
  | 'kpi-alert'

/** The 3 delivery channels. */
export type NotifChannelId = 'inApp' | 'email' | 'sms'

/** Delivery frequency for a category. */
export type NotifFreq = 'realtime' | 'digest' | 'off'

/** One category's preference: which channels are on, and how often. */
export interface NotifPref {
  inApp: boolean
  email: boolean
  sms: boolean
  freq: NotifFreq
}

/** A role's full preference set (one entry per category). */
export type RoleNotifPrefs = Record<NotifCategoryId, NotifPref>

/** Preferences for every role. */
export type NotifPrefsMap = Record<RoleId, RoleNotifPrefs>
