import type { CompletenessRow } from '../types'

/** Data completeness by MRI file section. Percentages are green except Load
 *  survey (95.4%), which the prototype tints amber. */
export const COMPLETENESS_ROWS: CompletenessRow[] = [
  { section: 'General info',   complete: '14,12,400', partial: '62,400',   missing: '25,200', pct: '99.4%', pctColor: 'var(--green)' },
  { section: 'Instantaneous',  complete: '14,06,200', partial: '68,600',   missing: '25,200', pct: '99.0%', pctColor: 'var(--green)' },
  { section: 'Billing list',   complete: '13,82,400', partial: '92,400',   missing: '25,200', pct: '97.4%', pctColor: 'var(--green)' },
  { section: 'Load survey',    complete: '13,54,600', partial: '1,20,200', missing: '25,200', pct: '95.4%', pctColor: 'var(--amber)' },
  { section: 'Tamper events',  complete: '13,76,200', partial: '98,600',   missing: '25,200', pct: '96.9%', pctColor: 'var(--green)' },
]
