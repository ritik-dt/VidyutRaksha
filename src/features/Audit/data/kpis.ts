import type { AuditKpi } from '../types'

/** 5 KPI cards. Two are clickable and NAVIGATE to the Cases screen (rather than
 *  filtering Audit) — matching kpiClick('cases', {status:…}) in the prototype. */
export const AUDIT_KPIS: AuditKpi[] = [
  {
    id: 'actions',
    label: 'Actions today',
    value: '18,420',
    accent: 'var(--navy-light)',
  },
  {
    id: 'finalized',
    label: 'Cases finalized',
    value: '14',
    sub: 'With evidence pack',
    accent: 'var(--green)',
    nav: { screen: 'cases', status: 'Confirmed' },
  },
  {
    id: 'assessments',
    label: 'Assessments signed',
    value: '8',
    sub: 'Digital signature',
    accent: 'var(--amber)',
    nav: { screen: 'cases', status: 'Assessment' },
  },
  {
    id: 'integrity',
    label: 'Chain integrity',
    value: '100%',
    sub: 'Hash verified',
    accent: 'var(--teal)',
    valueColor: 'var(--green)',
  },
  {
    id: 'compliance',
    label: 'Compliance score',
    value: 'A+',
    sub: 'RDSS + Sec 135',
    accent: 'var(--ai-purple)',
  },
]
