import type { RevenueSnapshotData } from '../types'

export const REVENUE_SNAPSHOT: RevenueSnapshotData = {
  metrics: [
    {
      id: 'billed',
      name: 'Revenue Billed',
      valueText: '₹19,432',
      unit: 'Crore · FYTD FY26',
      panelKey: 'revenue',
    },
    {
      id: 'collected',
      name: 'Collection',
      valueText: '₹18,422',
      unit: 'Crore · 94.8%',
      tone: 'jade',
      panelKey: 'revenue',
    },
  ],
  duesTotal: { valueText: '₹12,340', unit: 'Crore · Cumulative', panelKey: 'collection' },
  duesBuckets: [
    { label: '0 – 3 Months', percent: 25, valueText: '₹3,100 Cr', variant: 'young', panelKey: 'dues-03' },
    { label: '3 – 6 Months', percent: 17, valueText: '₹2,060 Cr', variant: 'mid', panelKey: 'dues-36' },
    { label: '6+ Months', percent: 58, valueText: '₹7,180 Cr', variant: 'old', panelKey: 'dues-6p' },
    { label: '⛔ Never Paid', percent: 7, valueText: '₹920 Cr', variant: 'never', panelKey: 'dues-never' },
  ],
  neverPaidAlert:
    '⚠ <strong>2,84,120 consumers</strong> — zero payment history. Est. ₹982 Cr unrecoverable. Immediate legal action recommended.',
}
