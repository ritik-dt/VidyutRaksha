import type { AttentionRow } from '../types'

/** Meters requiring attention.
 *  NOTE (prototype quirk, ported as-is): the card is titled "top 10 areas"
 *  but only these 5 rows exist. */
export const ATTENTION_ROWS: AttentionRow[] = [
  {
    area: 'Raghunath Nagar',
    stopped: '8,420',
    pct: '6.3%',
    lastComm: '45 days',
    cause: 'Network outage',
    causeBadge: 'badge-confirmed',
    action: 'Dispatch team',
    actionBadge: 'badge-assigned',
    countColor: 'var(--red)',
    bucket: 'stopped',
  },
  {
    area: 'Kerakatpur',
    stopped: '6,180',
    pct: '5.8%',
    lastComm: '38 days',
    cause: 'Network outage',
    causeBadge: 'badge-confirmed',
    action: 'Dispatch team',
    actionBadge: 'badge-assigned',
    countColor: 'var(--red)',
    bucket: 'stopped',
  },
  {
    area: 'Ramarepur',
    stopped: '4,920',
    pct: '4.2%',
    lastComm: '32 days',
    cause: 'Battery issue',
    causeBadge: 'badge-active',
    action: 'Replace meters',
    actionBadge: 'badge-new',
    countColor: 'var(--amber)',
    bucket: 'intermittent',
  },
  {
    area: 'Shaktipeeth',
    stopped: '3,860',
    pct: '3.5%',
    lastComm: '28 days',
    cause: 'Signal weak',
    causeBadge: 'badge-active',
    action: 'Reposition NIC',
    actionBadge: 'badge-new',
    countColor: 'var(--amber)',
    bucket: 'intermittent',
  },
  {
    area: 'Ganesh Pur',
    stopped: '2,680',
    pct: '2.6%',
    lastComm: '24 days',
    cause: 'Mixed causes',
    causeBadge: 'badge-active',
    action: 'Investigate',
    actionBadge: 'badge-new',
    countColor: 'var(--amber)',
    bucket: 'intermittent',
  },
]

/** Card title — kept verbatim including the "top 10" / 5-rows mismatch. */
export const ATTENTION_TITLE = '⚠ Meters requiring attention (top 10 areas)'
