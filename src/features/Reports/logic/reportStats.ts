// ── Reports logic (pure) ─────────────────────────────────────────────────────
// The prototype computes the at-a-glance strip rather than hardcoding it, and
// sorts the statutory list by urgency. Both are ported as pure functions.

import type {
  AdhocReport,
  GlanceTile,
  InternalReport,
  StatutoryReport,
} from '../types'

/** Statutory rows render sorted by days remaining (most urgent first). */
export function sortStatutoryByUrgency(reports: StatutoryReport[]): StatutoryReport[] {
  return [...reports].sort((a, b) => a.daysLeft - b.daysLeft)
}

/** Days-left colour: red at ≤10, amber at ≤30, default text otherwise. */
export function deadlineToneColor(daysLeft: number): string {
  if (daysLeft <= 10) return 'var(--red)'
  if (daysLeft <= 30) return 'var(--amber)'
  return 'var(--text)'
}

/** The 4 at-a-glance tiles — every value is derived, matching the prototype. */
export function buildGlanceTiles(
  internal: InternalReport[],
  statutory: StatutoryReport[],
  adhoc: AdhocReport[],
): GlanceTile[] {
  const scheduledActive = internal.filter((r) => r.status === 'Active').length
  // prototype: weekly + monthly average approximation
  const reportsThisMonth = internal.length * 4
  const upcomingDeadlines = statutory.filter((r) => r.daysLeft <= 30).length
  const adhocRuns = adhoc.reduce((a, r) => a + r.uses, 0)

  return [
    {
      id: 'scheduled',
      label: 'Scheduled · active',
      value: String(scheduledActive),
      sub: `of ${internal.length} configured`,
      tone: 'green',
    },
    {
      id: 'generated',
      label: 'Generated · this month',
      value: String(reportsThisMonth),
      sub: 'across 7 schedules',
      tone: 'purple',
    },
    {
      id: 'deadlines',
      label: 'Regulatory deadlines',
      value: String(upcomingDeadlines),
      sub: 'within 30 days',
      tone: 'red',
    },
    {
      id: 'adhoc',
      label: 'Saved ad-hoc queries',
      value: String(adhoc.length),
      sub: `${adhocRuns} total runs`,
      tone: 'teal',
    },
  ]
}
