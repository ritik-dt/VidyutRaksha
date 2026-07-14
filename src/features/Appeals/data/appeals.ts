import type {
  Appeal,
  AppealStatus,
  AppealsFilter,
  AppealsStats,
  HearingPrepBox,
} from '../types'

/** Featured hearing case (matches the prototype's AI hearing preparation card). */
export const FEATURED_APPEAL_ID = 'AP-2026-018'
export const FEATURED_APPEAL_CONSUMER = 'HEERA LAL AGRAWAL'

/**
 * 5 appeals — direct port of the prototype's array.
 * Amount is stored as a full-format string so tables render the exact prototype
 * values (`₹3,88,800`, `₹2,40,000`, etc.) without going through fmtINR.
 */
export const APPEALS: Appeal[] = [
  { id: 'AP-2026-018', case: 'C-20260301-001', consumer: 'HEERA LAL AGRAWAL',    amount: '₹3,88,800', filed: '08 Apr 2026', status: 'Under review',      reviewer: 'Rajiv Mehta',      hearing: '22 Apr 2026', grounds: 'Disputed consumption baseline — claims peer avg is unfair',    priority: 'High' },
  { id: 'AP-2026-017', case: 'C-20260228-038', consumer: 'M/S AGRAUTO',           amount: '₹2,40,000', filed: '05 Apr 2026', status: 'Hearing scheduled', reviewer: 'Senior Engineer',  hearing: '25 Apr 2026', grounds: 'Power factor penalty — claims capacitor was installed',        priority: 'Medium' },
  { id: 'AP-2026-016', case: 'C-20260215-025', consumer: 'ANAND PRAKASH AGARWAL', amount: '₹86,400',   filed: '02 Apr 2026', status: 'Hearing scheduled', reviewer: 'Rajiv Mehta',      hearing: '20 Apr 2026', grounds: 'Tariff misuse — claims premises changed to residential',       priority: 'Medium' },
  { id: 'AP-2026-015', case: 'C-20260210-019', consumer: 'BHUWAL JAISWAL',        amount: '₹2,14,600', filed: '28 Mar 2026', status: 'Upheld (reduced)',  reviewer: 'Senior Engineer',  hearing: '12 Apr 2026', grounds: 'Duration disputed', priority: 'Resolved', outcome: 'Reduced to ₹1,82,000' },
  { id: 'AP-2026-014', case: 'C-20260128-011', consumer: 'ISHANT',                amount: '₹1,42,800', filed: '20 Mar 2026', status: 'Dismissed',         reviewer: 'Rajiv Mehta',      hearing: '05 Apr 2026', grounds: 'No sufficient grounds', priority: 'Resolved', outcome: 'Original amount confirmed' },
]

/** Status → badge fill color (matches the prototype's statusColor function). */
export function statusBadgeColor(status: AppealStatus): string {
  switch (status) {
    case 'Under review': return 'var(--amber)'
    case 'Hearing scheduled': return 'var(--id-text, #0284c7)'
    case 'Upheld (reduced)': return 'var(--green)'
    case 'Dismissed': return 'var(--text-dim)'
  }
}

/** KPI values — hardcoded in the prototype (they represent the broader queue,
 *  not just the 5 sample appeals shown in the table). */
export const APPEALS_STATS: AppealsStats = {
  activeAppeals: 18,
  disputedAmountFmt: '₹42.6L',
  hearingThisWeek: 5,
  resolvedMtd: 12,
  upheldRatePct: 14,
  avgResolutionDays: 18,
}

/** Appeal grounds distribution chart data (6 categories, exact prototype colors). */
export const APPEAL_GROUNDS_DATA = {
  labels: [
    'Baseline disputed',
    'Duration disputed',
    'Tariff category',
    'Meter malfunction claim',
    'Billing error claim',
    'Other',
  ],
  values: [44, 22, 14, 10, 6, 4],
  colors: ['#DC3545', '#E6921E', '#17A2B8', '#7C3AED', '#28A745', '#8B95A5'],
}

/** Appeal outcomes stacked chart data (4 months × 3 series). */
export const APPEAL_OUTCOMES_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  dismissed: [8, 11, 14, 12],
  reduced: [4, 5, 7, 6],
  upheld: [2, 2, 3, 3],
}

/** AI hearing prep — 3 colored boxes for the featured appeal (AP-2026-018). */
export const HEARING_PREP_BOXES: HearingPrepBox[] = [
  {
    title: "Consumer's claim",
    color: 'var(--red)',
    bodyHtml:
      '"Peer baseline of 19.2 kWh/day is unfair. My showroom is smaller than comparable businesses. Previous consumption was only 14 kWh/day."',
  },
  {
    title: 'AI counter-argument',
    color: 'var(--ai-purple)',
    bodyHtml:
      "Peer baseline uses 19 comparable consumers with identical tariff, sanctioned load ± 20%, and same feeder. Consumer's pre-theft 3-year avg was <strong>21.4 kWh/day</strong>, exceeding peer average. Claim of 14 kWh/day is inconsistent with own history.",
  },
  {
    title: 'Recommended outcome',
    color: 'var(--green)',
    bodyHtml:
      "Uphold assessment. Consumer's historical data undermines their own argument. Assessment method is legally defensible per UPERC precedent.",
  },
]

/**
 * Apply the active KPI-set filter.
 * `status=Active` → Under review + Hearing scheduled.
 * `status=Scheduled` → Hearing scheduled.
 */
export function filterAppeals(appeals: Appeal[], filter: AppealsFilter): Appeal[] {
  if (filter.status === 'Active') {
    return appeals.filter((a) => a.status === 'Under review' || a.status === 'Hearing scheduled')
  }
  if (filter.status === 'Scheduled') {
    return appeals.filter((a) => a.status === 'Hearing scheduled')
  }
  return appeals
}
