import type { DqKpi } from '../types'

/** 5 KPI cards. Stopped + Intermittent are clickable and set a filter,
 *  matching kpiClick('dataQuality', {filter:…}) in the prototype. */
export const DQ_KPIS: DqKpi[] = [
  {
    id: 'freshness',
    label: 'MRI freshness',
    value: '94.2%',
    sub: 'Last 30 days',
    accent: 'var(--green)',
    valueColor: 'var(--green)',
  },
  {
    id: 'stopped',
    label: 'Stopped meters',
    value: '47,200',
    sub: 'No data 60+ days',
    accent: 'var(--red)',
    valueColor: 'var(--red)',
    filter: 'stopped',
  },
  {
    id: 'intermittent',
    label: 'Intermittent comm',
    value: '32,800',
    sub: 'Partial data',
    accent: 'var(--amber)',
    valueColor: 'var(--amber)',
    filter: 'intermittent',
  },
  {
    id: 'files',
    label: 'Files today',
    value: '18,420',
    sub: '142 failed (0.77%)',
    accent: 'var(--navy-light)',
  },
  {
    id: 'completeness',
    label: 'Completeness',
    value: '96.8%',
    sub: 'All sections present',
    accent: 'var(--teal)',
  },
]
