// ── Settings module types ────────────────────────────────────────────────────
// Faithful port of the prototype's renderSettings() (lines 10380-10499).
// Settings is ROLE-reactive: the header, AI insight, notification preferences,
// and channel destinations all change with the active role.

import type { NotifCategoryId, NotifChannelId, NotifFreq } from '@/shared/types/notif'

/** One of the 5 configurable alert categories. */
export interface AlertCategory {
  id: NotifCategoryId
  label: string
  icon: string
  desc: string
}

/** One of the 3 delivery channels. */
export interface Channel {
  id: NotifChannelId
  label: string
  icon: string
}

/** Computed delivery status shown as a pill in the last column. */
export type NotifStatus = 'OFF' | 'LIVE' | 'DIGEST'

// ── Alert rules ──────────────────────────────────────────────────────────────
export type RuleSeverity = 'Critical' | 'Warning' | 'Info'

export interface AlertRule {
  name: string
  /** trigger condition */
  desc: string
  sev: RuleSeverity
  enabled: boolean
  channels: string
}

// ── Quiet hours & destinations ───────────────────────────────────────────────
export interface QuietHours {
  from: string
  to: string
}

/** Channel destinations — phone and email are derived from the active role. */
export interface Destinations {
  phone: string
  email: string
  pushDevice: string
}

// ── Freq option ──────────────────────────────────────────────────────────────
export interface FreqOption {
  value: NotifFreq
  label: string
}
