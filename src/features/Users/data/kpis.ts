import type { UserKpi } from '../types'

/** The 5 KPI cards. Values are static in the prototype (they describe a
 *  17-user org even though only 8 rows exist in the table — ported as-is).
 *  Two cards are clickable and set a filter, matching kpiClick('users', …). */
export const USER_KPIS: UserKpi[] = [
  {
    id: 'total',
    label: 'Total users',
    value: '17',
    accent: 'var(--navy-light)',
    filter: {},
  },
  {
    id: 'active',
    label: 'Active (24h)',
    value: '14',
    accent: 'var(--green)',
    valueColor: 'var(--green)',
  },
  {
    id: 'inactive',
    label: 'Inactive (7d+)',
    value: '3',
    accent: 'var(--amber)',
    valueColor: 'var(--amber)',
    filter: { status: 'Inactive' },
  },
  {
    id: 'sso',
    label: 'SSO enabled',
    value: '14/17',
    sub: '82%',
    accent: 'var(--ai-purple)',
  },
  {
    id: 'mfa',
    label: 'MFA enforced',
    value: '17/17',
    accent: 'var(--teal)',
  },
]
