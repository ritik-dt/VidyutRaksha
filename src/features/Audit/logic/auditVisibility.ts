// ── Audit visibility logic (pure) ────────────────────────────────────────────
// Byte-identical port of the prototype's getVisibleAuditEntries() (line 2299)
// plus the presentation helpers around the role activity log.
//
// This is real RBAC on the audit feed: what a user can see depends on where
// they sit in the hierarchy. Seniors see everything beneath them; an AEN sees
// only their own actions.

import type { ActivityEntry } from '@/shared/context/ActivityLogContext'
import type { RoleId } from '@/shared/types/role'
import type { AuditRole } from '../types'

/** Which role ids each role is permitted to see in the activity log. */
const VISIBILITY: Partial<Record<RoleId, RoleId[]>> = {
  // SE sees own division and below
  se: ['se', 'ee', 'aen'],
  // EE sees own sub-division and below
  ee: ['ee', 'aen'],
  // AEN sees only their own activity
  aen: ['aen'],
}

/** Roles that see the entire log: CMD, Chief, and the (read-only) Analyst. */
const SEES_ALL: RoleId[] = ['cmd', 'chief', 'analyst']

/**
 * Filter the activity log to the entries the given role may see.
 * Anything not explicitly scoped falls back to seeing everything, matching the
 * prototype's final `return window._activityLog`.
 */
export function getVisibleAuditEntries(
  entries: ActivityEntry[],
  roleId: RoleId,
): ActivityEntry[] {
  if (SEES_ALL.includes(roleId)) return entries
  const allowed = VISIBILITY[roleId]
  if (!allowed) return entries
  return entries.filter((e) => allowed.includes(e.roleId))
}

/** Plain-language explanation of what the current role can see. */
const VISIBILITY_BLURB: Record<RoleId, string> = {
  cmd: 'You see all activity across UPPCL.',
  chief: 'You see all activity within Varanasi Zone scope.',
  se: 'You see SE, EE, and AEN activity within Bhelupur Division.',
  ee: 'You see EE and AEN activity within Bhelupur West Sub-division.',
  aen: 'You see only your own activity (AEN scope).',
  analyst: 'You see all activity (read-only audit role).',
}

export function visibilityBlurb(roleId: RoleId): string {
  return VISIBILITY_BLURB[roleId] ?? ''
}

/** Level-badge colour per role. */
const ROLE_COLOR: Record<RoleId, string> = {
  cmd: 'var(--red)',
  chief: 'var(--ai-purple)',
  se: 'var(--teal)',
  ee: 'var(--id-text)',
  aen: 'var(--amber)',
  analyst: 'var(--green)',
}

export function roleColor(roleId: RoleId): string {
  return ROLE_COLOR[roleId] ?? 'var(--text-mid)'
}

/** Relative timestamp — "just now" / "12 min ago" / "3 hr ago" / "2d ago". */
export function formatTime(ts: number, now: number = Date.now()): string {
  const m = Math.round((now - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

/** Badge class for a role on the STATIC audit log. */
export function staticRoleBadge(role: AuditRole): string {
  if (role === 'Admin') return 'badge-confirmed'
  if (role === 'System') return 'badge-ai'
  return 'badge-active'
}

/** The prototype caps the role activity log at 30 rows. */
export const ACTIVITY_LOG_LIMIT = 30

/**
 * Search across the static audit log. The prototype renders the search box but
 * never wires it; we make it work — it matches any field on a row.
 */
export function searchAuditLog<T extends object>(rows: T[], query: string): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(q)),
  )
}
