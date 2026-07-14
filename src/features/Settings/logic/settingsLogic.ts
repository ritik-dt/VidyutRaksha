// ── Settings logic (pure) ────────────────────────────────────────────────────

import type { NotifPref } from '@/shared/types/notif'
import type { RoleId } from '@/shared/types/role'
import type { Destinations, NotifStatus, RuleSeverity } from '../types'
import { PUSH_DEVICE } from '../data/quietHours'

/**
 * Delivery status for a category, exactly as the prototype computes it:
 *   • every channel off, OR frequency = off  → OFF
 *   • frequency = realtime                   → LIVE
 *   • otherwise                              → DIGEST
 */
export function notifStatus(pref: NotifPref): NotifStatus {
  const allOff = !pref.inApp && !pref.email && !pref.sms
  if (allOff || pref.freq === 'off') return 'OFF'
  if (pref.freq === 'realtime') return 'LIVE'
  return 'DIGEST'
}

/** Severity → badge colour. */
export function severityColor(sev: RuleSeverity): string {
  if (sev === 'Critical') return 'var(--red)'
  if (sev === 'Warning') return 'var(--amber)'
  return 'var(--teal)'
}

/**
 * Channel destinations are derived from the active role: the phone number's
 * last digit differs for AEN, and the email is the role id at the DISCOM domain.
 */
export function destinationsForRole(roleId: RoleId): Destinations {
  return {
    phone: `+91 98765-4321${roleId === 'aen' ? '0' : '5'}`,
    email: `${roleId}@kvvnl.uppcl.org`,
    pushDevice: PUSH_DEVICE,
  }
}
