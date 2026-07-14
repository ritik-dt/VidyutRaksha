// ── Users & Roles module types ───────────────────────────────────────────────
// Faithful port of the prototype's renderUsers() (lines 10772-10840). Users is
// state-level and NOT scope-reactive (the prototype does no scope filtering).

/** The 5 role types defined in the prototype. */
export type RoleName = 'Admin' | 'Vigilance Officer' | 'Inspector' | 'Executive' | 'Read-only'

export type UserStatus = 'Active' | 'Inactive'

export interface User {
  name: string
  email: string
  /** avatar initials, e.g. 'RM'. */
  init: string
  role: RoleName
  zone: string
  desig: string
  /** last-active label, e.g. '12 min ago'. */
  last: string
  status: UserStatus
  caseCount: number
  reports: number
}

/** A role definition card: colour, headcount, and its permission list. */
export interface Role {
  name: RoleName
  /** CSS var expression, e.g. 'var(--ai-purple)'. */
  color: string
  count: number
  perms: string[]
}

// ── Permission matrix ────────────────────────────────────────────────────────
/**
 * A permission cell is either full access (true), no access (false), or a
 * scope-limited label ('zone' | 'assigned' | 'own') rendered in amber.
 */
export type PermValue = boolean | string

export interface PermissionRow {
  /** screen / feature name. */
  screen: string
  view: PermValue
  create: PermValue
  edit: PermValue
  del: PermValue
  export: PermValue
}

// ── KPI row ──────────────────────────────────────────────────────────────────
export interface UserKpi {
  id: string
  label: string
  value: string
  sub?: string
  /** accent bar colour (CSS var expression). */
  accent: string
  /** value colour, when the prototype tints it. */
  valueColor?: string
  /** KPI cards that set a filter are clickable. */
  filter?: UsersFilter
}

// ── Filtering (search + dropdowns + KPI-driven filter pill) ──────────────────
export interface UsersFilter {
  status?: UserStatus
  role?: RoleName
  zone?: string
}

// ── AI insight ───────────────────────────────────────────────────────────────
export interface UsersAiInsight {
  title: string
  /** may contain <strong> emphasis. */
  bodyHtml: string
}
