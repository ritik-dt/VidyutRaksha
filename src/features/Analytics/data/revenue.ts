import type { HierNode } from '@/shared/types/hierarchy'
import { formatIndian } from '@/shared/utils/formatters'

/* ── Static chart data (exact prototype values, hardcoded there too) ── */

/** Revenue leakage funnel — horizontal bars (prototype's `indexAxis:'y'`). */
export const FUNNEL_DATA = {
  labels: ['Energy purchased', 'Available for sale', 'Energy billed', 'Amount billed', 'Amount collected'],
  values: [100, 91.8, 79.5, 74.9, 66.1],
  colors: ['#1B4F72', '#17A2B8', '#28A745', '#E6921E', '#7C3AED'],
}

/** Billing status breakdown. */
export const BILLING_STATUS_DATA = {
  labels: ['Billed normally', 'Stopped meter', 'Inaccessible', 'Billing error', 'New connection'],
  values: [94.2, 2.1, 1.5, 1.2, 1.0],
  colors: ['#28A745', '#DC3545', '#E6921E', '#8B95A5', '#17A2B8'],
}

/** Outstanding aging (₹ Cr). */
export const AGING_DATA = {
  labels: ['0-30 days', '30-90 days', '90-180 days', '180+ days'],
  values: [2.8, 4.2, 3.6, 7.4],
  colors: ['#28A745', '#E6921E', '#DC3545', '#8B2332'],
}

/* ── Hierarchy-aware KPI values ── */

export interface RevenueKpis {
  billingEffPct: string          // hardcoded 94.2%
  unbilledMeters: number          // meters × 0.058
  collectionRatePct: string       // hardcoded 88.4%
  outstandingCr: number           // meters × 0.0012 / 100
  /** meters × 0.00008 / 100 → rounded (matches prototype's `Math.round(...)` inline). */
  pfPenaltyCr: number
}

/** Prototype's inline scope-aware calc. Falls back to UPPCL defaults. */
export function computeRevenueKpis(level: HierNode | undefined): RevenueKpis {
  const meters = level?.meters ?? 1500000
  return {
    billingEffPct: '94.2',
    unbilledMeters: Math.round(meters * 0.058),
    collectionRatePct: '88.4',
    outstandingCr: Math.round((meters * 0.0012) / 100),
    pfPenaltyCr: Math.round((meters * 0.00008) / 100),
  }
}

/* ── Unbilled meter reasons table (4 rows) ── */

export interface UnbilledReasonRow {
  reason: string
  reasonColor?: 'red' | 'amber'
  count: number
  pctOfUnbilled: string
  revenueImpact: string        // e.g. "₹6.3 Cr" or "Pending"
  revenueImpactColor?: 'red' | 'amber' | 'dim'
  action: string
  actionBadge: 'confirmed' | 'assigned' | 'new' | 'active'
}

/**
 * Direct port of the prototype's 4 rows. Counts + revenue impacts derived from
 * the current scope's meter count using the prototype's inline multipliers.
 */
export function computeUnbilledReasons(level: HierNode | undefined): UnbilledReasonRow[] {
  const meters = level?.meters ?? 1500000
  return [
    {
      reason: 'Stopped meter (zero 2+ months)',
      reasonColor: 'red',
      count: Math.round(meters * 0.021),
      pctOfUnbilled: '36%',
      revenueImpact: '₹' + ((meters * 0.00042) / 100).toFixed(1) + ' Cr',
      revenueImpactColor: 'red',
      action: 'Replace meters',
      actionBadge: 'confirmed',
    },
    {
      reason: 'Inaccessible premises',
      reasonColor: 'amber',
      count: Math.round(meters * 0.015),
      pctOfUnbilled: '26%',
      revenueImpact: '₹' + ((meters * 0.0003) / 100).toFixed(1) + ' Cr',
      revenueImpactColor: 'amber',
      action: 'Schedule visit',
      actionBadge: 'assigned',
    },
    {
      reason: 'Billing system error',
      count: Math.round(meters * 0.012),
      pctOfUnbilled: '21%',
      revenueImpact: '₹' + ((meters * 0.00024) / 100).toFixed(1) + ' Cr',
      action: 'System fix',
      actionBadge: 'new',
    },
    {
      reason: 'New connection (no history)',
      count: Math.round(meters * 0.01),
      pctOfUnbilled: '17%',
      revenueImpact: 'Pending',
      revenueImpactColor: 'dim',
      action: 'Normal',
      actionBadge: 'active',
    },
  ]
}

/** Localized formatter for KPI values (Indian grouping). */
export const formatCount = formatIndian
