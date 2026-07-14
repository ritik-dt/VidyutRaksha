// ── Users logic (pure) ───────────────────────────────────────────────────────

import type { RoleName, User, UsersFilter } from '../types'

/**
 * Role → colour. The prototype inlines this ternary chain in the users table
 * (for the avatar circle and the role badge); centralising it keeps the two in
 * sync and matches the colours used by the role-definition cards.
 */
export function roleColor(role: RoleName): string {
  switch (role) {
    case 'Admin':
      return 'var(--ai-purple)'
    case 'Inspector':
      return 'var(--green)'
    case 'Executive':
      return 'var(--amber)'
    case 'Read-only':
      return 'var(--text-dim)'
    default:
      // Vigilance Officer
      return 'var(--id-text)'
  }
}

/**
 * Filter the user list by the search box, the three dropdowns, and any filter
 * set by a KPI click.
 *
 * NOTE: the prototype renders these controls but never wires them — and its
 * KPI filter shows a pill without filtering the table. We make them functional,
 * because a visible filter pill that changes nothing reads as a defect. Search
 * matches name, email, or role (as the placeholder promises).
 */
export function filterUsers(users: User[], search: string, filter: UsersFilter): User[] {
  const q = search.trim().toLowerCase()

  return users.filter((u) => {
    if (q) {
      const hay = `${u.name} ${u.email} ${u.role}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filter.status && u.status !== filter.status) return false
    if (filter.role && u.role !== filter.role) return false
    // zone is a substring match — the dropdown offers "Varanasi" (matches many)
    // as well as sub-zones like "Bhelupur".
    if (filter.zone && !u.zone.toLowerCase().includes(filter.zone.toLowerCase())) return false
    return true
  })
}
